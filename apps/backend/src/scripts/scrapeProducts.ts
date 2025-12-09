import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import logger from "../logger";
import { scrapeProducts } from "../services/scraper.service";
import { transformScrapedToProduct } from "../services/scraperTransformer";
import type { ScraperConfig } from "../types/scraper.types";
import * as model from "../models/workoutMongoDb";
import { InvalidInputError } from "../models/InvalidInputError";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const COLLECTION_URL = "https://shoppopeyes.com/en/collections/proteines-proteins";
const PRODUCT_GRID_SELECTOR = ".productgrid--item";
const OUTPUT_DIR = path.join(__dirname, "..", "..", "data");
const OUTPUT_FILE = "scraped-products.json";

const url =
	process.env.MONGO_URL ||
	(process.env.URL_PRE && process.env.MONGODB_PWD && process.env.URL_POST
		? `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`
		: "");

function ensureOutputDir(): void {
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}
}

function saveResults(result: Awaited<ReturnType<typeof scrapeProducts>>): string {
	const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
	fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
	return outputPath;
}

async function saveToDatabase(result: Awaited<ReturnType<typeof scrapeProducts>>): Promise<void> {
	if (!url) {
		logger.warn("MongoDB connection URL not found. Skipping database save.");
		return;
	}

	logger.info("Initializing database connection...");
	const collectionNames = ["users", "products", "orders"];
	await model.initialize("workout_db", false, url, collectionNames);

	let savedCount = 0;
	let skippedCount = 0;
	const errors: Array<{ url: string; reason: string }> = [];

	for (const scraped of result.products) {
		try {
			const product = transformScrapedToProduct(scraped);
			if (!product) {
				skippedCount++;
				errors.push({
					url: scraped.url,
					reason: "Failed to transform scraped data to product",
				});
				continue;
			}

			// Check if product already exists (by flavour)
			try {
				await model.getSingleProduct(product.flavour);
				logger.debug(`Product "${product.flavour}" already exists, skipping...`);
				skippedCount++;
				continue;
			} catch (err) {
				// Product doesn't exist (InvalidInputError) or other error occurred
				if (!(err instanceof InvalidInputError)) {
					// Unexpected error, log and continue
					logger.warn(`Error checking for existing product ${product.flavour}: ${err instanceof Error ? err.message : String(err)}`);
				}
				// If it's InvalidInputError, product doesn't exist, proceed to add it
			}

			await model.addProduct(
				product.flavour,
				product.type,
				product.price,
				product.description,
				product.ingredients,
				product.nutrition,
				product.benefits,
				product.rating,
			);
			savedCount++;
			logger.info(`Saved product to database: ${product.flavour} (${product.type}) - $${product.price}`);
		} catch (err) {
			const error = err as Error;
			// Check if it's a duplicate error (product already exists)
			if (error.message.includes("duplicate") || error.message.includes("already exists")) {
				logger.debug(`Product already exists: ${scraped.url}`);
				skippedCount++;
			} else {
				logger.error(`Failed to save product ${scraped.url}: ${error.message}`);
				errors.push({
					url: scraped.url,
					reason: error.message,
				});
			}
		}
	}

	logger.info(`Database save completed: ${savedCount} saved, ${skippedCount} skipped`);
	if (errors.length > 0) {
		logger.warn(`Failed to save ${errors.length} products to database:`);
		for (const error of errors) {
			logger.warn(`  - ${error.url}: ${error.reason}`);
		}
	}

	await model.close();
}

function logResults(result: Awaited<ReturnType<typeof scrapeProducts>>, outputPath: string): void {
	logger.info(`Scraping completed successfully!`);
	logger.info(`Total products scraped: ${result.totalScraped}`);
	logger.info(`Errors encountered: ${result.errors.length}`);
	logger.info(`Results saved to: ${outputPath}`);

	if (result.errors.length > 0) {
		logger.warn("Some products failed to scrape:");
		for (const error of result.errors) {
			logger.warn(`  - ${error.url}: ${error.error}`);
		}
	}
}

async function main() {
	logger.info("Starting product scraper script");

	const config: ScraperConfig = {
		baseUrl: COLLECTION_URL,
		productGridSelector: PRODUCT_GRID_SELECTOR,
		delayBetweenRequests: 1000,
		maxRetries: 3,
		timeout: 30000,
	};

	try {
		const result = await scrapeProducts(config);
		ensureOutputDir();
		const outputPath = saveResults(result);
		logResults(result, outputPath);

		// Save to database
		await saveToDatabase(result);

		process.exit(0);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logger.error(`Scraper script failed: ${errorMessage}`);
		console.error(error);
		process.exit(1);
	}
}

main();


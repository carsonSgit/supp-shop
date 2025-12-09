import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import logger from "../logger";
import { scrapeProducts } from "../services/scraper.service";
import type { ScraperConfig } from "../types/scraper.types";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const COLLECTION_URL = "https://shoppopeyes.com/en/collections/proteines-proteins";
const PRODUCT_GRID_SELECTOR = ".productgrid--item";
const OUTPUT_DIR = path.join(__dirname, "..", "..", "data");
const OUTPUT_FILE = "scraped-products.json";

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
		process.exit(0);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logger.error(`Scraper script failed: ${errorMessage}`);
		console.error(error);
		process.exit(1);
	}
}

main();


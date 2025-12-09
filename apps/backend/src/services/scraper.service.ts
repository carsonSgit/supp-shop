import * as cheerio from "cheerio";
import logger from "../logger";
import type {
	ScrapedProduct,
	ScraperConfig,
	ScraperResult,
	ScraperError,
} from "../types/scraper.types";
import { sanitizeScrapedProduct, validateScrapedProduct } from "./scraperSanitizer";

const DEFAULT_CONFIG = {
	delayBetweenRequests: 1000,
	maxRetries: 3,
	timeout: 30000,
} as const;

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

async function fetchWithRetry(
	url: string,
	maxRetries: number = DEFAULT_CONFIG.maxRetries,
	timeout: number = DEFAULT_CONFIG.timeout,
): Promise<string> {
	let lastError: Error | null = null;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response = await fetch(url, {
				signal: controller.signal,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				},
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const html = await response.text();
			return html;
		} catch (error) {
			lastError = error as Error;
			logger.warn(
				`Attempt ${attempt}/${maxRetries} failed for ${url}: ${getErrorMessage(error)}`,
			);

			if (attempt < maxRetries) {
				const delay = Math.pow(2, attempt) * 1000;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw new Error(
		`Failed to fetch ${url} after ${maxRetries} attempts: ${lastError ? getErrorMessage(lastError) : "Unknown error"}`,
	);
}

function resolveUrl(link: string, baseUrl: string): string {
	if (link.startsWith("http")) {
		return link;
	}
	const normalizedLink = link.startsWith("/") ? link : `/${link}`;
	return `${baseUrl}${normalizedLink}`;
}

async function extractProductLinks(
	collectionUrl: string,
	productGridSelector: string,
	maxRetries?: number,
	timeout?: number,
): Promise<string[]> {
	logger.info(`Fetching collection page: ${collectionUrl}`);

	const html = await fetchWithRetry(collectionUrl, maxRetries, timeout);
	const $ = cheerio.load(html);

	const productLinks: string[] = [];
	const baseUrl = new URL(collectionUrl).origin;

	$(productGridSelector).each((_index: number, element: cheerio.Element) => {
		const link = $(element).find("a").first().attr("href");
		if (link) {
			productLinks.push(resolveUrl(link, baseUrl));
		}
	});

	logger.info(`Found ${productLinks.length} product links`);
	return productLinks;
}

const PRODUCT_SELECTORS = {
	title: [
		"h1.product__title",
		"h1.product-title",
		"h1[itemprop='name']",
		".product-title h1",
		"h1",
	],
	price: [
		"[data-price]",
		".price--main",
		".product__price",
		".product-price",
		"[itemprop='price']",
		".price",
		".product-single__price",
		".product-price-wrapper",
		".price-wrapper",
		"[data-product-price]",
		".money",
		".product__price-wrapper",
		".price-item",
		".product__current-price",
	],
	description: [
		".product__description",
		".product-description",
		"[itemprop='description']",
		".product-single__description",
		".product__content",
	],
	image: [
		".product__photo img",
		".product-image img",
		"img[itemprop='image']",
		".product-single__photo img",
		"img.product__image",
	],
	availability: [
		".product__availability",
		".availability",
		"[itemprop='availability']",
		".product-single__availability",
	],
} as const;

function findFirstText($: cheerio.Root, selectors: readonly string[]): string | undefined {
	for (const selector of selectors) {
		const $el = $(selector).first();
		if ($el.length === 0) continue;

		let text = $el.html() || "";
		if (!text) {
			text = $el.text().trim();
		} else {
			text = text
				.replace(/<br\s*\/?>/gi, " ")
				.replace(/<\/p>/gi, " ")
				.replace(/<\/div>/gi, " ")
				.replace(/<\/li>/gi, " ")
				.replace(/<\/h[1-6]>/gi, " ")
				.replace(/<[^>]*>/g, "")
				.replace(/&nbsp;/g, " ")
				.replace(/&amp;/g, "&")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, "'")
				.replace(/\s+/g, " ")
				.trim();
		}

		if (text) {
			return text;
		}
	}
	return undefined;
}

function findFirstAttr($: cheerio.Root, selectors: readonly string[], attr: string): string | undefined {
	for (const selector of selectors) {
		const $el = $(selector).first();
		const value = $el.attr(attr) || $el.attr(`data-${attr}`);
		if (value) {
			return value;
		}
	}
	return undefined;
}

function parseRating(text: string): number | undefined {
	const rating = parseFloat(text);
	return isNaN(rating) ? undefined : rating;
}

function parseReviewCount(text: string): number | undefined {
	const count = parseInt(text, 10);
	return isNaN(count) ? undefined : count;
}

function extractPriceFromJson(html: string): string | undefined {
	const jsonMatch = html.match(/"price":\s*(\d+)/);
	if (jsonMatch) {
		const priceInCents = parseInt(jsonMatch[1], 10);
		return (priceInCents / 100).toFixed(2);
	}

	const priceAmountMatch = html.match(/"price":\s*{\s*"amount":\s*([\d.]+)/);
	if (priceAmountMatch) {
		return priceAmountMatch[1];
	}

	return undefined;
}

async function scrapeProductPage(
	productUrl: string,
	maxRetries?: number,
	timeout?: number,
): Promise<ScrapedProduct> {
	logger.debug(`Scraping product page: ${productUrl}`);

	const html = await fetchWithRetry(productUrl, maxRetries, timeout);
	const $ = cheerio.load(html);

	let price = findFirstText($, PRODUCT_SELECTORS.price);
	if (!price) {
		price = extractPriceFromJson(html);
	}

	if (price) {
		const priceMatch = price.match(/\$?\s*([\d.,]+)/);
		if (priceMatch) {
			price = priceMatch[1];
		}
	}

	const product: ScrapedProduct = {
		url: productUrl,
		title: findFirstText($, PRODUCT_SELECTORS.title),
		price: price,
		description: findFirstText($, PRODUCT_SELECTORS.description),
		availability: findFirstText($, PRODUCT_SELECTORS.availability),
	};

	const imageUrl = findFirstAttr($, PRODUCT_SELECTORS.image, "src");
	if (imageUrl) {
		product.imageUrl = resolveUrl(imageUrl, new URL(productUrl).origin);
	}

	const ratingText = $("[itemprop='ratingValue']").first().text().trim();
	if (ratingText) {
		product.rating = parseRating(ratingText);
	}

	const reviewCountText = $("[itemprop='reviewCount']").first().text().trim();
	if (reviewCountText) {
		product.reviews = parseReviewCount(reviewCountText);
	}

	return product;
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrapeProducts(
	config: ScraperConfig,
): Promise<ScraperResult> {
	const finalConfig: ScraperConfig = {
		...DEFAULT_CONFIG,
		...config,
	};

	logger.info(`Starting scraper for: ${finalConfig.baseUrl}`);

	const errors: ScraperError[] = [];
	const products: ScrapedProduct[] = [];

	try {
		const productLinks = await extractProductLinks(
			finalConfig.baseUrl,
			finalConfig.productGridSelector,
			finalConfig.maxRetries,
			finalConfig.timeout,
		);

		if (productLinks.length === 0) {
			logger.warn("No product links found on collection page");
			return {
				products: [],
				totalScraped: 0,
				errors: [],
				scrapedAt: new Date().toISOString(),
			};
		}

		for (let i = 0; i < productLinks.length; i++) {
			const link = productLinks[i];

			try {
				const scraped = await scrapeProductPage(
					link,
					finalConfig.maxRetries,
					finalConfig.timeout,
				);

				const sanitized = sanitizeScrapedProduct(scraped);
				const validation = validateScrapedProduct(sanitized);
				if (!validation.valid) {
					logger.warn(`Invalid product data for ${link}: ${validation.reason}`);
					errors.push({
						url: link,
						error: validation.reason || "Invalid product data after sanitization",
						timestamp: new Date().toISOString(),
					});
					continue;
				}

				products.push(sanitized);
				logger.debug(`Scraped ${i + 1}/${productLinks.length}: ${sanitized.title || link}`);

				const isLastItem = i === productLinks.length - 1;
				const delayMs = finalConfig.delayBetweenRequests;
				if (!isLastItem && delayMs) {
					await delay(delayMs);
				}
			} catch (error) {
				const errorMessage = getErrorMessage(error);
				logger.error(`Failed to scrape ${link}: ${errorMessage}`);

				errors.push({
					url: link,
					error: errorMessage,
					timestamp: new Date().toISOString(),
				});
			}
		}

		logger.info(
			`Scraping completed. Successfully scraped ${products.length}/${productLinks.length} products`,
		);

		return {
			products,
			totalScraped: products.length,
			errors,
			scrapedAt: new Date().toISOString(),
		};
	} catch (error) {
		logger.error(`Scraper failed: ${getErrorMessage(error)}`);
		throw error;
	}
}


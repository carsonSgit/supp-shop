import logger from "../logger";
import type { ScrapedProduct } from "../types/scraper.types";
import type { Product } from "../types/models.types";
import { sanitizeScrapedProduct, validateScrapedProduct } from "./scraperSanitizer";

function extractFlavour(title: string | undefined): string | undefined {
	if (!title) return undefined;

	const cleaned = title.trim();
	if (!cleaned) return undefined;

	// Try to extract flavour from title patterns like "Brand Flavour Size" or "Brand Flavour"
	const flavourMatch = cleaned.match(/^([A-Za-z\s]+?)(?:\s*[-–—]\s*|\s*\(|\s*\d|$)/);
	if (flavourMatch) {
		const extracted = flavourMatch[1].trim();
		if (extracted.length > 0 && extracted.length <= 100) {
			return extracted;
		}
	}

	// Fallback: extract first word(s) that are alphabetic
	const words = cleaned.split(/\s+/).filter((word) => /^[A-Za-z]+$/.test(word));
	if (words.length > 0) {
		const firstWord = words[0];
		if (firstWord.length > 0 && firstWord.length <= 100) {
			return firstWord;
		}
	}

	// Last resort: remove all non-alphabetic characters except spaces
	const alphaOnly = cleaned.replace(/[^A-Za-z\s]/g, "").trim();
	if (alphaOnly.length > 0 && alphaOnly.length <= 100) {
		return alphaOnly;
	}

	return undefined;
}

function determineProductType(title: string | undefined, description: string | undefined): "Pre-workout" | "Protein-powder" | undefined {
	const searchText = `${title || ""} ${description || ""}`.toLowerCase();

	if (/\bpre[- ]?workout\b/i.test(searchText)) {
		return "Pre-workout";
	}

	if (
		/\bprotein\b/i.test(searchText) ||
		/\bwhey\b/i.test(searchText) ||
		/\bisolate\b/i.test(searchText) ||
		/\bcasein\b/i.test(searchText) ||
		/\bvegan\s+protein\b/i.test(searchText) ||
		/\bmass\s+gainer\b/i.test(searchText) ||
		/\bgainer\b/i.test(searchText) ||
		/\bcollagen\b/i.test(searchText) ||
		/\bplant\s+protein\b/i.test(searchText)
	) {
		return "Protein-powder";
	}

	return undefined;
}

function validateFlavour(flavour: string | undefined): boolean {
	if (!flavour) return false;
	return /^[a-zA-Z\s]+$/.test(flavour) && flavour.length <= 100;
}

function parsePrice(priceText: string | undefined): number | undefined {
	if (!priceText) return undefined;

	const cleaned = priceText.replace(/[^\d.,]/g, "").trim();
	if (!cleaned) return undefined;

	const normalized = cleaned.replace(/,/g, "");
	const price = parseFloat(normalized);

	if (isNaN(price) || price < 0 || price > 100000) {
		return undefined;
	}

	return Math.round(price * 100) / 100;
}

/**
 * Transforms a ScrapedProduct to a Product for database storage
 * @param scraped The scraped product data
 * @returns Product object or null if transformation fails
 */
export function transformScrapedToProduct(scraped: ScrapedProduct): Product | null {
	const sanitized = sanitizeScrapedProduct(scraped);

	const validation = validateScrapedProduct(sanitized);
	if (!validation.valid) {
		logger.warn(`Invalid scraped product ${scraped.url}: ${validation.reason}`);
		return null;
	}

	const flavour = extractFlavour(sanitized.title);
	if (!flavour || !validateFlavour(flavour)) {
		logger.warn(`Could not extract valid flavour from title "${sanitized.title}" for ${scraped.url}`);
		return null;
	}

	const price = parsePrice(sanitized.price);
	if (price === undefined || price <= 0) {
		logger.warn(`Invalid price "${sanitized.price}" for ${scraped.url}`);
		return null;
	}

	const type = determineProductType(sanitized.title, sanitized.description);
	if (!type) {
		logger.warn(`Could not determine product type for "${sanitized.title}" (${scraped.url})`);
		return null;
	}

	const product: Product = {
		flavour,
		type,
		price,
	};

	if (sanitized.description) {
		product.description = sanitized.description;
	}

	if (sanitized.rating !== undefined) {
		product.rating = sanitized.rating;
	}

	return product;
}


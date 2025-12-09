import validator from "validator";
import logger from "../logger";
import type { ScrapedProduct } from "../types/scraper.types";

function removeEmojis(text: string): string {
	return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2000}-\u{206F}]|[\u{2070}-\u{209F}]|[\u{20A0}-\u{20CF}]|[\u{2100}-\u{214F}]|[\u{2190}-\u{21FF}]|[\u{2300}-\u{23FF}]|[\u{2B50}-\u{2BFF}]|[\u{FE00}-\u{FE0F}]|[\u{FE20}-\u{FE2F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FAFF}]/gu, "");
}

function stripHtml(text: string | undefined): string | undefined {
	if (!text) return undefined;
	const unescaped = validator.unescape(text.trim());
	// Convert common HTML line breaks and block elements to spaces before removing tags
	const withSpaces = unescaped
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<\/p>/gi, " ")
		.replace(/<\/div>/gi, " ")
		.replace(/<\/li>/gi, " ")
		.replace(/<\/h[1-6]>/gi, " ")
		.replace(/<[^>]*>/g, "");
	const stripped = withSpaces.replace(/\s+/g, " ").trim();
	return validator.stripLow(stripped);
}

function normalizeWhitespace(text: string | undefined): string | undefined {
	if (!text) return undefined;
	return text
		.replace(/[ \t]+/g, " ")
		.trim();
}

function sanitizeText(text: string | undefined, maxLength?: number): string | undefined {
	if (!text) return undefined;
	let cleaned = stripHtml(text);
	if (!cleaned) return undefined;
	cleaned = removeEmojis(cleaned);
	cleaned = normalizeWhitespace(cleaned);
	if (!cleaned) return undefined;
	if (maxLength && cleaned.length > maxLength) {
		cleaned = cleaned.substring(0, maxLength);
	}
	return cleaned;
}

function sanitizeUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	const cleaned = url.trim();
	if (!validator.isURL(cleaned)) {
		logger.warn(`Invalid URL detected: ${cleaned}`);
		return undefined;
	}
	return cleaned;
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

function validateRating(rating: number | undefined): number | undefined {
	if (rating === undefined) return undefined;
	if (rating < 0 || rating > 5) {
		logger.warn(`Rating out of range: ${rating}`);
		return undefined;
	}
	return Math.round(rating * 10) / 10;
}

export function sanitizeScrapedProduct(scraped: ScrapedProduct): ScrapedProduct {
	return {
		url: sanitizeUrl(scraped.url) || scraped.url,
		title: sanitizeText(scraped.title, 200),
		price: scraped.price,
		description: sanitizeText(scraped.description, 5000),
		imageUrl: sanitizeUrl(scraped.imageUrl),
		rating: validateRating(scraped.rating),
		reviews: scraped.reviews && scraped.reviews > 0 ? scraped.reviews : undefined,
		availability: sanitizeText(scraped.availability, 50),
	};
}

export function validateScrapedProduct(scraped: ScrapedProduct): { valid: boolean; reason?: string } {
	if (!scraped.url || !validator.isURL(scraped.url)) {
		return { valid: false, reason: "Invalid or missing URL" };
	}

	if (!scraped.title || scraped.title.trim().length === 0) {
		return { valid: false, reason: "Missing or empty title" };
	}

	const price = parsePrice(scraped.price);
	if (price === undefined || price <= 0) {
		return { valid: false, reason: `Invalid or missing price: ${scraped.price || "undefined"}` };
	}

	return { valid: true };
}


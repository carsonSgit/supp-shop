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

function extractNutrition(description: string | undefined): {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
} | undefined {
	if (!description) return undefined;

	const desc = description.toLowerCase();
	const nutrition: { calories?: number; protein?: number; carbs?: number; fat?: number } = {};

	// Extract calories - look for patterns like "1,300 calories", "1300 calories", "calories: 1300"
	const caloriesMatch = desc.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(?:high\s+quality\s+)?calories?/);
	if (caloriesMatch) {
		const calories = parseFloat(caloriesMatch[1].replace(/,/g, ""));
		if (!isNaN(calories) && calories > 0 && calories < 10000) {
			nutrition.calories = Math.round(calories);
		}
	}

	// Extract protein - look for patterns like "55g protein", "55 g protein", "protein: 55g"
	const proteinMatch = desc.match(/(\d+(?:\.\d+)?)\s*g\s*(?:of\s+)?(?:pure\s+)?protein/i);
	if (proteinMatch) {
		const protein = parseFloat(proteinMatch[1]);
		if (!isNaN(protein) && protein >= 0 && protein < 1000) {
			nutrition.protein = Math.round(protein * 10) / 10;
		}
	}

	// Extract carbs - look for patterns like "250g of carbohydrates", "250g carbs", "carbs: 250g"
	const carbsMatch = desc.match(/(\d+(?:\.\d+)?)\s*g\s*(?:of\s+)?(?:clean\s+)?(?:carbohydrates?|carbs?)/i);
	if (carbsMatch) {
		const carbs = parseFloat(carbsMatch[1]);
		if (!isNaN(carbs) && carbs >= 0 && carbs < 1000) {
			nutrition.carbs = Math.round(carbs * 10) / 10;
		}
	}

	// Extract fat - look for patterns like "9g fat", "9 g fat", "fat: 9g"
	const fatMatch = desc.match(/(\d+(?:\.\d+)?)\s*g\s*(?:of\s+)?(?:healthy\s+)?fat/i);
	if (fatMatch) {
		const fat = parseFloat(fatMatch[1]);
		if (!isNaN(fat) && fat >= 0 && fat < 1000) {
			nutrition.fat = Math.round(fat * 10) / 10;
		}
	}

	// Return nutrition object only if we found at least calories or protein
	if (nutrition.calories !== undefined || nutrition.protein !== undefined) {
		return {
			calories: nutrition.calories ?? 0,
			protein: nutrition.protein ?? 0,
			carbs: nutrition.carbs ?? 0,
			fat: nutrition.fat ?? 0,
		};
	}

	return undefined;
}

function extractIngredients(description: string | undefined): string[] | undefined {
	if (!description) return undefined;

	const desc = description;
	const ingredients: string[] = [];

	// Look for ingredient lists - common patterns:
	// "chia, sweet potato, brown rice, corn, quinoa & oats"
	// "Whey Protein Isolate, Cocoa Powder, Natural Flavors"
	// Ingredients are often listed after keywords like "contains", "ingredients", "made with", "includes"
	const ingredientPatterns = [
		/(?:contains?|ingredients?|made\s+with|includes?|featuring?)[:\s]+([^.!?]+?)(?:\.|$|!)/i,
		/(?:real\s+food\s+complex|clean\s+carb\s+complex|clean\s+carb\s+real\s+food\s+complex)[:\s]+([^.!?]+?)(?:\.|$)/i,
		/(?:healthy\s+fat\s+sources?|fat\s+sources?)[:\s]+([^.!?]+?)(?:\.|$)/i,
		/(?:sources?)[:\s]+([^.!?]+?)(?:\.|$)/i,
	];

	for (const pattern of ingredientPatterns) {
		const match = desc.match(pattern);
		if (match && match[1]) {
			const ingredientText = match[1].trim();
			// Split by commas, semicolons, "and", "&"
			const split = ingredientText
				.split(/[,;&]|\s+and\s+|\s+&\s+/i)
				.map((ing) => ing.trim())
				.filter((ing) => ing.length > 0 && ing.length < 100 && !/^(per|with|from|to|the|a|an)$/i.test(ing));

			if (split.length > 0) {
				ingredients.push(...split);
			}
		}
	}

	// Also look for standalone ingredient lists (comma-separated)
	// This catches patterns like "chia, sweet potato, brown rice, corn, quinoa & oats"
	if (ingredients.length === 0) {
		// Look for patterns with lowercase ingredients (like "chia, sweet potato")
		const lowercaseMatch = desc.match(/\b([a-z]+(?:\s+[a-z]+)*(?:\s*,\s*[a-z]+(?:\s+[a-z]+)*){2,}(?:\s+&\s+[a-z]+(?:\s+[a-z]+)*)?)/);
		if (lowercaseMatch) {
			const ingredientText = lowercaseMatch[1];
			const split = ingredientText
				.split(/[,;&]|\s+and\s+|\s+&\s+/i)
				.map((ing) => ing.trim())
				.filter((ing) => ing.length > 0 && ing.length < 100);

			if (split.length >= 2) {
				ingredients.push(...split);
			}
		}

		// Look for capitalized ingredient lists
		const capitalizedMatch = desc.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*){2,}(?:\s+&\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)?)/);
		if (capitalizedMatch && ingredients.length === 0) {
			const ingredientText = capitalizedMatch[1];
			const split = ingredientText
				.split(/[,;&]|\s+and\s+|\s+&\s+/i)
				.map((ing) => ing.trim())
				.filter((ing) => ing.length > 0 && ing.length < 100 && /^[A-Z]/.test(ing));

			if (split.length >= 2) {
				ingredients.push(...split);
			}
		}
	}

	// Remove duplicates and clean up
	const uniqueIngredients = Array.from(new Set(ingredients.map((ing) => ing.trim()))).filter(
		(ing) => ing.length > 0 && ing.length < 100,
	);

	return uniqueIngredients.length > 0 ? uniqueIngredients : undefined;
}

function extractBenefits(description: string | undefined): string[] | undefined {
	if (!description) return undefined;

	const desc = description;
	const benefits: string[] = [];

	// Look for benefit statements - common patterns:
	// "Increases muscle size & strength"
	// "supports joints, recovery"
	// "Helps build muscle"
	// Benefits often start with action verbs
	const benefitPatterns = [
		/\b(increases?|improves?|supports?|helps?|enhances?|boosts?|promotes?|aids?|assists?|facilitates?|enables?|provides?|delivers?|offers?|ensures?|maintains?|builds?|strengthens?|reduces?|prevents?|protects?|optimizes?|maximizes?|accelerates?|stimulates?)\s+([^.!?]+?)(?:\.|$|!)/gi,
	];

	for (const pattern of benefitPatterns) {
		const matches = [...desc.matchAll(pattern)];
		for (const match of matches) {
			if (match[1] && match[2]) {
				const benefit = `${match[1]} ${match[2]}`.trim();
				// Filter out very short or very long benefits, and common false positives
				if (
					benefit.length > 10 &&
					benefit.length < 150 &&
					!benefit.toLowerCase().includes("what") &&
					!benefit.toLowerCase().includes("how to") &&
					!benefit.toLowerCase().includes("difference between")
				) {
					benefits.push(benefit);
				}
			}
		}
	}

	// Also look for bullet-point style benefits (lines starting with action verbs)
	const lines = desc.split(/[.!?]\s+/);
	for (const line of lines) {
		const trimmed = line.trim();
		if (
			trimmed.length > 10 &&
			trimmed.length < 150 &&
			/^(increases?|improves?|supports?|helps?|enhances?|boosts?|promotes?|aids?|builds?|strengthens?|reduces?|featuring?|added)/i.test(trimmed) &&
			!trimmed.toLowerCase().includes("what") &&
			!trimmed.toLowerCase().includes("how")
		) {
			benefits.push(trimmed);
		}
	}

	// Remove duplicates and limit to reasonable number
	const uniqueBenefits = Array.from(new Set(benefits.map((b) => b.trim()))).slice(0, 10);

	return uniqueBenefits.length > 0 ? uniqueBenefits : undefined;
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

		// Extract structured data from description
		const nutrition = extractNutrition(sanitized.description);
		if (nutrition) {
			product.nutrition = nutrition;
		}

		const ingredients = extractIngredients(sanitized.description);
		if (ingredients && ingredients.length > 0) {
			product.ingredients = ingredients;
		}

		const benefits = extractBenefits(sanitized.description);
		if (benefits && benefits.length > 0) {
			product.benefits = benefits;
		}
	}

	if (sanitized.rating !== undefined) {
		product.rating = sanitized.rating;
	}

	return product;
}


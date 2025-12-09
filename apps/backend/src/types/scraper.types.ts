export interface ScrapedProduct {
	url: string;
	title?: string;
	price?: string;
	description?: string;
	imageUrl?: string;
	rating?: number;
	reviews?: number;
	availability?: string;
	[key: string]: unknown; // Allow additional fields
}

export interface ScraperConfig {
	baseUrl: string;
	productGridSelector: string;
	delayBetweenRequests?: number;
	maxRetries?: number;
	timeout?: number;
}

export interface ScraperResult {
	products: ScrapedProduct[];
	totalScraped: number;
	errors: ScraperError[];
	scrapedAt: string;
}

export interface ScraperError {
	url: string;
	error: string;
	timestamp: string;
}


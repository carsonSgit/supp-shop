/**
 * Route and navigation types
 */

/**
 * Home page search params
 */
export interface HomeSearchParams {
	name?: string;
	errorMessage?: string;
}

/**
 * Common route search params
 */
export interface RouteSearchParams {
	errorMessage?: string;
	[key: string]: unknown;
}


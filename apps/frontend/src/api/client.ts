/**
 * Base API Client
 * Centralized fetch wrapper with error handling, interceptors, and cookie support
 */

import { API_BASE_URL } from '../config/api';

export interface ApiError {
	message: string;
	status: number;
	errorMessage?: string;
}

export class ApiClientError extends Error {
	status: number;
	errorMessage?: string;

	constructor(message: string, status: number, errorMessage?: string) {
		super(message);
		this.name = 'ApiClientError';
		this.status = status;
		this.errorMessage = errorMessage;
	}
}

interface RequestOptions extends RequestInit {
	skipAuth?: boolean;
}

/**
 * Base API client function
 */
export async function apiClient<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	const { skipAuth, ...fetchOptions } = options;

	const url = endpoint.startsWith('http') 
		? endpoint 
		: `${API_BASE_URL}${endpoint}`;

	const defaultHeaders: HeadersInit = {
		'Content-Type': 'application/json; charset=UTF-8',
	};

	// Merge headers
	const headers = {
		...defaultHeaders,
		...fetchOptions.headers,
	};

	try {
		const response = await fetch(url, {
			...fetchOptions,
			headers,
			credentials: 'include', // Include cookies for session management
		});

		// Check if response is ok before trying to parse JSON
		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch {
				// If response is not JSON, use status text
				errorData = { errorMessage: response.statusText };
			}
			throw new ApiClientError(
				errorData.errorMessage || `API Error: ${response.statusText}`,
				response.status,
				errorData.errorMessage
			);
		}

		// Try to parse JSON, but handle cases where response might be empty
		let data;
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			try {
				const text = await response.text();
				data = text ? JSON.parse(text) : null;
			} catch (parseError) {
				throw new ApiClientError(
					'Invalid JSON response from server',
					response.status
				);
			}
		} else {
			// If not JSON, return empty object or text
			data = {};
		}

		return data as T;
	} catch (error) {
		if (error instanceof ApiClientError) {
			throw error;
		}
		
		// Network or other errors (CORS, connection refused, etc.)
		const errorMessage = error instanceof Error 
			? error.message 
			: 'Network error occurred';
		
		// Check for common network error messages
		if (errorMessage.includes('Failed to fetch') || 
			errorMessage.includes('NetworkError') ||
			errorMessage.includes('Network request failed')) {
			throw new ApiClientError(
				'Unable to connect to server. Please check if the backend is running.',
				0
			);
		}
		
		throw new ApiClientError(errorMessage, 0);
	}
}

/**
 * GET request helper
 */
export function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
	return apiClient<T>(endpoint, {
		...options,
		method: 'GET',
	});
}

/**
 * POST request helper
 */
export function post<T>(
	endpoint: string,
	body?: unknown,
	options?: RequestOptions
): Promise<T> {
	return apiClient<T>(endpoint, {
		...options,
		method: 'POST',
		body: body ? JSON.stringify(body) : undefined,
	});
}

/**
 * PUT request helper
 */
export function put<T>(
	endpoint: string,
	body?: unknown,
	options?: RequestOptions
): Promise<T> {
	return apiClient<T>(endpoint, {
		...options,
		method: 'PUT',
		body: body ? JSON.stringify(body) : undefined,
	});
}

/**
 * DELETE request helper
 */
export function del<T>(endpoint: string, options?: RequestOptions): Promise<T> {
	return apiClient<T>(endpoint, {
		...options,
		method: 'DELETE',
	});
}


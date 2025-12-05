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

		const data = await response.json();

		if (!response.ok) {
			throw new ApiClientError(
				data.errorMessage || `API Error: ${response.statusText}`,
				response.status,
				data.errorMessage
			);
		}

		return data as T;
	} catch (error) {
		if (error instanceof ApiClientError) {
			throw error;
		}
		
		// Network or other errors
		throw new ApiClientError(
			error instanceof Error ? error.message : 'Network error occurred',
			0
		);
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


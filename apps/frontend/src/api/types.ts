/**
 * API Response Types
 * Type definitions for API responses
 */

export interface User {
	username: string;
	email: string;
	password?: string;
}

export interface Product {
	flavour: string;
	type?: string;
	price: number | string;
	description?: string;
	quantity?: number;
	ingredients?: string[];
	nutrition?: {
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
	};
	benefits?: string[];
	rating?: number;
	[key: string]: unknown;
}

export interface Order {
	orderID: string;
	username: string;
	flavour: string;
	quantity: number;
	[key: string]: unknown;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	username?: string;
	message?: string;
	errorMessage?: string;
}

export interface ApiResponse<T = unknown> {
	data?: T;
	message?: string;
	errorMessage?: string;
}


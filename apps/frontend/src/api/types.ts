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
	price: number;
	quantity?: number;
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


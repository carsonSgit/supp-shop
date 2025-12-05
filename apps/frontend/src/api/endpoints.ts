/**
 * API Endpoints
 * Centralized endpoint definitions grouped by resource
 */

export const API_ENDPOINTS = {
	// Authentication
	auth: {
		login: '/session/login',
		logout: '/session/logout',
	},

	// Users
	users: {
		base: '/users',
		all: '/users/all',
		getById: (username: string) => `/users/${username}`,
		create: '/users',
		update: (username: string) => `/users/${username}`,
		delete: (username: string) => `/users/${username}`,
	},

	// Products
	products: {
		base: '/products',
		all: '/products/all',
		getById: (flavour: string) => `/products/${flavour}`,
		create: '/products',
		update: '/products',
		delete: '/products',
	},

	// Orders
	orders: {
		base: '/orders',
		all: '/orders',
		getById: (orderID: string) => `/orders/${orderID}`,
		create: '/orders',
		update: (orderID: string) => `/orders/${orderID}`,
		delete: (orderID: string) => `/orders/${orderID}`,
	},
} as const;


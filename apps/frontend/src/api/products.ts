/**
 * Products API Service
 */

import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Product } from './types';

export const productsApi = {
	/**
	 * Get all products
	 */
	getAll: async (): Promise<Product[]> => {
		return get<Product[]>(API_ENDPOINTS.products.all);
	},

	/**
	 * Get product by flavour
	 */
	getById: async (flavour: string): Promise<Product> => {
		return get<Product>(API_ENDPOINTS.products.getById(flavour));
	},

	/**
	 * Create a new product
	 */
	create: async (product: Product): Promise<Product> => {
		return post<Product>(API_ENDPOINTS.products.create, product);
	},

	/**
	 * Update product
	 */
	update: async (product: Product): Promise<Product> => {
		return put<Product>(API_ENDPOINTS.products.update, product);
	},

	/**
	 * Delete product
	 */
	delete: async (product: Product): Promise<void> => {
		return del<void>(API_ENDPOINTS.products.delete, {
			body: JSON.stringify(product),
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
		});
	},
};


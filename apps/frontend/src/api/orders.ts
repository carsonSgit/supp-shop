/**
 * Orders API Service
 */

import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Order } from './types';

export const ordersApi = {
	/**
	 * Get all orders
	 */
	getAll: async (): Promise<Order[]> => {
		return get<Order[]>(API_ENDPOINTS.orders.all);
	},

	/**
	 * Get order by ID
	 */
	getById: async (orderID: string): Promise<Order> => {
		return get<Order>(API_ENDPOINTS.orders.getById(orderID));
	},

	/**
	 * Create a new order
	 */
	create: async (order: Omit<Order, 'orderID'>): Promise<Order> => {
		return post<Order>(API_ENDPOINTS.orders.create, order);
	},

	/**
	 * Update order
	 */
	update: async (orderID: string, order: Partial<Order>): Promise<Order> => {
		return put<Order>(API_ENDPOINTS.orders.update(orderID), order);
	},

	/**
	 * Delete order
	 */
	delete: async (orderID: string): Promise<void> => {
		return del<void>(API_ENDPOINTS.orders.delete(orderID));
	},
};


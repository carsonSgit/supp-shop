/**
 * Users API Service
 */

import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './endpoints';
import { User } from './types';

export const usersApi = {
	/**
	 * Get all users
	 */
	getAll: async (): Promise<User[]> => {
		return get<User[]>(API_ENDPOINTS.users.all);
	},

	/**
	 * Get user by username
	 */
	getById: async (username: string): Promise<User> => {
		return get<User>(API_ENDPOINTS.users.getById(username));
	},

	/**
	 * Create a new user
	 */
	create: async (user: Omit<User, 'username'> & { username: string }): Promise<User> => {
		return post<User>(API_ENDPOINTS.users.create, user);
	},

	/**
	 * Update user
	 */
	update: async (username: string, user: Partial<User>): Promise<User> => {
		return put<User>(API_ENDPOINTS.users.update(username), user);
	},

	/**
	 * Delete user
	 */
	delete: async (username: string): Promise<void> => {
		return del<void>(API_ENDPOINTS.users.delete(username));
	},
};


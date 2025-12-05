/**
 * Authentication API Service
 */

import { post } from './client';
import { API_ENDPOINTS } from './endpoints';
import { LoginRequest, LoginResponse } from './types';

export const authApi = {
	/**
	 * Login user
	 */
	login: async (credentials: LoginRequest): Promise<LoginResponse> => {
		return post<LoginResponse>(API_ENDPOINTS.auth.login, credentials);
	},

	/**
	 * Logout user
	 */
	logout: async (): Promise<void> => {
		return post<void>(API_ENDPOINTS.auth.logout);
	},
};


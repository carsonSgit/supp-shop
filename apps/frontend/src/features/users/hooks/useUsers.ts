/**
 * TanStack Query hooks for Users
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../api/users';
import { User } from '../../../api/types';

/**
 * Get all users
 */
export function useUsers() {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => usersApi.getAll(),
	});
}

/**
 * Get user by username
 */
export function useUser(username: string) {
	return useQuery({
		queryKey: ['users', username],
		queryFn: () => usersApi.getById(username),
		enabled: !!username,
	});
}

/**
 * Create user mutation
 */
export function useCreateUser() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (user: Omit<User, 'username'> & { username: string }) => 
			usersApi.create(user),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
}

/**
 * Update user mutation
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ username, user }: { username: string; user: Partial<User> }) =>
			usersApi.update(username, user),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
}

/**
 * Delete user mutation
 */
export function useDeleteUser() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (username: string) => usersApi.delete(username),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
}


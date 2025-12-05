/**
 * TanStack Query hooks for Orders
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../../api/orders';
import { Order } from '../../../api/types';

/**
 * Get all orders
 */
export function useOrders() {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => ordersApi.getAll(),
	});
}

/**
 * Get order by ID
 */
export function useOrder(orderID: string) {
	return useQuery({
		queryKey: ['orders', orderID],
		queryFn: () => ordersApi.getById(orderID),
		enabled: !!orderID,
	});
}

/**
 * Create order mutation
 */
export function useCreateOrder() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (order: Omit<Order, 'orderID'>) => ordersApi.create(order),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
}

/**
 * Update order mutation
 */
export function useUpdateOrder() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: ({ orderID, order }: { orderID: string; order: Partial<Order> }) =>
			ordersApi.update(orderID, order),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
}

/**
 * Delete order mutation
 */
export function useDeleteOrder() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (orderID: string) => ordersApi.delete(orderID),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
}


/**
 * TanStack Query hooks for Products
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../../api/products';
import { Product } from '../../../api/types';

/**
 * Get all products
 */
export function useProducts() {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => productsApi.getAll(),
	});
}

/**
 * Get product by flavour
 */
export function useProduct(flavour: string) {
	return useQuery({
		queryKey: ['products', flavour],
		queryFn: () => productsApi.getById(flavour),
		enabled: !!flavour,
	});
}

/**
 * Create product mutation
 */
export function useCreateProduct() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (product: Product) => productsApi.create(product),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

/**
 * Update product mutation
 */
export function useUpdateProduct() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (product: Product) => productsApi.update(product),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

/**
 * Delete product mutation
 */
export function useDeleteProduct() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (product: Product) => productsApi.delete(product),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}


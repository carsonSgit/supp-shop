/**
 * Navigation utilities for TanStack Router
 */

import { useNavigate as useTanStackNavigate } from '@tanstack/react-router';

/**
 * Wrapper for TanStack Router navigate with error handling
 */
export function useNavigateWithError() {
	const navigate = useTanStackNavigate();
	
	return {
		navigate: (to: string, errorMessage?: string) => {
			if (errorMessage) {
				navigate({ 
					to, 
					search: { errorMessage } as Record<string, any>
				});
			} else {
				navigate({ to });
			}
		},
	};
}


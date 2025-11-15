/**
 * Enhanced auth hook with React Query integration
 * Provides user data with automatic caching and refetching
 * Adapted from next-supabase-starter
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

/**
 * Hook to get current authenticated user with React Query
 * Automatically handles caching and refetching
 * 
 * @example
 * ```tsx
 * const { user, isLoading, error } = useAuthQuery();
 * 
 * if (isLoading) return <Loading />;
 * if (!user) return <LoginPrompt />;
 * 
 * return <div>Welcome, {user.email}</div>;
 * ```
 */
export function useAuthQuery() {
	return useQuery<User | null>({
		queryKey: ['auth', 'user'],
		queryFn: async () => {
			const { data, error } = await supabase.auth.getUser();
			
			if (error) {
				// If error, user is not authenticated
				return null;
			}

			return data?.user ?? null;
		},
		staleTime: 0, // Always fetch fresh user data
		refetchOnWindowFocus: true, // Refetch when window regains focus
		refetchOnMount: true, // Refetch on component mount
	});
}

/**
 * Hook to check if user is authenticated
 * Returns a boolean instead of the full user object
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, isLoading } = useIsAuthenticated();
 * ```
 */
export function useIsAuthenticated() {
	const { data: user, isLoading } = useAuthQuery();
	
	return {
		isAuthenticated: !!user,
		isLoading,
		user,
	};
}


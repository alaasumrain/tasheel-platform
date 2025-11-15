/**
 * React Query hooks for Supabase data fetching
 * Adapted from next-supabase-starter
 * 
 * Use these hooks in client components to fetch data from Supabase with React Query caching
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
// PostgrestFilterBuilder type is not exported, using any for query builder type
type PostgrestFilterBuilder = any;

const supabase = createClient();

export interface UseSupabaseQueryOptions<T> extends Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'> {
	/**
	 * Cache time in milliseconds. Default: 0 (no cache)
	 * Set to a number (e.g., 60000) to cache for that duration
	 */
	cacheTime?: number;
	/**
	 * Optional filter function to apply to the Supabase query
	 */
	filters?: (query: PostgrestFilterBuilder<any, any, any>) => PostgrestFilterBuilder<any, any, any>;
}

/**
 * Hook to fetch data from Supabase using React Query
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useSupabaseQuery(
 *   'users',
 *   'users-list',
 *   { cacheTime: 60000 } // Cache for 1 minute
 * );
 * ```
 * 
 * @example With filters
 * ```tsx
 * const { data } = useSupabaseQuery(
 *   'orders',
 *   'user-orders',
 *   {
 *     filters: (query) => query.eq('user_id', userId).order('created_at', { ascending: false })
 *   }
 * );
 * ```
 */
export function useSupabaseQuery<T = any>(
	table: string,
	queryKey: string,
	options?: UseSupabaseQueryOptions<T>
) {
	return useQuery<T[]>({
		queryKey: [queryKey, table],
		queryFn: async () => {
			let query = supabase.from(table).select('*');
			
			if (options?.filters) {
				query = options.filters(query);
			}

			const { data, error } = await query;
			
			if (error) {
				throw error;
			}

			return (data as T[]) ?? [];
		},
		staleTime: options?.cacheTime ?? 0,
		...options,
	});
}

/**
 * Hook to fetch a single record by ID
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useSupabaseQueryById(
 *   'orders',
 *   'order-123',
 *   '123'
 * );
 * ```
 */
export function useSupabaseQueryById<T = any>(
	table: string,
	queryKey: string,
	id: string | number,
	options?: Omit<UseQueryOptions<T | null, Error>, 'queryKey' | 'queryFn'>
) {
	return useQuery<T | null>({
		queryKey: [queryKey, table, id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from(table)
				.select('*')
				.eq('id', id)
				.single();

			if (error) {
				throw error;
			}

			return (data as T) ?? null;
		},
		staleTime: options?.cacheTime ?? 0,
		...options,
	});
}


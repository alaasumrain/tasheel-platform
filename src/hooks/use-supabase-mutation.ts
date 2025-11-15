/**
 * React Query hooks for Supabase mutations (insert, update, delete)
 * Adapted from next-supabase-starter
 * 
 * Use these hooks in client components to mutate Supabase data with React Query
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

const supabase = createClient();

export type MutationAction = 'insert' | 'update' | 'delete';

export interface UseSupabaseMutationOptions<TData = any, TVariables = any> 
	extends Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
	/**
	 * Query keys to invalidate after successful mutation
	 * Can be a string (table name) or array of query keys
	 */
	invalidateQueries?: string | string[];
}

/**
 * Hook to mutate data in Supabase (insert, update, delete)
 * 
 * @example Insert
 * ```tsx
 * const mutation = useSupabaseMutation('orders', 'insert');
 * 
 * mutation.mutate({
 *   user_id: userId,
 *   service_id: serviceId,
 *   status: 'pending'
 * });
 * ```
 * 
 * @example Update
 * ```tsx
 * const mutation = useSupabaseMutation('orders', 'update', {
 *   invalidateQueries: ['orders-list', 'user-orders']
 * });
 * 
 * mutation.mutate({
 *   id: orderId,
 *   status: 'completed'
 * });
 * ```
 * 
 * @example Delete
 * ```tsx
 * const mutation = useSupabaseMutation('orders', 'delete');
 * 
 * mutation.mutate({ id: orderId });
 * ```
 */
export function useSupabaseMutation<TData = any, TVariables extends { id?: string | number } = any>(
	table: string,
	action: MutationAction,
	options?: UseSupabaseMutationOptions<TData, TVariables>
) {
	const queryClient = useQueryClient();

	return useMutation<TData, Error, TVariables>({
		mutationFn: async (payload: TVariables) => {
			let response: any;

			if (action === 'insert') {
				// Remove id from insert payload if present
				const { id, ...insertData } = payload as any;
				response = await supabase.from(table).insert(insertData).select().single();
			} else if (action === 'update') {
				if (!payload.id) {
					throw new Error('ID is required for update operations');
				}
				const { id, ...updateData } = payload as any;
				response = await supabase
					.from(table)
					.update(updateData)
					.eq('id', id)
					.select()
					.single();
			} else if (action === 'delete') {
				if (!payload.id) {
					throw new Error('ID is required for delete operations');
				}
				response = await supabase
					.from(table)
					.delete()
					.eq('id', payload.id)
					.select()
					.single();
			}

			if (response?.error) {
				throw response.error;
			}

			return response?.data as TData;
		},
		onSuccess: (data, variables, context) => {
			// Invalidate relevant queries
			const invalidateKeys = options?.invalidateQueries 
				? Array.isArray(options.invalidateQueries) 
					? options.invalidateQueries 
					: [options.invalidateQueries]
				: [table];

			invalidateKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: [key], exact: false });
			});

			// Call custom onSuccess if provided
			if (options?.onSuccess) {
				options.onSuccess(data, variables, context);
			}
		},
		onMutate: async (newData) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: [table] });

			// Snapshot the previous value
			const previousData = queryClient.getQueryData([table]);

			// Optimistically update the cache for insert
			if (action === 'insert') {
				queryClient.setQueryData([table], (old: any[] = []) => [
					...old,
					{ id: `temp-${Date.now()}`, ...newData },
				]);
			}

			// Return context with previous data for rollback
			return { previousData };
		},
		onError: (error, variables, context) => {
			// Rollback on error
			if (context?.previousData) {
				queryClient.setQueryData([table], context.previousData);
			}

			// Call custom onError if provided
			if (options?.onError) {
				options.onError(error, variables, context);
			}
		},
		...options,
	});
}


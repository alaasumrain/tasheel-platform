/**
 * Client-side hooks for URL param management and debounced search
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Simple debounce function
 */
function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;
	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			func(...args);
		};
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Hook for managing URL search params
 */
export function useUrlParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const updateParams = useCallback(
		(params: Record<string, string | number | null | undefined>) => {
			const current = new URLSearchParams(searchParams.toString());

			Object.entries(params).forEach(([key, value]) => {
				if (value === null || value === undefined || value === '') {
					current.delete(key);
				} else {
					current.set(key, String(value));
				}
			});

			router.push(`?${current.toString()}`, { scroll: false });
		},
		[router, searchParams]
	);

	const getParam = useCallback(
		(key: string): string | null => {
			return searchParams.get(key);
		},
		[searchParams]
	);

	const getAllParams = useCallback((): Record<string, string> => {
		const params: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});
		return params;
	}, [searchParams]);

	const createQueryString = useCallback(
		(name: string, value: string | number | null | undefined): string => {
			const params = new URLSearchParams(searchParams.toString());
			if (value === null || value === undefined || value === '') {
				params.delete(name);
			} else {
				params.set(name, String(value));
			}
			return params.toString();
		},
		[searchParams]
	);

	return {
		updateParams,
		getParam,
		getAllParams,
		createQueryString,
		pathname,
		searchParams,
	};
}

/**
 * Hook for debounced search input
 */
export function useDebouncedSearch(
	initialValue: string = '',
	delay: number = 500,
	onSearch?: (value: string) => void
) {
	const [searchValue, setSearchValue] = useState(initialValue);
	const [debouncedValue, setDebouncedValue] = useState(initialValue);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(searchValue);
			if (onSearch) {
				onSearch(searchValue);
			}
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [searchValue, delay, onSearch]);

	return {
		searchValue,
		setSearchValue,
		debouncedValue,
	};
}

/**
 * Hook for managing filter state with URL sync
 */
export function useFilterState<T extends Record<string, any>>(
	initialFilters: T = {} as T
) {
	const { updateParams, getAllParams } = useUrlParams();
	const [filters, setFilters] = useState<T>(initialFilters);

	useEffect(() => {
		// Sync URL params to state on mount
		const urlParams = getAllParams();
		const urlFilters: Partial<T> = {};

		Object.entries(urlParams).forEach(([key, value]) => {
			if (key.startsWith('filter_')) {
				const filterKey = key.replace('filter_', '') as keyof T;
				urlFilters[filterKey] = value as T[keyof T];
			}
		});

		if (Object.keys(urlFilters).length > 0) {
			setFilters((prev) => ({ ...prev, ...urlFilters }));
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const updateFilter = useCallback(
		(key: keyof T, value: any) => {
			setFilters((prev) => {
				const newFilters = { ...prev, [key]: value };
				updateParams({ [`filter_${String(key)}`]: value });
				return newFilters;
			});
		},
		[updateParams]
	);

	const clearFilters = useCallback(() => {
		setFilters(initialFilters);
		// Clear filter params from URL
		const currentParams = getAllParams();
		Object.keys(currentParams).forEach((key) => {
			if (key.startsWith('filter_')) {
				updateParams({ [key]: null });
			}
		});
	}, [initialFilters, getAllParams, updateParams]);

	return {
		filters,
		setFilters,
		updateFilter,
		clearFilters,
	};
}

/**
 * Hook for pagination with URL sync
 */
export function usePagination(initialPage: number = 1, initialPageSize: number = 25) {
	const { updateParams, getParam } = useUrlParams();
	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialPageSize);

	useEffect(() => {
		// Sync URL params to state on mount
		const urlPage = getParam('page');
		const urlPageSize = getParam('pageSize') || getParam('itemsPerPage');

		if (urlPage) {
			setPage(Number(urlPage));
		}
		if (urlPageSize) {
			setPageSize(Number(urlPageSize));
		}
	}, [getParam]);

	const goToPage = useCallback(
		(newPage: number) => {
			setPage(newPage);
			updateParams({ page: newPage === 1 ? null : newPage });
		},
		[updateParams]
	);

	const changePageSize = useCallback(
		(newPageSize: number) => {
			setPageSize(newPageSize);
			setPage(1); // Reset to first page
			updateParams({ pageSize: newPageSize === 25 ? null : newPageSize, page: null });
		},
		[updateParams]
	);

	return {
		page,
		pageSize,
		goToPage,
		changePageSize,
	};
}

/**
 * Hook for sorting with URL sync
 */
export function useSorting(
	initialColumn?: string,
	initialDirection: 'asc' | 'desc' = 'asc'
) {
	const { updateParams, getParam } = useUrlParams();
	const [sortColumn, setSortColumn] = useState<string | undefined>(initialColumn);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);

	useEffect(() => {
		// Sync URL params to state on mount
		const urlColumn = getParam('sortColumn') || getParam('sort');
		const urlDirection = (getParam('sortDirection') || getParam('order')) as 'asc' | 'desc';

		if (urlColumn) {
			setSortColumn(urlColumn);
		}
		if (urlDirection) {
			setSortDirection(urlDirection);
		}
	}, [getParam]);

	const setSorting = useCallback(
		(column: string, direction: 'asc' | 'desc' = 'asc') => {
			setSortColumn(column);
			setSortDirection(direction);
			updateParams({
				sortColumn: column === initialColumn ? null : column,
				sortDirection: direction === 'asc' ? null : direction,
			});
		},
		[updateParams, initialColumn]
	);

	const toggleSort = useCallback(
		(column: string) => {
			if (sortColumn === column) {
				const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
				setSorting(column, newDirection);
			} else {
				setSorting(column, 'asc');
			}
		},
		[sortColumn, sortDirection, setSorting]
	);

	return {
		sortColumn,
		sortDirection,
		setSorting,
		toggleSort,
	};
}


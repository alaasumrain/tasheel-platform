/**
 * Advanced search predicate builder
 * Creates Supabase query filters from search terms and filter objects
 */

export interface SearchOptions {
	fields: string[];
	caseSensitive?: boolean;
}

export interface FilterOptions {
	[key: string]: any;
}

/**
 * Build search predicate for Supabase query
 * Searches across multiple fields with OR logic
 */
export function buildSearchPredicate(
	search: string,
	options: SearchOptions
): string | null {
	if (!search || !options.fields.length) return null;

	const searchTerm = search.trim();
	if (!searchTerm) return null;

	const fields = options.fields.map((field) => {
		return `${field}.ilike.%${searchTerm}%`;
	});

	return fields.join(',');
}

/**
 * Apply filters to Supabase query
 */
export function applyFilters<T>(
	query: any,
	filters: FilterOptions
): any {
	let result = query;

	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined || value === null || value === '') continue;

		// Handle different filter operators
		if (key.endsWith('_gte')) {
			const field = key.replace('_gte', '');
			result = result.gte(field, value);
		} else if (key.endsWith('_lte')) {
			const field = key.replace('_lte', '');
			result = result.lte(field, value);
		} else if (key.endsWith('_gt')) {
			const field = key.replace('_gt', '');
			result = result.gt(field, value);
		} else if (key.endsWith('_lt')) {
			const field = key.replace('_lt', '');
			result = result.lt(field, value);
		} else if (key.endsWith('_neq')) {
			const field = key.replace('_neq', '');
			result = result.neq(field, value);
		} else if (key.endsWith('_in')) {
			const field = key.replace('_in', '');
			if (Array.isArray(value)) {
				result = result.in(field, value);
			}
		} else if (key.endsWith('_contains')) {
			const field = key.replace('_contains', '');
			result = result.contains(field, value);
		} else {
			// Default to equality
			result = result.eq(key, value);
		}
	}

	return result;
}

/**
 * Build complete query with search, filters, sorting, and pagination
 */
export interface QueryOptions {
	search?: string;
	searchFields?: string[];
	filters?: FilterOptions;
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
	page?: number;
	pageSize?: number;
}

export function buildQuery<T>(
	baseQuery: any,
	options: QueryOptions
): { query: any; skip: number; take: number } {
	let query = baseQuery;
	const page = options.page || 1;
	const pageSize = options.pageSize || 25;
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	// Apply search
	if (options.search && options.searchFields && options.searchFields.length > 0) {
		const searchPredicate = buildSearchPredicate(options.search, {
			fields: options.searchFields,
			caseSensitive: false,
		});
		if (searchPredicate) {
			query = query.or(searchPredicate);
		}
	}

	// Apply filters
	if (options.filters) {
		query = applyFilters(query, options.filters);
	}

	// Apply sorting
	if (options.sortColumn) {
		query = query.order(options.sortColumn, {
			ascending: options.sortDirection !== 'desc',
		});
	}

	return { query, skip, take };
}

/**
 * Parse URL search params into query options
 */
export function parseQueryParams(searchParams: URLSearchParams): QueryOptions {
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
	const pageSize = searchParams.get('pageSize') || searchParams.get('itemsPerPage') 
		? Number(searchParams.get('pageSize') || searchParams.get('itemsPerPage'))
		: undefined;
	const search = searchParams.get('search') || undefined;
	const sortColumn = searchParams.get('sortColumn') || searchParams.get('sort') || undefined;
	const sortDirection = (searchParams.get('sortDirection') || searchParams.get('order') || 'asc') as 'asc' | 'desc';

	// Parse filters from JSON string or individual params
	let filters: FilterOptions | undefined;
	const filtersParam = searchParams.get('filters');
	if (filtersParam) {
		try {
			filters = JSON.parse(filtersParam);
		} catch {
			// If not JSON, parse individual filter params
			filters = {};
			searchParams.forEach((value, key) => {
				if (key.startsWith('filter_')) {
					const filterKey = key.replace('filter_', '');
					filters![filterKey] = value;
				}
			});
		}
	} else {
		// Parse individual filter params
		filters = {};
		searchParams.forEach((value, key) => {
			if (key.startsWith('filter_')) {
				const filterKey = key.replace('filter_', '');
				filters![filterKey] = value;
			}
		});
		if (Object.keys(filters).length === 0) {
			filters = undefined;
		}
	}

	return {
		search,
		filters,
		sortColumn,
		sortDirection,
		page,
		pageSize,
	};
}


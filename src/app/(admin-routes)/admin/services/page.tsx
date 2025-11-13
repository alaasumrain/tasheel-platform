import { Box } from '@mui/material';
import { ServicesPageClient } from '@/components/admin/ServicesPageClient';
import { getServiceCategories } from '@/lib/service-queries';
import { createClient } from '@/lib/supabase/server';
import { buildQuery, parseQueryParams } from '@/lib/utils/query-builder';
import { convertSearchParamsToURLSearchParams } from '@/lib/utils/search-params';

export const dynamic = 'force-dynamic';

interface ServicesPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
	const params = await searchParams;
	const searchParamsObj = convertSearchParamsToURLSearchParams(params);

	const queryOptions = parseQueryParams(searchParamsObj);
	
	// Fetch services with filtering
	const supabase = await createClient();
	let baseQuery = supabase
		.from('services')
		.select('*');

	const finalOptions = {
		...queryOptions,
		searchFields: queryOptions.searchFields || ['name_en', 'name_ar', 'slug', 'short_description_en', 'short_description_ar'],
		sortColumn: queryOptions.sortColumn || 'sort_order',
		sortDirection: queryOptions.sortDirection || 'asc',
	};

	const { query: builtQuery } = buildQuery(baseQuery, finalOptions);
	
	// Add secondary sort if primary sort is not name
	if (finalOptions.sortColumn !== 'name' && finalOptions.sortColumn !== 'name_en') {
		builtQuery.order('name', { ascending: true });
	}

	const { data: services, error } = await builtQuery;

	if (error) {
		console.error('Error fetching services:', error);
	}

	const categories = await getServiceCategories();

	return (
		<Box>
			<ServicesPageClient services={services || []} categories={categories} />
		</Box>
	);
}


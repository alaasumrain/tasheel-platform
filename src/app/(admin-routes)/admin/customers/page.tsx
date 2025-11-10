import { Box } from '@mui/material';
import { CustomersPageClient } from '@/components/admin/CustomersPageClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getCustomers } from '@/lib/admin-queries';
import { getTranslations } from 'next-intl/server';
import { parseQueryParams } from '@/lib/utils/query-builder';
import { convertSearchParamsToURLSearchParams } from '@/lib/utils/search-params';

export const dynamic = 'force-dynamic';

interface CustomersPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
	const t = await getTranslations('Admin.customers');
	const params = await searchParams;
	const searchParamsObj = convertSearchParamsToURLSearchParams(params);

	const queryOptions = parseQueryParams(searchParamsObj);
	const customers = await getCustomers({
		search: queryOptions.search,
		page: queryOptions.page,
		pageSize: queryOptions.pageSize,
		sortColumn: queryOptions.sortColumn,
		sortDirection: queryOptions.sortDirection,
	});

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: t('breadcrumbs.dashboard'), href: '/admin' },
					{ label: t('breadcrumbs.customers') },
				]}
			/>
			<CustomersPageClient customers={customers} />
		</Box>
	);
}


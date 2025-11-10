import { Box } from '@mui/material';
import { getUsers } from '@/lib/admin-queries';
import { UsersPageClient } from '@/components/admin/UsersPageClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getTranslations } from 'next-intl/server';
import { parseQueryParams } from '@/lib/utils/query-builder';
import { convertSearchParamsToURLSearchParams } from '@/lib/utils/search-params';

export const dynamic = 'force-dynamic';

interface UsersPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
	const t = await getTranslations('Admin.users');
	const params = await searchParams;
	const searchParamsObj = convertSearchParamsToURLSearchParams(params);

	const queryOptions = parseQueryParams(searchParamsObj);
	const users = await getUsers({
		search: queryOptions.search,
		role: queryOptions.filters?.role as string,
		isActive: queryOptions.filters?.is_active as boolean,
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
					{ label: t('breadcrumbs.users') },
				]}
			/>
			<UsersPageClient users={users} />
		</Box>
	);
}


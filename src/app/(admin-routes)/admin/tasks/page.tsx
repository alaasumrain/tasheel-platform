import { Box } from '@mui/material';
import { TasksPageClient } from '@/components/admin/TasksPageClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getTasks } from '@/lib/admin-queries';
import { getTranslations } from 'next-intl/server';
import { parseQueryParams } from '@/lib/utils/query-builder';
import { convertSearchParamsToURLSearchParams } from '@/lib/utils/search-params';

export const dynamic = 'force-dynamic';

interface TasksPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
	const t = await getTranslations('Admin.tasks');
	const params = await searchParams;
	const searchParamsObj = convertSearchParamsToURLSearchParams(params);

	const queryOptions = parseQueryParams(searchParamsObj);
	const tasks = await getTasks({
		status: queryOptions.filters?.status as any,
		priority: queryOptions.filters?.priority as any,
		type: queryOptions.filters?.type as any,
		assigned_to: queryOptions.filters?.assigned_to as string,
		application_id: queryOptions.filters?.application_id as string,
		page: queryOptions.page,
		pageSize: queryOptions.pageSize,
		sortColumn: queryOptions.sortColumn,
		sortDirection: queryOptions.sortDirection,
	});

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'Tasks' },
				]}
			/>
			<TasksPageClient tasks={tasks} />
		</Box>
	);
}


import { Box } from '@mui/material';
import { OrdersPageClient } from '@/components/admin/OrdersPageClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getOrders } from '@/lib/admin-queries';
import { getAllServices } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { getTranslations } from 'next-intl/server';
import { parseQueryParams } from '@/lib/utils/query-builder';
import { convertSearchParamsToURLSearchParams } from '@/lib/utils/search-params';

export const dynamic = 'force-dynamic';

interface OrdersPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
	const t = await getTranslations('Admin.orders');
	const params = await searchParams;
	const searchParamsObj = convertSearchParamsToURLSearchParams(params);

	const queryOptions = parseQueryParams(searchParamsObj);
	const orders = await getOrders({
		search: queryOptions.search,
		status: queryOptions.filters?.status as any,
		dateFrom: queryOptions.filters?.submitted_at_gte as string,
		dateTo: queryOptions.filters?.submitted_at_lte as string,
		page: queryOptions.page,
		pageSize: queryOptions.pageSize,
		sortColumn: queryOptions.sortColumn,
		sortDirection: queryOptions.sortDirection,
	});
	const services = await getAllServices();
	
	// Create a map of service slug -> name for quick lookup
	const serviceNames: Record<string, string> = {};
	services.forEach((service) => {
		const legacy = convertToLegacyFormat(service, 'en');
		serviceNames[service.slug] = legacy.title;
	});

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'Orders' },
				]}
			/>
			<OrdersPageClient orders={orders} serviceNames={serviceNames} />
		</Box>
	);
}

import { notFound } from 'next/navigation';
import { Box } from '@mui/material';
import { getOrderById, getOrderEvents } from '@/lib/admin-queries';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const t = await getTranslations('Admin.orders');
	const { id } = await params;

	try {
		const [order, events] = await Promise.all([
			getOrderById(id),
			getOrderEvents(id),
		]);

		if (!order) {
			notFound();
		}

		// Fetch service name if service_slug exists
		let serviceName: string | undefined;
		if (order.service_slug) {
			const service = await getServiceBySlug(order.service_slug);
			if (service) {
				const legacy = convertToLegacyFormat(service, 'en');
				serviceName = legacy.title;
			}
		}

		return (
			<Box>
				<AdminBreadcrumbs
					items={[
						{ label: 'Dashboard', href: '/admin' },
						{ label: 'Orders', href: '/admin/orders' },
						{ label: order.order_number || `Order ${id}` },
					]}
				/>

				<OrderDetailClient order={order} events={events} serviceName={serviceName} />
			</Box>
		);
	} catch (error) {
		console.error('Error loading order:', error);
		notFound();
	}
}

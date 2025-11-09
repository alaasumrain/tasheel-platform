import { Box } from '@mui/material';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { SLAPageClient } from '@/components/admin/SLAPageClient';
import { getOrders, getSLAConfigs, getSLAMetrics } from '@/lib/admin-queries';
import { getAllServices } from '@/lib/service-queries';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function SLAPage() {
	const t = await getTranslations('Admin.sla');
	const [orders, slaConfigs, metrics, services] = await Promise.all([
		getOrders(),
		getSLAConfigs(),
		getSLAMetrics(),
		getAllServices(),
	]);

	// Filter only active orders
	const activeOrders = orders.filter(order => 
		['submitted', 'scoping', 'quote_sent', 'in_progress', 'review'].includes(order.status)
	);

	// Map services to include id, slug, and name
	const servicesMap = services.map(service => ({
		id: service.id,
		slug: service.slug,
		name: service.name_en || service.name_ar || service.slug,
	}));

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'SLA Tracking' },
				]}
			/>
			<SLAPageClient
				applications={activeOrders}
				slaConfigs={slaConfigs}
				metrics={metrics}
				services={servicesMap}
			/>
		</Box>
	);
}


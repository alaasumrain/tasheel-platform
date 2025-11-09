import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	Receipt as OrdersIcon,
	HourglassEmpty as PendingIcon,
	AutoMode as InProgressIcon,
	CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrdersTimelineChart } from '@/components/admin/OrdersTimelineChart';
import { StatusDistributionChart } from '@/components/admin/StatusDistributionChart';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import {
	getOrders,
	getDashboardMetrics,
	getOrdersTimeline,
	getStatusDistribution,
} from '@/lib/admin-queries';
import { getAllServices } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
	const t = await getTranslations('Admin.dashboard');
	const [metrics, orders, timelineData, statusData, services] = await Promise.all([
		getDashboardMetrics(),
		getOrders(),
		getOrdersTimeline(),
		getStatusDistribution(),
		getAllServices(),
	]);
	
	// Create a map of service slug -> name for quick lookup
	const serviceNames: Record<string, string> = {};
	services.forEach((service) => {
		const legacy = convertToLegacyFormat(service, 'en');
		serviceNames[service.slug] = legacy.title;
	});

	return (
		<Box>
			<AdminBreadcrumbs items={[{ label: 'Dashboard' }]} />
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					{t('title')}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{t('description')}
				</Typography>
			</Box>

			{/* Stats Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.totalOrders')}
						value={metrics.totalOrders}
						icon={OrdersIcon}
						color="primary"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.pending')}
						value={metrics.pendingOrders}
						icon={PendingIcon}
						color="info"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.inProgress')}
						value={metrics.inProgressOrders}
						icon={InProgressIcon}
						color="warning"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.completedToday')}
						value={metrics.completedToday}
						icon={CompletedIcon}
						color="success"
					/>
				</Grid>
			</Grid>

			{/* Charts */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<OrdersTimelineChart data={timelineData} />
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<StatusDistributionChart data={statusData} />
				</Grid>
			</Grid>

			{/* Recent Orders */}
			<Box sx={{ mb: 2 }}>
				<Typography variant="h5" fontWeight={600} gutterBottom>
					{t('recentOrders.title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{t('recentOrders.description')}
				</Typography>
			</Box>

			<OrdersTable orders={orders.slice(0, 20)} serviceNames={serviceNames} />
		</Box>
	);
}

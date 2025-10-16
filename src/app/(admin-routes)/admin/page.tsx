import { Box, Grid, Typography } from '@mui/material';
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
import {
	getOrders,
	getDashboardMetrics,
	getOrdersTimeline,
	getStatusDistribution,
} from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
	const [metrics, orders, timelineData, statusData] = await Promise.all([
		getDashboardMetrics(),
		getOrders(),
		getOrdersTimeline(),
		getStatusDistribution(),
	]);

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					Dashboard
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Overview of all orders and their statuses
				</Typography>
			</Box>

			{/* Stats Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid xs={12} sm={6} md={3}>
					<StatsCard
						title="Total Orders"
						value={metrics.totalOrders}
						icon={OrdersIcon}
						color="primary"
					/>
				</Grid>
				<Grid xs={12} sm={6} md={3}>
					<StatsCard
						title="Pending"
						value={metrics.pendingOrders}
						icon={PendingIcon}
						color="info"
					/>
				</Grid>
				<Grid xs={12} sm={6} md={3}>
					<StatsCard
						title="In Progress"
						value={metrics.inProgressOrders}
						icon={InProgressIcon}
						color="warning"
					/>
				</Grid>
				<Grid xs={12} sm={6} md={3}>
					<StatsCard
						title="Completed Today"
						value={metrics.completedToday}
						icon={CompletedIcon}
						color="success"
					/>
				</Grid>
			</Grid>

			{/* Charts */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid xs={12} md={6}>
					<OrdersTimelineChart data={timelineData} />
				</Grid>
				<Grid xs={12} md={6}>
					<StatusDistributionChart data={statusData} />
				</Grid>
			</Grid>

			{/* Recent Orders */}
			<Box sx={{ mb: 2 }}>
				<Typography variant="h5" fontWeight={600} gutterBottom>
					Recent Orders
				</Typography>
				<Typography variant="body2" color="text.secondary">
					All orders sorted by most recent
				</Typography>
			</Box>

			<OrdersTable orders={orders.slice(0, 20)} />
		</Box>
	);
}

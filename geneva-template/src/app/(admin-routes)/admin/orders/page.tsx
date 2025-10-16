import { Box, Typography } from '@mui/material';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { getOrders } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
	const orders = await getOrders();

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					All Orders
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Manage and track all customer orders
				</Typography>
			</Box>

			<OrdersTable orders={orders} />
		</Box>
	);
}

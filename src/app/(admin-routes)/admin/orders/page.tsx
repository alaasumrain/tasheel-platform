import { Box, Typography } from '@mui/material';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { getOrders } from '@/lib/admin-queries';
import { getAllServices } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
	const orders = await getOrders();
	const services = await getAllServices();
	
	// Create a map of service slug -> name for quick lookup
	const serviceNames: Record<string, string> = {};
	services.forEach((service) => {
		const legacy = convertToLegacyFormat(service, 'en');
		serviceNames[service.slug] = legacy.title;
	});

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

			<OrdersTable orders={orders} serviceNames={serviceNames} />
		</Box>
	);
}

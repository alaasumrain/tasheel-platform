import { notFound } from 'next/navigation';
import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { getOrderById, getOrderEvents } from '@/lib/admin-queries';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	try {
		const [order, events] = await Promise.all([
			getOrderById(id),
			getOrderEvents(id),
		]);

		if (!order) {
			notFound();
		}

		return (
			<Box>
				<Breadcrumbs sx={{ mb: 3 }}>
					<MuiLink component={Link} href="/admin" underline="hover" color="inherit">
						Dashboard
					</MuiLink>
					<MuiLink component={Link} href="/admin/orders" underline="hover" color="inherit">
						Orders
					</MuiLink>
					<Typography color="text.primary">{order.order_number}</Typography>
				</Breadcrumbs>

				<OrderDetailClient order={order} events={events} />
			</Box>
		);
	} catch (error) {
		console.error('Error loading order:', error);
		notFound();
	}
}

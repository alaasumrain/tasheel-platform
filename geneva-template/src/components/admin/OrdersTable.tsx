'use client';

import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	Button,
	Box,
	Typography,
} from '@mui/material';
import { Card } from '@/components/ui/card';
import { Application, ApplicationStatus } from '@/lib/admin-queries';
import { services } from '@/data/services';

interface OrdersTableProps {
	orders: Application[];
}

const statusColors: Record<ApplicationStatus, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
	draft: 'default',
	submitted: 'info',
	scoping: 'primary',
	quote_sent: 'warning',
	in_progress: 'primary',
	review: 'warning',
	completed: 'success',
	archived: 'default',
	rejected: 'error',
	cancelled: 'default',
};

const statusLabels: Record<ApplicationStatus, string> = {
	draft: 'Draft',
	submitted: 'Submitted',
	scoping: 'Scoping',
	quote_sent: 'Quote Sent',
	in_progress: 'In Progress',
	review: 'In Review',
	completed: 'Completed',
	archived: 'Archived',
	rejected: 'Rejected',
	cancelled: 'Cancelled',
};

function getServiceName(serviceSlug: string): string {
	const service = services.find((s) => s.slug === serviceSlug);
	return service?.title || serviceSlug;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

export function OrdersTable({ orders }: OrdersTableProps) {
	if (orders.length === 0) {
		return (
			<Card
				backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
				borderColor={{ light: '#e0e0e0', dark: '#333333' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="h6" color="text.secondary">
						No orders found
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						Orders will appear here when customers submit quote requests
					</Typography>
				</Box>
			</Card>
		);
	}

	return (
		<Card
			backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
			borderColor={{ light: '#e0e0e0', dark: '#333333' }}
			borderRadius={20}
		>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 600 }}>Order Number</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
							<TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map((order) => (
							<TableRow
								key={order.id}
								hover
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell>
									<Typography variant="body2" fontWeight={600}>
										{order.order_number || 'N/A'}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{order.customer_name || 'N/A'}
									</Typography>
									{order.customer_phone && (
										<Typography variant="caption" color="text.secondary" display="block">
											{order.customer_phone}
										</Typography>
									)}
								</TableCell>
								<TableCell>
									<Typography variant="body2">{order.applicant_email}</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{getServiceName(order.service_slug)}
									</Typography>
								</TableCell>
								<TableCell>
									<Chip
										label={statusLabels[order.status]}
										color={statusColors[order.status]}
										size="small"
									/>
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{formatDate(order.submitted_at)}
									</Typography>
								</TableCell>
								<TableCell align="right">
									<Button
										component={Link}
										href={`/admin/orders/${order.id}`}
										variant="outlined"
										size="small"
									>
										View
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	);
}

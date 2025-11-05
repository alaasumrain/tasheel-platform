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
import { useTranslations } from 'next-intl';

interface OrdersTableProps {
	orders: Application[];
	serviceNames?: Record<string, string>; // Map of slug -> name
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

function getServiceName(serviceSlug: string | null, serviceNames?: Record<string, string>): string {
	if (!serviceSlug) {
		return 'N/A';
	}
	return serviceNames?.[serviceSlug] || serviceSlug;
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

export function OrdersTable({ orders, serviceNames }: OrdersTableProps) {
	const t = useTranslations('Admin.orders');
	
	if (orders.length === 0) {
		return (
			<Card
				backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
				borderColor={{ light: '#e0e0e0', dark: '#333333' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="h6" color="text.secondary">
						{t('noOrders')}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						{t('noOrdersDescription')}
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
							<TableCell sx={{ fontWeight: 600 }}>{t('table.orderNumber')}</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>{t('table.customer')}</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>{t('table.email')}</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>{t('table.service')}</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>{t('table.status')}</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>{t('table.submitted')}</TableCell>
							<TableCell align="right" sx={{ fontWeight: 600 }}>{t('table.actions')}</TableCell>
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
										{getServiceName(order.service_slug, serviceNames)}
									</Typography>
								</TableCell>
								<TableCell>
									<Chip
										label={t(`statusLabels.${order.status}` as any)}
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
										{t('table.view')}
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

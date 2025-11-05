'use client';

import { useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Button,
	IconButton,
	Stack,
	TextField,
	InputAdornment,
} from '@mui/material';
import { IconSearch, IconEye } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import type { Application } from '@/lib/admin-queries';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

interface CustomerRequestsTableProps {
	orders: Application[];
}

const statusColors: Record<
	Application['status'],
	'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
> = {
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

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}

export function CustomerRequestsTable({ orders }: CustomerRequestsTableProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const t = useTranslations('Dashboard.requests');

	const filteredOrders = orders.filter(
		(order) =>
			!searchTerm ||
			order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.service_slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.status.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Stack spacing={3}>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				<TextField
					placeholder={t('searchPlaceholder')}
					size="small"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<IconSearch size={20} />
							</InputAdornment>
						),
					}}
					sx={{ maxWidth: 300 }}
				/>
			</Box>

			{filteredOrders.length === 0 ? (
				<Box sx={{ py: 8, textAlign: 'center' }}>
					<Typography variant="body1" color="text.secondary">
						{searchTerm ? t('noResults') : t('noRequests')}
					</Typography>
				</Box>
			) : (
				<TableContainer component={Paper} sx={{ borderRadius: 2 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{t('table.orderNumber')}</TableCell>
								<TableCell>{t('table.service')}</TableCell>
								<TableCell>{t('table.status')}</TableCell>
								<TableCell>{t('table.submitted')}</TableCell>
								<TableCell align="right">{t('table.actions')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredOrders.map((order) => (
								<TableRow key={order.id} hover>
									<TableCell>
										<Typography variant="body2" fontWeight={600}>
											{order.order_number || 'N/A'}
										</Typography>
									</TableCell>
									<TableCell>{order.service_slug || 'N/A'}</TableCell>
									<TableCell>
										<Chip
											label={t(`statusLabels.${order.status}` as any)}
											color={statusColors[order.status]}
											size="small"
										/>
									</TableCell>
									<TableCell>{formatDate(order.submitted_at)}</TableCell>
									<TableCell align="right">
										<Stack direction="row" spacing={1} justifyContent="flex-end">
											<Button
												component={Link}
												href={`/dashboard/requests/${order.id}`}
												size="small"
												variant="outlined"
												startIcon={<IconEye size={18} />}
											>
												{t('table.view')}
											</Button>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Stack>
	);
}


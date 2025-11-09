'use client';

import { useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Box, Typography } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Payment } from '@/lib/admin-queries';
import { useTranslations, useLocale } from 'next-intl';

interface PaymentsTableProps {
	payments: Payment[];
}

const statusColors: Record<Payment['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
	pending: 'warning',
	completed: 'success',
	failed: 'error',
};

function formatDate(dateString: string, locale: string = 'en'): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'ILS',
		minimumFractionDigits: 2,
	}).format(amount);
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
	const t = useTranslations('Admin.financials');
	const locale = useLocale() as 'en' | 'ar';

	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'transaction_id',
			headerName: t('table.transactionId'),
			width: 200,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">
					{params.value || '-'}
				</Typography>
			),
		},
		{
			field: 'amount',
			headerName: t('table.amount'),
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" fontWeight={600}>
					{formatCurrency(Number(params.value))}
				</Typography>
			),
		},
		{
			field: 'gateway',
			headerName: t('table.gateway'),
			width: 120,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">
					{params.value || 'N/A'}
				</Typography>
			),
		},
		{
			field: 'status',
			headerName: t('table.status'),
			width: 120,
			renderCell: (params: GridRenderCellParams) => (
				<Chip
					label={params.value}
					color={statusColors[params.value as keyof typeof statusColors]}
					size="small"
				/>
			),
		},
		{
			field: 'created_at',
			headerName: t('table.created'),
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" color="text.secondary">
					{formatDate(params.value, locale)}
				</Typography>
			),
		},
	], [t, locale]);

	if (payments.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="body1" color="text.secondary">
						{t('noPayments') || 'No payments found'}
					</Typography>
				</Box>
			</Card>
		);
	}

	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={20}
		>
			<DataGrid
				rows={payments}
				columns={columns}
				disableRowSelectionOnClick
				autoHeight
				pageSizeOptions={[10, 25, 50, 100]}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 25 },
					},
				}}
				slots={{
					toolbar: GridToolbar,
				}}
				sx={{
					border: 'none',
					'& .MuiDataGrid-cell': {
						borderBottom: '1px solid',
						borderColor: 'divider',
					},
					'& .MuiDataGrid-columnHeaders': {
						borderBottom: '2px solid',
						borderColor: 'divider',
					},
				}}
			/>
		</Card>
	);
}


'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Button, Box, Typography } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Invoice } from '@/lib/admin-queries';
import { useTranslations, useLocale } from 'next-intl';

interface InvoicesTableProps {
	invoices: Invoice[];
}

const statusColors: Record<Invoice['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
	pending: 'warning',
	paid: 'success',
	failed: 'error',
	cancelled: 'default',
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

function formatCurrency(amount: number, currency: string = 'ILS'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
	}).format(amount);
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
	const t = useTranslations('Admin.financials');
	const locale = useLocale() as 'en' | 'ar';
	const router = useRouter();

	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'invoice_number',
			headerName: t('table.invoiceNumber'),
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" fontWeight={600}>
					{params.value || 'N/A'}
				</Typography>
			),
		},
		{
			field: 'amount',
			headerName: t('table.amount'),
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" fontWeight={600}>
					{formatCurrency(Number(params.value), params.row.currency)}
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
		{
			field: 'paid_at',
			headerName: t('table.paidAt'),
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" color="text.secondary">
					{params.value ? formatDate(params.value, locale) : '-'}
				</Typography>
			),
		},
		{
			field: 'actions',
			headerName: t('table.actions'),
			width: 120,
			sortable: false,
			renderCell: (params: GridRenderCellParams) => (
				<Button
					variant="outlined"
					size="small"
					onClick={() => router.push(`/admin/orders/${params.row.application_id}`)}
				>
					{t('view') || 'View'}
				</Button>
			),
		},
	], [t, locale, router]);

	if (invoices.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="body1" color="text.secondary">
						{t('noInvoices') || 'No invoices found'}
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
				rows={invoices}
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


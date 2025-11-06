'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Button, Box, Typography, Stack } from '@mui/material';
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
	const router = useRouter();

	// Define columns for DataGrid
	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'order_number',
			headerName: t('table.orderNumber'),
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" fontWeight={600}>
					{params.value || 'N/A'}
				</Typography>
			),
		},
		{
			field: 'customer_name',
			headerName: t('table.customer'),
			width: 200,
			renderCell: (params: GridRenderCellParams) => (
				<Stack>
					<Typography variant="body2">
						{params.value || 'N/A'}
					</Typography>
					{params.row.customer_phone && (
						<Typography variant="caption" color="text.secondary">
							{params.row.customer_phone}
						</Typography>
					)}
				</Stack>
			),
		},
		{
			field: 'applicant_email',
			headerName: t('table.email'),
			width: 220,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">{params.value}</Typography>
			),
		},
		{
			field: 'service_slug',
			headerName: t('table.service'),
			width: 200,
			valueGetter: (value) => getServiceName(value, serviceNames),
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">{params.value}</Typography>
			),
		},
		{
			field: 'status',
			headerName: t('table.status'),
			width: 150,
			renderCell: (params: GridRenderCellParams<Application, ApplicationStatus>) => {
				const status = params.value || 'submitted';
				return (
					<Chip
						label={t(`statusLabels.${status}` as any)}
						color={statusColors[status]}
						size="small"
					/>
				);
			},
		},
		{
			field: 'submitted_at',
			headerName: t('table.submitted'),
			width: 180,
			valueGetter: (value) => new Date(value),
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">
					{formatDate(params.row.submitted_at)}
				</Typography>
			),
		},
		{
			field: 'actions',
			headerName: t('table.actions'),
			width: 120,
			sortable: false,
			filterable: false,
			renderCell: (params: GridRenderCellParams) => (
				<Button
					onClick={() => router.push(`/admin/orders/${params.row.id}`)}
					variant="outlined"
					size="small"
				>
					{t('table.view')}
				</Button>
			),
		},
	], [t, serviceNames, router]);

	// Empty state
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
			<Box sx={{ height: 'auto', width: '100%' }}>
				<DataGrid
					rows={orders}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { pageSize: 25 },
						},
						sorting: {
							sortModel: [{ field: 'submitted_at', sort: 'desc' }],
						},
					}}
					pageSizeOptions={[10, 25, 50, 100]}
					disableRowSelectionOnClick
					autoHeight
					slots={{
						toolbar: GridToolbar,
					}}
					slotProps={{
						toolbar: {
							showQuickFilter: true,
							quickFilterProps: { debounceMs: 500 },
						},
					}}
					sx={{
						border: 'none',
						'& .MuiDataGrid-cell': {
							borderColor: 'divider',
						},
						'& .MuiDataGrid-columnHeaders': {
							backgroundColor: 'background.default',
							borderBottom: '2px solid',
							borderColor: 'divider',
						},
						'& .MuiDataGrid-footerContainer': {
							borderTop: '2px solid',
							borderColor: 'divider',
						},
					}}
				/>
			</Box>
		</Card>
	);
}

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Button, Box, Typography, Stack } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Customer } from '@/lib/admin-queries';
import { useTranslations, useLocale } from 'next-intl';

interface CustomersTableProps {
	customers: Customer[];
}

function formatDate(dateString: string, locale: string = 'en'): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}

export function CustomersTable({ customers }: CustomersTableProps) {
	const t = useTranslations('Admin.customers');
	const locale = useLocale() as 'en' | 'ar';
	const router = useRouter();

	// Define columns for DataGrid
	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'name',
			headerName: t('table.name'),
			width: 200,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" fontWeight={600}>
					{params.value || 'N/A'}
				</Typography>
			),
		},
		{
			field: 'email',
			headerName: t('table.email'),
			width: 250,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">
					{params.value}
				</Typography>
			),
		},
		{
			field: 'phone',
			headerName: t('table.phone'),
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" color="text.secondary">
					{params.value || 'N/A'}
				</Typography>
			),
		},
		{
			field: 'language_preference',
			headerName: t('table.language'),
			width: 120,
			renderCell: (params: GridRenderCellParams) => (
				<Chip
					label={params.value === 'ar' ? 'العربية' : 'English'}
					size="small"
					color={params.value === 'ar' ? 'primary' : 'default'}
				/>
			),
		},
		{
			field: 'created_at',
			headerName: t('table.created'),
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" color="text.secondary">
					{formatDate(params.value, locale)}
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
					onClick={() => router.push(`/admin/customers/${params.row.id}`)}
				>
					{t('view')}
				</Button>
			),
		},
	], [t, locale, router]);

	if (customers.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="body1" color="text.secondary">
						{t('noCustomers')}
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
				rows={customers}
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


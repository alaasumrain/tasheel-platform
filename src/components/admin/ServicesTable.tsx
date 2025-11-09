'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Button, Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useToast } from '@/components/admin/ToastProvider';
import { Card } from '@/components/ui/card';
import type { Service } from '@/lib/types/service';

interface ServicesTableProps {
	services: Service[];
	categories: Array<{ id: string; name: string; name_ar?: string }>;
	onDelete?: (id: string) => void;
	onEdit?: (id: string) => void;
}

function formatPrice(pricing: any): string {
	if (!pricing) return 'Quote';
	if (pricing.type === 'quote') return 'Quote';
	if (pricing.type === 'fixed' && pricing.amount) return `₪${pricing.amount}`;
	if (pricing.type === 'starting' && pricing.amount) return `From ₪${pricing.amount}`;
	return 'Quote';
}

function getCategoryName(categoryId: string, categories: Array<{ id: string; name: string }>): string {
	const category = categories.find((c) => c.id === categoryId);
	return category?.name || 'N/A';
}

export function ServicesTable({ services, categories, onDelete, onEdit }: ServicesTableProps) {
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this service?')) return;

		setDeletingId(id);
		try {
			const response = await fetch(`/api/admin/services/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				showSuccess('Service deleted successfully!');
				if (onDelete) {
					onDelete(id);
				} else {
					router.refresh();
				}
			} else {
				const errorData = await response.json();
				const errorMessage = errorData.error || 'Failed to delete service';
				showError(errorMessage);
			}
		} catch (error) {
			console.error('Error deleting service:', error);
			showError('An error occurred while deleting the service');
		} finally {
			setDeletingId(null);
		}
	};

	const columns: GridColDef[] = useMemo(
		() => [
			{
				field: 'name_en',
				headerName: 'Name',
				width: 250,
				renderCell: (params: GridRenderCellParams) => (
					<Box>
						<Typography variant="body2" fontWeight={600}>
							{params.value || params.row.name}
						</Typography>
						{params.row.name_ar && (
							<Typography variant="caption" color="text.secondary">
								{params.row.name_ar}
							</Typography>
						)}
					</Box>
				),
			},
			{
				field: 'category_id',
				headerName: 'Category',
				width: 150,
				valueGetter: (value) => getCategoryName(value, categories),
				renderCell: (params: GridRenderCellParams) => (
					<Chip label={params.value} size="small" variant="outlined" />
				),
			},
			{
				field: 'pricing',
				headerName: 'Price',
				width: 120,
				valueGetter: (value) => formatPrice(value),
				renderCell: (params: GridRenderCellParams) => (
					<Typography variant="body2">{params.value}</Typography>
				),
			},
			{
				field: 'is_active',
				headerName: 'Status',
				width: 120,
				renderCell: (params: GridRenderCellParams) => (
					<Chip
						label={params.value ? 'Active' : 'Inactive'}
						color={params.value ? 'success' : 'default'}
						size="small"
					/>
				),
			},
			{
				field: 'is_featured',
				headerName: 'Featured',
				width: 100,
				renderCell: (params: GridRenderCellParams) => (
					<Chip
						label={params.value ? 'Yes' : 'No'}
						color={params.value ? 'primary' : 'default'}
						size="small"
						variant={params.value ? 'filled' : 'outlined'}
					/>
				),
			},
			{
				field: 'sort_order',
				headerName: 'Order',
				width: 100,
				renderCell: (params: GridRenderCellParams) => (
					<Typography variant="body2">{params.value || 0}</Typography>
				),
			},
			{
				field: 'actions',
				headerName: 'Actions',
				width: 150,
				sortable: false,
				filterable: false,
				renderCell: (params: GridRenderCellParams) => (
					<Box sx={{ display: 'flex', gap: 1 }}>
						<IconButton
							size="small"
							onClick={() => {
								if (onEdit) {
									onEdit(params.row.id);
								} else {
									router.push(`/admin/services/${params.row.id}/edit`);
								}
							}}
							color="primary"
						>
							<EditIcon fontSize="small" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => handleDelete(params.row.id)}
							color="error"
							disabled={deletingId === params.row.id}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Box>
				),
			},
		],
		[categories, router, deletingId, onEdit]
	);

	if (services.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="h6" color="text.secondary">
						No services found
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						Create your first service to get started
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
			<Box sx={{ height: 'auto', width: '100%' }}>
				<DataGrid
					rows={services}
					columns={columns}
					getRowId={(row) => row.id}
					initialState={{
						pagination: {
							paginationModel: { pageSize: 25 },
						},
						sorting: {
							sortModel: [{ field: 'sort_order', sort: 'asc' }, { field: 'name_en', sort: 'asc' }],
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


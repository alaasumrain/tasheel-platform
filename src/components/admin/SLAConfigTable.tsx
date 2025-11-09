'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Card } from '@/components/ui/card';
import { SLAConfig } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/admin/ToastProvider';

interface SLAConfigTableProps {
	configs: SLAConfig[];
	services: Array<{ id: string; name: string }>;
	onRefresh: () => void;
}

export function SLAConfigTable({ configs, services, onRefresh }: SLAConfigTableProps) {
	const t = useTranslations('Admin.sla.configs');
	const router = useRouter();
	const { showSuccess, showError } = useToast();

	const serviceMap = new Map(services.map(s => [s.id, s]));

	const handleDelete = async (id: string) => {
		if (!confirm(t('deleteConfirm') || 'Are you sure you want to delete this SLA configuration?')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/sla-configs/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to delete SLA configuration');
			}

			showSuccess(t('deleteSuccess') || 'SLA configuration deleted successfully!');
			onRefresh();
		} catch (error: any) {
			console.error('Error deleting SLA config:', error);
			showError(error.message || t('deleteError') || 'Failed to delete SLA configuration');
		}
	};

	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'service_name',
			headerName: t('table.service'),
			width: 250,
			renderCell: (params: GridRenderCellParams) => {
				const serviceId = params.row.service_id;
				const service = serviceMap.get(serviceId);
				return (
					<Typography variant="body2" fontWeight={600}>
						{service?.name || serviceId}
					</Typography>
				);
			},
		},
		{
			field: 'target_hours',
			headerName: t('table.targetHours'),
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2">
					{params.value} {t('hours') || 'hours'}
				</Typography>
			),
		},
		{
			field: 'warning_threshold_percent',
			headerName: t('table.warningThreshold'),
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Chip
					label={`${params.value}%`}
					size="small"
					color={params.value >= 80 ? 'error' : params.value >= 70 ? 'warning' : 'info'}
				/>
			),
		},
		{
			field: 'created_at',
			headerName: t('table.created'),
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" color="text.secondary">
					{new Date(params.value).toLocaleDateString()}
				</Typography>
			),
		},
		{
			field: 'actions',
			headerName: t('table.actions'),
			width: 150,
			sortable: false,
			renderCell: (params: GridRenderCellParams) => (
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Tooltip title={t('edit') || 'Edit'}>
						<IconButton
							size="small"
							onClick={() => router.push(`/admin/sla/configs/${params.row.id}/edit`)}
						>
							<EditIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title={t('delete') || 'Delete'}>
						<IconButton
							size="small"
							color="error"
							onClick={() => handleDelete(params.row.id)}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>
			),
		},
	], [t, router, serviceMap]);

	if (configs.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="body1" color="text.secondary">
						{t('noConfigs') || 'No SLA configurations found'}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						{t('noConfigsDescription') || 'Create an SLA configuration for a service to start tracking compliance'}
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
				rows={configs.map(config => ({
					...config,
					service_name: serviceMap.get(config.service_id)?.name || config.service_id,
				}))}
				columns={columns}
				getRowId={(row) => row.id}
				disableRowSelectionOnClick
				autoHeight
				pageSizeOptions={[10, 25, 50]}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 25 },
					},
					sorting: {
						sortModel: [{ field: 'created_at', sort: 'desc' }],
					},
				}}
				slots={{
					toolbar: GridToolbar,
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
				}}
			/>
		</Card>
	);
}


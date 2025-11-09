'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Chip, Button, Box, Typography } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Task } from '@/lib/admin-queries';
import { useTranslations, useLocale } from 'next-intl';

interface TasksTableProps {
	tasks: Task[];
}

const statusColors: Record<Task['status'], 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
	open: 'info',
	in_progress: 'warning',
	done: 'success',
	cancelled: 'default',
};

const priorityColors: Record<Task['priority'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
	low: 'default',
	normal: 'primary',
	high: 'warning',
	urgent: 'error',
};

function formatDate(dateString: string | null, locale: string = 'en'): string {
	if (!dateString) return '-';
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}

export function TasksTable({ tasks }: TasksTableProps) {
	const t = useTranslations('Admin.tasks');
	const locale = useLocale() as 'en' | 'ar';
	const router = useRouter();

	const typeLabels: Record<Task['type'], string> = {
		call: t('types.call'),
		whatsapp: t('types.whatsapp'),
		email: t('types.email'),
		office_visit: t('types.office_visit'),
		ministry: t('types.ministry'),
		qa: t('types.qa'),
	};

	const statusLabels: Record<Task['status'], string> = {
		open: t('statuses.open'),
		in_progress: t('statuses.in_progress'),
		done: t('statuses.done'),
		cancelled: t('statuses.cancelled'),
	};

	const priorityLabels: Record<Task['priority'], string> = {
		low: t('priorities.low'),
		normal: t('priorities.normal'),
		high: t('priorities.high'),
		urgent: t('priorities.urgent'),
	};

	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'title',
			headerName: t('table.title'),
			width: 250,
			renderCell: (params: GridRenderCellParams) => (
				<Typography variant="body2" fontWeight={600}>
					{params.value}
				</Typography>
			),
		},
		{
			field: 'type',
			headerName: t('table.type'),
			width: 120,
			renderCell: (params: GridRenderCellParams) => (
				<Chip label={typeLabels[params.value as keyof typeof typeLabels]} size="small" />
			),
		},
		{
			field: 'priority',
			headerName: t('table.priority'),
			width: 120,
			renderCell: (params: GridRenderCellParams) => (
				<Chip
					label={priorityLabels[params.value as keyof typeof priorityLabels]}
					color={priorityColors[params.value as keyof typeof priorityColors]}
					size="small"
				/>
			),
		},
		{
			field: 'status',
			headerName: t('table.status'),
			width: 130,
			renderCell: (params: GridRenderCellParams) => (
				<Chip
					label={statusLabels[params.value as keyof typeof statusLabels]}
					color={statusColors[params.value as keyof typeof statusColors]}
					size="small"
				/>
			),
		},
		{
			field: 'due_date',
			headerName: t('table.dueDate'),
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
					onClick={() => router.push(`/admin/tasks/${params.row.id}/edit`)}
				>
					{t('view') || 'View'}
				</Button>
			),
		},
	], [t, locale, router, typeLabels, statusLabels, priorityLabels]);

	if (tasks.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Typography variant="body1" color="text.secondary">
						{t('noTasks') || 'No tasks found'}
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
				rows={tasks}
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


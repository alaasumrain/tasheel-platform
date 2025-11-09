'use client';

import { Box, Typography, Alert } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { StatsCard } from '@/components/admin/StatsCard';
import { Warning as WarningIcon, Error as ErrorIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { SLABadge } from '@/components/admin/SLABadge';
import { Application, SLAConfig } from '@/lib/admin-queries';
import { calculateSLA, SLAResult } from '@/lib/utils/business-hours';
import { useTranslations } from 'next-intl';
import { Card as UICard } from '@/components/ui/card';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

interface SLADashboardProps {
	applications: Application[];
	slaConfigs: SLAConfig[];
	metrics: {
		atRisk: number;
		breached: number;
		onTrack: number;
		total: number;
	};
	services: Array<{ id: string; slug: string; name: string }>;
}

export function SLADashboard({ applications, slaConfigs, metrics, services }: SLADashboardProps) {
	const t = useTranslations('Admin.sla');
	const router = useRouter();

	// Create service map
	const serviceMap = new Map(services.map(s => [s.id, s]));
	const slaMap = new Map(slaConfigs.map(c => [c.service_id, c]));

	// Calculate SLA for each application
	const applicationsWithSLA = applications.map((app) => {
		// Find service ID from slug
		const service = services.find(s => s.slug === app.service_slug);
		if (!service) return { ...app, sla: null as SLAResult | null };

		const slaConfig = slaMap.get(service.id);
		if (!slaConfig) return { ...app, sla: null as SLAResult | null };

		const sla = calculateSLA(
			new Date(app.submitted_at),
			slaConfig.target_hours,
			slaConfig.warning_threshold_percent
		);

		return { ...app, sla, serviceName: service.name };
	}).filter((app): app is typeof app & { sla: SLAResult; serviceName: string } => app.sla !== null);

	// Filter by status
	const atRiskApps = applicationsWithSLA.filter(app => app.sla?.status === 'at_risk');
	const breachedApps = applicationsWithSLA.filter(app => app.sla?.status === 'breached');

	const columns: GridColDef[] = useMemo(() => [
		{
			field: 'order_number',
			headerName: t('table.orderNumber'),
			width: 150,
		},
		{
			field: 'serviceName',
			headerName: t('table.service'),
			width: 200,
		},
		{
			field: 'customer_name',
			headerName: t('table.customer'),
			width: 150,
		},
		{
			field: 'sla',
			headerName: t('table.sla'),
			width: 200,
			renderCell: (params: GridRenderCellParams) => {
				if (!params.value) return '-';
				return <SLABadge sla={params.value} />;
			},
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
					onClick={() => router.push(`/admin/orders/${params.row.id}`)}
				>
					{t('view') || 'View'}
				</Button>
			),
		},
	], [t, router]);

	return (
		<Box>
			{/* Empty State - No SLA Configurations */}
			{slaConfigs.length === 0 && (
				<UICard
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 6, textAlign: 'center' }}>
						<Typography variant="h5" gutterBottom fontWeight={600}>
							{t('emptyState.noConfigs.title') || 'No SLA Configurations'}
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
							{t('emptyState.noConfigs.description') || 'Create SLA configurations for your services to start tracking performance. Each service can have its own target completion time.'}
						</Typography>
						<Button
							variant="contained"
							size="large"
							onClick={() => router.push('/admin/sla/configs/new')}
						>
							{t('emptyState.noConfigs.createButton') || 'Create Your First SLA Configuration'}
						</Button>
					</Box>
				</UICard>
			)}

			{/* Stats Cards - Only show if configs exist */}
			{slaConfigs.length > 0 && (
				<>
					<Grid2 container spacing={3} sx={{ mb: 4 }}>
						<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
							<StatsCard
								title={t('stats.onTrack') || 'On Track'}
								value={metrics.onTrack.toString()}
								icon={CheckIcon}
								color="success"
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
							<StatsCard
								title={t('stats.atRisk') || 'At Risk'}
								value={metrics.atRisk.toString()}
								icon={WarningIcon}
								color="warning"
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
							<StatsCard
								title={t('stats.breached') || 'Breached'}
								value={metrics.breached.toString()}
								icon={ErrorIcon}
								color="error"
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
							<StatsCard
								title={t('stats.total') || 'Total'}
								value={metrics.total.toString()}
								icon={CheckIcon}
								color="primary"
							/>
						</Grid2>
					</Grid2>

					{/* Empty State - No Active Orders */}
					{applications.length === 0 && (
						<UICard
							backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
							borderColor={{ light: 'divider', dark: 'divider' }}
							borderRadius={20}
						>
							<Box sx={{ p: 4, textAlign: 'center' }}>
								<Typography variant="h6" gutterBottom>
									{t('emptyState.noOrders.title') || 'No Active Orders'}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t('emptyState.noOrders.description') || 'There are no active orders to track. SLA tracking will appear here once orders are submitted.'}
								</Typography>
							</Box>
						</UICard>
					)}

					{/* Breached Applications */}
					{breachedApps.length > 0 && (
						<Box sx={{ mb: 4 }}>
							<UICard
								backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
								borderColor={{ light: 'divider', dark: 'divider' }}
								borderRadius={20}
							>
								<Box sx={{ p: 3 }}>
									<Alert severity="error" sx={{ mb: 2 }}>
										{t('breachedAlert', { count: breachedApps.length }) || `${breachedApps.length} requests have breached SLA`}
									</Alert>
									<DataGrid
										rows={breachedApps}
										columns={columns}
										disableRowSelectionOnClick
										autoHeight
										pageSizeOptions={[10, 25, 50]}
										initialState={{
											pagination: {
												paginationModel: { pageSize: 10 },
											},
										}}
										slots={{
											toolbar: GridToolbar,
										}}
									/>
								</Box>
							</UICard>
						</Box>
					)}

					{/* At Risk Applications */}
					{atRiskApps.length > 0 && (
						<Box sx={{ mb: 4 }}>
							<UICard
								backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
								borderColor={{ light: 'divider', dark: 'divider' }}
								borderRadius={20}
							>
								<Box sx={{ p: 3 }}>
									<Alert severity="warning" sx={{ mb: 2 }}>
										{t('atRiskAlert', { count: atRiskApps.length }) || `${atRiskApps.length} requests are at risk`}
									</Alert>
									<DataGrid
										rows={atRiskApps}
										columns={columns}
										disableRowSelectionOnClick
										autoHeight
										pageSizeOptions={[10, 25, 50]}
										initialState={{
											pagination: {
												paginationModel: { pageSize: 10 },
											},
										}}
										slots={{
											toolbar: GridToolbar,
										}}
									/>
								</Box>
							</UICard>
						</Box>
					)}

					{breachedApps.length === 0 && atRiskApps.length === 0 && applications.length > 0 && (
						<Alert severity="success">
							{t('allOnTrack') || 'All requests are on track!'}
						</Alert>
					)}
				</>
			)}
		</Box>
	);
}


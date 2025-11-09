'use client';

import { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SLADashboard } from '@/components/admin/SLADashboard';
import { SLAConfigTable } from '@/components/admin/SLAConfigTable';
import { SLAConfig } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { Application } from '@/lib/admin-queries';

interface SLAPageClientProps {
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

export function SLAPageClient({ applications, slaConfigs, metrics, services }: SLAPageClientProps) {
	const t = useTranslations('Admin.sla');
	const router = useRouter();
	const [tabValue, setTabValue] = useState(0);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleRefresh = () => {
		setRefreshKey(prev => prev + 1);
		router.refresh();
	};

	return (
		<Box>
			{/* Header with Create Button */}
			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{t('pageTitle')}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('pageDescription')}
					</Typography>
				</Box>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => router.push('/admin/sla/configs/new')}
					size="large"
				>
					{t('configs.createConfig') || 'Create SLA Configuration'}
				</Button>
			</Box>

			{/* Tabs */}
			<Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
				<Tab label={t('tracking') || 'SLA Tracking'} />
				<Tab label={t('configs.title') || 'Configurations'} />
			</Tabs>

			{/* Tab Content */}
			{tabValue === 0 && (
				<SLADashboard
					applications={applications}
					slaConfigs={slaConfigs}
					metrics={metrics}
					services={services}
				/>
			)}

			{tabValue === 1 && (
				<SLAConfigTable
					key={refreshKey}
					configs={slaConfigs}
					services={services}
					onRefresh={handleRefresh}
				/>
			)}
		</Box>
	);
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Typography,
	Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Card } from '@/components/ui/card';
import { SLAConfig } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/admin/ToastProvider';

interface SLAConfigFormProps {
	config?: SLAConfig;
	services: Array<{ id: string; name: string }>;
	mode: 'create' | 'edit';
}

export function SLAConfigForm({ config, services, mode }: SLAConfigFormProps) {
	const t = useTranslations('Admin.sla.configs');
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showSuccess, showError } = useToast();

	const [serviceId, setServiceId] = useState(
		config?.service_id || searchParams.get('service_id') || ''
	);
	const [targetHours, setTargetHours] = useState(
		config?.target_hours?.toString() || '24'
	);
	const [warningThreshold, setWarningThreshold] = useState(
		config?.warning_threshold_percent?.toString() || '70'
	);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!serviceId) {
			newErrors.service_id = t('errors.serviceRequired') || 'Service is required';
		}

		if (!targetHours || isNaN(Number(targetHours)) || Number(targetHours) <= 0) {
			newErrors.target_hours = t('errors.targetHoursRequired') || 'Target hours must be a positive number';
		}

		const threshold = Number(warningThreshold);
		if (isNaN(threshold) || threshold < 0 || threshold > 100) {
			newErrors.warning_threshold = t('errors.thresholdInvalid') || 'Warning threshold must be between 0 and 100';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setLoading(true);

		try {
			const url = mode === 'create' 
				? '/api/admin/sla-configs'
				: `/api/admin/sla-configs/${config?.id}`;
			
			const method = mode === 'create' ? 'POST' : 'PUT';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service_id: serviceId,
					target_hours: Number(targetHours),
					warning_threshold_percent: Number(warningThreshold),
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `Failed to ${mode} SLA configuration`);
			}

			showSuccess(
				mode === 'create'
					? t('createSuccess') || 'SLA configuration created successfully!'
					: t('updateSuccess') || 'SLA configuration updated successfully!'
			);
			router.push('/admin/sla');
			router.refresh();
		} catch (error: any) {
			console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} SLA config:`, error);
			showError(error.message || t('saveError') || 'Failed to save SLA configuration');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={20}
		>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{mode === 'create' ? t('createConfig') : t('editConfig')}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					{mode === 'create' 
						? t('createConfigDescription') || 'Configure SLA tracking for a service'
						: t('editConfigDescription') || 'Update SLA configuration settings'
					}
				</Typography>

				<form onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12 }}>
							<FormControl fullWidth required error={!!errors.service_id}>
								<InputLabel>{t('form.service') || 'Service'}</InputLabel>
								<Select
									value={serviceId}
									label={t('form.service') || 'Service'}
									onChange={(e) => setServiceId(e.target.value)}
									disabled={loading || mode === 'edit'}
								>
									{services.map((service) => (
										<MenuItem key={service.id} value={service.id}>
											{service.name}
										</MenuItem>
									))}
								</Select>
								{errors.service_id && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
										{errors.service_id}
									</Typography>
								)}
							</FormControl>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<TextField
								fullWidth
								label={t('form.targetHours') || 'Target Hours'}
								value={targetHours}
								onChange={(e) => setTargetHours(e.target.value)}
								type="number"
								required
								error={!!errors.target_hours}
								helperText={errors.target_hours || t('form.targetHoursHelper') || 'Business hours to complete the service'}
								disabled={loading}
								inputProps={{ min: 1 }}
							/>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<TextField
								fullWidth
								label={t('form.warningThreshold') || 'Warning Threshold (%)'}
								value={warningThreshold}
								onChange={(e) => setWarningThreshold(e.target.value)}
								type="number"
								required
								error={!!errors.warning_threshold}
								helperText={errors.warning_threshold || t('form.warningThresholdHelper') || 'Percentage threshold for SLA warnings (0-100)'}
								disabled={loading}
								inputProps={{ min: 0, max: 100 }}
							/>
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
								<Button
									variant="outlined"
									onClick={() => router.back()}
									disabled={loading}
								>
									{t('cancel') || 'Cancel'}
								</Button>
								<Button
									type="submit"
									variant="contained"
									disabled={loading}
								>
									{loading
										? (t('saving') || 'Saving...')
										: (mode === 'create' ? t('create') : t('update'))
									}
								</Button>
							</Box>
						</Grid>
					</Grid>
				</form>
			</Box>
		</Card>
	);
}


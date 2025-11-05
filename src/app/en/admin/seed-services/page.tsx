'use client';

import { useState } from 'react';
import { Button, Alert, CircularProgress, Box, Typography, Card } from '@mui/material';
import { Card as UICard } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function SeedServicesPage() {
	const [loading, setLoading] = useState(false);
	const t = useTranslations('Admin.seedServices');
	const [result, setResult] = useState<{ success: boolean; message: string; added?: number; total?: number; existing?: number } | null>(null);

	const handleSeed = async () => {
		setLoading(true);
		setResult(null);

		try {
			const response = await fetch('/api/admin/seed-services', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (response.ok) {
				setResult({
					success: true,
					message: data.message,
					added: data.added,
					total: data.total,
					existing: data.existing,
				});
			} else {
				setResult({
					success: false,
					message: data.error || t('error'),
				});
			}
		} catch (error: any) {
			setResult({
				success: false,
				message: error.message || t('error'),
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ p: 4 }}>
			<UICard borderRadius={20}>
				<Box sx={{ p: 4 }}>
					<Typography variant="h4" gutterBottom fontWeight={700}>
						{t('title')}
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
						{t('description')}
					</Typography>

					{result && (
						<Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 3 }}>
							{result.message}
							{result.success && result.added !== undefined && (
								<>
									<br />
									<strong>{t('added')}</strong> {result.added} {t('services')}
									<br />
									<strong>{t('total')}</strong> {result.total} {t('services')}
									{result.existing !== undefined && (
										<>
											<br />
											<strong>{t('alreadyExisted')}</strong> {result.existing} {t('services')}
										</>
									)}
								</>
							)}
						</Alert>
					)}

					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleSeed}
						disabled={loading}
						startIcon={loading ? <CircularProgress size={20} /> : null}
					>
						{loading ? t('buttonLoading') : t('button')}
					</Button>
				</Box>
			</UICard>
		</Box>
	);
}


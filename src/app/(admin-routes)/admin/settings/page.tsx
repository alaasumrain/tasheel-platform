import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Card } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
	const t = await getTranslations('Admin.settings');
	
	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					{t('title')}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{t('description')}
				</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
						borderColor={{ light: 'divider', dark: 'divider' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('adminInfo.title')}
							</Typography>
							<Box sx={{ mt: 2 }}>
								<Typography variant="body2" color="text.secondary" paragraph>
									{t('adminInfo.description')}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>{t('adminInfo.version')}:</strong> 1.0.0
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>{t('adminInfo.environment')}:</strong> {process.env.NODE_ENV || 'development'}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
						borderColor={{ light: 'divider', dark: 'divider' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('emailConfig.title')}
							</Typography>
							<Box sx={{ mt: 2 }}>
								<Typography variant="body2" color="text.secondary" paragraph>
									{t('emailConfig.description')}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>{t('emailConfig.resendApi')}:</strong>{' '}
									{process.env.RESEND_API_KEY ? t('emailConfig.configured') : t('emailConfig.notConfigured')}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>{t('emailConfig.contactEmail')}:</strong>{' '}
									{process.env.CONTACT_EMAIL || t('emailConfig.notConfigured')}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>

				<Grid size={{ xs: 12 }}>
					<Card
						backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
						borderColor={{ light: 'divider', dark: 'divider' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('quickLinks.title')}
							</Typography>
							<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
								<Typography variant="body2">
									• <strong>{t('quickLinks.dashboard')}:</strong> /admin
								</Typography>
								<Typography variant="body2">
									• <strong>{t('quickLinks.orders')}:</strong> /admin/orders
								</Typography>
								<Typography variant="body2">
									• <strong>{t('quickLinks.tracking')}:</strong> /track
								</Typography>
								<Typography variant="body2">
									• <strong>{t('quickLinks.quoteForm')}:</strong> /
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

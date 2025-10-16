import { Box, Typography, Grid } from '@mui/material';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					Settings
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Configure your admin dashboard
				</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Admin Information
							</Typography>
							<Box sx={{ mt: 2 }}>
								<Typography variant="body2" color="text.secondary" paragraph>
									Admin dashboard for managing Tasheel orders and customer requests.
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>Version:</strong> 1.0.0
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Email Configuration
							</Typography>
							<Box sx={{ mt: 2 }}>
								<Typography variant="body2" color="text.secondary" paragraph>
									Email notifications are configured via environment variables.
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>Resend API:</strong>{' '}
									{process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Not configured'}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>Contact Email:</strong>{' '}
									{process.env.CONTACT_EMAIL || 'Not configured'}
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>

				<Grid size={{ xs: 12 }}>
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Quick Links
							</Typography>
							<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
								<Typography variant="body2">
									• <strong>Dashboard:</strong> /admin
								</Typography>
								<Typography variant="body2">
									• <strong>Orders:</strong> /admin/orders
								</Typography>
								<Typography variant="body2">
									• <strong>Tracking Page:</strong> /track
								</Typography>
								<Typography variant="body2">
									• <strong>Quote Form:</strong> /
								</Typography>
							</Box>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

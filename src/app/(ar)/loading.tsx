import { Box, CircularProgress, Container, Typography } from '@mui/material';

/**
 * Loading State for Arabic Routes
 * Displayed while page content is being fetched
 */
export default function Loading() {
	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
					gap: 3,
				}}
			>
				<CircularProgress size={48} thickness={4} />
				<Typography variant="body1" color="text.secondary">
					جارٍ التحميل...
				</Typography>
			</Box>
		</Container>
	);
}

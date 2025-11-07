'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { IconRefresh, IconHome } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations('Common');
	const router = useRouter();

	useEffect(() => {
		// Log error to console for debugging
		console.error('Application error:', error);
	}, [error]);

	return (
		<Container sx={{ py: { xs: 8, md: 12 } }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
					textAlign: 'center',
				}}
			>
				<Stack spacing={4} sx={{ maxWidth: 600 }}>
					<Typography variant="h1" fontWeight={700} color="error.main">
						{t('error')}
					</Typography>
					<Typography variant="h5" color="text.secondary">
						{error.message || t('error')}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('errorDescription') || "We're sorry, but something unexpected happened. Please try again or return to the homepage."}
					</Typography>
					{error.digest && (
						<Typography variant="caption" color="text.disabled">
							{t('errorId') || 'Error ID'}: {error.digest}
						</Typography>
					)}
					<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
						<Button
							variant="contained"
							size="large"
							startIcon={<IconRefresh size={20} />}
							onClick={reset}
							sx={{ borderRadius: 2 }}
						>
							{t('tryAgain')}
						</Button>
						<Button
							variant="outlined"
							size="large"
							startIcon={<IconHome size={20} />}
							onClick={() => router.push('/')}
							sx={{ borderRadius: 2 }}
						>
							{t('goHome')}
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Container>
	);
}


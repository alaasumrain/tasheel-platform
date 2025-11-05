import { Box, Container, Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export async function generateMetadata() {
	setRequestLocale('en');
	const t = await getTranslations('Auth.resetPassword');
	return {
		title: t('title'),
		description: t('description'),
	};
}

export default function ResetPasswordPage() {
	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 12 } }}>
			<Container maxWidth="sm">
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4}>
						<Stack spacing={2} textAlign="center">
							<Typography variant="h2" component="h1" fontWeight={700}>
								Set New Password
							</Typography>
							<Typography variant="h6" color="text.secondary">
								Enter your new password below
							</Typography>
						</Stack>

						<Card borderRadius={24}>
							<Box sx={{ p: { xs: 3, md: 4 } }}>
								<ResetPasswordForm />
							</Box>
						</Card>
					</Stack>
				</RevealSection>
			</Container>
		</Box>
	);
}


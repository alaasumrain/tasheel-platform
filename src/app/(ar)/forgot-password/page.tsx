import { Box, Container, Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export async function generateMetadata() {
	setRequestLocale('ar');
	const t = await getTranslations('Auth.forgotPassword');
	return {
		title: t('title'),
		description: t('description'),
	};
}

export default async function ForgotPasswordPage() {
	setRequestLocale('ar');
	const t = await getTranslations('Auth.forgotPassword');
	
	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 12 } }}>
			<Container maxWidth="sm">
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4}>
						<Stack spacing={2} textAlign="center">
							<Typography variant="h2" component="h1" fontWeight={700}>
								{t('title')}
							</Typography>
							<Typography variant="h6" color="text.secondary">
								{t('description')}
							</Typography>
						</Stack>

						<Card borderRadius={24}>
							<Box sx={{ p: { xs: 3, md: 4 } }}>
								<ForgotPasswordForm />
							</Box>
						</Card>
					</Stack>
				</RevealSection>
			</Container>
		</Box>
	);
}


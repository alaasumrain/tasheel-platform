import { Box, Container, Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import RegisterForm from '@/components/auth/RegisterForm';

export async function generateMetadata() {
	setRequestLocale('ar');
	const t = await getTranslations('Auth.register');
	return {
		title: t('title'),
		description: t('description'),
	};
}

export default async function RegisterPage() {
	const t = await getTranslations('Auth.register');
	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 12 } }}>
			<Container maxWidth="sm">
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4}>
						<Stack spacing={2} textAlign="center">
							<Typography variant="h2" component="h1" fontWeight={700}>
								{t('pageTitle')}
							</Typography>
							<Typography variant="h6" color="text.secondary">
								{t('pageSubtitle')}
							</Typography>
						</Stack>

						<Card borderRadius={24}>
							<Box sx={{ p: { xs: 3, md: 4 } }}>
								<RegisterForm />
							</Box>
						</Card>
					</Stack>
				</RevealSection>
			</Container>
		</Box>
	);
}


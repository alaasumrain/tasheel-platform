import { Container, Stack, Typography } from '@mui/material';
import { getCustomerProfile } from '@/lib/supabase/auth-helpers';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { ProfileSettingsForm } from '@/components/dashboard/ProfileSettingsForm';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage() {
	setRequestLocale('en');
	const t = await getTranslations('Dashboard.profile');
	const customer = await getCustomerProfile();

	if (!customer) {
		return null;
	}

	return (
		<Container maxWidth="md">
			<RevealSection delay={0.1} direction="up">
				<Stack spacing={4}>
					<Stack spacing={2}>
						<Typography variant="h4" component="h1" fontWeight={700}>
							{t('title')}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{t('description')}
						</Typography>
					</Stack>

					<Card borderRadius={20}>
						<Stack sx={{ p: { xs: 3, md: 4 } }}>
							<ProfileSettingsForm customer={customer} />
						</Stack>
					</Card>
				</Stack>
			</RevealSection>
		</Container>
	);
}


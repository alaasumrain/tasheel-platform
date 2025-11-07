import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container, Stack, Typography } from '@mui/material';

export default async function RegistrationPage() {
	setRequestLocale('ar');
	const t = await getTranslations('Registration');
	return (
		<Container maxWidth="md" sx={{ py: { xs: 5, md: 10 } }}>
			<Stack spacing={3}>
				<Typography variant="h2">{t('title')}</Typography>
				<Typography color="text.secondary" variant="body1">
					{t('description')}
				</Typography>
			</Stack>
		</Container>
	);
}

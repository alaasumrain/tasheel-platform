import Link from 'next/link';
import {
	Box,
	Button,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { getTranslations, getLocale } from 'next-intl/server';

import { getAllServices } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

export default async function ServicesCatalog() {
	const t = await getTranslations('Homepage.servicesCatalog');
	const locale = (await getLocale()) as 'en' | 'ar';
	const servicesFromDB = await getAllServices();
	// Limit to first 6 featured services for homepage
	const featuredServices = servicesFromDB.slice(0, 6);
	const services = featuredServices.map((s) => convertToLegacyFormat(s, locale));
	
	return (
		<Container id="services" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack spacing={{ xs: 3, md: 4 }} sx={{ textAlign: 'center', mb: 6 }}>
				<Typography color="accent" variant="subtitle1">
					{t('subtitle')}
				</Typography>
				<Typography variant="h2">
					{t('title')}
				</Typography>
				<Typography color="text.secondary" variant="h6">
					{t('description')}
				</Typography>
			</Stack>
			<Grid container spacing={{ xs: 2.5, md: 3.5 }}>
				{services.map((service, index) => (
					<Grid key={service.slug} size={{ xs: 12, sm: 6, md: 4, lg: 4 }} sx={{ display: 'flex' }}>
						<RevealSection delay={0.1 + index * 0.05} direction="up">
							<Card
								borderRadius={24}
								backgroundColor={{ light: 'rgba(255,255,255,0.8)', dark: '#1F1F2B' }}
								borderColor={{ light: '#fff', dark: '#2F2F3B' }}
							>
								<CardContent
									sx={{
										display: 'flex',
										flexDirection: 'column',
										height: '100%',
										width: '100%',
										gap: 2,
									}}
								>
									<Stack spacing={1.5} sx={{ flexGrow: 1 }}>
										<Typography variant="h5">{service.title}</Typography>
										<Typography color="text.secondary" variant="body1">
											{service.shortDescription}
										</Typography>
									</Stack>
									<Box>
										<Button
											component={Link}
											href={`/services/${service.slug}`}
											size="large"
										>
											{t('getStarted')}
										</Button>
									</Box>
								</CardContent>
							</Card>
							</RevealSection>
						</Grid>
					))}
			</Grid>
		</Container>
	);
}

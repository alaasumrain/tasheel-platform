import {
	Box,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { getAllServices } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { Card } from '@/components/ui/card';
import QuoteRequestForm from '@/components/forms/quote-request-form';
import RevealSection from '@/components/ui/reveal-section';

export default async function Contact() {
	const t = await getTranslations('Quote');
	const servicesFromDB = await getAllServices();
	const services = servicesFromDB.map((s) => convertToLegacyFormat(s, 'en'));
	return (
		<Container sx={{ py: { xs: 1.5, md: 3 } }}>
			<RevealSection delay={0.1} direction="up">
				<Grid
				alignItems={{ md: 'stretch' }}
				container
				direction={{ xs: 'column-reverse', md: 'row' }}
				spacing={{ xs: 0, md: 4, lg: 8 }}
			>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						backgroundColor={{
							light: 'background.paper',
							dark: 'background.paper',
						}}
						borderColor={{ light: 'divider', dark: 'divider' }}
						borderRadius={36}
					>
						<CardContent
							sx={{
								p: { xs: 3, md: 5 },
								paddingBottom: { xs: '32px !important', md: '40px !important' },
							}}
						>
							<Stack spacing={4}>
								<Typography variant="h3">{t('requestQuote')}</Typography>
								<QuoteRequestForm services={services} />
							</Stack>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ md: 6 }} sx={{ flexGrow: { md: 1 } }}>
					<Card borderRadius={36} fullHeight>
						<Box
							className="aspect-596/702"
							sx={{ position: 'relative', height: '100%' }}
						>
							<Image
								src="/dark/contact.jpg"
								alt=""
								fill
								style={{ objectFit: 'cover' }}
							/>
						</Box>
					</Card>
				</Grid>
			</Grid>
			</RevealSection>
		</Container>
	);
}

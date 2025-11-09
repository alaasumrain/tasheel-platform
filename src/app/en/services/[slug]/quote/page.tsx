import { notFound } from 'next/navigation';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { getTranslations, getLocale } from 'next-intl/server';

import { getServiceBySlug as getServiceFromDB } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { Card } from '@/components/ui/card';
import ServiceQuoteWizard from '@/components/forms/service-quote-wizard';
import ServiceQuoteSidebar from '@/components/sections/service-quote-sidebar';
import RevealSection from '@/components/ui/reveal-section';
import { Link as I18nLink } from '@/i18n/navigation';

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const { getTranslations, setRequestLocale } = await import('next-intl/server');
	setRequestLocale('en');
	const t = await getTranslations('Quote');
	const tServices = await getTranslations('Services');
	const serviceFromDB = await getServiceFromDB(slug);

	if (!serviceFromDB) {
		return {
			title: tServices('notFound'),
		};
	}

	const service = convertToLegacyFormat(serviceFromDB, 'en');

	return {
		title: `${t('requestQuote')} - ${service.title} | ${tServices('title')}`,
		description: `${t('description')} ${service.title}. ${service.shortDescription}`,
	};
}

export default async function QuotePage({ params }: PageProps) {
	const { setRequestLocale } = await import('next-intl/server');
	setRequestLocale('en');
	const t = await getTranslations('Quote');
	const tServices = await getTranslations('Services');
	const locale = (await getLocale()) as 'en' | 'ar';
	
	const { slug } = await params;
	const serviceFromDB = await getServiceFromDB(slug);

	if (!serviceFromDB) {
		notFound();
	}

	const service = convertToLegacyFormat(serviceFromDB, locale);

	// Check availability from database (like "in stock" / "out of stock")
	// Check is_active only (is_available doesn't exist in Service type)
	const isAvailable = serviceFromDB?.is_active !== false;
	
	if (!isAvailable) {
		// Redirect to service detail page with Coming Soon message
		return (
			<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
				<Container sx={{ pt: { xs: 3, md: 6 }, pb: { xs: 6.25, md: 12.5 } }}>
					<RevealSection delay={0.1} direction="up">
						<Stack spacing={4} alignItems="center" textAlign="center">
							<Typography variant="h2">{tServices('comingSoon')}</Typography>
							<Typography variant="h6" color="text.secondary">
								{tServices('comingSoonTooltip')}
							</Typography>
							<Button component={I18nLink} href={`/services/${service.slug}`} variant="contained" size="large">
								{t('backTo')} {service.title}
							</Button>
						</Stack>
					</RevealSection>
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
			<Container sx={{ pt: { xs: 3, md: 6 }, pb: { xs: 6.25, md: 12.5 } }}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4}>
						{/* Back Button */}
						<Link
							href={`/services/${service.slug}`}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								textDecoration: 'none',
								color: 'inherit',
								width: 'fit-content',
							}}
						>
							<IconArrowLeft size={20} />
							<Typography variant="body2">{t('backTo')} {service.title}</Typography>
						</Link>

						{/* Header */}
						<Stack spacing={2}>
							<Typography
								variant="overline"
								color="accent"
								sx={{ textTransform: 'uppercase' }}
							>
								{t('requestQuote')}
							</Typography>
							<Typography variant="h2">{t('title')}</Typography>
							<Typography variant="h6" color="text.secondary" maxWidth={720}>
								{t('description')}
							</Typography>
						</Stack>

						{/* Main Content */}
						<Grid container spacing={{ xs: 4, md: 6 }}>
							{/* Form - Left Column */}
							<Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: locale === 'ar' ? 2 : 1 } }}>
								<Card borderRadius={24}>
									<Box sx={{ p: { xs: 3, md: 4 } }}>
										<ServiceQuoteWizard service={service} />
									</Box>
								</Card>
							</Grid>

							{/* Sidebar - Right Column */}
							<Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: locale === 'ar' ? 1 : 2 } }}>
								<ServiceQuoteSidebar service={service} />
							</Grid>
						</Grid>

						{/* Footer Note */}
						<Box
							sx={{
								p: 3,
								backgroundColor: 'background.paper',
								borderRadius: 3,
								border: 1,
								borderColor: 'divider',
							}}
						>
							<Stack spacing={1}>
								<Typography variant="subtitle2" fontWeight={600}>
									{t('whatHappensNext')}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									1. {t('whatHappensNext1')}
									<br />
									2. {t('whatHappensNext2')}
									<br />
									3. {t('whatHappensNext3')}
									<br />
									4. {t('whatHappensNext4')}
								</Typography>
							</Stack>
						</Box>
					</Stack>
				</RevealSection>
			</Container>
		</Box>
	);
}

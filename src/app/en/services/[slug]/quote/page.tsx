import { notFound } from 'next/navigation';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { getTranslations, getLocale } from 'next-intl/server';

import { getServiceBySlug as getServiceFromDB } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import ServiceQuoteWizard from '@/components/forms/service-quote-wizard';
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
	const isCheckoutFlow = service.pricing?.type === 'fixed' || service.pricing?.type === 'starting';

	return {
		title: `${isCheckoutFlow ? t('bookService') : t('requestQuote')} - ${service.title} | ${tServices('title')}`,
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
	const isCheckoutFlow = service.pricing?.type === 'fixed' || service.pricing?.type === 'starting';

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
		<Box sx={{ 
			bgcolor: 'background.default', 
			minHeight: '100vh',
			py: { xs: 3, md: 4 },
		}}>
			<Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }}>
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
						marginBottom: '16px',
					}}
				>
					<IconArrowLeft size={20} />
					<Typography variant="body2">{t('backTo')} {service.title}</Typography>
				</Link>

				{/* Wizard handles ALL layout */}
				<ServiceQuoteWizard service={service} isCheckoutFlow={isCheckoutFlow} />
			</Container>
		</Box>
	);
}

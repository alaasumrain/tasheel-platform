'use client';

import {
	Box,
	Button,
	CardContent,
	Container,
	Stack,
	Tooltip,
	Typography,
	useColorScheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconCheck, IconClock, IconCurrencyShekel } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

import type { Service } from '@/data/services';
import RevealSection from '@/components/ui/reveal-section';
import { Card as CustomCard } from '@/components/ui/card';
import { PageBreadcrumbs } from '@/components/ui/breadcrumbs';
import ServiceDetailSidebar from './service-detail-sidebar';
import Stats from './stats';
import Process from './process';
import Reviews from './reviews';
import Faq from './faq';

interface ServiceDetailProps {
	service: Service;
	originalService?: any; // Raw DB service to check availability
}

export default function ServiceDetail({ service, originalService }: ServiceDetailProps) {
	const t = useTranslations('Services');
	const locale = useLocale() as 'en' | 'ar';
	const { mode } = useColorScheme();
	const categoryLabels = (t.raw('categoryLabels') as Record<string, string>) || {};
	const categoryLabel =
		categoryLabels[service.category] ?? service.category.replace('-', ' ');
	
	// Check availability from database (like "in stock" / "out of stock")
	// Only is_active field exists in the database schema
	const isAvailable = originalService?.is_active !== false;
	const isComingSoon = !isAvailable;
	
	// Get service image with fallback
	const serviceImage = mode === 'dark'
		? ((service as any).image_dark || (service as any).image_light || '/dark/services/default-service.jpg')
		: ((service as any).image_light || (service as any).image_dark || '/light/services/default-service.jpg');

	const currencyFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		style: 'currency',
		currency: 'ILS',
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: 0,
	});

	const formatPrice = () => {
		if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
			const amount = currencyFormatter.format(service.pricing.amount);
			return t('pricingFormats.fixed', { amount });
		}

		if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
			const amount = currencyFormatter.format(service.pricing.amount);
			return t('pricingFormats.startingFrom', { amount });
		}

		if (service.pricing.note) {
			return service.pricing.note;
		}

		return t('pricingFormats.custom');
	};

	const breadcrumbs = [
		{ label: t('breadcrumbs.home'), href: '/' },
		{ label: t('breadcrumbs.services'), href: '/services' },
		...(categoryLabel ? [{ label: categoryLabel }] : []),
		{ label: service.title },
	];

	return (
		<Box>
			{/* Hero Section */}
			<Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 } }}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={{ xs: 3, md: 4 }}>
						<PageBreadcrumbs items={breadcrumbs} />
						
						{/* Service Image */}
						{((service as any).image_light || (service as any).image_dark) && (
							<Box
								sx={{
									position: 'relative',
									width: '100%',
									height: { xs: 200, md: 320 },
									borderRadius: 3,
									overflow: 'hidden',
									mb: 1,
									boxShadow: (theme) => theme.palette.mode === 'dark'
										? '0px 4px 16px rgba(0,0,0,0.3)'
										: '0px 4px 16px rgba(0,0,0,0.08)',
								}}
							>
								<Image
									src={serviceImage}
									alt={service.title}
									fill
									style={{ objectFit: 'cover' }}
									onError={(e) => {
										// Hide image if it fails to load
										e.currentTarget.style.display = 'none';
									}}
								/>
							</Box>
						)}
						
						<Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
							{/* Main Content - Left Column (Right for Arabic/RTL) */}
							<Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 1, md: locale === 'ar' ? 2 : 1 } }}>
								<Stack spacing={3}>
									<Stack spacing={1.5}>
										<Typography
											color="accent"
											variant="subtitle2"
											sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: { xs: '0.8125rem', md: '0.875rem' } }}
										>
											{categoryLabel}
										</Typography>
										<Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.5rem' }, lineHeight: 1.3 }}>
											{service.title}
										</Typography>
										<Typography
											color="text.secondary"
											variant="body1"
											component="p"
											sx={{ fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.65 }}
										>
											{service.description}
										</Typography>
									</Stack>

									{/* Quick Info */}
									<Grid container spacing={2.5} sx={{ pt: 0.5 }}>
										<Grid size={{ xs: 12, sm: 6 }}>
											<Stack direction="row" spacing={1.5} alignItems="center">
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: 1.5,
														bgcolor: 'primary.main',
														color: 'primary.contrastText',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														flexShrink: 0,
													}}
												>
													<IconClock size={20} />
												</Box>
												<Box>
													<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
														{t('turnaroundTime')}
													</Typography>
													<Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
														{service.turnaroundTime}
													</Typography>
												</Box>
											</Stack>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<Stack direction="row" spacing={1.5} alignItems="center">
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: 1.5,
														bgcolor: 'accent.main',
														color: 'accent.contrastText',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														flexShrink: 0,
													}}
												>
													<IconCurrencyShekel size={20} />
												</Box>
												<Box>
													<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
														{t('startingPrice')}
													</Typography>
													<Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
														{formatPrice()}
													</Typography>
												</Box>
											</Stack>
										</Grid>
									</Grid>

									<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1.5 }}>
										<Tooltip title={isComingSoon ? t('comingSoonTooltip') : ''} arrow>
											<span>
												<Button
													component={Link}
													href={`/services/${service.slug}/quote`}
													variant="contained"
													size="medium"
													disabled={isComingSoon}
													sx={{
														px: 3,
														py: 1.25,
														fontSize: '0.9375rem',
														fontWeight: 600,
													}}
												>
													{isComingSoon ? t('startButtonDisabled') : t('startService')}
												</Button>
											</span>
										</Tooltip>
										<Button
											component={Link}
											href="/track"
											variant="outlined"
											size="medium"
											sx={{
												px: 3,
												py: 1.25,
												fontSize: '0.9375rem',
												fontWeight: 600,
											}}
										>
											{t('trackStatus')}
										</Button>
									</Stack>
								</Stack>
							</Grid>

							{/* Sidebar - Right Column (Left for Arabic/RTL) */}
							<Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 2, md: locale === 'ar' ? 1 : 2 } }}>
								<ServiceDetailSidebar service={service} />
							</Grid>
						</Grid>
					</Stack>
				</RevealSection>
			</Container>

			{/* Process Steps */}
			<Box sx={{ backgroundColor: 'background.default', py: { xs: 6.25, md: 12.5 } }}>
				<Container>
					<RevealSection delay={0.2} direction="up">
						<Stack spacing={5} alignItems="center">
							<Stack spacing={2.5} alignItems="center" textAlign="center">
								<Typography color="accent" variant="subtitle1">
									{t('processSteps')}
								</Typography>
								<Typography variant="h2">
									{t('simpleProcess')}
								</Typography>
							</Stack>

							<Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'stretch' }}>
								{service.processSteps.map((step, index) => (
									<Grid size={{ xs: 12, md: 6, lg: 3 }} key={index} sx={{ display: 'flex' }}>
										<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
											<CustomCard fullHeight>
												<CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
												<Stack spacing={2.5}>
													<Box
														sx={(theme) => ({
															width: 60,
															height: 60,
															borderRadius: '16px',
														backgroundColor: 'accent.main',
														color: theme.palette.mode === 'dark' ? 'accent.contrastText' : 'accent.contrastText',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															flexShrink: 0,
														})}
													>
														<Typography variant="h3" component="span" fontWeight={700}>
															{step.number}
														</Typography>
													</Box>
													<Typography variant="h5" fontWeight={700}>{step.title}</Typography>
													<Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.7 }}>
														{step.description}
													</Typography>
												</Stack>
											</CardContent>
											</CustomCard>
										</Box>
									</Grid>
								))}
							</Grid>
						</Stack>
					</RevealSection>
				</Container>
			</Box>

			{/* Required Documents & Features */}
			<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
				<RevealSection delay={0.3} direction="up">
					<Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'stretch' }}>
						{/* Required Documents */}
						<Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
							<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
								<CustomCard fullHeight>
									<CardContent sx={{ p: { xs: 4, md: 5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
									<Stack spacing={3}>
										<Typography variant="h4" fontWeight={700}>{t('requiredDocuments')}</Typography>
										<Stack spacing={2}>
											{service.requiredDocuments.map((doc, index) => (
												<Stack direction="row" spacing={2} key={index} alignItems="flex-start">
													<Box sx={{ color: 'accent.main', pt: 0.5, flexShrink: 0 }}>
														<IconCheck size={24} />
													</Box>
													<Typography color="text.secondary" variant="body1" sx={{ lineHeight: 1.7 }}>
														{doc}
													</Typography>
												</Stack>
											))}
										</Stack>
										{service.pricing.note && (
											<Box
												sx={(theme) => ({
													mt: 2,
													p: 2.5,
													backgroundColor: theme.palette.mode === 'dark'
														? 'rgba(255,255,255,0.05)'
														: 'rgba(14, 33, 160, 0.04)',
													borderRadius: 2,
													border: '1px solid',
													borderColor: 'divider',
												})}
											>
												<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
													<strong>{locale === 'ar' ? 'ملاحظة:' : 'Note:'}</strong> {service.pricing.note}
												</Typography>
											</Box>
										)}
									</Stack>
									</CardContent>
								</CustomCard>
							</Box>
						</Grid>

						{/* Service Features */}
						<Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
							<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
								<CustomCard
									backgroundColor={{ light: 'accent.main', dark: 'accent.main' }}
									borderColor={{ light: 'accent.light', dark: 'accent.light' }}
									gradientColor={{ light: 'accent.light', dark: 'accent.light' }}
									gradientOpacity={0.6}
									fullHeight
								>
								<CardContent sx={{ p: { xs: 4, md: 5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
									<Stack spacing={3}>
									<Typography variant="h4" color="accent.contrastText">
										{t('whatsIncluded')}
									</Typography>
										<Stack spacing={2}>
											{service.features.map((feature, index) => (
												<Stack direction="row" spacing={2} key={index}>
													<Box sx={{ color: 'accent.contrastText', pt: 0.5 }}>
														<IconCheck size={24} />
													</Box>
													<Typography variant="body1" color="accent.contrastText">
														{feature}
													</Typography>
												</Stack>
											))}
										</Stack>
									</Stack>
								</CardContent>
							</CustomCard>
							</Box>
						</Grid>
					</Grid>
				</RevealSection>
			</Container>

			{/* Stats Section */}
			<Stats />

			{/* General Process Section */}
			<Process />

			{/* Reviews Section */}
			<Reviews />

			{/* FAQ Section */}
			<Faq />

			{/* CTA Section */}
			<Box
				sx={{
					backgroundColor: 'background.default',
					py: { xs: 6.25, md: 12.5 },
				}}
			>
				<Container>
					<RevealSection delay={0.4} direction="up">
						<CustomCard>
							<CardContent
								sx={{
									p: { xs: 4, md: 6 },
									textAlign: 'center',
								}}
							>
								<Stack spacing={4} alignItems="center">
									<Stack spacing={2.5} alignItems="center" maxWidth={720}>
										<Typography variant="h3" fontWeight={700}>
											{t('readyToStart')}
										</Typography>
										<Typography color="text.secondary" variant="h6" sx={{ lineHeight: 1.7 }}>
											{t('quoteDescription')}
										</Typography>
									</Stack>
									<Stack
										direction={{ xs: 'column', sm: 'row' }}
										spacing={2}
										justifyContent="center"
										sx={{ width: '100%', maxWidth: 500 }}
									>
										<Tooltip title={isComingSoon ? t('comingSoonTooltip') : ''} arrow>
											<span>
												<Button
													component={Link}
													href={`/services/${service.slug}/quote`}
													variant="contained"
													size="large"
													disabled={isComingSoon}
													sx={{
														flex: { xs: 1, sm: 'none' },
														px: 4,
														py: 1.5,
														fontWeight: 600,
														borderRadius: 2,
													}}
												>
													{isComingSoon ? t('startButtonDisabled') : t('startService')}
												</Button>
											</span>
										</Tooltip>
										<Button
											component={Link}
											href="tel:+97022401234"
											variant="outlined"
											size="large"
											sx={{
												flex: { xs: 1, sm: 'none' },
												px: 4,
												py: 1.5,
												fontWeight: 600,
												borderRadius: 2,
											}}
										>
											{t('callUs')} <span dir="ltr">{t('callUsPhone')}</span>
										</Button>
									</Stack>
								</Stack>
							</CardContent>
						</CustomCard>
					</RevealSection>
				</Container>
			</Box>
		</Box>
	);
}

'use client';

import { useState, useEffect } from 'react';
import {
	Box,
	Button,
	CardContent,
	Container,
	Stack,
	Tooltip,
	Typography,
	useColorScheme,
	Fab,
	useScrollTrigger,
	Slide,
	Chip,
	IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconCheck, IconClock, IconCurrencyShekel, IconShare, IconBookmark } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'motion/react';

import type { Service } from '@/data/services';
import RevealSection from '@/components/ui/reveal-section';
import { Card as CustomCard } from '@/components/ui/card';
import { PageBreadcrumbs } from '@/components/ui/breadcrumbs';
import ServiceDetailSidebar from './service-detail-sidebar';
import Stats from './stats';
import Process from './process';
import Reviews from './reviews';
import Faq from './faq';
import { useCurrency } from '@/contexts/currency-context';

interface ServiceDetailProps {
	service: Service;
	originalService?: any; // Raw DB service to check availability
}

// Sticky CTA Button for Mobile
function StickyCTA({ service, locale }: { service: Service; locale: 'en' | 'ar' }) {
	const trigger = useScrollTrigger({
		threshold: 100,
	});

	return (
		<Slide direction="up" in={trigger} mountOnEnter unmountOnExit>
			<Box
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					p: 2,
					backgroundColor: 'background.paper',
					borderTop: '1px solid',
					borderColor: 'divider',
					boxShadow: '0px -4px 20px rgba(0,0,0,0.1)',
					zIndex: 1000,
					display: { xs: 'block', md: 'none' },
				}}
			>
				<Button
					component={Link}
					href={`/services/${service.slug}/quote`}
					variant="contained"
					fullWidth
					size="large"
					sx={{
						height: 56,
						fontSize: '1rem',
						fontWeight: 600,
					}}
				>
					{locale === 'ar' ? 'ابدأ الخدمة' : 'Request Service'}
				</Button>
			</Box>
		</Slide>
	);
}

export default function ServiceDetail({ service, originalService }: ServiceDetailProps) {
	const t = useTranslations('Services');
	const locale = useLocale() as 'en' | 'ar';
	const { mode } = useColorScheme();
	const [isBookmarked, setIsBookmarked] = useState(false);
	const categoryLabels = (t.raw('categoryLabels') as Record<string, string>) || {};
	const categoryLabel =
		categoryLabels[service.category] ?? service.category.replace('-', ' ');
	
	// Check availability from database
	const isAvailable = originalService?.is_available !== false && originalService?.is_active !== false;
	const isComingSoon = !isAvailable;
	
	// Get service image with fallback
	const serviceImage = mode === 'dark'
		? ((service as any).image_dark || (service as any).image_light || '/dark/services/default-service.jpg')
		: ((service as any).image_light || (service as any).image_dark || '/light/services/default-service.jpg');

	const { currency } = useCurrency();
	const currencyFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		style: 'currency',
		currency: currency === 'ILS' ? 'ILS' : currency === 'USD' ? 'USD' : 'EUR',
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

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: service.title,
					text: service.description,
					url: window.location.href,
				});
			} catch (err) {
				// User cancelled or error occurred
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
		}
	};

	return (
		<Box>
			{/* Hero Section */}
			<Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 } }}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={{ xs: 3, md: 4 }}>
						<Box sx={{ width: '100%' }}>
							<PageBreadcrumbs items={breadcrumbs} />
						</Box>
						
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
										e.currentTarget.style.display = 'none';
									}}
								/>
								{/* Action Buttons Overlay */}
								<Stack
									direction="row"
									spacing={1}
									sx={{
										position: 'absolute',
										top: 16,
										right: 16,
									}}
								>
									<Tooltip title={t('share')}>
										<IconButton
											onClick={handleShare}
											sx={{
												backgroundColor: 'background.paper',
												'&:hover': { backgroundColor: 'action.hover' },
											}}
										>
											<IconShare size={20} />
										</IconButton>
									</Tooltip>
									<Tooltip title={t('bookmark')}>
										<IconButton
											onClick={() => setIsBookmarked(!isBookmarked)}
											sx={{
												backgroundColor: 'background.paper',
												'&:hover': { backgroundColor: 'action.hover' },
												color: isBookmarked ? 'primary.main' : 'inherit',
											}}
										>
											<IconBookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
										</IconButton>
									</Tooltip>
								</Stack>
							</Box>
						)}
						
						<Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
							{/* Main Content */}
							<Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 1, md: locale === 'ar' ? 2 : 1 } }}>
								<Stack spacing={3}>
									<Stack spacing={1.5}>
										<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
											<Typography
												color="accent"
												variant="subtitle2"
												sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: { xs: '0.8125rem', md: '0.875rem' } }}
											>
												{categoryLabel}
											</Typography>
											{isComingSoon && (
												<Chip
													label={t('comingSoon')}
													size="small"
													color="warning"
													sx={{ fontSize: '0.75rem' }}
												/>
											)}
										</Stack>
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

									{/* Quick Info - Mobile Optimized */}
									<Grid container spacing={2.5} sx={{ pt: 0.5 }}>
										<Grid size={{ xs: 12, sm: 6 }}>
											<motion.div
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<Stack direction="row" spacing={1.5} alignItems="center">
													<Box
														sx={{
															width: { xs: 36, sm: 40 },
															height: { xs: 36, sm: 40 },
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
														<Typography variant="body2" fontWeight={700} sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
															{service.turnaroundTime}
														</Typography>
													</Box>
												</Stack>
											</motion.div>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<motion.div
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<Stack direction="row" spacing={1.5} alignItems="center">
													<Box
														sx={{
															width: { xs: 36, sm: 40 },
															height: { xs: 36, sm: 40 },
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
														<Typography variant="body2" fontWeight={700} sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
															{formatPrice()}
														</Typography>
													</Box>
												</Stack>
											</motion.div>
										</Grid>
									</Grid>

									{/* CTA Button - Desktop */}
									<Box sx={{ display: { xs: 'none', md: 'block' }, pt: 1 }}>
										<Button
											component={Link}
											href={`/services/${service.slug}/quote`}
											variant="contained"
											size="large"
											disabled={isComingSoon}
											sx={{
												minWidth: 200,
												height: 56,
											}}
										>
											{locale === 'ar' ? 'ابدأ الخدمة' : 'Request Service'}
										</Button>
									</Box>
								</Stack>
							</Grid>

							{/* Sidebar */}
							<Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 2, md: locale === 'ar' ? 1 : 2 } }}>
								<ServiceDetailSidebar service={service} />
							</Grid>
						</Grid>
					</Stack>
				</RevealSection>
			</Container>

			{/* Additional Sections */}
			<Stats />
			<Process />
			<Reviews />
			<Faq />

			{/* Sticky CTA for Mobile */}
			<StickyCTA service={service} locale={locale} />
		</Box>
	);
}


'use client';

import { alpha, Box, Button, Chip, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

import { Card } from '@/components/ui/card';
import { CardContent } from '@mui/material';
import type { Service } from '@/data/services';
import { trackServicesEvent } from '@/lib/analytics';

interface ServiceCardProps {
	service: Service;
	locale: 'en' | 'ar';
	currencyFormatter: Intl.NumberFormat;
	viewMode?: 'grid' | 'list';
	categoryLabel: string;
	categories: Array<{ slug: string; name: string; description: string }>;
	originalService?: any; // Raw DB service to check availability
}

export default function ServiceCard({
	service,
	locale,
	currencyFormatter,
	viewMode = 'grid',
	categoryLabel,
	categories,
	originalService,
}: ServiceCardProps) {
	const t = useTranslations('Services');
	const currentLocale = useLocale() as 'en' | 'ar';
	const theme = useTheme();

	const priceLabel = (() => {
		if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
			return t('pricingFormats.fixed', { amount: currencyFormatter.format(service.pricing.amount) });
		}
		if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
			return t('pricingFormats.startingFrom', { amount: currencyFormatter.format(service.pricing.amount) });
		}
		if (service.pricing.note) {
			return service.pricing.note;
		}
		return t('pricingFormats.custom');
	})();

	// Check availability from database (like "in stock" / "out of stock")
	// Only is_active field exists in the database schema
	const isAvailable = originalService?.is_active !== false;
	const isComingSoon = !isAvailable;

	const getCategoryColor = (categorySlug: string): { bg: string; text: string } => {
		const colorMap: Record<string, { bg: string; text: string }> = {
			government: { bg: alpha(theme.palette.primary.main, 0.1), text: 'primary.main' },
			translation: { bg: alpha(theme.palette.info.main, 0.1), text: 'info.main' },
			legalization: { bg: alpha(theme.palette.success.main, 0.1), text: 'success.main' },
			business: { bg: alpha(theme.palette.warning.main, 0.1), text: 'warning.main' },
		};
		return colorMap[categorySlug] || { bg: alpha(theme.palette.primary.main, 0.1), text: 'primary.main' };
	};

	const categoryColor = getCategoryColor(service.category);

	const handleDetailsClick = () => {
		trackServicesEvent('service_card_click', {
			service_slug: service.slug,
			service_title: service.title,
		});
	};

	if (viewMode === 'list') {
		return (
			<Card
				backgroundColor={{ light: '#ffffff', dark: '#181818' }}
				borderColor={{ light: '#ffffff', dark: '#444444' }}
				borderRadius={16}
				gradientColor={{ light: '#eeeeee', dark: '#262626' }}
				gradientOpacity={0.5}
			>
				<CardContent sx={{ p: 3 }}>
					<Stack direction="row" spacing={3} alignItems="flex-start">
						{/* Left: Content */}
						<Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
							<Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
								<Chip
									label={categoryLabel}
									size="small"
									sx={{
										bgcolor: categoryColor.bg,
										color: categoryColor.text,
										fontWeight: 600,
										fontSize: '0.6875rem',
										height: 24,
										px: 1.25,
									}}
								/>
								{isComingSoon ? (
									<Chip
										label={t('comingSoon')}
										size="small"
										sx={{
											bgcolor: alpha(theme.palette.warning.main, 0.12),
											color: 'warning.main',
											fontWeight: 700,
											fontSize: '0.625rem',
											height: 22,
											border: '1px solid',
											borderColor: alpha(theme.palette.warning.main, 0.3),
										}}
									/>
								) : (
									<Chip
										label={t('availableNow')}
										size="small"
										sx={{
											bgcolor: alpha(theme.palette.success.main, 0.15),
											color: 'success.main',
											fontWeight: 700,
											fontSize: '0.6875rem',
											height: 24,
											border: '1.5px solid',
											borderColor: theme.palette.success.main,
											boxShadow: `0 0 0 2px ${alpha(theme.palette.success.main, 0.1)}`,
										}}
									/>
								)}
							</Stack>
							<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 }}>
								{service.title}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
								{service.shortDescription}
							</Typography>
							<Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
								<Box>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
										{locale === 'ar' ? 'رسوم الخدمة' : 'Service fee'}
									</Typography>
									<Typography variant="subtitle2" sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'primary.main' }}>
										{priceLabel}
									</Typography>
								</Box>
								<Tooltip title={isComingSoon ? t('comingSoonTooltip') : ''} arrow>
									<span>
										<Button
											component={Link}
											href={`/services/${service.slug}`}
											variant="contained"
											endIcon={currentLocale === 'ar' ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
											onClick={handleDetailsClick}
											disabled={isComingSoon}
											sx={{
												fontWeight: 600,
												textTransform: 'none',
												borderRadius: '50vh',
												px: 3,
												py: 1,
											}}
										>
											{t('viewDetails')}
										</Button>
									</span>
								</Tooltip>
							</Stack>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		);
	}

	// Grid view (default)
	return (
		<Card
			backgroundColor={{ light: '#ffffff', dark: '#181818' }}
			borderColor={{ light: '#ffffff', dark: '#444444' }}
			borderRadius={44}
			gradientColor={{ light: '#eeeeee', dark: '#262626' }}
			gradientOpacity={0.5}
			fullHeight
		>
			<CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
				{/* Badges */}
				<Box sx={{ position: 'relative', mb: 2 }}>
					{isComingSoon ? (
						<Chip
							label={t('comingSoon')}
							size="small"
							sx={{
								position: 'absolute',
								top: 0,
								right: 0,
								bgcolor: alpha(theme.palette.warning.main, 0.12),
								color: 'warning.main',
								fontWeight: 700,
								fontSize: '0.625rem',
								height: 22,
								border: '1px solid',
								borderColor: alpha(theme.palette.warning.main, 0.3),
							}}
						/>
					) : (
						<Chip
							label={t('availableNow')}
							size="small"
							sx={{
								position: 'absolute',
								top: 0,
								right: 0,
								bgcolor: alpha(theme.palette.success.main, 0.15),
								color: 'success.main',
								fontWeight: 700,
								fontSize: '0.6875rem',
								height: 24,
								border: '1.5px solid',
								borderColor: theme.palette.success.main,
								boxShadow: `0 0 0 2px ${alpha(theme.palette.success.main, 0.1)}`,
							}}
						/>
					)}
				</Box>

				<Stack spacing={2.5} sx={{ flexGrow: 1 }}>
					{/* Category Tag */}
					<Box>
						<Chip
							label={categoryLabel}
							size="small"
							sx={{
								bgcolor: categoryColor.bg,
								color: categoryColor.text,
								fontWeight: 600,
								fontSize: '0.6875rem',
								height: 24,
								px: 1.25,
							}}
						/>
					</Box>

					{/* Title */}
					<Typography
						variant="h6"
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1rem', md: '1.125rem' },
							lineHeight: 1.3,
							minHeight: { xs: 48, md: 56 },
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{service.title}
					</Typography>

					{/* Description */}
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							fontSize: { xs: '0.875rem', md: '0.9375rem' },
							lineHeight: 1.6,
							minHeight: { xs: 60, md: 68 },
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{service.shortDescription}
					</Typography>

					{/* Service Fee */}
					<Box sx={{ mt: 'auto', pt: 1.5 }}>
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}>
							{locale === 'ar' ? 'رسوم الخدمة' : 'Service fee'}
						</Typography>
						<Typography variant="subtitle2" sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'primary.main' }}>
							{priceLabel}
						</Typography>
					</Box>
				</Stack>

				{/* Details Link */}
				<Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
					<Tooltip title={isComingSoon ? t('comingSoonTooltip') : ''} arrow>
						<span>
							<Button
								component={Link}
								href={`/services/${service.slug}`}
								variant="text"
								endIcon={currentLocale === 'ar' ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
								onClick={handleDetailsClick}
								fullWidth
								disabled={isComingSoon}
								sx={{
									color: 'primary.main',
									fontWeight: 600,
									textTransform: 'none',
									borderRadius: 1.5,
									px: 2,
									py: 1.25,
									justifyContent: 'space-between',
									fontSize: '0.875rem',
									'&:hover': {
										bgcolor: alpha(theme.palette.primary.main, 0.08),
									},
									'&.Mui-disabled': {
										color: theme.palette.mode === 'dark' 
											? 'rgba(255,255,255,0.3)' 
											: 'rgba(0,0,0,0.26)',
									},
								}}
							>
								{t('viewDetails')}
							</Button>
						</span>
					</Tooltip>
				</Box>
			</CardContent>
		</Card>
	);
}


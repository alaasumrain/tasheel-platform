'use client';

import {
	Box,
	Button,
	CardContent,
	Stack,
	Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
	IconClock,
	IconCurrencyShekel,
	IconCheck,
	IconBrandWhatsapp,
} from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

import { Card } from '@/components/ui/card';
import type { Service } from '@/data/services';

interface ServiceQuoteSidebarProps {
	service: Service;
}

export default function ServiceQuoteSidebar({ service }: ServiceQuoteSidebarProps) {
	const t = useTranslations('Quote.sidebar');
	const locale = useLocale() as 'en' | 'ar';
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const formatPrice = () => {
		if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
			return `₪${service.pricing.amount}`;
		}

		if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
			return `${t('from')} ₪${service.pricing.amount}`;
		}

		return t('requestQuote');
	};

	const whatsappMessage = encodeURIComponent(
		locale === 'ar' 
			? `مرحباً! أود الحصول على عرض سعر لـ: ${service.title}`
			: `Hi! I'd like to get a quote for: ${service.title}`
	);
	const whatsappUrl = `https://wa.me/970590000000?text=${whatsappMessage}`;

	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'accent.main' }}
			borderColor={{ light: 'divider', dark: 'accent.light' }}
			gradientColor={{ light: 'accent.light', dark: 'accent.light' }}
			gradientOpacity={0.6}
			borderRadius={24}
		>
			<CardContent sx={{ p: { xs: 3, md: 4 } }}>
				<Stack spacing={3}>
					{/* Service Title */}
					<Box>
						<Typography variant="overline" sx={{ color: 'text.secondary', opacity: 0.7 }}>
							{t('service')}
						</Typography>
						<Typography variant="h5" color="text.primary" fontWeight={700}>
							{service.title}
						</Typography>
					</Box>

					{/* Pricing & Time */}
					<Stack spacing={2}>
						<Stack direction="row" spacing={1.5} alignItems="center">
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: '12px',
									backgroundColor: isDark 
										? 'rgba(255,255,255,0.15)' 
										: 'rgba(14, 33, 160, 0.08)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'primary.main',
								}}
							>
								<IconCurrencyShekel size={20} />
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary">
									{t('pricing')}
								</Typography>
								<Typography variant="body1" color="text.primary" fontWeight={600}>
									{formatPrice()}
								</Typography>
							</Box>
						</Stack>

						<Stack direction="row" spacing={1.5} alignItems="center">
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: '12px',
									backgroundColor: isDark 
										? 'rgba(255,255,255,0.15)' 
										: 'rgba(14, 33, 160, 0.08)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'primary.main',
								}}
							>
								<IconClock size={20} />
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary">
									{t('turnaround')}
								</Typography>
								<Typography variant="body1" color="text.primary" fontWeight={600}>
									{service.turnaroundTime}
								</Typography>
							</Box>
						</Stack>
					</Stack>

					{/* What's Included */}
					<Box>
						<Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
							{t('whatsIncluded')}
						</Typography>
						<Stack spacing={1.5}>
							{service.features.slice(0, 4).map((feature, index) => (
								<Stack direction="row" spacing={1.5} alignItems="flex-start" key={index}>
									<Box sx={{ color: 'primary.main', pt: 0.25 }}>
										<IconCheck size={20} />
									</Box>
									<Typography variant="body2" color="text.secondary">
										{feature}
									</Typography>
								</Stack>
							))}
						</Stack>
					</Box>

					{/* Divider */}
					<Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
						<Stack spacing={2}>
							<Typography variant="body2" color="text.secondary">
								{t('needFasterQuote')}
							</Typography>
							<Button
								variant="outlined"
								size="large"
								startIcon={<IconBrandWhatsapp size={20} />}
								component="a"
								href={whatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									borderColor: 'divider',
									color: 'text.primary',
									'&:hover': {
										borderColor: 'primary.main',
										backgroundColor: 'action.hover',
									},
								}}
							>
								{t('quickWhatsAppQuote')}
							</Button>
						</Stack>
					</Box>

					{/* Note */}
					{service.pricing.note && (
						<Box
							sx={{
								p: 2,
								backgroundColor: isDark 
									? 'rgba(255,255,255,0.1)' 
									: 'rgba(14, 33, 160, 0.04)',
								borderRadius: 2,
							}}
						>
							<Typography variant="caption" color="text.secondary">
								<strong>{t('note')}:</strong> {service.pricing.note}
							</Typography>
						</Box>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}

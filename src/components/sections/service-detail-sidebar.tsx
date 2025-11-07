'use client';

import {
	Box,
	CardContent,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import {
	IconClock,
	IconCurrencyShekel,
	IconUsers,
	IconLanguage,
	IconDeviceMobile,
	IconCreditCard,
	IconShare,
	IconQrcode,
	IconX,
} from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('qrcode.react').then((mod) => mod.default), {
	ssr: false,
});

import { Card } from '@/components/ui/card';
import type { Service } from '@/data/services';

interface ServiceDetailSidebarProps {
	service: Service;
}

export default function ServiceDetailSidebar({ service }: ServiceDetailSidebarProps) {
	const t = useTranslations('Services');
	const tCommon = useTranslations('Common');
	const locale = useLocale() as 'en' | 'ar';
	const theme = useTheme();
	const [qrOpen, setQrOpen] = useState(false);

	const currencyFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		style: 'currency',
		currency: 'ILS',
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: 0,
	});

	const formatPrice = () => {
		if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
			return currencyFormatter.format(service.pricing.amount);
		}

		if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
			return `${t('pricingFormats.startingFrom', { amount: currencyFormatter.format(service.pricing.amount) })}`;
		}

		if (service.pricing.note) {
			return service.pricing.note;
		}

		return t('pricingFormats.custom');
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: service.title,
					text: service.shortDescription,
					url: window.location.href,
				});
			} catch (err) {
				// User cancelled or error occurred
			}
		} else {
			await navigator.clipboard.writeText(window.location.href);
			// Could show a toast notification here
		}
	};

	const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

	const metadataItems = [
		{
			icon: IconUsers,
			label: t('sidebar.beneficiaries'),
			value: locale === 'ar' ? 'المواطنون والمقيمون' : 'Citizens and Residents',
		},
		{
			icon: IconCurrencyShekel,
			label: t('sidebar.serviceCost'),
			value: formatPrice(),
		},
		{
			icon: IconLanguage,
			label: t('sidebar.serviceLanguage'),
			value: locale === 'ar' ? 'عربي / انجليزي' : 'Arabic / English',
		},
		{
			icon: IconClock,
			label: t('sidebar.executionTime'),
			value: service.turnaroundTime || t('sidebar.notSpecified'),
		},
		{
			icon: IconDeviceMobile,
			label: t('sidebar.deliveryChannels'),
			value: locale === 'ar' ? 'منصة تسهيل' : 'Tasheel Platform',
		},
		{
			icon: IconCreditCard,
			label: t('sidebar.paymentChannels'),
			value: locale === 'ar' ? 'PalPay / PayTabs' : 'PalPay / PayTabs',
		},
	];

	return (
		<Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={16}
			>
				<CardContent sx={{ p: { xs: 3, md: 4 } }}>
					<Stack spacing={3}>
						{/* Share Actions */}
						<Stack direction="row" spacing={1.5} justifyContent="flex-start">
							<IconButton
								onClick={handleShare}
								sx={{
									color: 'primary.main',
									border: '1px solid',
									borderColor: 'divider',
									'&:hover': { 
										bgcolor: 'action.hover',
										borderColor: 'primary.main',
									},
								}}
								aria-label={t('sidebar.shareService')}
							>
								<IconShare size={18} />
							</IconButton>
							<IconButton
								onClick={() => setQrOpen(true)}
								sx={{
									color: 'primary.main',
									border: '1px solid',
									borderColor: 'divider',
									'&:hover': { 
										bgcolor: 'action.hover',
										borderColor: 'primary.main',
									},
								}}
								aria-label={t('sidebar.quickAccess')}
							>
								<IconQrcode size={18} />
							</IconButton>
						</Stack>

						<Divider />

						{/* Metadata Items */}
						<Stack spacing={2.5}>
							{metadataItems.map((item, index) => {
								const IconComponent = item.icon;
								return (
									<Stack key={index} direction="row" spacing={2} alignItems="flex-start">
										<Box
											sx={{
												width: 40,
												height: 40,
												borderRadius: 2,
												bgcolor: theme.palette.mode === 'dark' 
													? 'rgba(255,255,255,0.05)' 
													: 'rgba(14, 33, 160, 0.04)',
												color: 'primary.main',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}
										>
											<IconComponent size={20} />
										</Box>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography
												variant="caption"
												color="text.secondary"
												sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}
											>
												{item.label}
											</Typography>
											<Typography 
												variant="body1" 
												fontWeight={600}
												sx={{ 
													wordBreak: 'break-word',
													lineHeight: 1.5,
												}}
											>
												{item.value}
											</Typography>
										</Box>
									</Stack>
								);
							})}
						</Stack>
					</Stack>
				</CardContent>
			</Card>

			{/* QR Code Dialog */}
			<Dialog 
				open={qrOpen} 
				onClose={() => setQrOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="h6">{t('sidebar.quickAccess')}</Typography>
					<IconButton onClick={() => setQrOpen(false)} size="small">
						<IconX size={20} />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<Stack spacing={3} alignItems="center" sx={{ py: 2 }}>
						<Box
							sx={{
								p: 2,
								bgcolor: 'background.paper',
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
							}}
						>
							<QRCode value={currentUrl} size={200} />
						</Box>
						<Typography variant="body2" color="text.secondary" textAlign="center">
							{locale === 'ar' 
								? 'امسح رمز QR للوصول السريع إلى هذه الخدمة'
								: 'Scan QR code for quick access to this service'}
						</Typography>
						<Typography 
							variant="caption" 
							color="text.secondary" 
							sx={{ 
								wordBreak: 'break-all',
								textAlign: 'center',
								fontFamily: 'monospace',
							}}
						>
							{currentUrl}
						</Typography>
					</Stack>
				</DialogContent>
			</Dialog>
		</Box>
	);
}


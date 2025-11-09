'use client';

import { useMemo, useState, useEffect } from 'react';
import {
	Alert,
	Box,
	Button,
	CardContent,
	Chip,
	Container,
	Divider,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	IconArrowRight,
	IconArrowLeft,
	IconBrandWhatsapp,
	IconCheck,
	IconClipboardCopy,
	IconClipboardCheck,
	IconClock,
	IconInbox,
	IconPrinter,
	IconShieldCheck,
	IconUserPlus,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Link, useRouter } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';

type PricingType = 'fixed' | 'quote' | 'starting';

interface ServiceSummary {
	slug: string;
	title: string;
	category: string;
	pricingType: PricingType;
	pricingAmount?: number;
	pricingNote?: string;
	turnaroundTime?: string;
}

interface OrderConfirmationProps {
	locale: 'en' | 'ar';
	orderFound: boolean;
	orderNumber?: string | null;
	customerName?: string | null;
	customerEmail?: string | null;
	customerPhone?: string | null;
	status?: string | null;
	submittedAt?: string | null;
	service?: ServiceSummary | null;
}

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
	government: { en: 'Government services', ar: 'الخدمات الحكومية' },
	translation: { en: 'Translation', ar: 'الترجمة' },
	legalization: { en: 'Legalization', ar: 'التصديقات' },
	business: { en: 'Business services', ar: 'خدمات الأعمال' },
};

export function OrderConfirmation({
	locale,
	orderFound,
	orderNumber,
	customerName,
	customerEmail,
	customerPhone,
	status,
	submittedAt,
	service,
}: OrderConfirmationProps) {
	const t = useTranslations('OrderConfirmation');
	const router = useRouter();
	const [copied, setCopied] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
	const supabase = createClientComponentClient();

	// Check if user is logged in
	useEffect(() => {
		const checkAuth = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setIsLoggedIn(!!user);
		};
		checkAuth();
	}, [supabase]);

	const handleCopy = async () => {
		if (!orderNumber) return;
		try {
			await navigator.clipboard.writeText(orderNumber);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	const handlePrint = () => {
		if (typeof window !== 'undefined') {
			window.print();
		}
	};

	const nextSteps = useMemo(() => {
		return [
			{
				icon: <IconClock size={24} />,
				title: t('nextSteps.review.title'),
				description: t('nextSteps.review.description'),
			},
			{
				icon: <IconInbox size={24} />,
				title: t('nextSteps.quote.title'),
				description: t('nextSteps.quote.description'),
			},
			{
				icon: <IconShieldCheck size={24} />,
				title: t('nextSteps.payment.title'),
				description: t('nextSteps.payment.description'),
			},
			{
				icon: <IconCheck size={24} />,
				title: t('nextSteps.processing.title'),
				description: t('nextSteps.processing.description'),
			},
		];
	}, [t]);

	const formattedSubmittedAt = useMemo(() => {
		if (!submittedAt) return null;
		try {
			const date = new Date(submittedAt);
			return new Intl.DateTimeFormat(locale, {
				dateStyle: 'medium',
				timeStyle: 'short',
			}).format(date);
		} catch {
			return null;
		}
	}, [submittedAt, locale]);

	const formattedPricing = useMemo(() => {
		if (!service) return null;
		if (service.pricingType === 'fixed' && service.pricingAmount !== undefined) {
			return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
				style: 'currency',
				currency: 'ILS',
				currencyDisplay: 'narrowSymbol',
				maximumFractionDigits: 0,
			}).format(service.pricingAmount);
		}

		if (service.pricingType === 'starting' && service.pricingAmount !== undefined) {
			const amount = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
				style: 'currency',
				currency: 'ILS',
				currencyDisplay: 'narrowSymbol',
				maximumFractionDigits: 0,
			}).format(service.pricingAmount);
			return t('pricing.startingFrom', { amount });
		}

		return t('pricing.customQuote');
	}, [service, locale, t]);

	const categoryLabel =
		service && CATEGORY_LABELS[service.category]
			? CATEGORY_LABELS[service.category][locale]
			: service?.category ?? null;

	const trackHref =
		orderNumber != null ? `/track?order=${encodeURIComponent(orderNumber)}` : '/track';

	if (!orderNumber) {
		return (
			<Container sx={{ py: { xs: 6, md: 10 } }}>
				<Card>
					<CardContent sx={{ p: { xs: 4, md: 6 } }}>
						<Stack spacing={3} alignItems="center" textAlign="center">
							<Typography variant="h3">{t('noOrderTitle')}</Typography>
							<Typography color="text.secondary" variant="body1" maxWidth={480}>
								{t('noOrderDescription')}
							</Typography>
							<Stack
								direction={{ xs: 'column', sm: 'row' }}
								spacing={2}
								justifyContent="center"
								alignItems="center"
							>
								<Button component={Link} href="/services" variant="contained" endIcon={locale === 'ar' ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}>
									{t('backToServices')}
								</Button>
								<Button component={Link} href="/track" variant="outlined">
									{t('trackManually')}
								</Button>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		);
	}

	if (!orderFound) {
		return (
			<Container sx={{ py: { xs: 6, md: 10 } }}>
				<Card>
					<CardContent sx={{ p: { xs: 4, md: 6 } }}>
						<Stack spacing={3} alignItems="center" textAlign="center">
							<Typography variant="h3">{t('unknownOrderTitle')}</Typography>
							<Typography color="text.secondary" variant="body1" maxWidth={520}>
								{t('unknownOrderDescription', { orderNumber })}
							</Typography>
							<Stack
								direction={{ xs: 'column', sm: 'row' }}
								spacing={2}
								justifyContent="center"
								alignItems="center"
							>
								<Button component={Link} href="/track" variant="contained">
									{t('trackManually')}
								</Button>
								<Button component={Link} href="/services" variant="outlined">
									{t('backToServices')}
								</Button>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Container sx={{ py: { xs: 6, md: 10 } }}>
			<Stack spacing={{ xs: 4, md: 6 }}>
				{/* Success Card */}
				<Card>
					<CardContent sx={{ p: { xs: 4, md: 6 } }}>
						<Stack spacing={4}>
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: 72,
									height: 72,
									borderRadius: '50%',
									backgroundColor: 'rgba(20, 170, 124, 0.12)',
									color: 'accent.main',
								}}
							>
								<IconShieldCheck size={32} />
							</Box>

							<Stack spacing={1}>
								<Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
									{t('title')}
								</Typography>
								<Typography color="text.secondary" variant="h6" maxWidth={560}>
									{t('subtitle', {
										name: customerName ?? t('customerDefaultName'),
									})}
								</Typography>
							</Stack>

							<Card
								borderRadius={28}
								gradientOpacity={0.2}
								backgroundColor={{ 
									light: 'rgba(14, 33, 160, 0.02)', 
									dark: 'rgba(255, 255, 255, 0.02)' 
								}}
								borderColor={{ light: 'divider', dark: 'divider' }}
							>
								<CardContent sx={{ p: { xs: 3, md: 4 } }}>
									<Grid container spacing={3} alignItems="center">
										<Grid size={{ xs: 12, md: 'auto' }}>
											<Stack spacing={0.5}>
												<Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
													{t('orderNumberLabel')}
												</Typography>
												<Stack direction="row" alignItems="center" spacing={1}>
													<Typography variant="h4" sx={{ fontFamily: 'monospace' }}>
														{orderNumber}
													</Typography>
													<Tooltip title={copied ? t('copySuccess') : t('copyAction')} placement="top">
														<Button
															variant="outlined"
															size="small"
															onClick={handleCopy}
															startIcon={copied ? <IconClipboardCheck size={18} /> : <IconClipboardCopy size={18} />}
														>
															{copied ? t('copied') : t('copy')}
														</Button>
													</Tooltip>
												</Stack>
											</Stack>
										</Grid>
										<Grid size={{ xs: 12, md: 'auto' }}>
											<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ sm: 'flex-end' }}>
												<Button
													component={Link}
													href={trackHref}
													variant="contained"
													size="large"
													endIcon={locale === 'ar' ? <IconArrowLeft size={20} /> : <IconArrowRight size={20} />}
												>
													{t('trackButton')}
												</Button>
												<Button variant="outlined" size="large" onClick={handlePrint} startIcon={<IconPrinter size={20} />}>
													{t('printReceipt')}
												</Button>
											</Stack>
										</Grid>
									</Grid>
								</CardContent>
							</Card>

							{customerEmail && (
								<Alert severity="info" sx={{ borderRadius: 2 }}>
									{t('emailNotice', { email: customerEmail })}
								</Alert>
							)}

							{/* Account Creation Prompt */}
							{isLoggedIn === false && customerEmail && (
								<Card
									backgroundColor={{ light: 'primary.main', dark: 'primary.main' }}
									borderColor={{ light: 'primary.main', dark: 'primary.main' }}
									gradientOpacity={0.2}
								>
									<CardContent sx={{ p: { xs: 3, md: 4 }, color: 'primary.contrastText' }}>
										<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
											<Stack spacing={1} flex={1}>
												<Typography variant="h6" fontWeight={600}>
													{t('createAccount.title')}
												</Typography>
												<Typography variant="body2" sx={{ opacity: 0.9 }}>
													{t('createAccount.description')}
												</Typography>
											</Stack>
											<Button
												component={Link}
												href={`/register?email=${encodeURIComponent(customerEmail)}${customerName ? `&name=${encodeURIComponent(customerName)}` : ''}`}
												variant="contained"
												size="large"
												startIcon={<IconUserPlus size={20} />}
												sx={{
													backgroundColor: 'rgba(255, 255, 255, 0.2)',
													color: 'primary.contrastText',
													border: '1px solid rgba(255, 255, 255, 0.3)',
													'&:hover': {
														backgroundColor: 'rgba(255, 255, 255, 0.3)',
													},
												}}
											>
												{t('createAccount.button')}
											</Button>
										</Stack>
									</CardContent>
								</Card>
							)}
						</Stack>
					</CardContent>
				</Card>

				<Grid container spacing={{ xs: 4, md: 6 }}>
					{/* Service Summary */}
					<Grid size={{ xs: 12, lg: 7 }}>
						<Card fullHeight>
							<CardContent sx={{ p: { xs: 4, md: 5 }, height: '100%' }}>
								<Stack spacing={3} sx={{ height: '100%' }}>
									<Stack spacing={2}>
										<Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>
											{t('serviceSummaryTitle')}
										</Typography>
										{service ? (
											<Stack spacing={1.5}>
												<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
													<Typography variant="h4">{service.title}</Typography>
													{categoryLabel && <Chip label={categoryLabel} color="primary" variant="outlined" size="small" />}
												</Stack>
												<Stack direction="row" spacing={2} flexWrap="wrap">
													{formattedPricing && (
														<Stack spacing={0.5}>
															<Typography variant="caption" color="text.secondary">
																{t('pricing.label')}
															</Typography>
															<Typography variant="body1" fontWeight={600}>
																{formattedPricing}
															</Typography>
														</Stack>
													)}
													{service.turnaroundTime && (
														<Stack spacing={0.5}>
															<Typography variant="caption" color="text.secondary">
																{t('turnaround.label')}
															</Typography>
															<Typography variant="body1" fontWeight={600}>
																{service.turnaroundTime}
															</Typography>
														</Stack>
													)}
												</Stack>
												{service.pricingNote && (
													<Typography variant="body2" color="text.secondary">
														{service.pricingNote}
													</Typography>
												)}
											</Stack>
										) : (
											<Typography color="text.secondary" variant="body1">
												{t('serviceSummaryFallback')}
											</Typography>
										)}
									</Stack>

									<Divider />

									<Stack spacing={2}>
										<Typography variant="h4" sx={{ fontSize: '1.25rem' }}>
											{t('nextSteps.title')}
										</Typography>
										<Stack spacing={2}>
											{nextSteps.map((step) => (
												<Card
													key={step.title}
													borderRadius={20}
													gradientOpacity={0.1}
													backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
													borderColor={{ light: 'divider', dark: 'divider' }}
												>
													<CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
														<Stack direction="row" spacing={2} alignItems="flex-start">
															<Box
																sx={{
																	width: 48,
																	height: 48,
																	borderRadius: 2,
																	backgroundColor: 'rgba(14, 33, 160, 0.08)',
																	color: 'accent.main',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																}}
															>
																{step.icon}
															</Box>
															<Stack spacing={0.75}>
																<Typography variant="subtitle1" fontWeight={600}>
																	{step.title}
																</Typography>
																<Typography variant="body2" color="text.secondary">
																	{step.description}
																</Typography>
															</Stack>
														</Stack>
													</CardContent>
												</Card>
											))}
										</Stack>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					{/* Order Meta */}
					<Grid size={{ xs: 12, lg: 5 }}>
						<Stack spacing={4}>
							<Card>
								<CardContent sx={{ p: { xs: 4, md: 5 } }}>
									<Stack spacing={2}>
										<Typography variant="h3" sx={{ fontSize: '1.5rem' }}>
											{t('orderDetailsTitle')}
										</Typography>
										<Stack spacing={1}>
											<Typography variant="caption" color="text.secondary">
												{t('submittedOnLabel')}
											</Typography>
											<Typography variant="body1">
												{formattedSubmittedAt ?? t('submittedOnFallback')}
											</Typography>
										</Stack>
										{status && (
											<Stack spacing={1}>
												<Typography variant="caption" color="text.secondary">
													{t('statusLabel')}
												</Typography>
												<Chip
													label={t(`statuses.${status}`, {
														defaultValue: status.replace('_', ' '),
													})}
													color="success"
													variant="outlined"
												/>
											</Stack>
										)}
										{customerPhone && (
											<Stack spacing={1}>
												<Typography variant="caption" color="text.secondary">
													{t('phoneLabel')}
												</Typography>
												<Typography variant="body1">{customerPhone}</Typography>
											</Stack>
										)}
									</Stack>
								</CardContent>
							</Card>

							<Card
								backgroundColor={{ light: 'accent.main', dark: 'accent.main' }}
								borderColor={{ light: 'accent.main', dark: 'accent.main' }}
								gradientColor={{ light: 'accent.main', dark: 'accent.main' }}
								gradientOpacity={0.4}
							>
								<CardContent sx={{ p: { xs: 4, md: 5 }, color: 'accent.contrastText' }}>
									<Stack spacing={3}>
										<Stack spacing={1}>
											<Typography variant="h3" sx={{ fontSize: '1.5rem' }}>
												{t('helpTitle')}
											</Typography>
											<Typography variant="body2" sx={{ opacity: 0.85 }}>
												{t('helpDescription')}
											</Typography>
										</Stack>
										<Button
											component="a"
											href="https://wa.me/9722401234"
											target="_blank"
											rel="noopener noreferrer"
											variant="contained"
											size="large"
											startIcon={<IconBrandWhatsapp size={20} />}
											sx={{
												backgroundColor: '#25D366',
												color: '#0E21A0',
												fontWeight: 600,
												'&:hover': {
													backgroundColor: '#1db954',
												},
											}}
										>
											{t('whatsAppButton')}
										</Button>
									</Stack>
								</CardContent>
							</Card>

							<Card>
								<CardContent sx={{ p: { xs: 4, md: 5 } }}>
									<Stack spacing={2}>
										<Typography variant="h3" sx={{ fontSize: '1.5rem' }}>
											{t('nextActionsTitle')}
										</Typography>
										<Stack spacing={1} component="ul" sx={{ pl: 3, m: 0 }}>
											{service ? (
												<li>
													<Typography variant="body2">
														{t('nextActions.reviewRequest', { service: service.title })}
													</Typography>
												</li>
											) : null}
											<li>
												<Typography variant="body2">
													{t('nextActions.keepEmail')}
												</Typography>
											</li>
											<li>
												<Typography variant="body2">
													{t('nextActions.trackUpdates')}
												</Typography>
											</li>
										</Stack>
										<Button
											onClick={() => router.push('/services')}
											variant="text"
											endIcon={locale === 'ar' ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
											sx={{ alignSelf: 'flex-start' }}
										>
											{t('browseMoreServices')}
										</Button>
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
				</Grid>
			</Stack>
			<Snackbar
				open={copied}
				autoHideDuration={2000}
				onClose={() => setCopied(false)}
				message={t('copySuccess')}
				anchorOrigin={{ vertical: 'bottom', horizontal: locale === 'ar' ? 'left' : 'right' }}
			/>
		</Container>
	);
}

'use client';

import {
	Box,
	Button,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconCheck, IconClock, IconCurrencyShekel } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import type { Service } from '@/data/services';
import Mockup from '@/components/ui/mockup';
import RevealSection from '@/components/ui/reveal-section';
import { Card as CustomCard } from '@/components/ui/card';

interface ServiceDetailProps {
	service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
	const t = useTranslations('Services');
	const formatPrice = () => {
		if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'ILS',
				currencyDisplay: 'narrowSymbol',
			}).format(service.pricing.amount);
		}

		if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
			const amount = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'ILS',
				currencyDisplay: 'narrowSymbol',
			}).format(service.pricing.amount);
			return `${t('from')} ${amount}`;
		}

		return t('requestQuote');
	};

	return (
		<Box>
			{/* Hero Section */}
			<Container sx={{ pt: { xs: 3, md: 6 }, pb: { xs: 6.25, md: 12.5 } }}>
				<RevealSection delay={0.1} direction="up">
					<Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={3}>
								<Typography
									color="accent"
									variant="subtitle1"
									sx={{ textTransform: 'capitalize' }}
								>
									{service.category.replace('-', ' ')} {t('title')}
								</Typography>
								<Typography variant="h1">{service.title}</Typography>
								<Typography
									color="text.secondary"
									variant="h6"
									component="p"
								>
									{service.description}
								</Typography>

								{/* Quick Info */}
								<Grid container spacing={2} sx={{ pt: 2 }}>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Stack direction="row" spacing={1} alignItems="center">
											<IconClock size={20} />
											<Box>
												<Typography variant="caption" color="text.secondary">
													{t('turnaroundTime')}
												</Typography>
												<Typography variant="body2" fontWeight={600}>
													{service.turnaroundTime}
												</Typography>
											</Box>
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Stack direction="row" spacing={1} alignItems="center">
									<IconCurrencyShekel size={20} />
											<Box>
												<Typography variant="caption" color="text.secondary">
													{t('startingPrice')}
												</Typography>
									<Typography variant="body2" fontWeight={600}>
										{formatPrice()}
									</Typography>
											</Box>
										</Stack>
									</Grid>
								</Grid>

								<Stack direction="row" spacing={2} sx={{ pt: 1 }}>
									<Button
										component={Link}
										href={`/services/${service.slug}/quote`}
										variant="contained"
										size="large"
									>
										{t('requestQuote')}
									</Button>
									<Button
										component={Link}
										href="/track"
										variant="outlined"
										size="large"
									>
										{t('trackStatus')}
									</Button>
								</Stack>
							</Stack>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Mockup
								darkImage={service.image.dark}
								lightImage={service.image.light}
								aspectRatio="600/400"
								borderRadius={24}
							/>
						</Grid>
					</Grid>
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

							<Grid container spacing={4}>
								{service.processSteps.map((step, index) => (
									<Grid size={{ xs: 12, md: 6, lg: 3 }} key={index}>
										<CustomCard>
											<CardContent sx={{ p: { xs: 3, md: 4 } }}>
												<Stack spacing={2}>
													<Box
														sx={{
															width: 60,
															height: 60,
															borderRadius: '16px',
															backgroundColor: 'accent.main',
															color: '#10101E',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}
													>
														<Typography variant="h3" component="span">
															{step.number}
														</Typography>
													</Box>
													<Typography variant="h5">{step.title}</Typography>
													<Typography color="text.secondary" variant="body2">
														{step.description}
													</Typography>
												</Stack>
											</CardContent>
										</CustomCard>
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
					<Grid container spacing={6}>
						{/* Required Documents */}
						<Grid size={{ xs: 12, lg: 6 }}>
							<CustomCard>
								<CardContent sx={{ p: { xs: 4, md: 5 } }}>
									<Stack spacing={3}>
										<Typography variant="h4">{t('requiredDocuments')}</Typography>
										<Stack spacing={2}>
											{service.requiredDocuments.map((doc, index) => (
												<Stack direction="row" spacing={2} key={index}>
													<Box sx={{ color: 'accent.main', pt: 0.5 }}>
														<IconCheck size={24} />
													</Box>
													<Typography color="text.secondary" variant="body1">
														{doc}
													</Typography>
												</Stack>
											))}
										</Stack>
										{service.pricing.note && (
											<Box
												sx={{
													mt: 2,
													p: 2,
													backgroundColor: 'background.default',
													borderRadius: 2,
												}}
											>
												<Typography variant="caption" color="text.secondary">
													<strong>Note:</strong> {service.pricing.note}
												</Typography>
											</Box>
										)}
									</Stack>
								</CardContent>
							</CustomCard>
						</Grid>

						{/* Service Features */}
						<Grid size={{ xs: 12, lg: 6 }}>
							<CustomCard
								backgroundColor={{ light: '#0E21A0', dark: '#0E21A0' }}
								borderColor={{ light: '#3949B1', dark: '#3949B1' }}
								gradientColor={{ light: '#3949B1', dark: '#3949B1' }}
								gradientOpacity={0.6}
							>
								<CardContent sx={{ p: { xs: 4, md: 5 } }}>
									<Stack spacing={3}>
									<Typography variant="h4" color="#ffffff">
										{t('whatsIncluded')}
									</Typography>
										<Stack spacing={2}>
											{service.features.map((feature, index) => (
												<Stack direction="row" spacing={2} key={index}>
													<Box sx={{ color: '#ffffff', pt: 0.5 }}>
														<IconCheck size={24} />
													</Box>
													<Typography variant="body1" color="#ffffff">
														{feature}
													</Typography>
												</Stack>
											))}
										</Stack>
									</Stack>
								</CardContent>
							</CustomCard>
						</Grid>
					</Grid>
				</RevealSection>
			</Container>

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
									<Stack spacing={2} alignItems="center" maxWidth={720}>
										<Typography variant="h3">
											{t('readyToStart')}
										</Typography>
										<Typography color="text.secondary" variant="h6">
											{t('quoteDescription')}
										</Typography>
									</Stack>
									<Stack
										direction={{ xs: 'column', sm: 'row' }}
										spacing={2}
										justifyContent="center"
									>
										<Button
											component={Link}
											href={`/services/${service.slug}/quote`}
											variant="contained"
											size="large"
										>
											{t('requestQuoteNow')}
										</Button>
										<Button
									component={Link}
									href="tel:+97022401234"
											variant="outlined"
											size="large"
										>
									{t('callUs')}
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

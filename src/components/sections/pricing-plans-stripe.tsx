'use client';
import {
	Box,
	Button,
	CardContent,
	Chip,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconCheck, IconX, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

const currency = 'ILS';

interface PricingPlan {
	title: string;
	monthlyPrice?: number | null;
	yearlyPrice?: number | null;
	includedFeatures: string[];
	excludedFeatures?: string[];
	popular?: boolean;
	stripePriceIdMonthly?: string;
	stripePriceIdYearly?: string;
	ctaLabel?: string;
	ctaHref?: string;
}

export default function PricingPlans() {
	const t = useTranslations('PricingPlans');
	
	const pricingPlans: PricingPlan[] = [
		{
			title: t('plan1Title'),
			monthlyPrice: 275,
			yearlyPrice: null,
			includedFeatures: [
				t('plan1Feature1'),
				t('plan1Feature2'),
				t('plan1Feature3'),
				t('plan1Feature4'),
				t('plan1Feature5'),
			],
			excludedFeatures: [],
			ctaLabel: t('plan1Cta'),
			ctaHref: '/services',
		},
		{
			title: t('plan2Title'),
			monthlyPrice: 520,
			yearlyPrice: null,
			includedFeatures: [
				t('plan2Feature1'),
				t('plan2Feature2'),
				t('plan2Feature3'),
				t('plan2Feature4'),
				t('plan2Feature5'),
				t('plan2Feature6'),
			],
			excludedFeatures: [],
			popular: true,
			ctaLabel: t('plan2Cta'),
			ctaHref: '/services',
		},
		{
			title: t('plan3Title'),
			monthlyPrice: 980,
			yearlyPrice: null,
			includedFeatures: [
				t('plan3Feature1'),
				t('plan3Feature2'),
				t('plan3Feature3'),
				t('plan3Feature4'),
				t('plan3Feature5'),
			],
			excludedFeatures: [],
			ctaLabel: t('plan3Cta'),
			ctaHref: '/contact',
		},
	];

	return (
		<Container id="pricing" sx={{ py: { xs: 4.5, md: 8 } }}>
			<RevealSection delay={0.1} direction="up">
				<Stack spacing={{ xs: 6, md: 8 }}>
					<Box>
						<Stack spacing={1.5} textAlign="center">
							<Typography variant="h2">{t('headline')}</Typography>
							<Typography
								color="textSecondary"
								component={'p'}
								variant="h6"
								maxWidth={800}
								sx={{ mx: 'auto' }}
							>
								{t('subHeadline')}
							</Typography>
						</Stack>
					</Box>
					<Box>
						<Grid container spacing={{ xs: 3, md: 4 }}>
							{pricingPlans.map((plan, index) => (
								<Grid key={index} size={{ xs: 12, md: 4 }}>
						<PricingPlanCard plan={plan} currency={currency} />
								</Grid>
							))}
						</Grid>
					</Box>
				</Stack>
			</RevealSection>
		</Container>
	);
}

function PricingPlanCard({
	plan,
	currency,
}: {
	plan: PricingPlan;
	currency: string;
}) {
	const t = useTranslations('PricingPlans');
	const locale = useLocale() as 'en' | 'ar';

	const formattedMonthlyPrice =
		plan.monthlyPrice !== undefined && plan.monthlyPrice !== null
			? new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency,
				currencyDisplay: 'narrowSymbol',
			}).format(plan.monthlyPrice)
			: null;

	const isCustomPlan =
		(plan.monthlyPrice === undefined || plan.monthlyPrice === null) &&
		(plan.yearlyPrice === undefined || plan.yearlyPrice === null);

	const handlePrimaryAction = () => {
		if (plan.ctaHref) {
			window.location.href = plan.ctaHref;
		}
	};

	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={36}
		>
			<CardContent
				sx={{
					p: { xs: 3, md: 4 },
					paddingBottom: { xs: '24px !important', md: '32px !important' },
				}}
			>
				<Stack spacing={{ xs: 2, md: 3 }}>
					<Stack spacing={1}>
						<Stack
							alignItems="center"
							direction="row"
							justifyContent="space-between"
							spacing={2}
						>
							<Typography variant="subtitle1">{plan.title}</Typography>
							{plan.popular && <Chip color="accent" label={t('mostPopular')} />}
						</Stack>
						<Typography variant="h3">
							{isCustomPlan && t('customQuote')}
							{!isCustomPlan && `${t('from')} ${formattedMonthlyPrice}`}
						</Typography>
						<Typography sx={{ fontWeight: 600 }} variant="body1">
							{isCustomPlan && t('contactForPricing')}
							{!isCustomPlan && t('startingPrice')}
						</Typography>
					</Stack>
					<Box
						sx={(theme) => ({
							background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
							boxShadow: theme.palette.mode === 'dark' 
								? '0px 2px 0px 0px rgba(255,255,255,0.1)' 
								: '0px 2px 0px 0px rgba(0,0,0,0.1)',
							height: 2,
						})}
					/>
					<Stack spacing={{ xs: 3, md: 5 }}>
						<Stack spacing={2}>
							{plan.includedFeatures.map((feature, index) => (
								<Stack
									alignItems="start"
									direction="row"
									key={index}
									spacing={1.5}
								>
									<Box sx={{ color: 'accent.main', pt: 0 }}>
										<IconCheck size={24} />
									</Box>
									<Typography variant="body1">{feature}</Typography>
								</Stack>
							))}
							{plan.excludedFeatures && plan.excludedFeatures.length > 0 && (
								<>
									{plan.excludedFeatures.map((feature, index) => (
										<Stack
											alignItems="start"
											direction="row"
											key={index}
											spacing={1.5}
											sx={{ opacity: 0.5 }}
										>
											<Box sx={{ color: 'disabled.main', pt: 0 }}>
												<IconX size={24} />
											</Box>
											<Typography variant="body1">{feature}</Typography>
										</Stack>
									))}
								</>
							)}
						</Stack>

						<Button
							endIcon={locale === 'ar' ? <IconArrowLeft size={24} /> : <IconArrowRight size={24} />}
							onClick={handlePrimaryAction}
						>
							{plan.ctaLabel ?? t('plan1Cta')}
						</Button>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

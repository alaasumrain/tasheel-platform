'use client';
import {
	Box,
	Button,
	CardContent,
	Chip,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { IconCheck, IconX, IconArrowRight } from '@tabler/icons-react';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

const headline = `Transparent pricing for Palestinian services`;
const subHeadline = `Clear NIS pricing for our most requested services. Government fees are billed at cost, and every quote includes a detailed breakdown.`;
const currency = 'ILS';

const pricingPlans: PricingPlan[] = [
	{
		title: 'Government Services',
		monthlyPrice: 275,
		yearlyPrice: null,
		includedFeatures: [
			`Palestinian driver&apos;s license renewal assistance`,
			`Document verification & preparation`,
			`Ministry of Interior & Transport coordination`,
			`Courier delivery included`,
			`SMS/Email updates`,
		],
		excludedFeatures: [],
		ctaLabel: 'View services',
		ctaHref: '/services',
	},
	{
		title: 'Attestation Services',
		monthlyPrice: 520,
		yearlyPrice: null,
		includedFeatures: [
			`Marriage certificate attestation`,
			`Birth certificate attestation`,
			`Degree attestation`,
			`Complete mission + MOFAE chain`,
			`Free pickup across the West Bank`,
			`Express service available`,
		],
		excludedFeatures: [],
		popular: true,
		ctaLabel: 'View services',
		ctaHref: '/services',
	},
	{
		title: 'Business Services',
		monthlyPrice: 980,
		yearlyPrice: null,
		includedFeatures: [
			`Commercial license renewal`,
			`Business registration`,
			`Corporate compliance filings`,
			`Ministry of National Economy coordination`,
			`Priority processing`,
		],
		excludedFeatures: [],
		ctaLabel: 'Contact us',
		ctaHref: '/contact',
	},
];

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
	return (
		<Container id="pricing" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Stack spacing={{ xs: 6, md: 8 }}>
					<Box>
						<Stack spacing={1.5} textAlign="center">
							<Typography variant="h2">{headline}</Typography>
							<Typography
								color="textSecondary"
								component={'p'}
								variant="h6"
								maxWidth={800}
								sx={{ mx: 'auto' }}
							>
								{subHeadline}
							</Typography>
						</Stack>
					</Box>
					<Box>
						<Grid container spacing={{ xs: 3, md: 4 }}>
							{pricingPlans.map((plan, index) => (
								<Grid key={index} xs={12} md={4}>
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
			backgroundColor={{ light: 'rgba(255, 255, 255, 0.5)', dark: '#282828' }}
			borderColor={{ light: 'rgba(255, 255, 255, 1)', dark: '#444' }}
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
							{plan.popular && <Chip color="accent" label="Most Popular" />}
						</Stack>
						<Typography variant="h3">
							{isCustomPlan && 'Custom Quote'}
							{!isCustomPlan && `From ${formattedMonthlyPrice}`}
						</Typography>
						<Typography sx={{ fontWeight: 600 }} variant="body1">
							{isCustomPlan && 'Contact for pricing'}
							{!isCustomPlan && 'Starting price'}
						</Typography>
					</Stack>
					<Box
						sx={[
							() => ({
								background: 'rgba(200, 209, 216, 1)',
								height: 2,
							}),
							(theme) =>
								theme.applyStyles('dark', {
									background: '#111',
									boxShadow: '0px 2px 0px 0px #444',
									height: 2,
								}),
						]}
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
							endIcon={<IconArrowRight size={24} />}
							onClick={handlePrimaryAction}
						>
							{plan.ctaLabel ?? 'Request Quote'}
						</Button>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

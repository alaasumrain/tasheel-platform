'use client';
import { useState } from 'react';
import {
	Box,
	Button,
	CardContent,
	Chip,
	Container,
	Stack,
	ToggleButtonGroup,
	ToggleButton,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconCheck, IconX, IconArrowRight } from '@tabler/icons-react';

import { Card } from '@/components/ui/card';

const headline = `Our Pricing`;
const subHeadline = `Tasheel offers transparent plans with built-in support.
No hidden fees, no surprises.`;
const currency = 'ILS';

const pricingPlans: PricingPlan[] = [
	{
		title: 'Essential Services',
		monthlyPrice: 275,
		yearlyPrice: 2970,
		includedFeatures: [
			`Driver's license renewal assistance`,
			`Document verification & preparation`,
			`Ministry coordination`,
		],
		excludedFeatures: [
			`Embassy legalization handling`,
			`Corporate compliance filings`,
			`24/7 priority support`,
		],
	},
	{
		title: 'Attestation Suite',
		monthlyPrice: 520,
		yearlyPrice: 5610,
		includedFeatures: [
			`Full attestation chain (mission + MOFAE)`,
			`Pickup & courier delivery`,
			`Real-time status tracking`,
			`Express turnaround options`,
		],
		excludedFeatures: [
			`Corporate compliance filings`,
			`Dedicated account manager`,
		],
		popular: true,
	},
	{
		title: 'Corporate Concierge',
		monthlyPrice: 980,
		yearlyPrice: 10580,
		includedFeatures: [
			`Commercial license renewals`,
			`Business registration & restructuring`,
			`Corporate compliance filings`,
			`Dedicated account manager`,
			`Priority government appointments`,
			`24/7 priority support`,
		],
		excludedFeatures: [],
	},
];

interface PricingPlan {
	title: string;
	monthlyPrice?: number;
	yearlyPrice?: number;
	includedFeatures: string[];
	excludedFeatures?: string[];
	popular?: boolean;
}

export default function PricingPlans() {
	const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');

	return (
		<Container id="pricing" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack spacing={{ xs: 6, md: 8 }}>
				<Box>
					<Grid container spacing={{ xs: 4, md: 4 }} alignItems="center">
						<Grid size={{ xs: 12, md: 'grow' }}>
							<Stack spacing={1.5}>
								<Typography
									sx={{ textAlign: { xs: 'center', md: 'left' } }}
									variant="h2"
								>
									{headline}
								</Typography>
								<Typography
									color="textSecondary"
									component={'p'}
									sx={{
										textAlign: { xs: 'center', md: 'left' },
										whiteSpace: 'pre-line',
									}}
									variant="h6"
								>
									{subHeadline}
								</Typography>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: "auto" }}>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent={{ xs: 'center', md: 'flex-end' }}
							>
								<ToggleButtonGroup
									exclusive
									onChange={(event, newValue) => setPlanType(newValue)}
									value={planType}
								>
									<ToggleButton value="monthly">
										<Box sx={{ px: { md: 3.25 } }}>{`Monthly`}</Box>
									</ToggleButton>
									<ToggleButton value="yearly">
										<Stack direction="row" alignItems="center" spacing={1}>
											<Box>{`Yearly`}</Box>
											<Chip color="accent" label="Save 20%" size="small" />
										</Stack>
									</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
						</Grid>
					</Grid>
				</Box>
				<Box>
					<Grid container spacing={{ xs: 3, md: 4 }}>
						{pricingPlans.map((plan, index) => (
							<Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
								<PricingPlanCard
									plan={plan}
									planType={planType}
									currency={currency}
								/>
							</Grid>
						))}
					</Grid>
				</Box>
			</Stack>
		</Container>
	);
}

function PricingPlanCard({
	plan,
	planType,
	currency,
}: {
	plan: PricingPlan;
	planType: 'monthly' | 'yearly';
	currency: string;
}) {
	const formattedMonthlyPrice =
		plan.monthlyPrice !== undefined && plan.monthlyPrice !== null
			? new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: currency,
				}).format(plan.monthlyPrice)
			: null;

	const formattedYearlyPrice =
		plan.yearlyPrice !== undefined && plan.yearlyPrice !== null
			? new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: currency,
				}).format(plan.yearlyPrice)
			: null;

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
							{plan.popular && (
								<Chip color="accent" label="Popular" variant="outlined" />
							)}
						</Stack>
						<Typography variant="h3">
							{planType === 'monthly' && <>{formattedMonthlyPrice}</>}
							{planType === 'yearly' && <>{formattedYearlyPrice}</>}
						</Typography>
						<Typography sx={{ fontWeight: 600 }} variant="body1">
							{planType === 'monthly' && <>{'Monthly'}</>}
							{planType === 'yearly' && <>{'Yearly'}</>}
						</Typography>
					</Stack>
					<Box
						sx={[
							() => ({
								background: 'rgba(200, 209, 216, 1)',
								boxShadow: 'none',
								height: 1,
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

						<Button endIcon={<IconArrowRight size={24} />}>
							{`Get Started`}
						</Button>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

'use client';

import { useEffect, useState } from 'react';

import {
	Box,
	Container,
	Stack,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCountUp } from 'use-count-up';
import { useTranslations, useLocale } from 'next-intl';

import Mockup from '@/components/ui/mockup';
import RevealSection from '@/components/ui/reveal-section';

interface Feature {
	title: string;
	content: string;
	imageDark: string;
	imageLight: string;
}

// duration to display each feature in seconds
const duration = 5;

export default function FeaturesAccordion() {
	const t = useTranslations('FeaturesAccordion');
	const locale = useLocale();
	const isRTL = locale === 'ar';
	const [activeStep, setActiveStep] = useState<number>(-1);
	const [mounted, setMounted] = useState(false);

const features: Feature[] = [
	{
		imageDark: '/dark/screenshot-01.jpg',
		imageLight: '/light/screenshot-01.jpg',
			title: t('feature1Title'),
			content: t('feature1Content'),
	},
	{
		imageDark: '/dark/screenshot-02.jpg',
		imageLight: '/light/screenshot-02.jpg',
			title: t('feature2Title'),
			content: t('feature2Content'),
	},
	{
		imageDark: '/dark/screenshot-03.jpg',
		imageLight: '/light/screenshot-03.jpg',
			title: t('feature3Title'),
			content: t('feature3Content'),
	},
	{
		imageDark: '/dark/screenshot-04.jpg',
		imageLight: '/light/screenshot-04.jpg',
			title: t('feature4Title'),
			content: t('feature4Content'),
	},
	{
		imageDark: '/dark/screenshot-05.jpg',
		imageLight: '/light/screenshot-05.jpg',
			title: t('feature5Title'),
			content: t('feature5Content'),
	},
];

	const { reset } = useCountUp({
		isCounting: true,
		duration: duration,
		start: 0,
		end: 100,
		onComplete: () => {
			const nextStep = features.length > activeStep + 1 ? activeStep + 1 : 0;
			setActiveStep(nextStep);
			reset();
		},
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Container id="features-3" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack spacing={{ xs: 4, md: 8 }}>
				<RevealSection delay={0.1} direction="up">
					<Container disableGutters sx={{ maxWidth: '560px !important' }}>
						<Stack spacing={1.5}>
							<Typography textAlign={'center'} variant="h2">
								{t('headline')}
							</Typography>
							<Typography
								color="textSecondary"
								component={'p'}
								textAlign={'center'}
								variant="h6"
							>
								{t('subHeadline')}
							</Typography>
						</Stack>
					</Container>
				</RevealSection>
				<RevealSection delay={0.3} direction="up">
					<Box>
						<Grid
							container
							direction={{ xs: 'column-reverse', md: 'row' }}
							spacing={{ xs: 3.75, md: 7.5 }}
						>
							<Grid size={{ xs: 12, md: 5 }}>
								<Box sx={{ position: 'relative', width: '100%' }}>
									<Stepper
										activeStep={activeStep}
										nonLinear
										orientation="vertical"
										sx={{
											'& .MuiStepLabel-root': {
												py: 2.5,
											},
											'& .completed': {
												'& .MuiStepLabel-iconContainer': {
													backgroundColor: 'accent.light',
												},
											},
											'& .MuiStepLabel-iconContainer': {
												backgroundColor: 'accent.light',
												borderRadius: '50vh',
												height: 20,
												[isRTL ? 'ml' : 'mr']: 2.5,
												overflow: 'hidden',
												position: 'relative',
												width: 20,
												zIndex: 1,
												'&:after': {
													backgroundColor: 'accent.main',
													content: '""',
													height: '0px',
													[isRTL ? 'right' : 'left']: 0,
													position: 'absolute',
													top: 0,
													width: 20,
												},
												'&.Mui-completed': {
													'&:after': {
														height: '20px',
													},
												},
												'&.Mui-active': {
													'&:after': {
														height: '20px',
														transition: `height 2s ease-in-out`,
													},
												},
												'& svg': {
													display: 'none',
												},
											},
											'& .MuiStepConnector-root': {
												display: 'none',
											},
											'& .MuiStepContent-root': {
												border: 'none',
												[isRTL ? 'mr' : 'ml']: 2.5,
												'&:after': {
													backgroundColor: 'accent.main',
													bottom: '100%',
													content: '""',
													[isRTL ? 'right' : 'left']: 8,
													position: 'absolute',
													top: 30,
													width: 4,
												},
												'&:before': {
													backgroundColor: 'accent.light',
													bottom: -30,
													content: '""',
													[isRTL ? 'right' : 'left']: 8,
													position: 'absolute',
													top: 30,
													width: 4,
												},
												'&.active': {
													'&:after': {
														bottom: -30,
														transition: `bottom ${duration}s ease-in-out 1s`,
													},
												},
												'&.completed': {
													'&:before': {
														backgroundColor: 'accent.main',
													},
												},
												'&.MuiStepContent-last': {
													'&:after': {
														display: 'none',
													},
													'&:before': {
														display: 'none',
													},
												},
											},
										}}
									>
										{features.map((feature, index) => (
											<Step
												key={index}
												onClick={() => {
													if (index === activeStep) {
														return;
													}
													setActiveStep(index);
													reset();
												}}
												sx={{
													position: 'relative',
													'& .MuiStepLabel-label:not(.Mui-active)': {
														cursor: 'pointer',
													},
												}}
											>
												<StepLabel
													className={`
													${index === activeStep ? 'active' : 'not-active'}
                          ${index < activeStep ? 'completed' : 'not-completed'}
												`}
												>
													<Typography color="textPrimary" variant="subtitle1">
														{feature.title}
													</Typography>
												</StepLabel>
												<StepContent
													className={`
													${index === activeStep ? 'active' : 'not-active'}
                          ${index < activeStep ? 'completed' : 'not-completed'}
												`}
												>
													<Typography
														color="textSecondary"
														variant="subtitle2"
														sx={{ whiteSpace: 'pre-line' }}
													>
														{feature.content}
													</Typography>
												</StepContent>
											</Step>
										))}
									</Stepper>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, md: 'grow' }}>
								<Stack
									sx={{
										height: { xs: 260, md: '100%' },
										position: 'relative',
										width: '100%',
									}}
								>
									{features.map((feature, index) => {
										const isSelected =
											index === activeStep ||
											(index === 0 && activeStep === -1);
										return (
											<Box
												key={feature.title}
												sx={{
													opacity: isSelected ? 1 : 0,
													position: 'absolute',
													right: 0,
													top: '50%',
													transform: 'translateY(-50%)',
													transition: `opacity 0.3s ease-in-out`,
													width: '100%',
												}}
											>
												<Mockup
													darkImage={feature.imageDark}
													lightImage={feature.imageLight}
													aspectRatio="1271/831"
													borderRadius={24}
												/>
											</Box>
										);
									})}
								</Stack>
							</Grid>
						</Grid>
					</Box>
				</RevealSection>
			</Stack>
		</Container>
	);
}

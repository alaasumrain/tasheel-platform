'use client';

import { Box, Stack, Typography, Stepper, Step, StepLabel, StepContent, Card, CardContent } from '@mui/material';
import { IconUpload, IconCheck, IconClock, IconDownload } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'motion/react';

interface HowItWorksProps {
	service?: {
		slug?: string;
		processSteps?: Array<{ number: number; title: string; description: string; icon?: React.ComponentType<any> }>;
	};
}

export function HowItWorksVisual({ service }: HowItWorksProps) {
	const t = useTranslations('Services.howItWorks');
	const locale = useLocale() as 'en' | 'ar';

	// Use service-specific steps if available, otherwise use default
	const steps = service?.processSteps || [
		{
			number: 1,
			title: locale === 'ar' ? 'اختر الخدمة' : 'Choose Service',
			description:
				locale === 'ar'
					? 'اختر الخدمة التي تحتاجها واملأ النموذج'
					: 'Select the service you need and fill out the form',
			icon: IconUpload,
		},
		{
			number: 2,
			title: locale === 'ar' ? 'رفع المستندات' : 'Upload Documents',
			description:
				locale === 'ar'
					? 'ارفع المستندات المطلوبة بشكل آمن'
					: 'Upload required documents securely',
			icon: IconCheck,
		},
		{
			number: 3,
			title: locale === 'ar' ? 'نعالج طلبك' : 'We Process',
			description:
				locale === 'ar'
					? 'نقوم بمعالجة طلبك ومتابعة التقدم'
					: 'We process your request and track progress',
			icon: IconClock,
		},
		{
			number: 4,
			title: locale === 'ar' ? 'استلم المستندات' : 'Receive Documents',
			description:
				locale === 'ar'
					? 'استلم مستنداتك المكتملة رقمياً أو جسدياً'
					: 'Receive your completed documents digitally or physically',
			icon: IconDownload,
		},
	];

	return (
		<Box sx={{ py: { xs: 4, md: 6 } }}>
			<Stack spacing={4} alignItems="center">
				<Stack spacing={1} textAlign="center">
					<Typography variant="h3" fontWeight={700}>
						{t('title') || (locale === 'ar' ? 'كيف يعمل' : 'How It Works')}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('subtitle') ||
							(locale === 'ar'
								? 'عملية بسيطة من 4 خطوات'
								: 'A simple 4-step process')}
					</Typography>
				</Stack>

				<Box sx={{ width: '100%', maxWidth: 800 }}>
					<Stepper orientation="vertical" sx={{ '& .MuiStepLabel-root': { alignItems: 'flex-start' } }}>
						{steps.map((step, index) => {
							const StepIcon = step.icon || IconUpload;
							return (
								<Step key={step.number} active={true} completed={false}>
									<StepLabel
										icon={
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: index * 0.2 }}
											>
												<Box
													sx={{
														width: 48,
														height: 48,
														borderRadius: 2,
														backgroundColor: 'primary.main',
														color: 'primary.contrastText',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<StepIcon size={24} />
												</Box>
											</motion.div>
										}
									>
										<Typography variant="h6" fontWeight={600}>
											{step.title}
										</Typography>
									</StepLabel>
									<StepContent>
										<Card sx={{ mt: 2, mb: 4 }}>
											<CardContent>
												<Typography variant="body1" color="text.secondary">
													{step.description}
												</Typography>
											</CardContent>
										</Card>
									</StepContent>
								</Step>
							);
						})}
					</Stepper>
				</Box>
			</Stack>
		</Box>
	);
}

// Timeline Component (Alternative to Stepper)
export function ProcessTimeline({ service }: HowItWorksProps) {
	const locale = useLocale() as 'en' | 'ar';

	const steps = service?.processSteps || [
		{
			number: 1,
			title: locale === 'ar' ? 'اختر الخدمة' : 'Choose Service',
			description: locale === 'ar' ? 'اختر الخدمة التي تحتاجها' : 'Select the service you need',
			icon: IconUpload,
		},
		{
			number: 2,
			title: locale === 'ar' ? 'رفع المستندات' : 'Upload Documents',
			description: locale === 'ar' ? 'ارفع المستندات المطلوبة' : 'Upload required documents',
			icon: IconCheck,
		},
		{
			number: 3,
			title: locale === 'ar' ? 'نعالج طلبك' : 'We Process',
			description: locale === 'ar' ? 'نقوم بمعالجة طلبك' : 'We process your request',
			icon: IconClock,
		},
		{
			number: 4,
			title: locale === 'ar' ? 'استلم المستندات' : 'Receive Documents',
			description: locale === 'ar' ? 'استلم مستنداتك المكتملة' : 'Receive your completed documents',
			icon: IconDownload,
		},
	];

	return (
		<Box sx={{ py: { xs: 4, md: 6 } }}>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
				{steps.map((step, index) => {
					const StepIcon = step.icon;
					return (
						<Box key={step.number} sx={{ flex: 1, position: 'relative' }}>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<Stack spacing={2} alignItems="center" textAlign="center">
									<Box
										sx={{
											width: 64,
											height: 64,
											borderRadius: '50%',
											backgroundColor: 'primary.main',
											color: 'primary.contrastText',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '1.5rem',
											fontWeight: 700,
											mb: 1,
										}}
									>
										{step.number}
									</Box>
									<Typography variant="h6" fontWeight={600}>
										{step.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{step.description}
									</Typography>
								</Stack>
							</motion.div>
							{index < steps.length - 1 && (
								<Box
									sx={{
										display: { xs: 'none', md: 'block' },
										position: 'absolute',
										top: '32px',
										left: '100%',
										width: '100%',
										height: '2px',
										backgroundColor: 'divider',
										zIndex: -1,
									}}
								/>
							)}
						</Box>
					);
				})}
			</Stack>
		</Box>
	);
}


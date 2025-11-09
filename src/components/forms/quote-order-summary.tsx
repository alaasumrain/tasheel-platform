'use client';

import {
	Box,
	Divider,
	LinearProgress,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import { IconCheck, IconFile, IconClock, IconCurrencyShekel } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

import { Card } from '@/components/ui/card';
import { CardContent } from '@mui/material';
import type { Service } from '@/data/services';

interface UploadedAttachment {
	id: string;
	storagePath: string;
	fileName: string;
	fileSize: number;
}

interface QuoteOrderSummaryProps {
	service: Service;
	activeStep: number;
	totalSteps: number;
	formData: Record<string, string>;
	uploadedAttachments: Record<string, UploadedAttachment>;
	locale: 'en' | 'ar';
}

export default function QuoteOrderSummary({
	service,
	activeStep,
	totalSteps,
	formData,
	uploadedAttachments,
	locale,
}: QuoteOrderSummaryProps) {
	const t = useTranslations('Quote.wizard');
	const theme = useTheme();
	const currencyFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		style: 'currency',
		currency: 'ILS',
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: 0,
	});

	const progress = ((activeStep + 1) / totalSteps) * 100;
	const uploadedFiles = Object.values(uploadedAttachments);

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<Box
			sx={{
				position: { xs: 'static', md: 'sticky' },
				top: { xs: 'auto', md: 100 },
				alignSelf: { xs: 'stretch', md: 'flex-start' },
			}}
		>
			<Card
				backgroundColor={{ light: '#ffffff', dark: '#181818' }}
				borderColor={{ light: '#ffffff', dark: '#444444' }}
				borderRadius={16}
				gradientColor={{ light: '#eeeeee', dark: '#262626' }}
				gradientOpacity={0.3}
			>
				<CardContent sx={{ p: 3 }}>
					<Stack spacing={3}>
						{/* Progress Indicator */}
						<Stack spacing={1.5}>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
									{t('summary.progress')}
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
									{activeStep + 1} / {totalSteps}
								</Typography>
							</Stack>
							<LinearProgress
								variant="determinate"
								value={progress}
								sx={{
									height: 8,
									borderRadius: 1,
									bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
									'& .MuiLinearProgress-bar': {
										bgcolor: 'primary.main',
										borderRadius: 1,
									},
								}}
							/>
							<Stack spacing={1}>
								{Array.from({ length: totalSteps }).map((_, index) => (
									<Stack key={index} direction="row" spacing={1.5} alignItems="center">
										<Box
											sx={{
												width: 24,
												height: 24,
												borderRadius: '50%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											bgcolor: index <= activeStep ? 'primary.main' : 'action.disabledBackground',
											color: index <= activeStep ? 'primary.contrastText' : 'text.disabled',
												fontSize: '0.75rem',
												fontWeight: 700,
											}}
										>
											{index < activeStep ? (
												<IconCheck size={14} />
											) : (
												index + 1
											)}
										</Box>
										<Typography
											variant="body2"
											sx={{
												fontSize: '0.8125rem',
												fontWeight: index === activeStep ? 700 : 500,
												color: index <= activeStep ? 'text.primary' : 'text.secondary',
											}}
										>
											{index === 0 && t('summary.step1')}
											{index === 1 && t('summary.step2')}
											{index === 2 && t('summary.step3')}
										</Typography>
									</Stack>
								))}
							</Stack>
						</Stack>

						<Divider />

						{/* Service Summary */}
						<Stack spacing={1.5}>
							<Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
								{t('summary.serviceDetails')}
							</Typography>
							<Stack spacing={1}>
								<Typography variant="body1" fontWeight={600} sx={{ fontSize: '0.9375rem' }}>
									{service.title}
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
									{service.shortDescription}
								</Typography>
								<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
									<IconClock size={16} style={{ color: theme.palette.text.secondary }} />
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
										{service.turnaroundTime}
									</Typography>
								</Stack>
								{service.pricing.type === 'fixed' && service.pricing.amount && (
									<Stack direction="row" spacing={1.5} alignItems="center">
										<IconCurrencyShekel size={16} style={{ color: theme.palette.text.secondary }} />
										<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
											{currencyFormatter.format(service.pricing.amount)}
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>

						<Divider />

						{/* Uploaded Files */}
						<Stack spacing={1.5}>
							<Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
								{t('summary.uploadedFiles')} ({uploadedFiles.length})
							</Typography>
							{uploadedFiles.length > 0 ? (
								<Stack spacing={1}>
									{uploadedFiles.map((file) => (
										<Stack key={file.id} direction="row" spacing={1.5} alignItems="center">
											<IconFile size={16} style={{ color: theme.palette.primary.main }} />
											<Stack sx={{ flex: 1, minWidth: 0 }}>
												<Typography
													variant="body2"
													sx={{
														fontSize: '0.8125rem',
														fontWeight: 500,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
													}}
												>
													{file.fileName}
												</Typography>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
													{formatFileSize(file.fileSize)}
												</Typography>
											</Stack>
										</Stack>
									))}
								</Stack>
							) : (
								<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
									{t('summary.noFilesYet')}
								</Typography>
							)}
						</Stack>

						{/* Form Data Preview */}
						{(formData.name || formData.email || formData.phone) && (
							<>
								<Divider />
								<Stack spacing={1.5}>
									<Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
										{t('summary.contactInfo')}
									</Typography>
									<Stack spacing={1}>
										{formData.name && (
											<Box>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
													{t('summary.name')}
												</Typography>
												<Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
													{formData.name}
												</Typography>
											</Box>
										)}
										{formData.email && (
											<Box>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
													{t('summary.email')}
												</Typography>
												<Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
													{formData.email}
												</Typography>
											</Box>
										)}
										{formData.phone && (
											<Box>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
													{t('summary.phone')}
												</Typography>
												<Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
													{formData.phone}
												</Typography>
											</Box>
										)}
									</Stack>
								</Stack>
							</>
						)}
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}


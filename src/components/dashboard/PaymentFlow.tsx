'use client';

import { useState } from 'react';
import {
	Box,
	Typography,
	Stack,
	Button,
	Card as MuiCard,
	CardContent,
	Alert,
	Stepper,
	Step,
	StepLabel,
	CircularProgress,
	Divider,
} from '@mui/material';
import { IconCreditCard, IconCheck, IconX } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface PaymentFlowProps {
	invoiceId: string;
	amount: number;
	currency: string;
	onPaymentSuccess?: () => void;
	onPaymentCancel?: () => void;
}

/**
 * Payment Flow Component
 * 
 * ✅ Payment Gateway Integration Ready
 * 
 * Supports:
 * - PalPay integration (production/sandbox)
 * - PayTabs integration (production/sandbox)
 * - Placeholder mode (when gateway not configured)
 * 
 * Payment Gateway Options:
 * - PalPay: https://www.palpay.ps/
 * - PayTabs: https://www.paytabs.com/
 * 
 * Configuration:
 * Set PAYMENT_GATEWAY_TYPE, PAYMENT_GATEWAY_API_KEY, PAYMENT_GATEWAY_MERCHANT_ID
 * Or set PAYMENT_USE_PLACEHOLDER=true for testing without gateway
 */

const steps = ['Review', 'Payment', 'Confirmation'];

export function PaymentFlow({
	invoiceId,
	amount,
	currency,
	onPaymentSuccess,
	onPaymentCancel,
}: PaymentFlowProps) {
	const t = useTranslations('Payment');
	const [activeStep, setActiveStep] = useState(0);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			// Last step - payment complete
			onPaymentSuccess?.();
		} else {
			setActiveStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const handlePayment = async () => {
		setProcessing(true);
		setError(null);

		try {
			// Create payment session with gateway
			const response = await fetch('/api/payment/create-session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					invoiceId,
					amount,
					currency,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create payment session');
			}

			const { paymentUrl, placeholder } = await response.json();

			// If placeholder mode, simulate payment success
			if (placeholder) {
				// Simulate payment processing delay
				await new Promise(resolve => setTimeout(resolve, 1500));
				
				// Call test-complete endpoint to mark as paid
				const completeResponse = await fetch('/api/payment/test-complete', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						invoiceId,
						amount,
						currency,
						transactionId: `PLACEHOLDER-${Date.now()}`,
						status: 'completed',
						isPlaceholder: true, // Skip auth check
					}),
				});

				if (completeResponse.ok) {
					handleNext();
				} else {
					const errorData = await completeResponse.json().catch(() => ({}));
					throw new Error(errorData.error || 'Failed to complete placeholder payment');
				}
				return;
			}

			// Redirect to payment gateway
			if (paymentUrl) {
				window.location.href = paymentUrl;
			} else {
				throw new Error('Payment URL not received');
			}
		} catch (err: any) {
			setError(err.message || t('paymentError'));
			setProcessing(false);
		}
	};

	const handleCancel = () => {
		onPaymentCancel?.();
	};

	return (
		<Card borderRadius={20}>
			<Box sx={{ p: 3 }}>
				<Typography variant="h5" fontWeight={700} gutterBottom>
					{t('title')}
				</Typography>


				{/* Stepper */}
				<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{/* Step Content */}
				{activeStep === 0 && (
					<Stack spacing={3}>
						<MuiCard>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									{t('reviewTitle')}
								</Typography>
								<Divider sx={{ my: 2 }} />
								<Stack spacing={2}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
										<Typography color="text.secondary">{t('invoiceId')}</Typography>
										<Typography fontWeight={600}>{invoiceId}</Typography>
									</Box>
									<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
										<Typography color="text.secondary">{t('amount')}</Typography>
										<Typography variant="h6" fontWeight={700}>
											{amount.toFixed(2)} {currency}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</MuiCard>

						<Stack direction="row" spacing={2} justifyContent="flex-end">
							<Button 
								onClick={handleCancel}
								size="large"
								sx={{ 
									minWidth: { xs: 100, sm: 120 },
									flex: { xs: 1, sm: 'none' },
								}}
							>
								{t('cancel')}
							</Button>
							<Button 
								variant="contained" 
								onClick={handleNext}
								size="large"
								sx={{ 
									minWidth: { xs: 100, sm: 120 },
									flex: { xs: 1, sm: 'none' },
								}}
							>
								{t('continue')}
							</Button>
						</Stack>
					</Stack>
				)}

				{activeStep === 1 && (
					<Stack spacing={3}>
						<MuiCard>
							<CardContent>
								<Stack spacing={3} alignItems="center">
									<IconCreditCard size={64} color="primary" />
									<Typography variant="h6">{t('paymentTitle')}</Typography>
									<Typography variant="body2" color="text.secondary" textAlign="center">
										{t('paymentDescription')}
									</Typography>
									<Typography variant="h4" fontWeight={700} color="primary">
										{amount.toFixed(2)} {currency}
									</Typography>

									{error && (
										<Alert severity="error" sx={{ width: '100%' }}>
											{error}
										</Alert>
									)}
								</Stack>
							</CardContent>
						</MuiCard>

						<Stack direction="row" spacing={2} justifyContent="space-between">
							<Button 
								onClick={handleBack} 
								disabled={processing}
								size="large"
								sx={{ 
									minWidth: { xs: 100, sm: 120 },
									flex: { xs: 1, sm: 'none' },
								}}
							>
								{t('back')}
							</Button>
							<Button
								variant="contained"
								onClick={handlePayment}
								disabled={processing}
								startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <IconCreditCard size={18} />}
								size="large"
								sx={{ 
									minWidth: { xs: 100, sm: 120 },
									flex: { xs: 1, sm: 'none' },
								}}
							>
								{processing ? t('processing') : t('payNow')}
							</Button>
						</Stack>
					</Stack>
				)}

				{activeStep === 2 && (
					<Stack spacing={3} alignItems="center">
						<IconCheck size={64} color="success" />
						<Typography variant="h5" fontWeight={700}>
							{t('successTitle')}
						</Typography>
						<Typography variant="body1" color="text.secondary" textAlign="center">
							{t('successDescription')}
						</Typography>
						<Button variant="contained" onClick={handleNext} size="large">
							{t('done')}
						</Button>
					</Stack>
				)}
			</Box>
		</Card>
	);
}


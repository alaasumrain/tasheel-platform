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
 * ⚠️ TESTING MODE - Payment Gateway Integration Pending
 * 
 * This component provides a complete payment flow UI for testing purposes.
 * 
 * TODO: Integrate with actual payment gateway (PalPay or PayTabs):
 * 1. Replace test flow with actual gateway redirect/iframe
 * 2. Implement webhook handler at /api/payment/webhook
 * 3. Update payment status in database after successful payment
 * 4. Send confirmation email to customer
 * 
 * Payment Gateway Options:
 * - PalPay: https://www.palpay.ps/
 * - PayTabs: https://www.paytabs.com/
 * 
 * Recommended Integration:
 * - Use server-side API route to create payment session
 * - Redirect customer to gateway payment page
 * - Handle callback/webhook to update payment status
 * - Store transaction ID and gateway response in payments table
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
			// TODO: Replace with actual payment gateway integration
			// Example flow:
			// 1. Call API to create payment session
			// const response = await fetch('/api/payment/create-session', {
			//   method: 'POST',
			//   body: JSON.stringify({ invoiceId, amount, currency })
			// });
			// const { paymentUrl } = await response.json();
			// 2. Redirect to payment gateway
			// window.location.href = paymentUrl;

			// TESTING: Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simulate success (90% of the time for testing)
			const success = Math.random() > 0.1;

			if (success) {
				// TODO: In production, this would be handled by webhook
				// Update payment status via API
				const response = await fetch('/api/payment/test-complete', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						invoiceId,
						amount,
						currency,
						transactionId: `TEST-${Date.now()}`,
						status: 'completed',
					}),
				});

				if (!response.ok) {
					throw new Error('Failed to update payment status');
				}

				handleNext();
			} else {
				throw new Error(t('paymentFailed'));
			}
		} catch (err: any) {
			setError(err.message || t('paymentError'));
		} finally {
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

				{/* Testing Notice */}
				<Alert severity="info" sx={{ mb: 3 }}>
					<strong>{t('testingMode')}</strong> {t('testingModeDescription')}
				</Alert>

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
							<Button onClick={handleCancel}>{t('cancel')}</Button>
							<Button variant="contained" onClick={handleNext}>
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
							<Button onClick={handleBack} disabled={processing}>
								{t('back')}
							</Button>
							<Button
								variant="contained"
								onClick={handlePayment}
								disabled={processing}
								startIcon={processing ? <CircularProgress size={20} /> : <IconCreditCard />}
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


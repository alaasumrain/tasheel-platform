import { Container, Stack, Typography, Button, Card, CardContent, Box, Alert } from '@mui/material';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface PageProps {
	searchParams: Promise<{ invoice?: string; transaction?: string; placeholder?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
	setRequestLocale('en');
	const t = await getTranslations('Payment.success');
	const resolvedSearchParams = await searchParams;
	const invoiceId = resolvedSearchParams?.invoice;
	const isPlaceholder = resolvedSearchParams?.placeholder === 'true';

	if (!invoiceId) {
		return (
			<Container sx={{ py: { xs: 6, md: 10 } }}>
				<Card>
					<CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
						<Stack spacing={3} alignItems="center">
							<IconX size={64} color="error" />
							<Typography variant="h5">{t('invalidRequest')}</Typography>
							<Button component={Link} href="/dashboard" variant="contained">
								{t('goToDashboard')}
							</Button>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		);
	}

	const supabase = await createClient();
	const { data: invoice } = await supabase
		.from('invoices')
		.select('*, applications(id, order_number)')
		.eq('id', invoiceId)
		.single();

	if (!invoice) {
		notFound();
	}

	const orderNumber = invoice.applications?.order_number || invoice.invoice_number;

	return (
		<Container sx={{ py: { xs: 6, md: 10 } }}>
			<Card>
				<CardContent sx={{ p: { xs: 4, md: 6 } }}>
					<Stack spacing={4} alignItems="center" textAlign="center">
						<Box
							sx={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: 80,
								height: 80,
								borderRadius: '50%',
								backgroundColor: 'rgba(76, 175, 80, 0.12)',
								color: 'success.main',
							}}
						>
							<IconCheck size={48} />
						</Box>

						<Stack spacing={2}>
							<Typography variant="h3" fontWeight={700}>
								{t('title')}
							</Typography>
							<Typography variant="h6" color="text.secondary">
								{t('description', { orderNumber })}
							</Typography>
						</Stack>

						{isPlaceholder && (
							<Alert severity="info" sx={{ width: '100%', maxWidth: 500 }}>
								<strong>{t('testingMode')}:</strong> {t('testingModeDescription')}
							</Alert>
						)}

						<Box
							sx={{
								p: 3,
								borderRadius: 2,
								bgcolor: 'background.default',
								width: '100%',
								maxWidth: 500,
							}}
						>
							<Stack spacing={2}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color="text.secondary">{t('orderNumber')}</Typography>
									<Typography fontWeight={600}>{orderNumber}</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography color="text.secondary">{t('amount')}</Typography>
									<Typography fontWeight={600}>
										{invoice.amount.toFixed(2)} {invoice.currency || 'ILS'}
									</Typography>
								</Box>
								{invoice.transaction_id && (
									<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
										<Typography color="text.secondary">{t('transactionId')}</Typography>
										<Typography fontWeight={600} sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
											{invoice.transaction_id}
										</Typography>
									</Box>
								)}
							</Stack>
						</Box>

						<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
							<Button
								component={Link}
								href={`/dashboard/requests/${invoice.applications?.id}`}
								variant="contained"
								fullWidth
								size="large"
							>
								{t('viewOrder')}
							</Button>
							<Button component={Link} href="/dashboard" variant="outlined" fullWidth size="large">
								{t('goToDashboard')}
							</Button>
						</Stack>

						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							{t('confirmationEmail')}
						</Typography>
					</Stack>
				</CardContent>
			</Card>
		</Container>
	);
}


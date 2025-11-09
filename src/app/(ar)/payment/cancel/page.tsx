import { Container, Stack, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase';

interface PageProps {
	searchParams: Promise<{ invoice?: string }>;
}

export default async function PaymentCancelPage({ searchParams }: PageProps) {
	setRequestLocale('ar');
	const t = await getTranslations('Payment.cancel');
	const resolvedSearchParams = await searchParams;
	const invoiceId = resolvedSearchParams?.invoice;

	let orderNumber: string | null = null;
	let applicationId: string | null = null;
	if (invoiceId) {
		const supabase = await createClient();
		const { data: invoice } = await supabase
			.from('invoices')
			.select('*, applications(id, order_number)')
			.eq('id', invoiceId)
			.single();
		orderNumber = invoice?.applications?.order_number || invoice?.invoice_number || null;
		applicationId = invoice?.applications?.id || null;
	}

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
								backgroundColor: 'rgba(244, 67, 54, 0.12)',
								color: 'error.main',
							}}
						>
							<IconX size={48} />
						</Box>

						<Stack spacing={2}>
							<Typography variant="h3" fontWeight={700}>
								{t('title')}
							</Typography>
							<Typography variant="h6" color="text.secondary">
								{t('description')}
							</Typography>
							{orderNumber && (
								<Typography variant="body1" color="text.secondary">
									{t('orderNumber', { orderNumber })}
								</Typography>
							)}
						</Stack>

						<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
							{applicationId && (
								<Button
									component={Link}
									href={`/dashboard/requests/${applicationId}`}
									variant="contained"
									fullWidth
									size="large"
								>
									{t('retryPayment')}
								</Button>
							)}
							<Button component={Link} href="/dashboard" variant="outlined" fullWidth size="large">
								{t('goToDashboard')}
							</Button>
						</Stack>

						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							{t('helpText')}
						</Typography>
					</Stack>
				</CardContent>
			</Card>
		</Container>
	);
}


import { Box, Container, Stack, Typography } from '@mui/material';
import { getCustomerProfile } from '@/lib/supabase/auth-helpers';
import { getCustomerInvoices } from '@/lib/admin-queries';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { CustomerInvoicesTable } from '@/components/dashboard/CustomerInvoicesTable';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function InvoicesPage() {
	setRequestLocale('en');
	const t = await getTranslations('Dashboard.invoices');
	const customer = await getCustomerProfile();

	if (!customer) {
		return null;
	}

	// Get customer's invoices (server-side filtering for security)
	const customerInvoices = await getCustomerInvoices(customer.id || customer.email || '', !customer.id);

	return (
		<Container maxWidth="lg" sx={{ direction: 'ltr' }}>
			<RevealSection delay={0.1} direction="up">
				<Stack spacing={4}>
					<Stack spacing={2} sx={{ textAlign: 'left' }}>
						<Typography variant="h4" component="h1" fontWeight={700}>
							{t('title')}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{t('description')}
						</Typography>
					</Stack>

					<Card borderRadius={20}>
						<Box sx={{ p: 3 }}>
							<CustomerInvoicesTable invoices={customerInvoices} />
						</Box>
					</Card>
				</Stack>
			</RevealSection>
		</Container>
	);
}


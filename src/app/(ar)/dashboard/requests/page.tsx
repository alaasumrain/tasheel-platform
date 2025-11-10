import { Box, Container, Stack, Typography } from '@mui/material';
import { getCustomerProfile } from '@/lib/supabase/auth-helpers';
import { getCustomerOrders } from '@/lib/admin-queries';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { CustomerRequestsTable } from '@/components/dashboard/CustomerRequestsTable';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function MyRequestsPage() {
	setRequestLocale('ar');
	const t = await getTranslations('Dashboard.requests');
	const customer = await getCustomerProfile();

	if (!customer) {
		return null;
	}

	// Get customer's orders (server-side filtering for security)
	const customerOrders = await getCustomerOrders(customer.id || customer.email, !customer.id);

	return (
		<Container maxWidth="lg">
			<RevealSection delay={0.1} direction="up">
				<Stack spacing={4}>
					<Stack spacing={2}>
						<Typography variant="h4" component="h1" fontWeight={700}>
							{t('title')}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{t('description')}
						</Typography>
					</Stack>

					<Card borderRadius={20}>
						<Box sx={{ p: 3 }}>
							<CustomerRequestsTable orders={customerOrders} />
						</Box>
					</Card>
				</Stack>
			</RevealSection>
		</Container>
	);
}


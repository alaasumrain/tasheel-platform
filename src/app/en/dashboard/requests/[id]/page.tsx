import { notFound } from 'next/navigation';
import { Box, Container, Stack, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { getCustomerProfile } from '@/lib/supabase/auth-helpers';
import { getOrderById, getOrderEvents } from '@/lib/admin-queries';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { CustomerRequestDetail } from '@/components/dashboard/CustomerRequestDetail';
import { createClient } from '@/lib/supabase/server';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function RequestDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	setRequestLocale('en');
	const t = await getTranslations('Dashboard.requestDetail.breadcrumbs');
	const { id } = await params;
	const customer = await getCustomerProfile();

	if (!customer) {
		notFound();
	}

	try {
		const supabase = await createClient();
		
		const [order, events, invoicesResult] = await Promise.all([
			getOrderById(id),
			getOrderEvents(id),
			supabase
				.from('invoices')
				.select('*')
				.eq('application_id', id)
				.order('created_at', { ascending: false }),
		]);

		if (!order) {
			notFound();
		}

		// Verify this order belongs to the customer
		if (order.applicant_email !== customer.email) {
			notFound();
		}

		// Fetch service name if service_slug exists
		let serviceName: string | undefined;
		let serviceDetails = null;
		if (order.service_slug) {
			const service = await getServiceBySlug(order.service_slug);
			if (service) {
				const legacy = convertToLegacyFormat(service, 'en');
				serviceName = legacy.title;
				serviceDetails = legacy;
			}
		}

		const invoices = invoicesResult.data || [];
		const latestInvoice = invoices[0] || null;

		return (
			<Container maxWidth="lg">
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4}>
						<Breadcrumbs sx={{ mb: 2 }}>
							<MuiLink component={Link} href="/dashboard" underline="hover" color="inherit">
								{t('dashboard')}
							</MuiLink>
							<MuiLink
								component={Link}
								href="/dashboard/requests"
								underline="hover"
								color="inherit"
							>
								{t('myRequests')}
							</MuiLink>
							<Typography color="text.primary">{order.order_number}</Typography>
						</Breadcrumbs>

						<CustomerRequestDetail
							order={order}
							events={events}
							serviceName={serviceName}
							serviceDetails={serviceDetails}
							invoice={latestInvoice}
							customerName={customer.name || order.customer_name}
							customerEmail={customer.email}
						/>
					</Stack>
				</RevealSection>
			</Container>
		);
	} catch (error) {
		console.error('Error loading request:', error);
		notFound();
	}
}


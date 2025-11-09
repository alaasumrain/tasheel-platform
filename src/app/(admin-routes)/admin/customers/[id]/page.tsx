import { notFound } from 'next/navigation';
import { Box } from '@mui/material';
import { getCustomerById, getCustomerOrders } from '@/lib/admin-queries';
import { CustomerDetailClient } from '@/components/admin/CustomerDetailClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const t = await getTranslations('Admin.customers');
	const { id } = await params;

	try {
		const [customer, orders] = await Promise.all([
			getCustomerById(id),
			getCustomerOrders(id),
		]);

		if (!customer) {
			notFound();
		}

		return (
			<Box>
				<AdminBreadcrumbs
					items={[
						{ label: 'Dashboard', href: '/admin' },
						{ label: 'Customers', href: '/admin/customers' },
						{ label: customer.name || customer.email || `Customer ${id}` },
					]}
				/>

				<CustomerDetailClient customer={customer} orders={orders} />
			</Box>
		);
	} catch (error) {
		console.error('Error loading customer:', error);
		notFound();
	}
}


import { Box } from '@mui/material';
import { FinancialDashboard } from '@/components/admin/FinancialDashboard';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getRevenueMetrics, getInvoices, getPayments } from '@/lib/admin-queries';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function FinancialsPage() {
	const t = await getTranslations('Admin.financials');
	const [metrics, invoices, payments] = await Promise.all([
		getRevenueMetrics(),
		getInvoices(),
		getPayments(),
	]);

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: t('breadcrumbs.dashboard'), href: '/admin' },
					{ label: t('breadcrumbs.financials') },
				]}
			/>
			<FinancialDashboard metrics={metrics} invoices={invoices} payments={payments} />
		</Box>
	);
}


'use client';

import { Box, Typography, Button, Stack, Tabs, Tab } from '@mui/material';
import { FileDownload as ExportIcon } from '@mui/icons-material';
import { InvoicesTable } from '@/components/admin/InvoicesTable';
import { PaymentsTable } from '@/components/admin/PaymentsTable';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { StatsCard } from '@/components/admin/StatsCard';
import { exportInvoicesToCSV, exportPaymentsToCSV } from '@/lib/utils/export';
import { useToast } from '@/components/admin/ToastProvider';
import { Invoice, Payment, RevenueMetrics } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import {
	AttachMoney as RevenueIcon,
	Receipt as InvoiceIcon,
	AccountBalanceWallet as PaymentIcon,
	PendingActions as PendingIcon,
} from '@mui/icons-material';

interface FinancialDashboardProps {
	metrics: RevenueMetrics;
	invoices: Invoice[];
	payments: Payment[];
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'ILS',
		minimumFractionDigits: 2,
	}).format(amount);
}

export function FinancialDashboard({ metrics, invoices, payments }: FinancialDashboardProps) {
	const t = useTranslations('Admin.financials');
	const { showSuccess, showError } = useToast();
	const [tabValue, setTabValue] = useState(0);

	const handleExportInvoices = () => {
		try {
			exportInvoicesToCSV(invoices);
			showSuccess(t('exportSuccess') || 'Invoices exported successfully!');
		} catch (error) {
			console.error('Error exporting invoices:', error);
			showError(t('exportError') || 'Failed to export invoices');
		}
	};

	const handleExportPayments = () => {
		try {
			exportPaymentsToCSV(payments);
			showSuccess(t('exportSuccess') || 'Payments exported successfully!');
		} catch (error) {
			console.error('Error exporting payments:', error);
			showError(t('exportError') || 'Failed to export payments');
		}
	};

	// Prepare revenue chart data (last 7 days)
	const revenueData = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - i));
		return {
			date: date.toISOString().split('T')[0],
			revenue: 0, // TODO: Calculate actual revenue per day
		};
	});

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{t('pageTitle')}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('pageDescription')}
					</Typography>
				</Box>
			</Box>

			{/* Revenue Stats Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.revenueToday') || 'Revenue Today'}
						value={formatCurrency(metrics.revenueToday)}
						icon={RevenueIcon}
						color="success"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.revenueThisMonth') || 'Revenue This Month'}
						value={formatCurrency(metrics.revenueThisMonth)}
						icon={RevenueIcon}
						color="success"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.outstandingInvoices') || 'Outstanding Invoices'}
						value={metrics.outstandingInvoices.toString()}
						icon={PendingIcon}
						color="warning"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<StatsCard
						title={t('stats.paidInvoices') || 'Paid Invoices'}
						value={metrics.paidInvoices.toString()}
						icon={PaymentIcon}
						color="success"
					/>
				</Grid>
			</Grid>

			{/* Revenue Chart */}
			<Box sx={{ mb: 4 }}>
				<RevenueChart data={revenueData} />
			</Box>

			{/* Tabs for Invoices and Payments */}
			<Box>
				<Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
					<Tab label={t('invoices') || 'Invoices'} />
					<Tab label={t('payments') || 'Payments'} />
				</Tabs>

				{tabValue === 0 && (
					<Box>
						<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="outlined"
								startIcon={<ExportIcon />}
								onClick={handleExportInvoices}
								disabled={invoices.length === 0}
							>
								{t('export') || 'Export CSV'}
							</Button>
						</Box>
						<InvoicesTable invoices={invoices} />
					</Box>
				)}

				{tabValue === 1 && (
					<Box>
						<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="outlined"
								startIcon={<ExportIcon />}
								onClick={handleExportPayments}
								disabled={payments.length === 0}
							>
								{t('export') || 'Export CSV'}
							</Button>
						</Box>
						<PaymentsTable payments={payments} />
					</Box>
				)}
			</Box>
		</Box>
	);
}


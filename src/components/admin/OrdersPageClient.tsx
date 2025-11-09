'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { FileDownload as ExportIcon } from '@mui/icons-material';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { AdminFilterChips, type FilterOption } from '@/components/admin/AdminFilterChips';
import { exportOrdersToCSV } from '@/lib/utils/export';
import { useToast } from '@/components/admin/ToastProvider';
import { Application, ApplicationStatus } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';

interface OrdersPageClientProps {
	orders: Application[];
	serviceNames?: Record<string, string>;
}

export function OrdersPageClient({ orders, serviceNames }: OrdersPageClientProps) {
	const t = useTranslations('Admin.orders');
	const { showSuccess, showError } = useToast();

	const handleExport = () => {
		try {
			exportOrdersToCSV(orders);
			showSuccess('Orders exported successfully!');
		} catch (error) {
			console.error('Error exporting orders:', error);
			showError('Failed to export orders');
		}
	};

	// Status filter options
	const statusFilters: FilterOption[] = [
		{ key: 'status', label: t('statusLabels.submitted'), value: 'submitted', color: 'info' },
		{ key: 'status', label: t('statusLabels.scoping'), value: 'scoping', color: 'primary' },
		{ key: 'status', label: t('statusLabels.quote_sent'), value: 'quote_sent', color: 'warning' },
		{ key: 'status', label: t('statusLabels.in_progress'), value: 'in_progress', color: 'primary' },
		{ key: 'status', label: t('statusLabels.review'), value: 'review', color: 'warning' },
		{ key: 'status', label: t('statusLabels.completed'), value: 'completed', color: 'success' },
		{ key: 'status', label: t('statusLabels.rejected'), value: 'rejected', color: 'error' },
	];

	return (
		<Box>
			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{t('pageTitle')}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('pageDescription')}
					</Typography>
				</Box>
				<Button
					variant="outlined"
					startIcon={<ExportIcon />}
					onClick={handleExport}
					size="large"
					disabled={orders.length === 0}
				>
					Export CSV
				</Button>
			</Box>

			{/* Search and Filters */}
			<Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<AdminSearchBar placeholder={t('searchPlaceholder') || 'Search orders by number, customer name, email, or phone...'} />
				<AdminFilterChips filters={statusFilters} showLabel={true} />
			</Box>

			<OrdersTable orders={orders} serviceNames={serviceNames} />
		</Box>
	);
}


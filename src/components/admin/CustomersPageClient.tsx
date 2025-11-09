'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { FileDownload as ExportIcon } from '@mui/icons-material';
import { CustomersTable } from '@/components/admin/CustomersTable';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { exportCustomersToCSV } from '@/lib/utils/export';
import { useToast } from '@/components/admin/ToastProvider';
import { Customer } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';

interface CustomersPageClientProps {
	customers: Customer[];
}

export function CustomersPageClient({ customers }: CustomersPageClientProps) {
	const t = useTranslations('Admin.customers');
	const { showSuccess, showError } = useToast();

	const handleExport = () => {
		try {
			exportCustomersToCSV(customers);
			showSuccess(t('exportSuccess') || 'Customers exported successfully!');
		} catch (error) {
			console.error('Error exporting customers:', error);
			showError(t('exportError') || 'Failed to export customers');
		}
	};

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
					disabled={customers.length === 0}
				>
					{t('export') || 'Export CSV'}
				</Button>
			</Box>

			{/* Search */}
			<Box sx={{ mb: 3 }}>
				<AdminSearchBar placeholder={t('searchPlaceholder') || 'Search customers by name, email, or phone...'} />
			</Box>

			<CustomersTable customers={customers} />
		</Box>
	);
}


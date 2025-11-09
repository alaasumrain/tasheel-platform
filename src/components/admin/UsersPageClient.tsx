'use client';

import { Box, Typography, Button } from '@mui/material';
import { FileDownload as ExportIcon } from '@mui/icons-material';
import { UsersTable } from '@/components/admin/UsersTable';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { AdminFilterChips, type FilterOption } from '@/components/admin/AdminFilterChips';
import { exportUsersToCSV } from '@/lib/utils/export';
import { useToast } from '@/components/admin/ToastProvider';
import { User } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';

interface UsersPageClientProps {
	users: User[];
}

export function UsersPageClient({ users }: UsersPageClientProps) {
	const t = useTranslations('Admin.users');
	const { showSuccess, showError } = useToast();

	const handleExport = () => {
		try {
			exportUsersToCSV(users);
			showSuccess('Users exported successfully!');
		} catch (error) {
			console.error('Error exporting users:', error);
			showError('Failed to export users');
		}
	};

	// Role filter options
	const roleFilters: FilterOption[] = [
		{ key: 'role', label: 'Admin', value: 'admin', color: 'error' },
		{ key: 'role', label: 'Supervisor', value: 'supervisor', color: 'warning' },
		{ key: 'role', label: 'Officer', value: 'officer', color: 'primary' },
		{ key: 'role', label: 'Intake', value: 'intake', color: 'success' },
		{ key: 'role', label: 'Auditor', value: 'auditor', color: 'default' },
	];

	// Status filter options
	const statusFilters: FilterOption[] = [
		{ key: 'is_active', label: t('active'), value: true, color: 'success' },
		{ key: 'is_active', label: t('inactive'), value: false, color: 'default' },
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
					disabled={users.length === 0}
				>
					Export CSV
				</Button>
			</Box>

			{/* Search and Filters */}
			<Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<AdminSearchBar placeholder="Search users by name or email..." />
				<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
					<AdminFilterChips filters={roleFilters} showLabel={false} />
					<AdminFilterChips filters={statusFilters} showLabel={false} />
				</Box>
			</Box>

			<UsersTable users={users} />
		</Box>
	);
}


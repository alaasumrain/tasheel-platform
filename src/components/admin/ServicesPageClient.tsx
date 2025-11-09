'use client';

import { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add as AddIcon, FileDownload as ExportIcon } from '@mui/icons-material';
import { ServicesTable } from '@/components/admin/ServicesTable';
import { ServiceCreateDialog } from '@/components/admin/ServiceCreateDialog';
import { ServiceEditSidepanel } from '@/components/admin/ServiceEditSidepanel';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { AdminFilterChips, type FilterOption } from '@/components/admin/AdminFilterChips';
import { useRouter } from 'next/navigation';
import { exportServicesToCSV } from '@/lib/utils/export';
import { useToast } from '@/components/admin/ToastProvider';

interface ServicesPageClientProps {
	services: any[];
	categories: Array<{ id: string; name: string; name_ar?: string }>;
}

export function ServicesPageClient({ services, categories }: ServicesPageClientProps) {
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editSidepanelOpen, setEditSidepanelOpen] = useState(false);
	const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

	const handleServiceCreated = () => {
		setCreateDialogOpen(false);
		showSuccess('Service created successfully!');
		router.refresh();
	};

	const handleEditService = (serviceId: string) => {
		setEditingServiceId(serviceId);
		setEditSidepanelOpen(true);
	};

	const handleServiceUpdated = () => {
		showSuccess('Service updated successfully!');
		router.refresh();
	};

	const handleExport = () => {
		try {
			exportServicesToCSV(services);
			showSuccess('Services exported successfully!');
		} catch (error) {
			console.error('Error exporting services:', error);
			showError('Failed to export services');
		}
	};

	// Filter options for chips
	const statusFilters: FilterOption[] = [
		{ key: 'is_active', label: 'Active', value: true, color: 'success' },
		{ key: 'is_active', label: 'Inactive', value: false, color: 'default' },
	];

	const featuredFilters: FilterOption[] = [
		{ key: 'is_featured', label: 'Featured', value: true, color: 'primary' },
	];

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'Services' },
				]}
			/>
			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						Services Management
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Manage all services offered on the platform
					</Typography>
				</Box>
				<Stack direction="row" spacing={2}>
					<Button
						variant="outlined"
						startIcon={<ExportIcon />}
						onClick={handleExport}
						size="large"
					>
						Export CSV
					</Button>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => setCreateDialogOpen(true)}
						size="large"
					>
						Create Service
					</Button>
				</Stack>
			</Box>

			{/* Search and Filters */}
			<Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<AdminSearchBar placeholder="Search services by name, slug, or description..." />
				<Stack direction="row" spacing={2} flexWrap="wrap">
					<AdminFilterChips filters={statusFilters} showLabel={false} />
					<AdminFilterChips filters={featuredFilters} showLabel={false} />
				</Stack>
			</Box>

			<ServicesTable services={services} categories={categories} onEdit={handleEditService} />

			<ServiceCreateDialog
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				onServiceCreated={handleServiceCreated}
				categories={categories}
			/>

			<ServiceEditSidepanel
				open={editSidepanelOpen}
				onClose={() => {
					setEditSidepanelOpen(false);
					setEditingServiceId(null);
				}}
				serviceId={editingServiceId}
				categories={categories}
				onServiceUpdated={handleServiceUpdated}
			/>
		</Box>
	);
}


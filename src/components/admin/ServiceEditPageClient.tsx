'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Typography,
	Button,
	Alert,
	CircularProgress,
} from '@mui/material';
import { Card } from '@/components/ui/card';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useToast } from '@/components/admin/ToastProvider';
import type { Service } from '@/lib/types/service';

interface ServiceEditPageClientProps {
	serviceId: string;
	initialService: Service;
	initialCategories: Array<{ id: string; name: string; name_ar?: string }>;
}

export function ServiceEditPageClient({ serviceId, initialService, initialCategories }: ServiceEditPageClientProps) {
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (formData: any) => {
		setSaving(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await fetch(`/api/admin/services/${serviceId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSuccess(true);
				showSuccess('Service updated successfully!');
				setTimeout(() => {
					router.refresh();
					router.push('/admin/services');
				}, 1500);
			} else {
				const errorData = await response.json();
				const errorMessage = errorData.error || 'Failed to update service';
				setError(errorMessage);
				showError(errorMessage);
			}
		} catch (err) {
			console.error('Error updating service:', err);
			const errorMessage = 'An error occurred while updating the service';
			setError(errorMessage);
			showError(errorMessage);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`/api/admin/services/${serviceId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				showSuccess('Service deleted successfully!');
				router.push('/admin/services');
			} else {
				const errorData = await response.json();
				const errorMessage = errorData.error || 'Failed to delete service';
				showError(errorMessage);
			}
		} catch (err) {
			console.error('Error deleting service:', err);
			showError('An error occurred while deleting the service');
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'Services', href: '/admin/services' },
					{ label: initialService.name_en || initialService.name || 'Edit Service' },
				]}
			/>

			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						Edit Service
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Update service information and settings
					</Typography>
				</Box>
				<Button variant="outlined" color="error" onClick={handleDelete} disabled={saving}>
					Delete Service
				</Button>
			</Box>

			{success && (
				<Alert severity="success" sx={{ mb: 3 }}>
					Service updated successfully! Redirecting...
				</Alert>
			)}

			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 3 }}>
					<ServiceForm
						initialData={initialService}
						onSubmit={handleSubmit}
						loading={saving}
						error={error}
						categories={initialCategories}
					/>
					<Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
						<Button variant="outlined" onClick={() => router.back()} disabled={saving}>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={(e) => {
								const form = e.currentTarget.closest('form');
								if (form) {
									form.requestSubmit();
								}
							}}
							disabled={saving}
							startIcon={saving ? <CircularProgress size={20} /> : null}
						>
							{saving ? 'Saving...' : 'Save Changes'}
						</Button>
					</Box>
				</Box>
			</Card>
		</Box>
	);
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastProvider';
import {
	Box,
	Typography,
	Button,
	Alert,
	Drawer,
	IconButton,
	CircularProgress,
	Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ServiceForm } from './ServiceForm';
import type { Service } from '@/lib/types/service';

interface ServiceEditSidepanelProps {
	open: boolean;
	onClose: () => void;
	serviceId: string | null;
	categories: Array<{ id: string; name: string; name_ar?: string }>;
	onServiceUpdated?: () => void;
}

export function ServiceEditSidepanel({
	open,
	onClose,
	serviceId,
	categories,
	onServiceUpdated,
}: ServiceEditSidepanelProps) {
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Fetch service data when sidepanel opens
	useEffect(() => {
		if (open && serviceId) {
			setLoading(true);
			setError(null);
			fetch(`/api/admin/services/${serviceId}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.error) {
						setError(data.error);
					} else {
						setService(data.service || data);
					}
				})
				.catch((err) => {
					console.error('Error fetching service:', err);
					setError('Failed to load service');
				})
				.finally(() => setLoading(false));
		} else {
			setService(null);
			setError(null);
			setSuccess(false);
		}
	}, [open, serviceId]);

	const handleSubmit = async (formData: any) => {
		if (!serviceId) return;

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
				if (onServiceUpdated) {
					onServiceUpdated();
				}
				setTimeout(() => {
					onClose();
					router.refresh();
				}, 1000);
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
		if (!serviceId || !confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`/api/admin/services/${serviceId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				showSuccess('Service deleted successfully!');
				if (onServiceUpdated) {
					onServiceUpdated();
				}
				onClose();
				router.refresh();
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
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100%', sm: 600, md: 700 },
					maxWidth: '90vw',
					zIndex: 1300, // Above the sidebar (1200)
				},
			}}
		>
			<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				{/* Header */}
				<Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Typography variant="h5" fontWeight={700}>
						Edit Service
					</Typography>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Content */}
				<Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
					{loading && (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
							<CircularProgress />
						</Box>
					)}

					{error && !loading && (
						<Alert severity="error" sx={{ mb: 3 }}>
							{error}
						</Alert>
					)}

					{success && (
						<Alert severity="success" sx={{ mb: 3 }}>
							Service updated successfully! Closing...
						</Alert>
					)}

					{service && !loading && (
						<ServiceForm
							initialData={service}
							onSubmit={handleSubmit}
							loading={saving}
							error={error}
							categories={categories}
						/>
					)}
				</Box>

				{/* Footer */}
				{service && !loading && (
					<>
						<Divider />
						<Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', gap: 2, borderTop: 1, borderColor: 'divider' }}>
							<Button variant="outlined" color="error" onClick={handleDelete} disabled={saving}>
								Delete
							</Button>
							<Box sx={{ display: 'flex', gap: 2 }}>
								<Button variant="outlined" onClick={onClose} disabled={saving}>
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
					</>
				)}
			</Box>
		</Drawer>
	);
}


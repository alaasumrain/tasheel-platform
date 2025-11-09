'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Typography,
	Button,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
} from '@mui/material';
import { Card } from '@/components/ui/card';
import { ServiceForm } from './ServiceForm';

interface ServiceCreateDialogProps {
	open: boolean;
	onClose: () => void;
	onServiceCreated?: () => void;
	categories: Array<{ id: string; name: string; name_ar?: string }>;
}

export function ServiceCreateDialog({ open, onClose, onServiceCreated, categories }: ServiceCreateDialogProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (formData: any) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/admin/services', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				if (onServiceCreated) {
					onServiceCreated();
				} else {
					router.refresh();
					onClose();
				}
			} else {
				const errorData = await response.json();
				setError(errorData.error || 'Failed to create service');
			}
		} catch (err) {
			console.error('Error creating service:', err);
			setError('An error occurred while creating the service');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={() => !loading && onClose()} maxWidth="lg" fullWidth>
			<DialogTitle>Create New Service</DialogTitle>
			<DialogContent>
				<Box sx={{ pt: 2 }}>
					<ServiceForm onSubmit={handleSubmit} loading={loading} error={error} categories={categories} />
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={onClose} disabled={loading}>
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
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{loading ? 'Creating...' : 'Create Service'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}


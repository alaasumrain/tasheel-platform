'use client';

import { useState } from 'react';
import {
	Box,
	Grid,
	Typography,
	Chip,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	TextField,
	Alert,
	Snackbar,
} from '@mui/material';
import {
	Email as EmailIcon,
	Phone as PhoneIcon,
	WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { Card } from '@/components/ui/card';
import { Application, ApplicationEvent, ApplicationStatus } from '@/lib/admin-queries';
import { services } from '@/data/services';

interface OrderDetailClientProps {
	order: Application;
	events: ApplicationEvent[];
}

interface PayloadData {
	urgency?: string;
	details?: string;
	message?: string;
}

const statusOptions: { value: ApplicationStatus; label: string }[] = [
	{ value: 'submitted', label: 'Submitted' },
	{ value: 'scoping', label: 'Scoping' },
	{ value: 'quote_sent', label: 'Quote Sent' },
	{ value: 'in_progress', label: 'In Progress' },
	{ value: 'review', label: 'In Review' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'archived', label: 'Archived' },
	{ value: 'rejected', label: 'Rejected' },
	{ value: 'cancelled', label: 'Cancelled' },
];

const statusColors: Record<ApplicationStatus, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
	draft: 'default',
	submitted: 'info',
	scoping: 'primary',
	quote_sent: 'warning',
	in_progress: 'primary',
	review: 'warning',
	completed: 'success',
	archived: 'default',
	rejected: 'error',
	cancelled: 'default',
};

function getServiceName(serviceSlug: string): string {
	const service = services.find((s) => s.slug === serviceSlug);
	return service?.title || serviceSlug;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

export function OrderDetailClient({ order, events }: OrderDetailClientProps) {
	const [status, setStatus] = useState<ApplicationStatus>(order.status);
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

	const handleStatusUpdate = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/admin/orders/${order.id}/status`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status, notes }),
			});

			if (response.ok) {
				setSnackbar({ message: 'Status updated successfully', severity: 'success' });
				setNotes('');
				// Refresh the page to show updated data
				window.location.reload();
			} else {
				setSnackbar({ message: 'Failed to update status', severity: 'error' });
			}
		} catch {
			setSnackbar({ message: 'An error occurred', severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
					<Typography variant="h4" component="h1" fontWeight={700}>
						{order.order_number || 'Order Details'}
					</Typography>
					<Chip
						label={statusOptions.find((s) => s.value === order.status)?.label}
						color={statusColors[order.status]}
					/>
				</Box>
				<Typography variant="body1" color="text.secondary">
					Submitted {formatDate(order.submitted_at)}
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Left Column */}
				<Grid xs={12} md={8}>
					{/* Customer Info */}
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Customer Information
							</Typography>

							<Grid container spacing={2} sx={{ mt: 1 }}>
								<Grid xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary">
										Name
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{order.customer_name || 'N/A'}
									</Typography>
								</Grid>
								<Grid xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary">
										Email
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{order.applicant_email}
									</Typography>
								</Grid>
								<Grid xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary">
										Phone
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{order.customer_phone || 'N/A'}
									</Typography>
								</Grid>
								<Grid xs={12} sm={6}>
									<Typography variant="caption" color="text.secondary">
										Service
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{getServiceName(order.service_slug)}
									</Typography>
								</Grid>
							</Grid>

							{/* Contact Actions */}
							<Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
								<Button
									variant="outlined"
									size="small"
									startIcon={<EmailIcon />}
									component="a"
									href={`mailto:${order.applicant_email}`}
								>
									Email
								</Button>
								{order.customer_phone && (
									<>
										<Button
											variant="outlined"
											size="small"
											startIcon={<PhoneIcon />}
											component="a"
											href={`tel:${order.customer_phone}`}
										>
											Call
										</Button>
										<Button
											variant="outlined"
											size="small"
											startIcon={<WhatsAppIcon />}
											component="a"
											href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
											target="_blank"
										>
											WhatsApp
										</Button>
									</>
								)}
							</Box>
						</Box>
					</Card>

					{/* Order Details */}
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3, mt: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Order Details
							</Typography>

							<Box sx={{ mt: 2 }}>
								{order.payload && typeof order.payload === 'object' && (() => {
									const payloadData = order.payload as PayloadData;
									return (
										<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
											{payloadData.urgency && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														Urgency
													</Typography>
													<Typography variant="body1">
														{payloadData.urgency}
													</Typography>
												</Box>
											)}
											{payloadData.details && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														Details
													</Typography>
													<Typography variant="body1">
														{payloadData.details}
													</Typography>
												</Box>
											)}
											{payloadData.message && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														Customer Notes
													</Typography>
													<Typography variant="body1">
														{payloadData.message}
													</Typography>
												</Box>
											)}
										</Box>
									);
								})()}
							</Box>
						</Box>
					</Card>

					{/* Timeline */}
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3, mt: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Timeline
							</Typography>

							<Box sx={{ mt: 2 }}>
								{events.length === 0 ? (
									<Typography variant="body2" color="text.secondary">
										No events yet
									</Typography>
								) : (
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
										{events.map((event) => (
											<Box
												key={event.id}
												sx={{
													p: 2,
													bgcolor: 'background.default',
													borderRadius: 2,
												}}
											>
												<Typography variant="body2" fontWeight={600}>
													{event.event_type.replace(/_/g, ' ').toUpperCase()}
												</Typography>
												{event.notes && (
													<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
														{event.notes}
													</Typography>
												)}
												<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
													{formatDate(event.created_at)}
												</Typography>
											</Box>
										))}
									</Box>
								)}
							</Box>
						</Box>
					</Card>
				</Grid>

				{/* Right Column - Status Update */}
				<Grid xs={12} md={4}>
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								Update Status
							</Typography>

							<FormControl fullWidth sx={{ mt: 2 }}>
								<InputLabel>Status</InputLabel>
								<Select
									value={status}
									label="Status"
									onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
								>
									{statusOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<TextField
								fullWidth
								multiline
								rows={4}
								label="Notes (optional)"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								sx={{ mt: 2 }}
								placeholder="Add notes about this status update..."
							/>

							<Button
								fullWidth
								variant="contained"
								size="large"
								onClick={handleStatusUpdate}
								disabled={loading || status === order.status}
								sx={{ mt: 2 }}
							>
								{loading ? 'Updating...' : 'Update Status'}
							</Button>

							{status !== order.status && (
								<Alert severity="info" sx={{ mt: 2 }}>
									Customer will be notified via email about this status change
								</Alert>
							)}
						</Box>
					</Card>
				</Grid>
			</Grid>

			<Snackbar
				open={Boolean(snackbar)}
				autoHideDuration={6000}
				onClose={() => setSnackbar(null)}
			>
				<Alert
					onClose={() => setSnackbar(null)}
					severity={snackbar?.severity}
					sx={{ width: '100%' }}
				>
					{snackbar?.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}

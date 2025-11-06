'use client';

import { useState, useEffect } from 'react';
import {
	Box,
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
	Stack,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	Email as EmailIcon,
	Phone as PhoneIcon,
	WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { Card } from '@/components/ui/card';
import { Application, ApplicationEvent, ApplicationStatus, User } from '@/lib/admin-queries';
import { QuoteCreationCard } from './QuoteCreationCard';
import { InvoiceCreationCard } from './InvoiceCreationCard';
import { useTranslations } from 'next-intl';

interface OrderDetailClientProps {
	order: Application;
	events: ApplicationEvent[];
	serviceName?: string;
}

interface PayloadData {
	urgency?: string;
	details?: string;
	message?: string;
}


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

export function OrderDetailClient({ order, events, serviceName }: OrderDetailClientProps) {
	const [status, setStatus] = useState<ApplicationStatus>(order.status);
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
	const [assignedTo, setAssignedTo] = useState<string | null>(order.assigned_to);
	const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
	const [assignmentLoading, setAssignmentLoading] = useState(false);
	const t = useTranslations('Admin.orders');

	// Fetch assignable users
	useEffect(() => {
		async function loadUsers() {
			try {
				const response = await fetch('/api/admin/users/assignable');
				if (response.ok) {
					const users = await response.json();
					setAssignableUsers(users);
				}
			} catch (error) {
				console.error('Error loading assignable users:', error);
			}
		}
		loadUsers();
	}, []);

	const statusOptions: { value: ApplicationStatus; label: string }[] = [
		{ value: 'submitted', label: t('statusLabels.submitted') },
		{ value: 'scoping', label: t('statusLabels.scoping') },
		{ value: 'quote_sent', label: t('statusLabels.quote_sent') },
		{ value: 'in_progress', label: t('statusLabels.in_progress') },
		{ value: 'review', label: t('statusLabels.review') },
		{ value: 'completed', label: t('statusLabels.completed') },
		{ value: 'archived', label: t('statusLabels.archived') },
		{ value: 'rejected', label: t('statusLabels.rejected') },
		{ value: 'cancelled', label: t('statusLabels.cancelled') },
	];

	const handleStatusUpdate = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/admin/orders/${order.id}/status`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status, notes }),
			});

			if (response.ok) {
				setSnackbar({ message: t('statusUpdated'), severity: 'success' });
				setNotes('');
				// Refresh the page to show updated data
				window.location.reload();
			} else {
				setSnackbar({ message: t('statusUpdateFailed'), severity: 'error' });
			}
		} catch {
			setSnackbar({ message: t('errorOccurred'), severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	const handleAssignmentUpdate = async () => {
		setAssignmentLoading(true);
		try {
			const response = await fetch(`/api/admin/orders/${order.id}/assign`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: assignedTo }),
			});

			if (response.ok) {
				setSnackbar({
					message: assignedTo ? 'Order assigned successfully' : 'Assignment removed successfully',
					severity: 'success'
				});
				// Refresh the page to show updated data
				window.location.reload();
			} else {
				setSnackbar({ message: 'Failed to update assignment', severity: 'error' });
			}
		} catch {
			setSnackbar({ message: t('errorOccurred'), severity: 'error' });
		} finally {
			setAssignmentLoading(false);
		}
	};

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
					<Typography variant="h4" component="h1" fontWeight={700}>
						{order.order_number || t('orderDetails')}
					</Typography>
					<Chip
						label={statusOptions.find((s) => s.value === order.status)?.label}
						color={statusColors[order.status]}
					/>
				</Box>
				<Typography variant="body1" color="text.secondary">
					{t('submitted')} {formatDate(order.submitted_at)}
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Left Column */}
				<Grid size={{ xs: 12, md: 8 }}>
					{/* Customer Info */}
					<Card
						backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
						borderColor={{ light: '#e0e0e0', dark: '#333333' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('customerInformation')}
							</Typography>

							<Grid container spacing={2} sx={{ mt: 1 }}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<Typography variant="caption" color="text.secondary">
										{t('name')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{order.customer_name || 'N/A'}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<Typography variant="caption" color="text.secondary">
										{t('email')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{order.applicant_email}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<Typography variant="caption" color="text.secondary">
										{t('phone')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{order.customer_phone || 'N/A'}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<Typography variant="caption" color="text.secondary">
										{t('service')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{serviceName || order.service_slug || 'N/A'}
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
									{t('email')}
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
											{t('call')}
										</Button>
										<Button
											variant="outlined"
											size="small"
											startIcon={<WhatsAppIcon />}
											component="a"
											href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
											target="_blank"
										>
											{t('whatsapp')}
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
								{t('orderDetailsTitle')}
							</Typography>

							<Box sx={{ mt: 2 }}>
								{order.payload && typeof order.payload === 'object' && (() => {
									const payloadData = order.payload as PayloadData;
									return (
										<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
											{payloadData.urgency && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														{t('urgency')}
													</Typography>
													<Typography variant="body1">
														{payloadData.urgency}
													</Typography>
												</Box>
											)}
											{payloadData.details && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														{t('details')}
													</Typography>
													<Typography variant="body1">
														{payloadData.details}
													</Typography>
												</Box>
											)}
											{payloadData.message && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														{t('customerNotes')}
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
								{t('timeline')}
							</Typography>

							<Box sx={{ mt: 2 }}>
								{events.length === 0 ? (
									<Typography variant="body2" color="text.secondary">
										{t('noEvents')}
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
													{t(`eventTypes.${event.event_type}` as any, { defaultValue: event.event_type.replace(/_/g, ' ').toUpperCase() })}
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

				{/* Right Column - Actions */}
				<Grid size={{ xs: 12, md: 4 }}>
					<Stack spacing={3}>
						{/* Status Update */}
						<Card
							backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
							borderColor={{ light: '#e0e0e0', dark: '#333333' }}
							borderRadius={20}
						>
							<Box sx={{ p: 3 }}>
								<Typography variant="h6" fontWeight={600} gutterBottom>
									{t('updateStatus')}
								</Typography>

								<FormControl fullWidth sx={{ mt: 2 }}>
									<InputLabel>{t('status')}</InputLabel>
									<Select
										value={status}
										label={t('status')}
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
									label={t('notesOptional')}
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									sx={{ mt: 2 }}
									placeholder={t('notesPlaceholder')}
								/>

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handleStatusUpdate}
									disabled={loading || status === order.status}
									sx={{ mt: 2 }}
								>
									{loading ? t('updating') : t('updateStatusButton')}
								</Button>

								{status !== order.status && (
									<Alert severity="info" sx={{ mt: 2 }}>
										{t('statusUpdateNotification')}
									</Alert>
								)}
							</Box>
						</Card>

						{/* Order Assignment */}
						<Card
							backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
							borderColor={{ light: '#e0e0e0', dark: '#333333' }}
							borderRadius={20}
						>
							<Box sx={{ p: 3 }}>
								<Typography variant="h6" fontWeight={600} gutterBottom>
									Assign Order
								</Typography>

								<FormControl fullWidth sx={{ mt: 2 }}>
									<InputLabel>Assigned To</InputLabel>
									<Select
										value={assignedTo || ''}
										label="Assigned To"
										onChange={(e) => setAssignedTo(e.target.value || null)}
									>
										<MenuItem value="">
											<em>Unassigned</em>
										</MenuItem>
										{assignableUsers.map((user) => (
											<MenuItem key={user.id} value={user.id}>
												{user.name || user.email} ({user.role})
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handleAssignmentUpdate}
									disabled={assignmentLoading || assignedTo === order.assigned_to}
									sx={{ mt: 2 }}
								>
									{assignmentLoading ? 'Updating...' : 'Update Assignment'}
								</Button>

								{assignedTo !== order.assigned_to && (
									<Alert severity="info" sx={{ mt: 2 }}>
										Click "Update Assignment" to save changes
									</Alert>
								)}
							</Box>
						</Card>

						{/* Quote Creation */}
						<QuoteCreationCard orderId={order.id} customerEmail={order.applicant_email} />

						{/* Invoice Creation */}
						<InvoiceCreationCard orderId={order.id} applicationId={order.id} />
					</Stack>
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

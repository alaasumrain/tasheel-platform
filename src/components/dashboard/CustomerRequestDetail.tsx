'use client';

import { useState } from 'react';
import {
	Box,
	Typography,
	Chip,
	Stack,
	Card as MuiCard,
	CardContent,
	Divider,
	Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Card } from '@/components/ui/card';
import { Application, ApplicationEvent } from '@/lib/admin-queries';
import type { LegacyService } from '@/lib/types/service';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';
import { InvoicePDF } from './InvoicePDF';
import { PaymentFlow } from './PaymentFlow';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { useTranslations } from 'next-intl';

interface Invoice {
	id: string;
	invoice_number: string;
	amount: number;
	currency: string;
	status: string;
	created_at: string;
	application_id: string;
}

interface CustomerRequestDetailProps {
	order: Application;
	events: ApplicationEvent[];
	serviceName?: string;
	serviceDetails?: LegacyService | null;
	invoice?: Invoice | null;
	customerName?: string;
	customerEmail?: string;
}

const statusColors: Record<
	Application['status'],
	'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
> = {
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

export function CustomerRequestDetail({
	order,
	events,
	serviceName,
	serviceDetails,
	invoice,
	customerName,
	customerEmail,
}: CustomerRequestDetailProps) {
	const [showPayment, setShowPayment] = useState(false);
	const [fileUploadKey, setFileUploadKey] = useState(0);
	const t = useTranslations('Dashboard.requestDetail');

	const handleFileUploadComplete = () => {
		setFileUploadKey((prev) => prev + 1); // Refresh file list
	};

	return (
		<Stack spacing={3}>
			{/* Header */}
			<Card borderRadius={20}>
				<Box sx={{ p: 3 }}>
					<Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
						<Box>
							<Typography variant="h4" component="h1" fontWeight={700}>
								{order.order_number || t('requestDetails')}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
								{t('submitted')} {formatDate(order.submitted_at)}
							</Typography>
						</Box>
						<Chip
							label={t(`statusLabels.${order.status}` as any, { defaultValue: order.status })}
							color={statusColors[order.status]}
							size="medium"
						/>
					</Stack>
				</Box>
			</Card>

			{/* Payment Flow (if showing) */}
			{showPayment && invoice && (
				<PaymentFlow
					invoiceId={invoice.id}
					amount={invoice.amount}
					currency={invoice.currency}
					onPaymentSuccess={() => {
						setShowPayment(false);
						window.location.reload(); // Refresh to show updated status
					}}
					onPaymentCancel={() => setShowPayment(false)}
				/>
			)}

			<Grid container spacing={3}>
				{/* Left Column */}
				<Grid size={{ xs: 12, md: 8 }}>
					{/* Service Details */}
					<Card borderRadius={20}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('serviceDetails')}
							</Typography>
							<Stack spacing={2} sx={{ mt: 2 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('service')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{serviceName || order.service_slug || 'N/A'}
									</Typography>
								</Box>
								{serviceDetails && (
									<Box>
										<Typography variant="caption" color="text.secondary">
											{t('description')}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{serviceDetails.shortDescription}
										</Typography>
									</Box>
								)}
							</Stack>
						</Box>
					</Card>

					{/* Order Information */}
					<Box sx={{ mt: 3 }}>
						<Card borderRadius={20}>
							<Box sx={{ p: 3 }}>
								<Typography variant="h6" fontWeight={600} gutterBottom>
									{t('requestInformation')}
								</Typography>
								<Stack spacing={2} sx={{ mt: 2 }}>
									{order.payload && typeof order.payload === 'object' && (
										<>
											{(order.payload as any).urgency && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														{t('urgency')}
													</Typography>
													<Typography variant="body1">
														{(order.payload as any).urgency}
													</Typography>
												</Box>
											)}
											{(order.payload as any).message && (
												<Box>
													<Typography variant="caption" color="text.secondary">
														{t('yourNotes')}
													</Typography>
													<Typography variant="body1">
														{(order.payload as any).message}
													</Typography>
												</Box>
											)}
										</>
									)}
								</Stack>
							</Box>
						</Card>
					</Box>

					{/* File Upload */}
					<Box sx={{ mt: 3 }}>
						<FileUpload
							key={fileUploadKey}
							applicationId={order.id}
							onUploadComplete={handleFileUploadComplete}
						/>
					</Box>

					{/* File List */}
					<Box sx={{ mt: 3 }}>
						<FileList
							key={fileUploadKey}
							applicationId={order.id}
							canDelete={true}
							onFileDeleted={handleFileUploadComplete}
						/>
					</Box>

					{/* Timeline */}
					<Box sx={{ mt: 3 }}>
						<Card borderRadius={20}>
							<Box sx={{ p: 3 }}>
								<Typography variant="h6" fontWeight={600} gutterBottom>
									{t('statusTimeline')}
								</Typography>
								<Stack spacing={2} sx={{ mt: 2 }}>
									{events.length === 0 ? (
										<Typography variant="body2" color="text.secondary">
											{t('noUpdatesYet')}
										</Typography>
									) : (
										events.map((event, index) => (
											<Box key={event.id}>
												<Stack direction="row" spacing={2} alignItems="flex-start">
													<Box
														sx={{
															width: 8,
															height: 8,
															borderRadius: '50%',
															bgcolor: 'primary.main',
															mt: 0.5,
														}}
													/>
													<Box sx={{ flex: 1 }}>
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
												</Stack>
												{index < events.length - 1 && <Divider sx={{ mt: 2 }} />}
											</Box>
										))
									)}
								</Stack>
							</Box>
						</Card>
					</Box>
				</Grid>

				{/* Right Column */}
				<Grid size={{ xs: 12, md: 4 }}>
					<Card borderRadius={20}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('contactInformation')}
							</Typography>
							<Stack spacing={2} sx={{ mt: 2 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('name')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{customerName || order.customer_name || 'N/A'}
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('email')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{customerEmail || order.applicant_email}
									</Typography>
								</Box>
								{order.customer_phone && (
									<Box>
										<Typography variant="caption" color="text.secondary">
											{t('phone')}
										</Typography>
										<Typography variant="body1" fontWeight={500}>
											{order.customer_phone}
										</Typography>
									</Box>
								)}
							</Stack>
						</Box>
					</Card>

					{/* Invoice Section */}
					{invoice && (
						<Box sx={{ mt: 3 }}>
							<Card borderRadius={20}>
								<Box sx={{ p: 3 }}>
									<Typography variant="h6" fontWeight={600} gutterBottom>
									{t('invoice')}
								</Typography>
								<Stack spacing={2} sx={{ mt: 2 }}>
									<Box>
										<Typography variant="caption" color="text.secondary">
											{t('invoiceNumber')}
										</Typography>
										<Typography variant="body1" fontWeight={500}>
											{invoice.invoice_number}
										</Typography>
									</Box>
									<Box>
										<Typography variant="caption" color="text.secondary">
											{t('amount')}
										</Typography>
										<Typography variant="h6" fontWeight={700} color="primary">
											{invoice.amount.toFixed(2)} {invoice.currency}
										</Typography>
									</Box>
									<Box>
										<Chip
											label={invoice.status.toUpperCase()}
											color={
												invoice.status === 'paid'
													? 'success'
													: invoice.status === 'pending'
														? 'warning'
														: 'default'
											}
											size="small"
										/>
									</Box>
									<Divider />
									<Stack spacing={1}>
										<InvoicePDF
											invoice={invoice}
											customerName={customerName}
											customerEmail={customerEmail}
											serviceName={serviceName}
										/>
										{invoice.status === 'pending' && (
											<Button
												variant="contained"
												color="primary"
												fullWidth
												onClick={() => setShowPayment(true)}
											>
												{t('payNow')}
											</Button>
										)}
									</Stack>
								</Stack>
								</Box>
							</Card>
						</Box>
					)}

					{/* Contact Support */}
					<Box sx={{ mt: 3 }}>
						<Card borderRadius={20}>
							<Box sx={{ p: 3 }}>
								<Typography variant="h6" fontWeight={600} gutterBottom>
									{t('needHelp')}
								</Typography>
								<Stack spacing={2} sx={{ mt: 2 }}>
									<WhatsAppButton
										phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+970592345678'}
										message={t('whatsappMessage', { orderNumber: order.order_number || '' })}
										variant="button"
										fullWidth
									/>
								</Stack>
							</Box>
						</Card>
					</Box>
				</Grid>
			</Grid>
		</Stack>
	);
}


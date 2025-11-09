'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Typography,
	Chip,
	Button,
	Stack,
	Divider,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	Email as EmailIcon,
	Phone as PhoneIcon,
	WhatsApp as WhatsAppIcon,
	ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Card as UICard } from '@/components/ui/card';
import { Customer, Application, ApplicationStatus } from '@/lib/admin-queries';
import { useTranslations, useLocale } from 'next-intl';

interface CustomerDetailClientProps {
	customer: Customer;
	orders: Application[];
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

function formatDate(dateString: string, locale: string = 'en'): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

export function CustomerDetailClient({ customer, orders }: CustomerDetailClientProps) {
	const router = useRouter();
	const t = useTranslations('Admin.customers');
	const locale = useLocale() as 'en' | 'ar';

	const handleViewOrder = (orderId: string) => {
		router.push(`/admin/orders/${orderId}`);
	};

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.push('/admin/customers')}
						sx={{ mb: 2 }}
					>
						{t('back') || 'Back to Customers'}
					</Button>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{customer.name || customer.email}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('customerDetails') || 'Customer information and order history'}
					</Typography>
				</Box>
			</Box>

			<Grid container spacing={3}>
				{/* Customer Information */}
				<Grid size={{ xs: 12, md: 4 }}>
					<UICard
						backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
						borderColor={{ light: 'divider', dark: 'divider' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('information') || 'Customer Information'}
							</Typography>
							<Divider sx={{ my: 2 }} />
							<Stack spacing={2}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('email') || 'Email'}
									</Typography>
									<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
										<EmailIcon fontSize="small" color="action" />
										<Typography variant="body2">{customer.email}</Typography>
									</Stack>
								</Box>
								{customer.phone && (
									<Box>
										<Typography variant="caption" color="text.secondary">
											{t('phone') || 'Phone'}
										</Typography>
										<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
											<PhoneIcon fontSize="small" color="action" />
											<Typography variant="body2">{customer.phone}</Typography>
										</Stack>
									</Box>
								)}
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('language') || 'Language Preference'}
									</Typography>
									<Box sx={{ mt: 0.5 }}>
										<Chip
											label={customer.language_preference === 'ar' ? 'العربية' : 'English'}
											size="small"
											color={customer.language_preference === 'ar' ? 'primary' : 'default'}
										/>
									</Box>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('memberSince') || 'Member Since'}
									</Typography>
									<Typography variant="body2" sx={{ mt: 0.5 }}>
										{formatDate(customer.created_at, locale)}
									</Typography>
								</Box>
								<Divider />
								<Stack direction="row" spacing={1}>
									<Button
										variant="outlined"
										size="small"
										startIcon={<EmailIcon />}
										href={`mailto:${customer.email}`}
									>
										{t('email') || 'Email'}
									</Button>
									{customer.phone && (
										<Button
											variant="outlined"
											size="small"
											startIcon={<WhatsAppIcon />}
											href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
											target="_blank"
										>
											{t('whatsapp') || 'WhatsApp'}
										</Button>
									)}
								</Stack>
							</Stack>
						</Box>
					</UICard>
				</Grid>

				{/* Order History */}
				<Grid size={{ xs: 12, md: 8 }}>
					<UICard
						backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
						borderColor={{ light: 'divider', dark: 'divider' }}
						borderRadius={20}
					>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('orderHistory') || 'Order History'} ({orders.length})
							</Typography>
							<Divider sx={{ my: 2 }} />
							{orders.length === 0 ? (
								<Box sx={{ py: 4, textAlign: 'center' }}>
									<Typography variant="body2" color="text.secondary">
										{t('noOrders') || 'No orders found for this customer'}
									</Typography>
								</Box>
							) : (
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>{t('table.orderNumber') || 'Order Number'}</TableCell>
												<TableCell>{t('table.service') || 'Service'}</TableCell>
												<TableCell>{t('table.status') || 'Status'}</TableCell>
												<TableCell>{t('table.submitted') || 'Submitted'}</TableCell>
												<TableCell align="right">{t('table.actions') || 'Actions'}</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{orders.map((order) => (
												<TableRow key={order.id} hover>
													<TableCell>
														<Typography variant="body2" fontWeight={600}>
															{order.order_number}
														</Typography>
													</TableCell>
													<TableCell>
														<Typography variant="body2">
															{order.service_slug || 'N/A'}
														</Typography>
													</TableCell>
													<TableCell>
														<Chip
															label={order.status}
															color={statusColors[order.status]}
															size="small"
														/>
													</TableCell>
													<TableCell>
														<Typography variant="body2" color="text.secondary">
															{formatDate(order.submitted_at, locale)}
														</Typography>
													</TableCell>
													<TableCell align="right">
														<Button
															variant="outlined"
															size="small"
															onClick={() => handleViewOrder(order.id)}
														>
															{t('view') || 'View'}
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</Box>
					</UICard>
				</Grid>
			</Grid>
		</Box>
	);
}


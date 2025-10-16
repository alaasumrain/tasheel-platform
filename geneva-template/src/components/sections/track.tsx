'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	Box,
	Button,
	Container,
	Grid,
	Stack,
	TextField,
	Typography,
	Chip,
	Alert,
} from '@mui/material';
import { IconSearch, IconCheck, IconClock } from '@tabler/icons-react';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { trackOrder } from '@/app/actions/track-order';
import type { Application, ApplicationEvent } from '@/lib/admin-queries';

const tagline = `Track your request`;
const headline = `Check the status of your order`;
const description = `Enter your order number below to track your request in real-time. You'll see the current status and estimated completion date.`;

const statusLabels: Record<string, string> = {
	draft: 'Draft',
	submitted: 'Order Received',
	scoping: 'Under Review',
	quote_sent: 'Quote Sent',
	in_progress: 'In Progress',
	review: 'Quality Review',
	completed: 'Completed',
	archived: 'Archived',
	rejected: 'Rejected',
	cancelled: 'Cancelled',
};

const statusColors: Record<string, string> = {
	draft: '#9E9E9E',
	submitted: '#2196F3',
	scoping: '#FF9800',
	quote_sent: '#9C27B0',
	in_progress: '#FFC107',
	review: '#00BCD4',
	completed: '#4CAF50',
	archived: '#607D8B',
	rejected: '#F44336',
	cancelled: '#757575',
};

export default function Track() {
	const searchParams = useSearchParams();
	const [orderNumber, setOrderNumber] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [orderData, setOrderData] = useState<{
		order: Application;
		events: ApplicationEvent[];
		service: { title: string; category: string } | null;
	} | null>(null);

	const handleTrack = useCallback(
		async (orderNum?: string) => {
			const numToTrack = orderNum || orderNumber;
			if (!numToTrack.trim()) {
				setError('Please enter an order number');
				return;
			}

			setLoading(true);
			setError('');
			setOrderData(null);

			const result = await trackOrder(numToTrack.trim());

			if (result.type === 'error') {
				setError(result.message);
				setOrderData(null);
			} else {
				setOrderData(result.data);
				setError('');
			}

			setLoading(false);
		},
		[orderNumber],
	);

	// Auto-load if order param in URL
	useEffect(() => {
		const orderParam = searchParams.get('order');
		if (orderParam) {
			setOrderNumber(orderParam);
			void handleTrack(orderParam);
		}
	}, [searchParams, handleTrack]);

	return (
		<Container sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 3.25, md: 7.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Grid
					alignItems={{ md: 'center' }}
					container
					spacing={{ xs: 4, md: 8 }}
					sx={{ minHeight: { md: '60vh' } }}
				>
					<Grid size={{ xs: 12, md: 10, lg: 8 }} offset={{ md: 1, lg: 2 }}>
						<Stack spacing={{ xs: 4, md: 6 }}>
							<Stack spacing={2.5} sx={{ textAlign: 'center' }}>
								<Typography color="accent" variant="h5">
									{tagline}
								</Typography>
								<Typography variant="h2">{headline}</Typography>
								<Typography color="textSecondary" sx={{ whiteSpace: 'pre-line' }}>
									{description}
								</Typography>
							</Stack>

							<RevealSection delay={0.3} direction="up">
								<Card
									backgroundColor={{ light: 'rgba(255,255,255,0.8)', dark: '#1F1F2B' }}
									borderColor={{ light: '#fff', dark: '#2F2F3B' }}
									borderRadius={24}
								>
									<Box sx={{ p: { xs: 3, md: 4 } }}>
										<Stack spacing={3}>
											<TextField
												fullWidth
												label="Order Number"
												placeholder="Enter your order number (e.g., TS-12345)"
												value={orderNumber}
												onChange={(e) => setOrderNumber(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === 'Enter') {
														handleTrack();
													}
												}}
												error={!!error}
												sx={{
													'& .MuiOutlinedInput-root': {
														borderRadius: '12px',
													},
												}}
											/>
											<Button
												fullWidth
												size="large"
												startIcon={<IconSearch size={20} />}
												onClick={() => handleTrack()}
												disabled={loading}
												sx={{
													borderRadius: '12px',
													py: 1.5,
												}}
											>
												{loading ? 'Searching...' : 'Track Order'}
											</Button>

											{error && (
												<Alert severity="error" sx={{ borderRadius: '12px' }}>
													{error}
												</Alert>
											)}
										</Stack>

										{orderData && (
											<RevealSection delay={0.2} direction="up">
												<Box sx={{ mt: 4 }}>
													<Card
														backgroundColor={{ light: '#F8F9FF', dark: '#16161F' }}
														borderColor={{ light: '#E8EAFF', dark: '#25253F' }}
														borderRadius={16}
													>
														<Box sx={{ p: 3 }}>
															<Stack spacing={3}>
																{/* Order Header */}
																<Stack spacing={2}>
																	<Stack
																		direction="row"
																		justifyContent="space-between"
																		alignItems="flex-start"
																		flexWrap="wrap"
																		gap={2}
																	>
																		<Stack spacing={1}>
																			<Typography variant="h5" fontWeight={700}>
																				Order #{orderData.order.order_number}
																			</Typography>
																			{orderData.service && (
																				<Typography variant="body2" color="textSecondary">
																					{orderData.service.title}
																				</Typography>
																			)}
																		</Stack>
																		<Chip
																			label={statusLabels[orderData.order.status] || orderData.order.status}
																			sx={{
																				backgroundColor: statusColors[orderData.order.status] || '#9E9E9E',
																				color: '#fff',
																				fontWeight: 600,
																				px: 1,
																			}}
																		/>
																	</Stack>

																	{/* Customer Info */}
																	<Grid container spacing={2}>
																		<Grid size={{ xs: 12, sm: 6 }}>
																			<Typography variant="caption" color="textSecondary">
																				Customer
																			</Typography>
																			<Typography variant="body2" fontWeight={600}>
																				{orderData.order.customer_name || 'N/A'}
																			</Typography>
																		</Grid>
																		<Grid size={{ xs: 12, sm: 6 }}>
																			<Typography variant="caption" color="textSecondary">
																				Submitted
																			</Typography>
																			<Typography variant="body2" fontWeight={600}>
																				{new Date(orderData.order.submitted_at).toLocaleDateString('en-US', {
																					month: 'short',
																					day: 'numeric',
																					year: 'numeric',
																				})}
																			</Typography>
																		</Grid>
																	</Grid>
																</Stack>

																{/* Timeline */}
																<Box>
																	<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
																		Order Timeline
																	</Typography>
																	<Stack spacing={2}>
																		{orderData.events.length > 0 ? (
																			orderData.events.map((event, index) => (
																				<StatusStep
																					key={event.id}
																					label={event.notes || event.event_type}
																					date={new Date(event.created_at).toLocaleString('en-US', {
																						month: 'short',
																						day: 'numeric',
																						year: 'numeric',
																						hour: '2-digit',
																						minute: '2-digit',
																					})}
																					isFirst={index === 0}
																				/>
																			))
																		) : (
																			<Typography variant="body2" color="textSecondary">
																				No timeline events yet
																			</Typography>
																		)}
																	</Stack>
																</Box>

																{/* Order Details */}
																{orderData.order.payload && (
																	<Box>
																		<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
																			Order Details
																		</Typography>
																		<Stack spacing={1}>
																			{(orderData.order.payload as Record<string, unknown>).urgency ? (
																				<Stack direction="row" spacing={1}>
																					<Typography variant="body2" color="textSecondary">
																						Urgency:
																					</Typography>
																					<Typography variant="body2" fontWeight={600}>
																						{String((orderData.order.payload as Record<string, unknown>).urgency)}
																					</Typography>
																				</Stack>
																			) : null}
																			{(orderData.order.payload as Record<string, unknown>).details ? (
																				<Box>
																					<Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
																						Details:
																					</Typography>
																					<Typography variant="body2">
																						{String((orderData.order.payload as Record<string, unknown>).details)}
																					</Typography>
																				</Box>
																			) : null}
																		</Stack>
																	</Box>
																)}

																{/* Contact Support */}
																<Box
																	sx={{
																		borderTop: 1,
																		borderColor: 'divider',
																		pt: 3,
																	}}
																>
																	<Typography variant="body2" color="textSecondary">
																		Need help with your order?{' '}
																		<Typography
																			component="a"
																			href="/contact"
																			variant="body2"
																			sx={{
																				color: 'accent.main',
																				textDecoration: 'none',
																				fontWeight: 600,
																				'&:hover': { textDecoration: 'underline' },
																			}}
																		>
																			Contact support
																		</Typography>
																	</Typography>
																</Box>
															</Stack>
														</Box>
													</Card>
												</Box>
											</RevealSection>
										)}
									</Box>
								</Card>
							</RevealSection>

							<Stack spacing={1.5} sx={{ textAlign: 'center', pt: 2 }}>
								<Typography variant="body2" color="textSecondary">
									Can&apos;t find your order number? Check your confirmation email or{' '}
									<Typography
										component="a"
										href="/contact"
										variant="body2"
										sx={{
											color: 'accent.main',
											textDecoration: 'none',
											'&:hover': { textDecoration: 'underline' },
										}}
									>
										contact support
									</Typography>
								</Typography>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</RevealSection>
		</Container>
	);
}

function StatusStep({
	label,
	date,
	isFirst = false,
}: {
	label: string;
	date: string;
	isFirst?: boolean;
}) {
	return (
		<Stack direction="row" spacing={2} alignItems="flex-start">
			<Box
				sx={{
					width: 32,
					height: 32,
					borderRadius: '50%',
					backgroundColor: isFirst ? 'accent.main' : 'rgba(128, 128, 128, 0.2)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				{isFirst ? (
					<IconCheck size={18} color="#fff" />
				) : (
					<IconClock size={18} color="#999" />
				)}
			</Box>
			<Stack spacing={0.5} sx={{ flexGrow: 1 }}>
				<Typography variant="body1" fontWeight={isFirst ? 600 : 400}>
					{label}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{date}
				</Typography>
			</Stack>
		</Stack>
	);
}

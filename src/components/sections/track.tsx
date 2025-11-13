'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	Box,
	Button,
	Container,
	Stack,
	TextField,
	Typography,
	Chip,
	Alert,
	useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconSearch, IconCheck, IconClock } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { trackOrder } from '@/app/actions/track-order';
import type { Application, ApplicationEvent } from '@/lib/admin-queries';

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
	const t = useTranslations('Homepage.track');
	const locale = useLocale() as 'en' | 'ar';
	const theme = useTheme();
	const searchParams = useSearchParams();
	const [orderNumber, setOrderNumber] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [orderData, setOrderData] = useState<{
		order: Application;
		events: ApplicationEvent[];
		service: { title: string; category: string } | null;
	} | null>(null);

	const statusLabels: Record<string, string> = {
		draft: t('status.draft'),
		submitted: t('status.submitted'),
		scoping: t('status.scoping'),
		quote_sent: t('status.quote_sent'),
		in_progress: t('status.in_progress'),
		review: t('status.review'),
		completed: t('status.completed'),
		archived: t('status.archived'),
		rejected: t('status.rejected'),
		cancelled: t('status.cancelled'),
	};

	const handleTrack = useCallback(
		async (orderNum?: string) => {
			const numToTrack = orderNum || orderNumber;
			if (!numToTrack.trim()) {
				setError(t('orderNumberRequired'));
				return;
			}

			setLoading(true);
			setError('');
			setOrderData(null);

			const result = await trackOrder(numToTrack.trim(), locale);

			if (result.type === 'error') {
				setError(result.message || t('noOrderFound'));
				setOrderData(null);
			} else {
				setOrderData(result.data);
				setError('');
			}

			setLoading(false);
		},
		[orderNumber, t, locale],
	);

	// Auto-load if order param in URL
	useEffect(() => {
		if (!searchParams) return;
		const orderParam = searchParams.get('order');
		if (orderParam) {
			setOrderNumber(orderParam);
			void handleTrack(orderParam);
		}
	}, [searchParams, handleTrack]);

	return (
		<Container sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 2.5, md: 6 } }}>
			<RevealSection delay={0.1} direction="up">
				<Grid
					alignItems={{ md: 'center' }}
					container
					spacing={{ xs: 4, md: 8 }}
					sx={{ minHeight: { md: '60vh' } }}
					justifyContent="center"
				>
					<Grid size={{ xs: 12, md: 10, lg: 8 }}>
						<Stack spacing={{ xs: 4, md: 6 }}>
							<Stack spacing={2.5} sx={{ textAlign: 'center' }}>
								<Typography color="accent" variant="h5">
									{t('tagline')}
								</Typography>
								<Typography variant="h2">{t('headline')}</Typography>
								<Typography color="textSecondary" sx={{ whiteSpace: 'pre-line' }}>
									{t('description')}
								</Typography>
							</Stack>

							<RevealSection delay={0.3} direction="up">
								<Card
									backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
									borderColor={{ light: 'divider', dark: 'divider' }}
									borderRadius={24}
								>
									<Box sx={{ p: { xs: 3, md: 4 } }}>
										<Stack spacing={3}>
											<TextField
												fullWidth
												label={t('orderNumber')}
												placeholder={`${t('orderNumber')} (e.g., TS-12345)`}
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
														'& fieldset': {
															borderColor: 'divider',
														},
														'&:hover fieldset': {
															borderColor: 'primary.main',
														},
														'&.Mui-focused fieldset': {
															borderColor: 'primary.main',
														},
													},
												}}
											/>
											<Button
												fullWidth
												startIcon={<IconSearch size={20} />}
												size="large"
												onClick={() => handleTrack()}
												disabled={loading}
												sx={{
													borderRadius: '12px',
													py: 1.5,
												}}
											>
												{loading ? t('search') + '...' : t('search')}
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
														backgroundColor={{ 
															light: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(14, 33, 160, 0.02)', 
															dark: 'rgba(255,255,255,0.02)' 
														}}
														borderColor={{ light: 'divider', dark: 'divider' }}
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
																				{t('orderNumberLabel')} #{orderData.order.order_number}
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
																				color: 'common.white',
																				fontWeight: 600,
																				px: 1,
																			}}
																		/>
																	</Stack>

																	{/* Customer Info */}
																	<Grid container spacing={2}>
																		<Grid size={{ xs: 12, sm: 6 }}>
																			<Typography variant="caption" color="textSecondary">
																				{t('customer')}
																			</Typography>
																			<Typography variant="body2" fontWeight={600}>
																				{orderData.order.customer_name || 'N/A'}
																			</Typography>
																		</Grid>
																		<Grid size={{ xs: 12, sm: 6 }}>
																			<Typography variant="caption" color="textSecondary">
																				{t('submitted')}
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
																		{t('orderTimeline')}
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
																				{t('noTimelineEvents')}
																			</Typography>
																		)}
																	</Stack>
																</Box>

																{/* Order Details */}
																{orderData.order.payload && (
																	<Box>
																		<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
																			{t('orderDetails')}
																		</Typography>
																		<Stack spacing={1}>
																			{(orderData.order.payload as Record<string, unknown>).urgency ? (
																				<Stack direction="row" spacing={1}>
																					<Typography variant="body2" color="textSecondary">
																						{t('urgency')}:
																					</Typography>
																					<Typography variant="body2" fontWeight={600}>
																						{String((orderData.order.payload as Record<string, unknown>).urgency)}
																					</Typography>
																				</Stack>
																			) : null}
																			{(orderData.order.payload as Record<string, unknown>).details ? (
																				<Box>
																					<Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
																						{t('details')}:
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
																		{t('needHelp')}{' '}
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
																			{t('contactSupport')}
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
									{t('cantFindOrder')}{' '}
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
										{t('contactSupport')}
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
	const theme = useTheme();
	return (
		<Stack direction="row" spacing={2} alignItems="flex-start">
			<Box
				sx={{
					width: 32,
					height: 32,
					borderRadius: '50%',
					backgroundColor: isFirst 
						? 'accent.main' 
						: theme.palette.mode === 'dark' 
							? 'rgba(255,255,255,0.1)' 
							: 'rgba(0,0,0,0.08)',
					color: isFirst 
						? 'common.white' 
						: theme.palette.mode === 'dark' 
							? 'text.secondary' 
							: 'text.secondary',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				{isFirst ? (
					<IconCheck size={18} />
				) : (
					<IconClock size={18} />
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

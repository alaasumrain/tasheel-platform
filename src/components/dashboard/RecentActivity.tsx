'use client';

import { Card } from '@/components/ui/card';
import { Box, Stack, Typography, Divider, Chip } from '@mui/material';
import { IconClock, IconCheck, IconX, IconFileText } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import type { Application } from '@/lib/admin-queries';

interface RecentActivityProps {
	orders: Application[];
	maxItems?: number;
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

function formatDate(dateString: string, locale: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(locale, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

function getStatusIcon(status: Application['status']) {
	switch (status) {
		case 'completed':
			return <IconCheck size={18} />;
		case 'rejected':
		case 'cancelled':
			return <IconX size={18} />;
		default:
			return <IconClock size={18} />;
	}
}

/**
 * Recent activity component showing latest order updates
 */
export function RecentActivity({ orders, maxItems = 5 }: RecentActivityProps) {
	const t = useTranslations('Dashboard.page');
	const locale = useLocale();
	const isRTL = locale === 'ar';

	const recentOrders = orders.slice(0, maxItems);

	return (
		<Card borderRadius={20}>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{t('recentActivity')}
				</Typography>
				{recentOrders.length === 0 ? (
					<Box sx={{ py: 4, textAlign: 'center' }}>
						<Typography variant="body2" color="text.secondary">
							{t('noRecentActivity')}
						</Typography>
					</Box>
				) : (
					<Stack spacing={2} sx={{ mt: 2 }}>
						{recentOrders.map((order, index) => (
							<Box key={order.id}>
								<Stack
									direction="row"
									spacing={2}
									alignItems="flex-start"
									sx={{ direction: isRTL ? 'rtl' : 'ltr' }}
								>
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: '50%',
											bgcolor: 'primary.main',
											opacity: 0.1,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'primary.main',
											flexShrink: 0,
										}}
									>
										{getStatusIcon(order.status)}
									</Box>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											justifyContent="space-between"
											sx={{ mb: 0.5 }}
										>
											<Typography
												component={Link}
												href={`/dashboard/requests/${order.id}`}
												variant="body2"
												fontWeight={600}
												sx={{
													color: 'text.primary',
													textDecoration: 'none',
													'&:hover': { textDecoration: 'underline' },
												}}
											>
												{order.order_number || t('notAvailable')}
											</Typography>
											<Chip
												label={t(`statusLabels.${order.status}` as any) || order.status}
												color={statusColors[order.status]}
												size="small"
												sx={{ height: 20, fontSize: '0.7rem' }}
											/>
										</Stack>
										<Typography variant="caption" color="text.secondary">
											{order.service_slug || t('notAvailable')} • {formatDate(order.submitted_at, locale)}
										</Typography>
									</Box>
								</Stack>
								{index < recentOrders.length - 1 && <Divider sx={{ mt: 2 }} />}
							</Box>
						))}
					</Stack>
				)}
			</Box>
		</Card>
	);
}


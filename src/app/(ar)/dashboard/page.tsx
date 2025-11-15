import { Box, Container, Stack, Typography, Grid2 } from '@mui/material';
import { getCurrentUser, getCustomerProfile } from '@/lib/supabase/auth-helpers';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { getCustomerOrders } from '@/lib/admin-queries';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { IconFileText, IconClock, IconCheck, IconProgress } from '@tabler/icons-react';
import StatsCard from '@/components/ui/stats-card';
import { RequestTimelineChart } from '@/components/dashboard/RequestTimelineChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { FeaturedServices } from '@/components/dashboard/FeaturedServices';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EmptyState } from '@/components/ui/state-components';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
	setRequestLocale('ar');
	const t = await getTranslations('Dashboard.page');
	const user = await getCurrentUser();
	const customer = await getCustomerProfile();

	// Get customer's orders (server-side filtering for security)
	const customerOrders = customer
		? await getCustomerOrders(customer.id || customer.email || '', !customer.id)
		: [];

	// Get timeline data for charts (last 7 days)
	const supabase = await createClient();
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	
	const { data: timelineData } = await supabase
		.from('applications')
		.select('submitted_at')
		.eq('customer_id', customer?.id || '')
		.gte('submitted_at', sevenDaysAgo.toISOString())
		.order('submitted_at', { ascending: true });

	// Group timeline data by date
	const groupedByDate: Record<string, number> = {};
	for (let i = 0; i < 7; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];
		groupedByDate[dateStr] = 0;
	}

	timelineData?.forEach((order) => {
		const dateStr = order.submitted_at.split('T')[0];
		if (groupedByDate[dateStr] !== undefined) {
			groupedByDate[dateStr]++;
		}
	});

	const timelineChartData = Object.entries(groupedByDate)
		.map(([date, count]) => ({ date, count }))
		.reverse();

	const stats = {
		total: customerOrders.length,
		pending: customerOrders.filter((o) => o.status === 'submitted').length,
		inProgress: customerOrders.filter((o) => o.status === 'in_progress').length,
		completed: customerOrders.filter((o) => o.status === 'completed').length,
	};

	const hasOrders = customerOrders.length > 0;

	return (
		<Container maxWidth="lg" sx={{ direction: 'rtl' }}>
			<Stack spacing={4}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={2} sx={{ textAlign: 'right' }}>
						<Typography variant="h4" component="h1" fontWeight={700}>
							{t('welcomeBack', { name: customer?.name || user?.email || '' })}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{t('description')}
						</Typography>
					</Stack>
				</RevealSection>

				{!hasOrders ? (
					// New user: Services-first layout
					<>
						<RevealSection delay={0.2} direction="up">
							<Card borderRadius={20}>
								<Box sx={{ p: 4 }}>
									<EmptyState
										variant="no-orders"
										title={t('getStartedTitle')}
										description={t('getStartedMessage')}
									/>
								</Box>
							</Card>
						</RevealSection>

						<FeaturedServices maxItems={8} showTitle={true} />

						<RevealSection delay={0.5} direction="up">
							<QuickActions />
						</RevealSection>
					</>
				) : (
					// Existing user: Hybrid layout
					<>
						<RevealSection delay={0.2} direction="up">
							<Grid2 container spacing={3} sx={{ direction: 'rtl' }}>
								<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
									<StatsCard
										value={stats.total}
										label={t('totalRequests')}
										icon={<IconFileText size={32} />}
										color="primary"
									/>
								</Grid2>
								<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
									<StatsCard
										value={stats.pending}
										label={t('pending')}
										icon={<IconClock size={32} />}
										color="warning"
									/>
								</Grid2>
								<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
									<StatsCard
										value={stats.inProgress}
										label={t('inProgress')}
										icon={<IconProgress size={32} />}
										color="info"
									/>
								</Grid2>
								<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
									<StatsCard
										value={stats.completed}
										label={t('completed')}
										icon={<IconCheck size={32} />}
										color="success"
									/>
								</Grid2>
							</Grid2>
						</RevealSection>

						<RevealSection delay={0.3} direction="up">
							<Grid2 container spacing={3} sx={{ direction: 'rtl' }}>
								<Grid2 size={{ xs: 12, lg: 8 }}>
									<RequestTimelineChart data={timelineChartData} />
								</Grid2>
								<Grid2 size={{ xs: 12, lg: 4 }}>
									<RecentActivity orders={customerOrders} maxItems={5} />
								</Grid2>
							</Grid2>
						</RevealSection>

						<FeaturedServices maxItems={6} showTitle={true} />

						<RevealSection delay={0.5} direction="up">
							<QuickActions />
						</RevealSection>
					</>
				)}
			</Stack>
		</Container>
	);
}


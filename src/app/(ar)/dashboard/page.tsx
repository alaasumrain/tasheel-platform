import { Box, Container, Stack, Typography, Card as MuiCard, CardContent } from '@mui/material';
import { getCurrentUser, getCustomerProfile } from '@/lib/supabase/auth-helpers';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { getCustomerOrders } from '@/lib/admin-queries';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
	setRequestLocale('ar');
	const t = await getTranslations('Dashboard.page');
	const user = await getCurrentUser();
	const customer = await getCustomerProfile();

	// Get customer's orders (server-side filtering for security)
	const customerOrders = customer
		? await getCustomerOrders(customer.id || customer.email || '', !customer.id)
		: [];

	const stats = {
		total: customerOrders.length,
		pending: customerOrders.filter((o) => o.status === 'submitted').length,
		inProgress: customerOrders.filter((o) => o.status === 'in_progress').length,
		completed: customerOrders.filter((o) => o.status === 'completed').length,
	};

	return (
		<Container maxWidth="lg">
			<Stack spacing={4}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={2}>
						<Typography variant="h4" component="h1" fontWeight={700}>
							{t('welcomeBack', { name: customer?.name || user?.email || '' })}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{t('description')}
						</Typography>
					</Stack>
				</RevealSection>

				<RevealSection delay={0.2} direction="up">
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								sm: 'repeat(2, 1fr)',
								md: 'repeat(4, 1fr)',
							},
							gap: 3,
						}}
					>
						<Card borderRadius={16}>
							<CardContent>
								<Typography variant="h3" fontWeight={700}>
									{stats.total}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t('totalRequests')}
								</Typography>
							</CardContent>
						</Card>

						<Card borderRadius={16}>
							<CardContent>
								<Typography variant="h3" fontWeight={700} color="warning.main">
									{stats.pending}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t('pending')}
								</Typography>
							</CardContent>
						</Card>

						<Card borderRadius={16}>
							<CardContent>
								<Typography variant="h3" fontWeight={700} color="primary.main">
									{stats.inProgress}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t('inProgress')}
								</Typography>
							</CardContent>
						</Card>

						<Card borderRadius={16}>
							<CardContent>
								<Typography variant="h3" fontWeight={700} color="success.main">
									{stats.completed}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t('completed')}
								</Typography>
							</CardContent>
						</Card>
					</Box>
				</RevealSection>

				<RevealSection delay={0.3} direction="up">
					<Card borderRadius={20}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom>
								{t('recentRequests')}
							</Typography>
							{customerOrders.length === 0 ? (
								<Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
									{t('noRequestsYet')}
								</Typography>
							) : (
								<Stack spacing={2} sx={{ mt: 2 }}>
									{customerOrders.slice(0, 5).map((order) => (
										<Box
											key={order.id}
											sx={{
												p: 2,
												bgcolor: 'background.default',
												borderRadius: 2,
											}}
										>
											<Typography variant="body1" fontWeight={600}>
												{order.order_number || 'N/A'}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{t('status')} {order.status}
											</Typography>
										</Box>
									))}
								</Stack>
							)}
						</Box>
					</Card>
				</RevealSection>
			</Stack>
		</Container>
	);
}


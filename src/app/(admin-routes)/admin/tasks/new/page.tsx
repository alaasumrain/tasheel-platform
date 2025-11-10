import { Box, Typography } from '@mui/material';
import { TaskForm } from '@/components/admin/TaskForm';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { Card } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { getAssignableUsers } from '@/lib/admin-queries';
import { getOrders } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export default async function CreateTaskPage() {
	const t = await getTranslations('Admin.tasks');
	const [users, orders] = await Promise.all([
		getAssignableUsers(),
		getOrders(),
	]);

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: t('breadcrumbs.dashboard'), href: '/admin' },
					{ label: t('breadcrumbs.tasks'), href: '/admin/tasks' },
					{ label: t('createTask') || 'Create Task' },
				]}
			/>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					{t('createTask') || 'Create Task'}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{t('createTaskDescription') || 'Create a new task'}
				</Typography>
			</Box>
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 4 }}>
					<TaskForm mode="create" users={users} applications={orders} />
				</Box>
			</Card>
		</Box>
	);
}


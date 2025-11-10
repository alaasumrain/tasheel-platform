import { notFound } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { TaskForm } from '@/components/admin/TaskForm';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { Card } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { getTaskById, getAssignableUsers } from '@/lib/admin-queries';
import { getOrders } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export default async function EditTaskPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const t = await getTranslations('Admin.tasks');
	const { id } = await params;

	try {
		const [task, users, orders] = await Promise.all([
			getTaskById(id),
			getAssignableUsers(),
			getOrders(),
		]);

		if (!task) {
			notFound();
		}

		return (
			<Box>
				<AdminBreadcrumbs
					items={[
						{ label: t('breadcrumbs.dashboard'), href: '/admin' },
						{ label: t('breadcrumbs.tasks'), href: '/admin/tasks' },
						{ label: task.title },
					]}
				/>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{t('editTask') || 'Edit Task'}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('editTaskDescription') || 'Update task information'}
					</Typography>
				</Box>
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 4 }}>
						<TaskForm task={task} mode="edit" users={users} applications={orders} />
					</Box>
				</Card>
			</Box>
		);
	} catch (error) {
		console.error('Error loading task:', error);
		notFound();
	}
}


import { notFound } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { UserForm } from '@/components/admin/UserForm';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { Card } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { getUsers } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export default async function EditUserPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const t = await getTranslations('Admin.users');
	const { id } = await params;

	try {
		const users = await getUsers();
		const user = users.find((u) => u.id === id);

		if (!user) {
			notFound();
		}

		return (
			<Box>
				<AdminBreadcrumbs
					items={[
						{ label: t('breadcrumbs.dashboard'), href: '/admin' },
						{ label: t('breadcrumbs.users'), href: '/admin/users' },
						{ label: user.name || user.email },
					]}
				/>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{t('editUser') || 'Edit User'}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('editUserDescription') || 'Update user information'}
					</Typography>
				</Box>
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 4 }}>
						<UserForm user={user} mode="edit" />
					</Box>
				</Card>
			</Box>
		);
	} catch (error) {
		console.error('Error loading user:', error);
		notFound();
	}
}


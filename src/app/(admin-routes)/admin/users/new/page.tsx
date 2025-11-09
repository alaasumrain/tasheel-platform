import { Box, Typography } from '@mui/material';
import { UserForm } from '@/components/admin/UserForm';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { Card } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function CreateUserPage() {
	const t = await getTranslations('Admin.users');

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'Users', href: '/admin/users' },
					{ label: 'Create User' },
				]}
			/>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					{t('createUser') || 'Create User'}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{t('createUserDescription') || 'Add a new user to the system'}
				</Typography>
			</Box>
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 4 }}>
					<UserForm mode="create" />
				</Box>
			</Card>
		</Box>
	);
}


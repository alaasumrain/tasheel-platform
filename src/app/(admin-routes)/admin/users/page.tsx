import { Box, Typography } from '@mui/material';
import { getUsers } from '@/lib/admin-queries';
import { UsersTable } from '@/components/admin/UsersTable';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
	const t = await getTranslations('Admin.users');
	const users = await getUsers();

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					{t('pageTitle')}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{t('pageDescription')}
				</Typography>
			</Box>

			<UsersTable users={users} />
		</Box>
	);
}


import { Box, Typography } from '@mui/material';
import { getUsers } from '@/lib/admin-queries';
import { UsersTable } from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
	const users = await getUsers();

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
					User Management
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Manage admin and staff users
				</Typography>
			</Box>

			<UsersTable users={users} />
		</Box>
	);
}


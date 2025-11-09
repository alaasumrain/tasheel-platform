'use client';

import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	IconButton,
	Tooltip,
	Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { User } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';

interface UsersTableProps {
	users: User[];
}

const roleColors: Record<User['role'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
	admin: 'error',
	supervisor: 'warning',
	officer: 'primary',
	intake: 'success',
	auditor: 'default',
};

export function UsersTable({ users }: UsersTableProps) {
	const t = useTranslations('Admin.users');
	
	const handleEdit = (user: User) => {
		// TODO: Implement edit user functionality
		// Edit functionality not yet implemented
	};

	const handleDelete = (user: User) => {
		// TODO: Implement delete user functionality
		// Delete functionality not yet implemented
	};

	if (users.length === 0) {
		return (
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 6, textAlign: 'center' }}>
					<Alert severity="info">{t('noUsers')}</Alert>
				</Box>
			</Card>
		);
	}
	
	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={20}
		>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>{t('table.name')}</TableCell>
							<TableCell>{t('table.email')}</TableCell>
							<TableCell>{t('table.role')}</TableCell>
							<TableCell>{t('table.status')}</TableCell>
							<TableCell>{t('table.created')}</TableCell>
							<TableCell align="right">{t('table.actions')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id} hover>
								<TableCell>{user.name || 'N/A'}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<Chip
										label={user.role}
										color={roleColors[user.role]}
										size="small"
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={user.is_active ? t('active') : t('inactive')}
										color={user.is_active ? 'success' : 'default'}
										size="small"
									/>
								</TableCell>
								<TableCell>
									{new Date(user.created_at).toLocaleDateString()}
								</TableCell>
								<TableCell align="right">
									<Tooltip title={t('edit')}>
										<IconButton 
											size="small"
											onClick={() => handleEdit(user)}
											disabled
										>
											<EditIcon fontSize="small" />
										</IconButton>
									</Tooltip>
									<Tooltip title={t('delete')}>
										<IconButton 
											size="small" 
											color="error"
											onClick={() => handleDelete(user)}
											disabled
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	);
}


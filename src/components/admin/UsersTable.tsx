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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { User } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';

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
	
	return (
		<TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
					{users.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
								{t('noUsers')}
							</TableCell>
						</TableRow>
					) : (
						users.map((user) => (
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
										<IconButton size="small">
											<EditIcon fontSize="small" />
										</IconButton>
									</Tooltip>
									<Tooltip title={t('delete')}>
										<IconButton size="small" color="error">
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}


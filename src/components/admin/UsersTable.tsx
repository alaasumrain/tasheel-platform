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
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/ToastProvider';
import { useState } from 'react';

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
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	
	const handleEdit = (user: User) => {
		router.push(`/admin/users/${user.id}/edit`);
	};

	const handleDelete = async (user: User) => {
		if (!confirm(t('deleteConfirm') || `Are you sure you want to delete ${user.name || user.email}?`)) {
			return;
		}

		setDeletingId(user.id);

		try {
			const response = await fetch(`/api/admin/users/${user.id}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to delete user');
			}

			showSuccess(t('deleteSuccess') || 'User deleted successfully!');
			router.refresh();
		} catch (error: any) {
			console.error('Error deleting user:', error);
			showError(error.message || t('deleteError') || 'Failed to delete user');
		} finally {
			setDeletingId(null);
		}
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
										>
											<EditIcon fontSize="small" />
										</IconButton>
									</Tooltip>
									<Tooltip title={t('delete')}>
										<IconButton 
											size="small" 
											color="error"
											onClick={() => handleDelete(user)}
											disabled={deletingId === user.id}
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


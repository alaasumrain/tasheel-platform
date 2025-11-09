'use client';

import { useState } from 'react';
import {
	Box,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
	Alert,
	CircularProgress,
} from '@mui/material';
import { User } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/ToastProvider';

interface UserFormProps {
	user?: User;
	mode: 'create' | 'edit';
}

export function UserForm({ user, mode }: UserFormProps) {
	const t = useTranslations('Admin.users');
	const router = useRouter();
	const { showSuccess, showError } = useToast();

	const [formData, setFormData] = useState({
		email: user?.email || '',
		name: user?.name || '',
		role: user?.role || 'officer',
		is_active: user?.is_active ?? true,
		password: '',
		confirmPassword: '',
	});

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.email) {
			newErrors.email = t('errors.emailRequired') || 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = t('errors.emailInvalid') || 'Invalid email address';
		}

		if (!formData.name) {
			newErrors.name = t('errors.nameRequired') || 'Name is required';
		}

		if (mode === 'create' && !formData.password) {
			newErrors.password = t('errors.passwordRequired') || 'Password is required';
		} else if (formData.password && formData.password.length < 6) {
			newErrors.password = t('errors.passwordMin') || 'Password must be at least 6 characters';
		}

		if (formData.password && formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = t('errors.passwordMismatch') || 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setLoading(true);

		try {
			const url = mode === 'create' 
				? '/api/admin/users'
				: `/api/admin/users/${user?.id}`;
			
			const method = mode === 'create' ? 'POST' : 'PUT';

			const body: any = {
				email: formData.email,
				name: formData.name,
				role: formData.role,
				is_active: formData.is_active,
			};

			if (mode === 'create' || formData.password) {
				body.password = formData.password;
			}

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save user');
			}

			showSuccess(
				mode === 'create' 
					? t('createSuccess') || 'User created successfully!'
					: t('updateSuccess') || 'User updated successfully!'
			);
			router.push('/admin/users');
			router.refresh();
		} catch (error: any) {
			console.error('Error saving user:', error);
			showError(error.message || t('saveError') || 'Failed to save user');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<Stack spacing={3}>
				<TextField
					label={t('form.email') || 'Email'}
					type="email"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					error={!!errors.email}
					helperText={errors.email}
					required
					fullWidth
					disabled={mode === 'edit'} // Don't allow email changes in edit mode
				/>

				<TextField
					label={t('form.name') || 'Name'}
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					error={!!errors.name}
					helperText={errors.name}
					required
					fullWidth
				/>

				<FormControl fullWidth required>
					<InputLabel>{t('form.role') || 'Role'}</InputLabel>
					<Select
						value={formData.role}
						label={t('form.role') || 'Role'}
						onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
					>
						<MenuItem value="admin">{t('roles.admin') || 'Admin'}</MenuItem>
						<MenuItem value="supervisor">{t('roles.supervisor') || 'Supervisor'}</MenuItem>
						<MenuItem value="officer">{t('roles.officer') || 'Officer'}</MenuItem>
						<MenuItem value="intake">{t('roles.intake') || 'Intake'}</MenuItem>
						<MenuItem value="auditor">{t('roles.auditor') || 'Auditor'}</MenuItem>
					</Select>
				</FormControl>

				{mode === 'edit' && (
					<FormControl fullWidth>
						<InputLabel>{t('form.status') || 'Status'}</InputLabel>
						<Select
							value={formData.is_active ? 'active' : 'inactive'}
							label={t('form.status') || 'Status'}
							onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
						>
							<MenuItem value="active">{t('active') || 'Active'}</MenuItem>
							<MenuItem value="inactive">{t('inactive') || 'Inactive'}</MenuItem>
						</Select>
					</FormControl>
				)}

				<TextField
					label={t('form.password') || 'Password'}
					type="password"
					value={formData.password}
					onChange={(e) => setFormData({ ...formData, password: e.target.value })}
					error={!!errors.password}
					helperText={errors.password || (mode === 'edit' ? t('form.passwordOptional') || 'Leave blank to keep current password' : '')}
					required={mode === 'create'}
					fullWidth
				/>

				{formData.password && (
					<TextField
						label={t('form.confirmPassword') || 'Confirm Password'}
						type="password"
						value={formData.confirmPassword}
						onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword}
						fullWidth
					/>
				)}

				<Stack direction="row" spacing={2} justifyContent="flex-end">
					<Button
						variant="outlined"
						onClick={() => router.back()}
						disabled={loading}
					>
						{t('cancel') || 'Cancel'}
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={loading}
						startIcon={loading ? <CircularProgress size={20} /> : null}
					>
						{loading 
							? (t('saving') || 'Saving...')
							: (mode === 'create' ? t('create') || 'Create User' : t('update') || 'Update User')
						}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}


'use client';

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	OutlinedInput,
	Stack,
	Divider,
	Alert,
	Select,
	MenuItem,
	InputLabel,
} from '@mui/material';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';

interface Customer {
	id: string;
	email: string;
	name: string | null;
	phone: string | null;
	language_preference: string;
}

interface ProfileSettingsFormProps {
	customer: Customer;
}

export function ProfileSettingsForm({ customer }: ProfileSettingsFormProps) {
	const t = useTranslations('Dashboard.profile');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const supabase = createClient();
	const [success, setSuccess] = useState(false);

	const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData: FormData) => {
			const name = formData.get('name') as string;
			const phone = formData.get('phone') as string;
			const language = formData.get('language') as string;

			const response = await fetch('/api/customer/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, phone, language_preference: language }),
			});

			if (!response.ok) {
				throw new Error('Failed to update profile');
			}

			return response.json();
		},
		onSuccess: () => {
			setSuccess(true);
			toast.success(t('profileUpdated'));
			setTimeout(() => {
				setSuccess(false);
				router.refresh();
			}, 2000);
		},
		onError: () => {
			toast.error(t('updateFailed'));
		},
	});

	const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation({
		mutationFn: async (formData: FormData) => {
			const currentPassword = formData.get('currentPassword') as string;
			const newPassword = formData.get('newPassword') as string;
			const confirmPassword = formData.get('confirmPassword') as string;

			if (newPassword !== confirmPassword) {
				throw new Error(t('errors.passwordMismatch'));
			}

			if (newPassword.length < 6) {
				throw new Error(t('errors.passwordMin'));
			}

			// Verify current password by attempting sign-in
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: customer.email,
				password: currentPassword,
			});

			if (signInError) {
				throw new Error(t('errors.currentPasswordInvalid'));
			}

			// Update password
			const { error: updateError } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (updateError) {
				throw updateError;
			}
		},
		onSuccess: () => {
			toast.success(t('passwordUpdated'));
			formRef.current?.querySelectorAll('input[type="password"]').forEach((input) => {
				(input as HTMLInputElement).value = '';
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || t('updateFailed'));
		},
	});

	const handleUpdateProfile = (formData: FormData) => {
		updateProfile(formData);
	};

	const handleUpdatePassword = (formData: FormData) => {
		updatePassword(formData);
	};

	return (
		<Stack spacing={4}>
			{/* Profile Information */}
			<form ref={formRef} action={handleUpdateProfile}>
				<Stack spacing={3}>
					<Typography variant="h6" fontWeight={600}>
						{t('profileInformation')}
					</Typography>

					{success && (
						<Alert severity="success" icon={<IconCheck />}>
							{t('profileUpdated')}
						</Alert>
					)}

					<FormControl disabled={isUpdatingProfile} required>
						<FormLabel htmlFor="name">{t('fields.name')}</FormLabel>
						<OutlinedInput
							id="name"
							name="name"
							defaultValue={customer.name || ''}
							required
						/>
					</FormControl>

					<FormControl disabled>
						<FormLabel htmlFor="email">{t('fields.email')}</FormLabel>
						<OutlinedInput id="email" defaultValue={customer.email} disabled />
						<FormHelperText>{t('emailCannotChange')}</FormHelperText>
					</FormControl>

					<FormControl disabled={isUpdatingProfile}>
						<FormLabel htmlFor="phone">{t('fields.phone')}</FormLabel>
						<OutlinedInput
							id="phone"
							name="phone"
							type="tel"
							defaultValue={customer.phone || ''}
						/>
					</FormControl>

					<FormControl disabled={isUpdatingProfile} fullWidth>
						<InputLabel htmlFor="language">{t('fields.language')}</InputLabel>
						<Select
							id="language"
							name="language"
							defaultValue={customer.language_preference || 'ar'}
							label={t('fields.language')}
						>
							<MenuItem value="ar">العربية</MenuItem>
							<MenuItem value="en">English</MenuItem>
						</Select>
					</FormControl>

					<Button
						disabled={isUpdatingProfile}
						endIcon={<IconArrowRight />}
						fullWidth
						type="submit"
						variant="contained"
						size="large"
					>
						{t('updateProfile')}
					</Button>
				</Stack>
			</form>

			<Divider />

			{/* Change Password */}
			<form action={handleUpdatePassword}>
				<Stack spacing={3}>
					<Typography variant="h6" fontWeight={600}>
						{t('changePassword')}
					</Typography>

					<FormControl disabled={isUpdatingPassword} required>
						<FormLabel htmlFor="currentPassword">{t('fields.currentPassword')}</FormLabel>
						<OutlinedInput id="currentPassword" name="currentPassword" type="password" required />
					</FormControl>

					<FormControl disabled={isUpdatingPassword} required>
						<FormLabel htmlFor="newPassword">{t('fields.newPassword')}</FormLabel>
						<OutlinedInput id="newPassword" name="newPassword" type="password" required />
						<FormHelperText>{t('passwordRequirements')}</FormHelperText>
					</FormControl>

					<FormControl disabled={isUpdatingPassword} required>
						<FormLabel htmlFor="confirmPassword">{t('fields.confirmPassword')}</FormLabel>
						<OutlinedInput
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
						/>
					</FormControl>

					<Button
						disabled={isUpdatingPassword}
						endIcon={<IconArrowRight />}
						fullWidth
						type="submit"
						variant="outlined"
						size="large"
					>
						{t('updatePassword')}
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}


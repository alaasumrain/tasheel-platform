'use client';

import { useRef, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	OutlinedInput,
	Stack,
	Alert,
} from '@mui/material';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordForm() {
	const t = useTranslations('Auth.resetPassword');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [success, setSuccess] = useState(false);

	const supabase = createClient();

	// Check if user has valid session (from password reset link)
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!session) {
				toast.error(t('errors.invalidLink'));
				router.push('/forgot-password');
			}
		});
	}, [router, supabase.auth, t]);

	const { mutate: updatePassword, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			const password = formData.get('password') as string;
			const confirmPassword = formData.get('confirmPassword') as string;

			// Validation
			const newErrors: Record<string, string> = {};
			if (!password || password.length < 6) {
				newErrors.password = t('errors.passwordMin');
			}
			if (password !== confirmPassword) {
				newErrors.confirmPassword = t('errors.passwordMismatch');
			}

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				throw new Error(t('errors.validationFailed'));
			}

			setErrors({});

			// Update password
			const { error: updateError } = await supabase.auth.updateUser({
				password: password,
			});

			if (updateError) {
				throw updateError;
			}
		},
		onSuccess: () => {
			setSuccess(true);
			toast.success(t('success'));
			formRef.current?.reset();
			setTimeout(() => {
				router.push('/login');
			}, 2000);
		},
		onError: (error: Error) => {
			toast.error(error.message || t('errors.generic'));
		},
	});

	const handleSubmit = (formData: FormData) => {
		updatePassword(formData);
	};

	if (success) {
		return (
			<Stack spacing={3}>
				<Alert severity="success" icon={<IconCheck />}>
					{t('passwordUpdated')}
				</Alert>
			</Stack>
		);
	}

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				<FormControl disabled={isPending} required error={!!errors.password}>
					<FormLabel htmlFor="password">{t('fields.password')}</FormLabel>
					<OutlinedInput id="password" name="password" type="password" required />
					{errors.password && <FormHelperText>{errors.password}</FormHelperText>}
				</FormControl>

				<FormControl disabled={isPending} required error={!!errors.confirmPassword}>
					<FormLabel htmlFor="confirmPassword">{t('fields.confirmPassword')}</FormLabel>
					<OutlinedInput
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
					/>
					{errors.confirmPassword && (
						<FormHelperText>{errors.confirmPassword}</FormHelperText>
					)}
				</FormControl>

				<Button
					disabled={isPending}
					endIcon={<IconArrowRight />}
					fullWidth
					type="submit"
					variant="contained"
					size="large"
				>
					{t('submit')}
				</Button>
			</Stack>
		</form>
	);
}


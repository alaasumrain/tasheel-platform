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
	Alert,
	Typography,
} from '@mui/material';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordForm() {
	const t = useTranslations('Auth.forgotPassword');
	const formRef = useRef<HTMLFormElement>(null);
	const [emailSent, setEmailSent] = useState(false);
	const [error, setError] = useState<string>('');

	const supabase = createClient();

	const { mutate: resetPassword, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			const email = formData.get('email') as string;

			if (!email || !email.includes('@')) {
				throw new Error(t('errors.emailInvalid'));
			}

			const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (resetError) {
				throw resetError;
			}
		},
		onSuccess: () => {
			setEmailSent(true);
			toast.success(t('success'));
			formRef.current?.reset();
		},
		onError: (error: Error) => {
			setError(error.message || t('errors.generic'));
			toast.error(error.message || t('errors.generic'));
		},
	});

	const handleSubmit = (formData: FormData) => {
		setError('');
		resetPassword(formData);
	};

	if (emailSent) {
		return (
			<Stack spacing={3}>
				<Alert severity="success" icon={<IconCheck />}>
					{t('emailSent')}
				</Alert>
			</Stack>
		);
	}

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				{error && (
					<Alert severity="error">
						<FormHelperText error>{error}</FormHelperText>
					</Alert>
				)}

				<Typography variant="body2" color="text.secondary">
					{t('description')}
				</Typography>

				<FormControl disabled={isPending} required error={!!error}>
					<FormLabel htmlFor="email">{t('fields.email')}</FormLabel>
					<OutlinedInput id="email" name="email" type="email" required />
					{error && <FormHelperText>{error}</FormHelperText>}
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


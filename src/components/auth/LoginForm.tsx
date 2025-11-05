'use client';

import { useRef, useState } from 'react';
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
	Link as MuiLink,
} from '@mui/material';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
	const t = useTranslations('Auth.login');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [error, setError] = useState<string>('');

	const supabase = createClient();

	const { mutate: login, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			if (!email || !password) {
				throw new Error(t('errors.fieldsRequired'));
			}

			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (authError) {
				throw authError;
			}

			if (!data.user) {
				throw new Error(t('errors.loginFailed'));
			}

			return data;
		},
		onSuccess: () => {
			toast.success(t('success'));
			formRef.current?.reset();
			router.push('/dashboard');
		},
		onError: (error: Error) => {
			setError(error.message || t('errors.generic'));
			toast.error(error.message || t('errors.generic'));
		},
	});

	const handleSubmit = (formData: FormData) => {
		setError('');
		login(formData);
	};

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				{error && (
					<Stack sx={{ color: 'error.main' }}>
						<FormHelperText error>{error}</FormHelperText>
					</Stack>
				)}

				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="email">{t('fields.email')}</FormLabel>
					<OutlinedInput id="email" name="email" type="email" required />
				</FormControl>

				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="password">{t('fields.password')}</FormLabel>
					<OutlinedInput id="password" name="password" type="password" required />
				</FormControl>

				<Stack direction="row" justifyContent="flex-end">
					<MuiLink component={Link} href="/forgot-password" underline="hover">
						{t('forgotPassword')}
					</MuiLink>
				</Stack>

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

				<Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
					<span>{t('noAccount')}</span>
					<MuiLink component={Link} href="/register" underline="hover">
						{t('registerLink')}
					</MuiLink>
				</Stack>
			</Stack>
		</form>
	);
}


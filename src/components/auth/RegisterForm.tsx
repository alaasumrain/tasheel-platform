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
	Alert,
	Link as MuiLink,
} from '@mui/material';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterForm() {
	const t = useTranslations('Auth.register');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [errors, setErrors] = useState<Record<string, string>>({});

	const supabase = createClient();

	const { mutate: register, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			const name = formData.get('name') as string;
			const email = formData.get('email') as string;
			const phone = formData.get('phone') as string;
			const password = formData.get('password') as string;
			const confirmPassword = formData.get('confirmPassword') as string;

			// Validation
			const newErrors: Record<string, string> = {};
			if (!name || name.length < 2) {
				newErrors.name = t('errors.nameRequired');
			}
			if (!email || !email.includes('@')) {
				newErrors.email = t('errors.emailInvalid');
			}
			if (!phone || phone.length < 10) {
				newErrors.phone = t('errors.phoneInvalid');
			}
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

			// Sign up with Supabase Auth
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						name,
						phone,
					},
				},
			});

			if (authError) {
				throw authError;
			}

			if (!authData.user) {
				throw new Error(t('errors.signupFailed'));
			}

			// Create customer profile
			const profileResponse = await fetch('/api/customer/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, phone }),
			});

			if (!profileResponse.ok) {
				console.error('Failed to create customer profile');
				// Continue anyway - profile can be created later
			}

			return authData;
		},
		onSuccess: () => {
			toast.success(t('success'));
			formRef.current?.reset();
			// Redirect to dashboard after a brief delay
			setTimeout(() => {
				router.push('/dashboard');
			}, 1500);
		},
		onError: (error: Error) => {
			toast.error(error.message || t('errors.generic'));
		},
	});

	const handleSubmit = (formData: FormData) => {
		register(formData);
	};

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				<FormControl disabled={isPending} required error={!!errors.name}>
					<FormLabel htmlFor="name">{t('fields.name')}</FormLabel>
					<OutlinedInput id="name" name="name" required />
					{errors.name && <FormHelperText>{errors.name}</FormHelperText>}
				</FormControl>

				<FormControl disabled={isPending} required error={!!errors.email}>
					<FormLabel htmlFor="email">{t('fields.email')}</FormLabel>
					<OutlinedInput id="email" name="email" type="email" required />
					{errors.email && <FormHelperText>{errors.email}</FormHelperText>}
				</FormControl>

				<FormControl disabled={isPending} required error={!!errors.phone}>
					<FormLabel htmlFor="phone">{t('fields.phone')}</FormLabel>
					<OutlinedInput id="phone" name="phone" type="tel" required />
					{errors.phone && <FormHelperText>{errors.phone}</FormHelperText>}
				</FormControl>

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

				<Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
					<span>{t('alreadyHaveAccount')}</span>
					<MuiLink component={Link} href="/login" underline="hover">
						{t('loginLink')}
					</MuiLink>
				</Stack>
			</Stack>
		</form>
	);
}


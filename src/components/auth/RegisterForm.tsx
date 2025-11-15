'use client';

import { useRef, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function RegisterForm() {
	const t = useTranslations('Auth.register');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [emailSent, setEmailSent] = useState(false);
	const [sentEmail, setSentEmail] = useState<string | null>(null);

	// Pre-fill form from URL params (e.g., from OTP verification flow)
	useEffect(() => {
		const emailParam = searchParams?.get('email');
		const nameParam = searchParams?.get('name');
		const phoneParam = searchParams?.get('phone');
		
		if (formRef.current) {
			if (emailParam) {
				const emailInput = formRef.current.querySelector('[name="email"]') as HTMLInputElement;
				if (emailInput) emailInput.value = emailParam;
			}
			if (nameParam) {
				const nameInput = formRef.current.querySelector('[name="name"]') as HTMLInputElement;
				if (nameInput) nameInput.value = nameParam;
			}
			if (phoneParam) {
				const phoneInput = formRef.current.querySelector('[name="phone"]') as HTMLInputElement;
				if (phoneInput) phoneInput.value = phoneParam;
			}
		}
	}, [searchParams]);

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

			// Sign up with email confirmation
			const { data, error } = await supabase.auth.signUp({
				email: email,
				password: password,
				options: {
					data: {
						name: name,
						phone: phone,
					},
					emailRedirectTo: `${window.location.origin}/dashboard`,
				},
			});

			if (error) {
				throw new Error(error.message || t('errors.signupFailed'));
			}

			if (!data.user) {
				throw new Error(t('errors.signupFailed'));
			}

			return { email };
		},
		onSuccess: (data) => {
			setEmailSent(true);
			setSentEmail(data.email);
			toast.success(t('confirmationEmailSent'));
			formRef.current?.reset();
		},
		onError: (error: Error) => {
			toast.error(error.message || t('errors.generic'));
		},
	});

	// Show email confirmation message
	if (emailSent && sentEmail) {
		return (
			<Stack spacing={3}>
				<Stack spacing={2} sx={{ textAlign: 'center', py: 4 }}>
					<h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
						{t('checkYourEmail')}
					</h2>
					<p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>
						{t('confirmationEmailMessage', { email: sentEmail })}
					</p>
					<p style={{ margin: '16px 0 0', color: '#9ca3af', fontSize: '14px' }}>
						{t('confirmationEmailNote')}
					</p>
				</Stack>
				<Button
					variant="outlined"
					fullWidth
					onClick={() => {
						setEmailSent(false);
						setSentEmail(null);
					}}
				>
					{t('back')}
				</Button>
			</Stack>
		);
	}

	return (
		<form ref={formRef} action={register}>
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
					<FormHelperText>
						{t('emailConfirmationRequired')}
					</FormHelperText>
				</FormControl>

				<FormControl disabled={isPending} required error={!!errors.password}>
					<FormLabel htmlFor="password">{t('fields.password')}</FormLabel>
					<OutlinedInput 
						id="password" 
						name="password" 
						type="password" 
						required 
						autoComplete="new-password"
					/>
					{errors.password && <FormHelperText>{errors.password}</FormHelperText>}
				</FormControl>

				<FormControl disabled={isPending} required error={!!errors.confirmPassword}>
					<FormLabel htmlFor="confirmPassword">{t('fields.confirmPassword')}</FormLabel>
					<OutlinedInput
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autoComplete="new-password"
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

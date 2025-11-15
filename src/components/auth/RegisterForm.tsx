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
import OTPVerification from './OTPVerification';

export default function RegisterForm() {
	const t = useTranslations('Auth.register');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showOTP, setShowOTP] = useState(false);
	const [formData, setFormData] = useState<{
		name: string;
		email: string;
		phone: string;
		password: string;
	} | null>(null);

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

	// Mutation to send OTP
	const { mutate: sendOTP, isPending: isSendingOTP } = useMutation({
		mutationFn: async (phone: string) => {
			const response = await fetch('/api/auth/send-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to send OTP');
			}

			return response.json();
		},
		onSuccess: () => {
			toast.success(t('otpSent'));
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	// Mutation to verify OTP and link account
	const { mutate: verifyOTPAndLink, isPending: isVerifyingOTP } = useMutation({
		mutationFn: async (otp: string) => {
			if (!formData) throw new Error('Form data missing');

			// Check if a phone-only account exists and link to it (with OTP verification)
			const linkResponse = await fetch('/api/auth/link-phone-account', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					phone: formData.phone,
					email: formData.email,
					password: formData.password,
					name: formData.name,
					otp, // SECURITY: Include OTP to prove phone ownership
				}),
			});

			const linkData = await linkResponse.json();

			if (!linkResponse.ok) {
				throw new Error(linkData.error || 'Failed to link account');
			}

			if (linkData.linked) {
				const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
					email: formData.email,
					password: formData.password,
				});
				if (signInError) throw signInError;
				return signInData;
			}

			const { data: authData, error: authError } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: { data: { name: formData.name, phone: formData.phone } },
			});
			if (authError) throw authError;
			if (!authData.user) throw new Error(t('errors.signupFailed'));
			return authData;
		},
		onSuccess: () => {
			toast.success(t('success'));
			formRef.current?.reset();
			setShowOTP(false);
			setFormData(null);
			setTimeout(() => router.push('/dashboard'), 1500);
		},
		onError: (error: Error) => {
			toast.error(error.message || t('errors.generic'));
		},
	});

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
			setFormData({ name, email, phone, password });
			setShowOTP(true);
			sendOTP(phone);
		},
		onError: (error: Error) => {
			toast.error(error.message || t('errors.generic'));
		},
	});

	// Show OTP verification step
	if (showOTP && formData) {
		return (
			<Stack spacing={3}>
				<OTPVerification
					phone={formData.phone}
					onVerify={async (otp) => verifyOTPAndLink(otp)}
					onResend={async () => sendOTP(formData.phone)}
					isPending={isVerifyingOTP || isSendingOTP}
				/>
				<Button
					variant="outlined"
					fullWidth
					onClick={() => {
						setShowOTP(false);
						setFormData(null);
					}}
					disabled={isVerifyingOTP || isSendingOTP}
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
						{t('phoneVerificationRequired')}
					</FormHelperText>
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

/**
 * Improved Login Form
 * Based on next-supabase-starter best practices
 * Clean, simple, with proper redirects and error handling
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	OutlinedInput,
	Stack,
	Link as MuiLink,
	Typography,
	Box,
	Divider,
} from '@mui/material';
import { IconArrowRight, IconLock, IconMail } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import { login } from '@/app/actions/auth';
import PasswordInput from '@/components/ui/password-input';
import OTPVerification from './OTPVerification';

type LoginMethod = 'email' | 'phone';

export default function LoginForm() {
	const t = useTranslations('Auth.login');
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const [isPending, startTransition] = useTransition();
	
	// Get redirect destination safely
	const redirectParam = searchParams?.get('redirect');
	const safeRedirect = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/dashboard';
	
	const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	
	// Phone/OTP state
	const [phone, setPhone] = useState('');
	const [otpSent, setOtpSent] = useState(false);
	const [otpError, setOtpError] = useState('');

	// Handle email/password login
	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError(t('errors.fieldsRequired'));
			return;
		}

		startTransition(async () => {
			const result = await login({ email, password });

			if ('error' in result && result.error) {
				setError(result.error);
				toast.error(result.error);
				return;
			}

			// Invalidate user query cache
			queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
			queryClient.invalidateQueries({ queryKey: ['user'] });
			
			toast.success(t('success'));
			router.push(safeRedirect);
		});
	};

	// Handle phone OTP send
	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setOtpError('');

		if (!phone) {
			setOtpError(t('errors.phoneRequired'));
			return;
		}

		startTransition(async () => {
			try {
				const response = await fetch('/api/auth/send-otp', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ phone }),
				});

				const data = await response.json();
				
				if (!response.ok) {
					throw new Error(data.error || 'Failed to send OTP');
				}

				toast.success(t('otpSent'));
				setOtpSent(true);
				
				// Show test OTP in development
				if (process.env.NODE_ENV === 'development' && data.testOtp) {
					console.log('Test OTP:', data.testOtp);
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : t('errors.otpSendFailed');
				setOtpError(errorMessage);
				toast.error(errorMessage);
			}
		});
	};

	// Handle OTP verification
	const handleVerifyOTP = async (otp: string) => {
		setOtpError('');

		startTransition(async () => {
			try {
				const response = await fetch('/api/auth/verify-otp', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ phone, otp }),
				});

				const data = await response.json();
				
				if (!response.ok) {
					throw new Error(data.error || 'Invalid OTP code');
				}

				// Invalidate user query cache
				queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
				queryClient.invalidateQueries({ queryKey: ['user'] });
				
				toast.success(t('otpVerified'));
				router.push(safeRedirect);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : t('errors.otpInvalid');
				setOtpError(errorMessage);
				toast.error(errorMessage);
			}
		});
	};

	const handleResendOTP = async () => {
		if (!phone) return;
				setOtpError('');
				startTransition(async () => {
					try {
						const response = await fetch('/api/auth/send-otp', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ phone }),
						});

						const data = await response.json();
						
						if (!response.ok) {
							throw new Error(data.error || 'Failed to send OTP');
						}

						toast.success(t('otpSent'));
						setOtpSent(true);
						
						if (process.env.NODE_ENV === 'development' && data.testOtp) {
							console.log('Test OTP:', data.testOtp);
						}
					} catch (err) {
						const errorMessage = err instanceof Error ? err.message : t('errors.otpSendFailed');
						setOtpError(errorMessage);
						toast.error(errorMessage);
					}
				});
	};

	// Show OTP verification if OTP was sent
	if (otpSent && loginMethod === 'phone') {
		return (
			<OTPVerification
				phone={phone}
				onVerify={handleVerifyOTP}
				onResend={handleResendOTP}
				isPending={isPending}
				error={otpError}
			/>
		);
	}

	return (
		<Stack spacing={3}>
			{/* Header */}
			<Box>
				<Typography variant="h4" fontWeight={700} gutterBottom>
					{t('title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{t('description')}
				</Typography>
			</Box>

			{/* Login Method Toggle */}
			<Stack direction="row" spacing={1} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 0.5 }}>
				<Button
					fullWidth
					variant={loginMethod === 'email' ? 'contained' : 'text'}
					onClick={() => {
						setLoginMethod('email');
						setError('');
						setOtpError('');
					}}
					size="small"
					startIcon={<IconMail size={18} />}
				>
					{t('methods.email')}
				</Button>
				<Button
					fullWidth
					variant={loginMethod === 'phone' ? 'contained' : 'text'}
					onClick={() => {
						setLoginMethod('phone');
						setError('');
						setOtpError('');
					}}
					size="small"
					startIcon={<IconLock size={18} />}
				>
					{t('methods.phone')}
				</Button>
			</Stack>

			{/* Error Display */}
			{(error || otpError) && (
				<Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
					<FormHelperText error sx={{ m: 0 }}>
						{error || otpError}
					</FormHelperText>
				</Box>
			)}

			{/* Email Login Form */}
			{loginMethod === 'email' && (
				<form onSubmit={handleEmailLogin}>
					<Stack spacing={3}>
						<FormControl required error={!!error}>
							<FormLabel htmlFor="email">{t('fields.email')}</FormLabel>
							<OutlinedInput
								id="email"
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setError('');
								}}
								placeholder={t('placeholders.email')}
								disabled={isPending}
								startAdornment={<IconMail size={20} style={{ marginRight: 8, opacity: 0.5 }} />}
								autoComplete="email"
							/>
						</FormControl>

						<FormControl required error={!!error}>
							<FormLabel htmlFor="password">{t('fields.password')}</FormLabel>
							<PasswordInput
								id="password"
								name="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setError('');
								}}
								disabled={isPending}
								fullWidth
								autoComplete="current-password"
							/>
						</FormControl>

						<Stack direction="row" justifyContent="flex-end">
							<MuiLink component={Link} href="/forgot-password" underline="hover" fontSize="small">
								{t('forgotPassword')}
							</MuiLink>
						</Stack>

						<Button
							type="submit"
							variant="contained"
							size="large"
							fullWidth
							disabled={isPending || !email || !password}
							endIcon={<IconArrowRight />}
						>
							{isPending ? t('signingIn') : t('signIn')}
						</Button>
					</Stack>
				</form>
			)}

			{/* Phone Login Form */}
			{loginMethod === 'phone' && (
				<form onSubmit={handleSendOTP}>
					<Stack spacing={3}>
						<FormControl required error={!!otpError}>
							<FormLabel htmlFor="phone">{t('fields.phone')}</FormLabel>
							<OutlinedInput
								id="phone"
								type="tel"
								value={phone}
								onChange={(e) => {
									setPhone(e.target.value);
									setOtpError('');
								}}
								placeholder={t('placeholders.phone')}
								disabled={isPending}
								autoComplete="tel"
							/>
							{otpError && <FormHelperText error>{otpError}</FormHelperText>}
							<FormHelperText>{t('phoneHelper')}</FormHelperText>
						</FormControl>

						<Button
							type="submit"
							variant="contained"
							size="large"
							fullWidth
							disabled={isPending || !phone}
							endIcon={<IconArrowRight />}
						>
							{isPending ? t('sending') : t('sendCode')}
						</Button>
					</Stack>
				</form>
			)}

			<Divider>
				<Typography variant="caption" color="text.secondary">
					{t('noAccount')}
				</Typography>
			</Divider>

			<Button
				variant="outlined"
				fullWidth
				component={Link}
				href="/register"
				disabled={isPending}
			>
				{t('registerLink')}
			</Button>
		</Stack>
	);
}


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
	ToggleButton,
	ToggleButtonGroup,
	Box,
	Typography,
} from '@mui/material';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import OTPVerification from './OTPVerification';

type LoginMethod = 'email' | 'phone';

type LoginResponse = 
	| { requiresMFA: true; factorId: string; challengeId: string; user: { id: string } }
	| { user: { id: string }; session: { access_token: string; refresh_token: string } };

export default function LoginForm() {
	const t = useTranslations('Auth.login');
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [error, setError] = useState<string>('');
	const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
	const [phone, setPhone] = useState<string>('');
	const [otpSent, setOtpSent] = useState(false);
	const [otpError, setOtpError] = useState<string>('');
	const [mfaRequired, setMfaRequired] = useState(false);
	const [mfaFactorId, setMfaFactorId] = useState<string>('');
	const [mfaChallengeId, setMfaChallengeId] = useState<string>('');
	const [mfaCode, setMfaCode] = useState<string>('');
	const [mfaError, setMfaError] = useState<string>('');

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

			// Check if MFA is required
			// If session is null but user exists, MFA is likely required
			if (!data.session && data.user) {
				// Check if user has MFA factors enrolled
				// Note: listFactors() may work even without full session for partially authenticated users
				const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
				
				if (!factorsError && factors?.totp && factors.totp.length > 0) {
					// MFA is enabled - create challenge
					const totpFactor = factors.totp[0];
					const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
						factorId: totpFactor.id,
					});

					if (!challengeError && challengeData) {
						// Return challenge info for MFA verification
						return {
							requiresMFA: true as const,
							factorId: totpFactor.id,
							challengeId: challengeData.id,
							user: data.user,
						};
					}
				}
			}

			return data;
		},
		onSuccess: (data: LoginResponse) => {
			if ('requiresMFA' in data && data.requiresMFA) {
				// Show MFA verification UI
				setMfaRequired(true);
				setMfaFactorId(data.factorId);
				setMfaChallengeId(data.challengeId);
			} else {
				// Normal login success
				toast.success(t('success'));
				formRef.current?.reset();
				router.push('/dashboard');
			}
		},
		onError: (error: Error) => {
			setError(error.message || t('errors.generic'));
			toast.error(error.message || t('errors.generic'));
		},
	});

	const { mutate: sendOTP, isPending: isSendingOTP } = useMutation({
		mutationFn: async (phoneNumber: string) => {
			const response = await fetch('/api/auth/send-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone: phoneNumber }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Failed to send OTP');
			}

			return data;
		},
		onSuccess: (data) => {
			toast.success(t('otpSent'));
			setOtpSent(true);
			setOtpError('');
			// In development, show OTP in console
			if (process.env.NODE_ENV === 'development' && data.testOtp) {
				console.log('Test OTP:', data.testOtp);
			}
		},
		onError: (error: Error) => {
			setOtpError(error.message || t('errors.otpSendFailed'));
			toast.error(error.message || t('errors.otpSendFailed'));
		},
	});

	const { mutate: verifyOTP, isPending: isVerifyingOTP } = useMutation({
		mutationFn: async (otpCode: string) => {
			const response = await fetch('/api/auth/verify-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone, otp: otpCode }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Invalid OTP code');
			}

			// If session tokens are returned, set the session on the client
			if (data.accessToken && data.refreshToken) {
				const { error: sessionError } = await supabase.auth.setSession({
					access_token: data.accessToken,
					refresh_token: data.refreshToken,
				});

				if (sessionError) {
					throw new Error('Failed to create session');
				}

				// Session is set, redirect to dashboard
				router.push('/dashboard');
				return data;
			}

			// If user exists but needs email auth (fallback case)
			if (data.userId && data.email && data.requiresEmailAuth) {
				// Prompt user to sign in with email/password or use magic link
				toast.error(t('errors.emailAuthRequired') || 'Please sign in with your email and password');
				return data;
			}

			// If registration needed
			if (data.requiresRegistration) {
				router.push(`/register?phone=${encodeURIComponent(phone)}`);
				return data;
			}

			return data;
		},
		onSuccess: (data) => {
			if (!data.requiresRegistration && !data.requiresEmailAuth && !data.accessToken) {
				toast.success(t('otpVerified'));
			}
		},
		onError: (error: Error) => {
			setOtpError(error.message || t('errors.otpInvalid'));
			toast.error(error.message || t('errors.otpInvalid'));
		},
	});

	const handleVerifyOTP = async (otp: string) => {
		verifyOTP(otp);
	};

	const { mutate: verifyMFA, isPending: isVerifyingMFA } = useMutation({
		mutationFn: async (code: string) => {
			const { data, error } = await supabase.auth.mfa.verify({
				factorId: mfaFactorId,
				challengeId: mfaChallengeId,
				code: code,
			});

			if (error) {
				throw error;
			}

			return data;
		},
		onSuccess: () => {
			toast.success(t('mfaVerified') || 'MFA verified successfully');
			formRef.current?.reset();
			router.push('/dashboard');
		},
		onError: (error: Error) => {
			setMfaError(error.message || t('errors.mfaInvalid') || 'Invalid MFA code');
			toast.error(error.message || t('errors.mfaInvalid') || 'Invalid MFA code');
		},
	});

	const handleVerifyMFA = async (code: string) => {
		setMfaError('');
		verifyMFA(code);
	};

	const handleSubmit = (formData: FormData) => {
		setError('');
		if (loginMethod === 'email') {
			login(formData);
		} else {
			// Phone login - send OTP
			const phoneNumber = formData.get('phone') as string;
			if (!phoneNumber) {
				setOtpError(t('errors.phoneRequired'));
				return;
			}
			setPhone(phoneNumber);
			sendOTP(phoneNumber);
		}
	};

	const handleResendOTP = async () => {
		if (!phone) return;
		setOtpError('');
		sendOTP(phone);
	};

	if (otpSent && loginMethod === 'phone') {
		return (
			<OTPVerification
				phone={phone}
				onVerify={handleVerifyOTP}
				onResend={handleResendOTP}
				isPending={isVerifyingOTP}
				error={otpError}
			/>
		);
	}

	// Show MFA verification UI if required
	if (mfaRequired) {
		return (
			<Stack spacing={3}>
				<Box>
					<Typography variant="h6" fontWeight={600} gutterBottom>
						{t('mfaTitle') || 'Two-Factor Authentication'}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{t('mfaDescription') || 'Please enter the code from your authenticator app'}
					</Typography>
				</Box>

				<FormControl error={!!mfaError} fullWidth>
					<FormLabel>{t('mfaCode') || 'Verification Code'}</FormLabel>
					<OutlinedInput
						value={mfaCode}
						onChange={(e) => {
							setMfaCode(e.target.value);
							setMfaError('');
						}}
						placeholder="000000"
						inputProps={{ maxLength: 6 }}
						disabled={isVerifyingMFA}
						error={!!mfaError}
						autoFocus
					/>
					{mfaError && <FormHelperText error>{mfaError}</FormHelperText>}
				</FormControl>

				<Button
					variant="contained"
					fullWidth
					size="large"
					onClick={() => handleVerifyMFA(mfaCode)}
					disabled={isVerifyingMFA || mfaCode.length !== 6}
					endIcon={<IconArrowRight />}
				>
					{isVerifyingMFA ? (t('verifying') || 'Verifying...') : (t('verify') || 'Verify')}
				</Button>

				<Button
					variant="text"
					fullWidth
					onClick={() => {
						setMfaRequired(false);
						setMfaCode('');
						setMfaError('');
						formRef.current?.reset();
					}}
				>
					{t('back') || 'Back'}
				</Button>
			</Stack>
		);
	}

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				{/* Login Method Toggle */}
				<Box>
					<ToggleButtonGroup
						value={loginMethod}
						exclusive
						onChange={(_, value) => {
							if (value) {
								setLoginMethod(value);
								setError('');
								setOtpError('');
								setOtpSent(false);
							}
						}}
						fullWidth
						size="small"
					>
						<ToggleButton value="email">{t('methods.email')}</ToggleButton>
						<ToggleButton value="phone">{t('methods.phone')}</ToggleButton>
					</ToggleButtonGroup>
				</Box>

				{error && (
					<Stack sx={{ color: 'error.main' }}>
						<FormHelperText error>{error}</FormHelperText>
					</Stack>
				)}

				{loginMethod === 'email' ? (
					<>
						<FormControl disabled={isPending} required>
							<FormLabel htmlFor="email">{t('fields.email')}</FormLabel>
							<OutlinedInput id="email" name="email" type="email" required />
						</FormControl>

						<FormControl disabled={isPending} required>
							<FormLabel htmlFor="password">{t('fields.password')}</FormLabel>
							<OutlinedInput id="password" name="password" type="password" required />
						</FormControl>
					</>
				) : (
					<>
						<FormControl disabled={isSendingOTP} required error={!!otpError}>
							<FormLabel htmlFor="phone">{t('fields.phone')}</FormLabel>
							<OutlinedInput
								id="phone"
								name="phone"
								type="tel"
								required
								placeholder="0599123456"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
							{otpError && <FormHelperText error>{otpError}</FormHelperText>}
							<FormHelperText>{t('phoneHelper')}</FormHelperText>
						</FormControl>
					</>
				)}

				{loginMethod === 'email' && (
					<Stack direction="row" justifyContent="flex-end">
						<MuiLink component={Link} href="/forgot-password" underline="hover">
							{t('forgotPassword')}
						</MuiLink>
					</Stack>
				)}

				<Button
					disabled={isPending || isSendingOTP}
					endIcon={<IconArrowRight />}
					fullWidth
					type="submit"
					variant="contained"
					size="large"
				>
					{loginMethod === 'email' ? t('submit') : t('sendOTP')}
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


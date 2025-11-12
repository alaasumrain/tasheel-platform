'use client';

import { useState, useRef, useEffect } from 'react';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	OutlinedInput,
	Stack,
	Typography,
	Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';

interface OTPVerificationProps {
	phone: string;
	onVerify: (otp: string) => Promise<void>;
	onResend: () => Promise<void>;
	isPending?: boolean;
	error?: string;
}

export default function OTPVerification({
	phone,
	onVerify,
	onResend,
	isPending = false,
	error,
}: OTPVerificationProps) {
	const t = useTranslations('Auth.otp');
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [resendCooldown, setResendCooldown] = useState(0);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Countdown timer for resend
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => {
				setResendCooldown(resendCooldown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleChange = (index: number, value: string) => {
		// Only allow digits
		if (value && !/^\d$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}

		// Auto-submit when all fields filled
		if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
			handleSubmit(newOtp.join(''));
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
		if (pastedData.length === 6) {
			const newOtp = pastedData.split('');
			setOtp(newOtp);
			inputRefs.current[5]?.focus();
			// Auto-submit
			setTimeout(() => handleSubmit(pastedData), 100);
		}
	};

	const handleSubmit = async (code?: string) => {
		const codeToVerify = code || otp.join('');
		if (codeToVerify.length === 6) {
			await onVerify(codeToVerify);
		}
	};

	const handleResend = async () => {
		if (resendCooldown > 0) return;
		setOtp(['', '', '', '', '', '']);
		setResendCooldown(60); // 60 second cooldown
		inputRefs.current[0]?.focus();
		await onResend();
	};

	return (
		<Stack spacing={3}>
			<Box>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{t('title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{t('description', { phone })}
				</Typography>
			</Box>

			<FormControl error={!!error} fullWidth>
				<FormLabel>{t('enterCode')}</FormLabel>
				<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
					{otp.map((digit, index) => (
						<OutlinedInput
							key={index}
							inputRef={(el) => {
								inputRefs.current[index] = el;
							}}
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={index === 0 ? handlePaste : undefined}
							inputProps={{
								maxLength: 1,
								style: { textAlign: 'center', fontSize: '1.5rem' },
							}}
							sx={{ width: 56, height: 56 }}
							disabled={isPending}
							error={!!error}
							autoFocus={index === 0}
						/>
					))}
				</Stack>
				{error && <FormHelperText error>{error}</FormHelperText>}
			</FormControl>

			<Button
				variant="contained"
				fullWidth
				size="large"
				onClick={() => handleSubmit()}
				disabled={isPending || otp.some(d => !d)}
			>
				{isPending ? t('verifying') : t('verify')}
			</Button>

			<Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
				<Typography variant="body2" color="text.secondary">
					{t('didntReceive')}
				</Typography>
				<Button
					variant="text"
					size="small"
					onClick={handleResend}
					disabled={resendCooldown > 0 || isPending}
				>
					{resendCooldown > 0 ? t('resendIn', { seconds: resendCooldown }) : t('resend')}
				</Button>
			</Stack>
		</Stack>
	);
}


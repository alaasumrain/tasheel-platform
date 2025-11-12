'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
	Box,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import { IconCheck, IconShield, IconQrcode } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';

interface MFAEnrollmentProps {
	onClose: () => void;
	onEnrolled: () => void;
}

function MFAEnrollmentDialog({ onClose, onEnrolled }: MFAEnrollmentProps) {
	const t = useTranslations('Dashboard.profile.mfa');
	const supabase = createClient();
	const [qrCode, setQrCode] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	const [verificationCode, setVerificationCode] = useState<string>('');
	const [factorId, setFactorId] = useState<string>('');
	const [error, setError] = useState<string>('');

	const { mutate: enrollFactor, isPending: isEnrolling } = useMutation({
		mutationFn: async () => {
			const { data, error } = await supabase.auth.mfa.enroll({
				factorType: 'totp',
				friendlyName: 'Authenticator App',
			});

			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			setQrCode(data.totp?.qr_code || '');
			setSecret(data.totp?.secret || '');
			setFactorId(data.id);
		},
		onError: (error: Error) => {
			setError(error.message);
			toast.error(error.message);
		},
	});

	const { mutate: verifyFactor, isPending: isVerifying } = useMutation({
		mutationFn: async (code: string) => {
			if (!factorId) throw new Error('Factor ID not found');

			// Use challengeAndVerify helper which combines challenge creation and verification
			// This is the recommended approach for TOTP enrollment according to Supabase docs
			const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
				factorId,
				code,
			});

			if (verifyError) throw verifyError;
		},
		onSuccess: () => {
			toast.success(t('enrolledSuccess'));
			onEnrolled();
			onClose();
		},
		onError: (error: Error) => {
			setError(error.message);
			toast.error(error.message);
		},
	});

	useEffect(() => {
		enrollFactor();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Dialog open onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{t('enrollTitle')}</DialogTitle>
			<DialogContent>
				<Stack spacing={3}>
					{error && <Alert severity="error">{error}</Alert>}

					{qrCode ? (
						<>
							<Typography variant="body2" color="text.secondary">
								{t('scanQR')}
							</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
								<img src={qrCode} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
							</Box>
							<Typography variant="body2" color="text.secondary">
								{t('orEnterSecret')} {secret}
							</Typography>

							<FormControl fullWidth>
								<FormLabel>{t('enterCode')}</FormLabel>
								<OutlinedInput
									value={verificationCode}
									onChange={(e) => {
										setVerificationCode(e.target.value);
										setError('');
									}}
									placeholder="000000"
									inputProps={{ maxLength: 6 }}
									disabled={isVerifying}
								/>
								{error && <FormHelperText error>{error}</FormHelperText>}
							</FormControl>
						</>
					) : (
						<Typography>{t('generatingQR')}</Typography>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isVerifying}>
					{t('cancel')}
				</Button>
				<Button
					variant="contained"
					onClick={() => verifyFactor(verificationCode)}
					disabled={isVerifying || verificationCode.length !== 6 || !qrCode}
				>
					{isVerifying ? t('verifying') : t('verify')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export function MFASettings() {
	const t = useTranslations('Dashboard.profile.mfa');
	const supabase = createClient();
	const [showEnrollDialog, setShowEnrollDialog] = useState(false);

	const { data: factors, refetch } = useQuery({
		queryKey: ['mfa-factors'],
		queryFn: async () => {
			const { data, error } = await supabase.auth.mfa.listFactors();
			if (error) throw error;
			return data;
		},
	});

	const { mutate: unenrollFactor, isPending: isUnenrolling } = useMutation({
		mutationFn: async (factorId: string) => {
			const { error } = await supabase.auth.mfa.unenroll({ factorId });
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success(t('unenrolledSuccess'));
			refetch();
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const totpFactors = factors?.totp || [];
	const hasMFA = totpFactors.length > 0;

	return (
		<Stack spacing={3}>
			<Stack direction="row" spacing={2} alignItems="center">
				<IconShield size={24} />
				<Typography variant="h6" fontWeight={600}>
					{t('title')}
				</Typography>
			</Stack>

			<Typography variant="body2" color="text.secondary">
				{t('description')}
			</Typography>

			{hasMFA ? (
				<>
					<Alert severity="success" icon={<IconCheck />}>
						{t('enabled')}
					</Alert>
					<Stack spacing={2}>
						{totpFactors.map((factor) => (
							<Box key={factor.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Stack>
										<Typography variant="body1" fontWeight={500}>
											{factor.friendly_name || t('authenticatorApp')}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{t('enrolledAt')} {new Date(factor.created_at).toLocaleDateString()}
										</Typography>
									</Stack>
									<Button
										variant="outlined"
										color="error"
										size="small"
										onClick={() => unenrollFactor(factor.id)}
										disabled={isUnenrolling}
									>
										{t('remove')}
									</Button>
								</Stack>
							</Box>
						))}
					</Stack>
				</>
			) : (
				<Alert severity="info">{t('notEnabled')}</Alert>
			)}

			<Button
				variant={hasMFA ? 'outlined' : 'contained'}
				startIcon={<IconQrcode />}
				onClick={() => setShowEnrollDialog(true)}
				fullWidth
			>
				{hasMFA ? t('addAnother') : t('enable')}
			</Button>

			{showEnrollDialog && (
				<MFAEnrollmentDialog
					onClose={() => setShowEnrollDialog(false)}
					onEnrolled={() => refetch()}
				/>
			)}
		</Stack>
	);
}


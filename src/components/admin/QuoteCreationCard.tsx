'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Typography,
	Button,
	TextField,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface QuoteCreationCardProps {
	orderId: string;
	customerEmail: string;
}

export function QuoteCreationCard({ orderId, customerEmail }: QuoteCreationCardProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState('');
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const t = useTranslations('Admin.quote');

	const handleCreateQuote = async () => {
		if (!amount || isNaN(parseFloat(amount))) {
			setError(t('amountRequired') || 'Amount is required');
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const response = await fetch('/api/admin/quotes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					application_id: orderId,
					amount: parseFloat(amount),
					notes: notes || undefined,
				}),
			});

			if (response.ok) {
				setSuccess(true);
				setAmount('');
				setNotes('');
				setTimeout(() => {
					setOpen(false);
					setSuccess(false);
					// Refresh page data without full reload
					router.refresh();
				}, 2000);
			} else {
				const errorData = await response.json();
				setError(errorData.error || t('quoteCreationFailed') || 'Failed to create quote');
			}
		} catch (error) {
			console.error('Error creating quote:', error);
			setError(t('errorOccurred') || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Card
				backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
				borderColor={{ light: 'divider', dark: 'divider' }}
				borderRadius={20}
			>
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" fontWeight={600} gutterBottom>
						{t('createQuote')}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						{t('createQuoteDescription')}
					</Typography>
					<Button
						fullWidth
						variant="outlined"
						onClick={() => setOpen(true)}
					>
						{t('createQuote')}
					</Button>
				</Box>
			</Card>

			<Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>{t('createQuote')}</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TextField
							fullWidth
							label={t('amountNIS')}
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
							inputProps={{ min: 0, step: 0.01 }}
						/>
						<TextField
							fullWidth
							multiline
							rows={3}
							label={t('notesOptional')}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder={t('notesPlaceholder')}
						/>
						{success && (
							<Alert severity="success">{t('quoteCreated')}</Alert>
						)}
						{error && (
							<Alert severity="error">{error}</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)} disabled={loading}>
						{t('cancel')}
					</Button>
					<Button
						variant="contained"
						onClick={handleCreateQuote}
						disabled={loading || !amount || isNaN(parseFloat(amount))}
					>
						{loading ? t('creating') : t('createAndSend')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}


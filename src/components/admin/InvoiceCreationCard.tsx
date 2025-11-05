'use client';

import { useState } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslations } from 'next-intl';

interface InvoiceCreationCardProps {
	orderId: string;
	applicationId: string;
}

export function InvoiceCreationCard({ orderId, applicationId }: InvoiceCreationCardProps) {
	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState('');
	const [dueDate, setDueDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const t = useTranslations('Admin.invoice');

	const handleCreateInvoice = async () => {
		if (!amount || isNaN(parseFloat(amount)) || !dueDate) {
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/admin/invoices', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					application_id: applicationId,
					amount: parseFloat(amount),
					due_date: dueDate.toISOString().split('T')[0],
				}),
			});

			if (response.ok) {
				setSuccess(true);
				setAmount('');
				setDueDate(null);
				setTimeout(() => {
					setOpen(false);
					setSuccess(false);
				}, 2000);
			}
		} catch (error) {
			console.error('Error creating invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Card
				backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
				borderColor={{ light: '#e0e0e0', dark: '#333333' }}
				borderRadius={20}
			>
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" fontWeight={600} gutterBottom>
						{t('createInvoice')}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						{t('createInvoiceDescription')}
					</Typography>
					<Button
						fullWidth
						variant="outlined"
						onClick={() => setOpen(true)}
					>
						{t('createInvoice')}
					</Button>
				</Box>
			</Card>

			<Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>{t('createInvoice')}</DialogTitle>
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
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								label={t('dueDate')}
								value={dueDate}
								onChange={(newValue) => setDueDate(newValue)}
								slotProps={{
									textField: {
										fullWidth: true,
										required: true,
									},
								}}
							/>
						</LocalizationProvider>
						{success && (
							<Alert severity="success">{t('invoiceCreated')}</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)} disabled={loading}>
						{t('cancel')}
					</Button>
					<Button
						variant="contained"
						onClick={handleCreateInvoice}
						disabled={loading || !amount || !dueDate || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
					>
						{loading ? t('creating') : t('createInvoiceButton')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}


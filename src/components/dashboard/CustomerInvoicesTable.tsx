'use client';

import { useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Button,
	Stack,
	TextField,
	InputAdornment,
} from '@mui/material';
import { IconSearch, IconEye, IconFileText, IconDownload } from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';
import type { Invoice } from '@/lib/admin-queries';
import { Typography } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { EmptyState } from '@/components/ui/state-components';
import { Card } from '@/components/ui/card';

interface CustomerInvoicesTableProps {
	invoices: Invoice[];
}

const statusColors: Record<
	Invoice['status'],
	'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
> = {
	pending: 'warning',
	paid: 'success',
	failed: 'error',
	cancelled: 'default',
};

// Reuse formatting functions from admin components pattern
function formatDate(dateString: string, locale: string = 'en'): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

function formatCurrency(amount: number, currency: string = 'ILS'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
	}).format(amount);
}

export function CustomerInvoicesTable({ invoices }: CustomerInvoicesTableProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const t = useTranslations('Dashboard.invoices');
	const locale = useLocale() as 'en' | 'ar';

	const filteredInvoices = invoices.filter(
		(invoice) =>
			!searchTerm ||
			invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Stack spacing={3}>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				<TextField
					placeholder={t('searchPlaceholder')}
					size="small"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<IconSearch size={20} />
							</InputAdornment>
						),
					}}
					sx={{ maxWidth: 300 }}
				/>
			</Box>

			{filteredInvoices.length === 0 ? (
				<EmptyState
					variant={searchTerm ? 'no-results' : 'no-orders'}
					title={searchTerm ? t('noResults') : t('noInvoices')}
					description={searchTerm ? t('noResultsDescription') : t('noInvoicesDescription')}
					icon={<IconFileText size={48} />}
				/>
			) : (
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<TableContainer component={Box} sx={{ borderRadius: 2 }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>{t('table.invoiceNumber')}</TableCell>
									<TableCell>{t('table.amount')}</TableCell>
									<TableCell>{t('table.status')}</TableCell>
									<TableCell>{t('table.created')}</TableCell>
									<TableCell>{t('table.paidAt')}</TableCell>
									<TableCell align="right">{t('table.actions')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredInvoices.map((invoice) => (
									<TableRow key={invoice.id} hover>
										<TableCell>
											<Typography variant="body2" fontWeight={600}>
												{invoice.invoice_number || t('notAvailable')}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2" fontWeight={600}>
												{formatCurrency(invoice.amount, invoice.currency)}
											</Typography>
										</TableCell>
										<TableCell>
											<Chip
												label={t(`statusLabels.${invoice.status}` as any)}
												color={statusColors[invoice.status]}
												size="small"
											/>
										</TableCell>
										<TableCell>
											<Typography variant="body2" color="text.secondary">
												{formatDate(invoice.created_at, locale)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2" color="text.secondary">
												{invoice.paid_at ? formatDate(invoice.paid_at, locale) : '-'}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Stack direction="row" spacing={1} justifyContent="flex-end">
												{invoice.payment_link && invoice.status === 'pending' && (
													<Button
														component="a"
														href={invoice.payment_link}
														target="_blank"
														size="small"
														variant="contained"
														startIcon={<IconDownload size={18} />}
													>
														{t('table.pay')}
													</Button>
												)}
												<Button
													component={Link}
													href={`/dashboard/invoices/${invoice.id}`}
													size="small"
													variant="outlined"
													startIcon={<IconEye size={18} />}
												>
													{t('table.view')}
												</Button>
											</Stack>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Card>
			)}
		</Stack>
	);
}


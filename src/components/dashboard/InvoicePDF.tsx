'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@mui/material';
import { IconDownload } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

interface Invoice {
	id: string;
	invoice_number: string;
	amount: number;
	currency: string;
	status: string;
	created_at: string;
	application_id: string;
}

interface InvoicePDFProps {
	invoice: Invoice;
	customerName?: string;
	customerEmail?: string;
	serviceName?: string;
}

// PDF Styles
const styles = StyleSheet.create({
	page: {
		fontFamily: 'Helvetica',
		padding: 40,
		fontSize: 12,
	},
	header: {
		marginBottom: 30,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	companyInfo: {
		marginBottom: 20,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	label: {
		fontWeight: 'bold',
	},
	value: {
		color: '#666',
	},
	table: {
		marginTop: 20,
	},
	tableRow: {
		flexDirection: 'row',
		borderBottom: '1pt solid #eee',
		padding: 10,
	},
	tableHeader: {
		backgroundColor: '#f5f5f5',
		fontWeight: 'bold',
	},
	tableCell: {
		flex: 1,
	},
	total: {
		marginTop: 20,
		padding: 15,
		backgroundColor: '#f9f9f9',
		borderRadius: 5,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	totalAmount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	footer: {
		marginTop: 40,
		paddingTop: 20,
		borderTop: '1pt solid #eee',
		fontSize: 10,
		color: '#999',
		textAlign: 'center',
	},
});

// Invoice PDF Document Component (receives translations as props)
const InvoiceDocument = ({
	invoice,
	customerName,
	customerEmail,
	serviceName,
	translations,
	locale,
}: InvoicePDFProps & { translations: any; locale: string }) => {
	const isRTL = locale === 'ar';
	const t = translations;

	return (
		<Document>
			<Page size="A4" style={[styles.page, isRTL ? { direction: 'rtl' } : {}]}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>{t.title}</Text>
					<Text style={styles.companyInfo}>
						{t.companyName}
						{'\n'}
						{t.companyAddress}
						{'\n'}
						{t.companyPhone}
					</Text>
				</View>

				{/* Invoice Details */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>{t.invoiceDetails}</Text>
					<View style={styles.row}>
						<Text style={styles.label}>{t.invoiceNumber}:</Text>
						<Text style={styles.value}>{invoice.invoice_number}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>{t.date}:</Text>
						<Text style={styles.value}>
							{new Date(invoice.created_at).toLocaleDateString(locale)}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>{t.status}:</Text>
						<Text style={styles.value}>{invoice.status}</Text>
					</View>
				</View>

				{/* Customer Details */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>{t.customerDetails}</Text>
					{customerName && (
						<View style={styles.row}>
							<Text style={styles.label}>{t.name}:</Text>
							<Text style={styles.value}>{customerName}</Text>
						</View>
					)}
					{customerEmail && (
						<View style={styles.row}>
							<Text style={styles.label}>{t.email}:</Text>
							<Text style={styles.value}>{customerEmail}</Text>
						</View>
					)}
					{serviceName && (
						<View style={styles.row}>
							<Text style={styles.label}>{t.service}:</Text>
							<Text style={styles.value}>{serviceName}</Text>
						</View>
					)}
				</View>

				{/* Items Table */}
				<View style={styles.table}>
					<View style={[styles.tableRow, styles.tableHeader]}>
						<Text style={styles.tableCell}>{t.description}</Text>
						<Text style={styles.tableCell}>{t.amount}</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>
							{serviceName || t.serviceFee}
						</Text>
						<Text style={styles.tableCell}>
							{invoice.amount.toFixed(2)} {invoice.currency}
						</Text>
					</View>
				</View>

				{/* Total */}
				<View style={styles.total}>
					<View style={styles.totalRow}>
						<Text style={styles.label}>{t.total}:</Text>
						<Text style={styles.totalAmount}>
							{invoice.amount.toFixed(2)} {invoice.currency}
						</Text>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<Text>{t.footer}</Text>
				</View>
			</Page>
		</Document>
	);
};

// Wrapper Component with Download Button
export function InvoicePDF({ invoice, customerName, customerEmail, serviceName }: InvoicePDFProps) {
	const t = useTranslations('Invoice');
	const locale = useLocale();

	// Get all translations for PDF
	const translations = {
		title: t('title'),
		companyName: t('companyName'),
		companyAddress: t('companyAddress'),
		companyPhone: t('companyPhone'),
		invoiceDetails: t('invoiceDetails'),
		invoiceNumber: t('invoiceNumber'),
		date: t('date'),
		status: t('status'),
		customerDetails: t('customerDetails'),
		name: t('name'),
		email: t('email'),
		service: t('service'),
		description: t('description'),
		amount: t('amount'),
		serviceFee: t('serviceFee'),
		total: t('total'),
		footer: t('footer'),
	};

	return (
		<PDFDownloadLink
			document={
				<InvoiceDocument
					invoice={invoice}
					customerName={customerName}
					customerEmail={customerEmail}
					serviceName={serviceName}
					translations={translations}
					locale={locale}
				/>
			}
			fileName={`${invoice.invoice_number}.pdf`}
		>
			{({ loading }) => (
				<Button
					variant="contained"
					startIcon={<IconDownload size={20} />}
					disabled={loading}
				>
					{loading ? t('generating') : t('download')}
				</Button>
			)}
		</PDFDownloadLink>
	);
}


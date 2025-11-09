/**
 * Export Utilities
 * CSV and data export functionality
 */

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
	data: T[],
	columns?: Array<{ key: keyof T; label: string }>
): string {
	if (data.length === 0) return '';

	// Get headers
	const headers = columns
		? columns.map((col) => col.label)
		: Object.keys(data[0]);

	// Get rows
	const rows = data.map((row) => {
		if (columns) {
			return columns.map((col) => {
				const value = row[col.key];
				// Handle nested objects and arrays
				if (value === null || value === undefined) return '';
				if (typeof value === 'object') return JSON.stringify(value);
				// Escape commas and quotes
				const stringValue = String(value);
				if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
					return `"${stringValue.replace(/"/g, '""')}"`;
				}
				return stringValue;
			});
		}
		return Object.values(row).map((value) => {
			if (value === null || value === undefined) return '';
			if (typeof value === 'object') return JSON.stringify(value);
			const stringValue = String(value);
			if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
				return `"${stringValue.replace(/"/g, '""')}"`;
			}
			return stringValue;
		});
	});

	// Combine headers and rows
	const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

	return csvContent;
}

/**
 * Download data as CSV file
 */
export function downloadCSV<T extends Record<string, any>>(
	data: T[],
	filename: string,
	columns?: Array<{ key: keyof T; label: string }>
): void {
	const csvContent = arrayToCSV(data, columns);
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', `${filename}.csv`);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
}

/**
 * Export orders to CSV
 */
export function exportOrdersToCSV(orders: any[]): void {
	const columns = [
		{ key: 'order_number', label: 'Order Number' },
		{ key: 'customer_name', label: 'Customer Name' },
		{ key: 'customer_phone', label: 'Phone' },
		{ key: 'applicant_email', label: 'Email' },
		{ key: 'service_slug', label: 'Service' },
		{ key: 'status', label: 'Status' },
		{ key: 'submitted_at', label: 'Submitted At' },
	];

	const formattedOrders = orders.map((order) => ({
		...order,
		submitted_at: formatDateForExport(order.submitted_at),
	}));

	downloadCSV(formattedOrders, `orders-${new Date().toISOString().split('T')[0]}`, columns);
}

/**
 * Export services to CSV
 */
export function exportServicesToCSV(services: any[]): void {
	const columns = [
		{ key: 'name_en', label: 'Name (EN)' },
		{ key: 'name_ar', label: 'Name (AR)' },
		{ key: 'slug', label: 'Slug' },
		{ key: 'category_id', label: 'Category' },
		{ key: 'is_active', label: 'Active' },
		{ key: 'is_featured', label: 'Featured' },
		{ key: 'sort_order', label: 'Sort Order' },
	];

	downloadCSV(services, `services-${new Date().toISOString().split('T')[0]}`, columns);
}

/**
 * Export users to CSV
 */
export function exportUsersToCSV(users: any[]): void {
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'role', label: 'Role' },
		{ key: 'is_active', label: 'Active' },
		{ key: 'created_at', label: 'Created At' },
	];

	const formattedUsers = users.map((user) => ({
		...user,
		created_at: formatDateForExport(user.created_at),
	}));

	downloadCSV(formattedUsers, `users-${new Date().toISOString().split('T')[0]}`, columns);
}

/**
 * Export customers to CSV
 */
export function exportCustomersToCSV(customers: any[]): void {
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'language_preference', label: 'Language' },
		{ key: 'created_at', label: 'Created At' },
	];

	const formattedCustomers = customers.map((customer) => ({
		...customer,
		created_at: formatDateForExport(customer.created_at),
	}));

	downloadCSV(formattedCustomers, `customers-${new Date().toISOString().split('T')[0]}`, columns);
}

/**
 * Export invoices to CSV
 */
export function exportInvoicesToCSV(invoices: any[]): void {
	const columns = [
		{ key: 'invoice_number', label: 'Invoice Number' },
		{ key: 'amount', label: 'Amount' },
		{ key: 'currency', label: 'Currency' },
		{ key: 'status', label: 'Status' },
		{ key: 'created_at', label: 'Created At' },
		{ key: 'paid_at', label: 'Paid At' },
	];

	const formattedInvoices = invoices.map((invoice) => ({
		...invoice,
		created_at: formatDateForExport(invoice.created_at),
		paid_at: invoice.paid_at ? formatDateForExport(invoice.paid_at) : '',
	}));

	downloadCSV(formattedInvoices, `invoices-${new Date().toISOString().split('T')[0]}`, columns);
}

/**
 * Export payments to CSV
 */
export function exportPaymentsToCSV(payments: any[]): void {
	const columns = [
		{ key: 'transaction_id', label: 'Transaction ID' },
		{ key: 'amount', label: 'Amount' },
		{ key: 'gateway', label: 'Gateway' },
		{ key: 'status', label: 'Status' },
		{ key: 'created_at', label: 'Created At' },
	];

	const formattedPayments = payments.map((payment) => ({
		...payment,
		created_at: formatDateForExport(payment.created_at),
	}));

	downloadCSV(formattedPayments, `payments-${new Date().toISOString().split('T')[0]}`, columns);
}


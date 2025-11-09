/**
 * Number formatting utilities
 * Formats numbers for display in admin dashboard
 */

/**
 * Format number in compact notation (1K, 1M, etc.)
 * @param value - Number to format
 * @returns Formatted string (e.g., "1.2K", "5.3M")
 */
export function compactFormat(value: number): string {
	const formatter = new Intl.NumberFormat('en', {
		notation: 'compact',
		compactDisplay: 'short',
	});

	return formatter.format(value);
}

/**
 * Format number with standard notation (commas, decimals)
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1,234.56")
 */
export function standardFormat(value: number, decimals: number = 2): string {
	return value.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}

/**
 * Format currency amount
 * @param value - Amount to format
 * @param currency - Currency code (default: 'ILS')
 * @returns Formatted currency string (e.g., "₪1,234.56")
 */
export function formatCurrency(value: number, currency: string = 'ILS'): string {
	const symbol = currency === 'ILS' ? '₪' : '$';
	return `${symbol}${standardFormat(value)}`;
}


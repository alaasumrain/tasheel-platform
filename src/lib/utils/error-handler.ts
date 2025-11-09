/**
 * Error Handler Utilities
 * Standardized error handling and formatting
 */

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
	details?: any;
}

/**
 * Format API error into user-friendly message
 */
export function formatApiError(error: any): string {
	if (typeof error === 'string') {
		return error;
	}

	if (error?.message) {
		return error.message;
	}

	if (error?.error) {
		if (typeof error.error === 'string') {
			return error.error;
		}
		if (error.error?.message) {
			return error.error.message;
		}
	}

	if (error?.response?.data?.error) {
		return error.response.data.error;
	}

	if (error?.response?.data?.message) {
		return error.response.data.message;
	}

	return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API error and return structured error object
 */
export function handleApiError(error: any): ApiError {
	const message = formatApiError(error);
	const code = error?.code || error?.response?.status?.toString();
	const status = error?.status || error?.response?.status;
	const details = error?.details || error?.response?.data?.details;

	return {
		message,
		code,
		status,
		details,
	};
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
	if (!error) return false;
	
	const message = error?.message?.toLowerCase() || '';
	return (
		message.includes('network') ||
		message.includes('fetch') ||
		error?.code === 'NETWORK_ERROR'
	);
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
	if (!error) return false;
	
	const message = error?.message?.toLowerCase() || '';
	return (
		error?.status === 401 ||
		error?.response?.status === 401 ||
		message.includes('unauthorized') ||
		message.includes('authentication')
	);
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyError(error: any): string {
	if (isNetworkError(error)) {
		return 'Network error. Please check your internet connection and try again.';
	}

	if (isAuthError(error)) {
		return 'Your session has expired. Please log in again.';
	}

	return formatApiError(error);
}


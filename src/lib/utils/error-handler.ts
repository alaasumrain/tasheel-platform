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

/**
 * Sanitize error messages to prevent information leakage
 * Removes database errors, stack traces, and internal details
 */
export function sanitizeError(error: unknown, defaultMessage: string = 'An unexpected error occurred. Please try again.'): string {
	// If it's a string, check if it contains sensitive information
	if (typeof error === 'string') {
		// Check for database/internal error patterns
		if (
			error.includes('relation') ||
			error.includes('column') ||
			error.includes('syntax error') ||
			error.includes('permission denied') ||
			error.includes('duplicate key') ||
			error.includes('foreign key') ||
			error.includes('constraint') ||
			error.includes('violates') ||
			error.includes('SQL') ||
			error.includes('database') ||
			error.includes('connection') ||
			error.includes('timeout') ||
			error.toLowerCase().includes('supabase') ||
			error.includes('ENOENT') ||
			error.includes('ECONNREFUSED')
		) {
			return defaultMessage;
		}
		// Safe user-facing errors (validation, business logic)
		return error;
	}

	// If it's an Error object
	if (error instanceof Error) {
		const message = error.message;
		
		// Check for database/internal error patterns
		if (
			message.includes('relation') ||
			message.includes('column') ||
			message.includes('syntax error') ||
			message.includes('permission denied') ||
			message.includes('duplicate key') ||
			message.includes('foreign key') ||
			message.includes('constraint') ||
			message.includes('violates') ||
			message.includes('SQL') ||
			message.includes('database') ||
			message.includes('connection') ||
			message.includes('timeout') ||
			message.toLowerCase().includes('supabase') ||
			message.includes('ENOENT') ||
			message.includes('ECONNREFUSED') ||
			message.includes('ECONNRESET')
		) {
			return defaultMessage;
		}

		// Check error name for known safe errors
		if (['ValidationError', 'AuthenticationError', 'AuthorizationError'].includes(error.name)) {
			return message;
		}

		// For other errors, return default
		return defaultMessage;
	}

	// For unknown error types, return default
	return defaultMessage;
}


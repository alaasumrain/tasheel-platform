import { describe, it, expect } from 'vitest';
import {
	formatApiError,
	handleApiError,
	isNetworkError,
	isAuthError,
	getUserFriendlyError,
} from '@/lib/utils/error-handler';

describe('error-handler utilities', () => {
	describe('formatApiError', () => {
		it('should return string errors as-is', () => {
			expect(formatApiError('Simple error')).toBe('Simple error');
		});

		it('should extract message from error object', () => {
			expect(formatApiError({ message: 'Error message' })).toBe('Error message');
		});

		it('should extract error from nested error object', () => {
			expect(formatApiError({ error: 'Nested error' })).toBe('Nested error');
			expect(formatApiError({ error: { message: 'Deep error' } })).toBe('Deep error');
		});

		it('should extract from response.data', () => {
			expect(formatApiError({ response: { data: { error: 'API error' } } })).toBe('API error');
			expect(formatApiError({ response: { data: { message: 'API message' } } })).toBe('API message');
		});

		it('should return default message for unknown errors', () => {
			expect(formatApiError({})).toBe('An unexpected error occurred. Please try again.');
			expect(formatApiError(null)).toBe('An unexpected error occurred. Please try again.');
		});
	});

	describe('handleApiError', () => {
		it('should return structured error object', () => {
			const error = { message: 'Test error', code: 'ERR001', status: 400 };
			const result = handleApiError(error);

			expect(result.message).toBe('Test error');
			expect(result.code).toBe('ERR001');
			expect(result.status).toBe(400);
		});

		it('should extract status from response', () => {
			const error = { response: { status: 404 } };
			const result = handleApiError(error);

			expect(result.status).toBe(404);
		});

		it('should extract details', () => {
			const error = { details: { field: 'email' } };
			const result = handleApiError(error);

			expect(result.details).toEqual({ field: 'email' });
		});
	});

	describe('isNetworkError', () => {
		it('should detect network errors', () => {
			expect(isNetworkError({ message: 'network error' })).toBe(true);
			expect(isNetworkError({ message: 'fetch failed' })).toBe(true);
			expect(isNetworkError({ code: 'NETWORK_ERROR' })).toBe(true);
		});

		it('should not detect non-network errors', () => {
			expect(isNetworkError({ message: 'validation error' })).toBe(false);
			expect(isNetworkError({ response: { status: 400 } })).toBe(false);
			expect(isNetworkError({ status: 400 })).toBe(false);
			expect(isNetworkError({ message: 'some error', response: undefined })).toBe(false);
			expect(isNetworkError(null)).toBe(false);
			expect(isNetworkError(undefined)).toBe(false);
		});
	});

	describe('isAuthError', () => {
		it('should detect auth errors', () => {
			expect(isAuthError({ status: 401 })).toBe(true);
			expect(isAuthError({ response: { status: 401 } })).toBe(true);
			expect(isAuthError({ message: 'unauthorized' })).toBe(true);
			expect(isAuthError({ message: 'authentication failed' })).toBe(true);
		});

		it('should not detect non-auth errors', () => {
			expect(isAuthError({ status: 400 })).toBe(false);
			expect(isAuthError({ status: 404 })).toBe(false);
			expect(isAuthError({ message: 'validation error' })).toBe(false);
			expect(isAuthError(null)).toBe(false);
			expect(isAuthError(undefined)).toBe(false);
		});
	});

	describe('getUserFriendlyError', () => {
		it('should return network error message', () => {
			const error = { message: 'network error' };
			expect(getUserFriendlyError(error)).toBe(
				'Network error. Please check your internet connection and try again.'
			);
		});

		it('should return auth error message', () => {
			const error = { status: 401 };
			expect(getUserFriendlyError(error)).toBe('Your session has expired. Please log in again.');
		});

		it('should return formatted error for other errors', () => {
			const error = { message: 'Custom error', response: { status: 400 } };
			expect(getUserFriendlyError(error)).toBe('Custom error');
		});
	});
});


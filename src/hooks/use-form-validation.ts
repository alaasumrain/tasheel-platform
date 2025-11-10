'use client';

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

export interface FieldError {
	message: string;
	suggestion?: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: Record<string, FieldError>;
}

// Common validation schemas
export const commonValidators = {
	email: z.string().email('Invalid email address').min(1, 'Email is required'),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^(\+970|0)?5[6-9]\d{7}$/, 'Invalid Palestinian phone number'),
	name: z.string().min(2, 'Name must be at least 2 characters'),
	required: z.string().min(1, 'This field is required'),
};

// Phone number formatter
export function formatPhoneNumber(value: string): string {
	// Remove all non-digit characters except +
	const cleaned = value.replace(/[^\d+]/g, '');

	// Handle +970 prefix
	if (cleaned.startsWith('+970')) {
		const rest = cleaned.slice(4);
		if (rest.length <= 9) {
			return `+970 ${rest}`;
		}
		return `+970 ${rest.slice(0, 9)}`;
	}

	// Handle 0 prefix
	if (cleaned.startsWith('0')) {
		const rest = cleaned.slice(1);
		if (rest.length <= 9) {
			return `0${rest}`;
		}
		return `0${rest.slice(0, 9)}`;
	}

	// Handle 5 prefix (Palestinian mobile)
	if (cleaned.startsWith('5') && cleaned.length <= 9) {
		return cleaned;
	}

	return cleaned.slice(0, 9);
}

// Email domain suggestions
export function getEmailDomainSuggestions(partial: string): string[] {
	const commonDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
	const [localPart, domain] = partial.split('@');

	if (!domain) return [];

	return commonDomains
		.filter((d) => d.startsWith(domain.toLowerCase()))
		.map((d) => `${localPart}@${d}`);
}

// Validation hook
export function useFormValidation<T extends Record<string, any>>(
	schema: z.ZodObject<any>,
	options?: {
		validateOnBlur?: boolean;
		validateOnChange?: boolean;
		debounceMs?: number;
	}
) {
	const [errors, setErrors] = useState<Record<string, FieldError>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [isValidating, setIsValidating] = useState(false);

	const validateField = useCallback(
		async (name: string, value: any): Promise<FieldError | null> => {
			try {
				// Get field schema
				const fieldSchema = schema.shape[name];
				if (!fieldSchema) return null;

				// Validate
				await fieldSchema.parseAsync(value);
				return null;
			} catch (error) {
				if (error instanceof z.ZodError) {
					const firstError = error.issues[0];
					return {
						message: firstError.message,
						suggestion: getSuggestion(name, firstError.code, value),
					};
				}
				return { message: 'Validation failed' };
			}
		},
		[schema]
	);

	const validateForm = useCallback(
		async (data: T): Promise<ValidationResult> => {
			setIsValidating(true);
			try {
				await schema.parseAsync(data);
				setErrors({});
				return { isValid: true, errors: {} };
			} catch (error) {
				if (error instanceof z.ZodError) {
					const newErrors: Record<string, FieldError> = {};
					error.issues.forEach((err) => {
						const path = err.path[0] as string;
						newErrors[path] = {
							message: err.message,
							suggestion: getSuggestion(path, err.code, data[path]),
						};
					});
					setErrors(newErrors);
					return { isValid: false, errors: newErrors };
				}
				return { isValid: false, errors: {} };
			} finally {
				setIsValidating(false);
			}
		},
		[schema]
	);

	const handleFieldBlur = useCallback(
		async (name: string, value: any) => {
			if (!options?.validateOnBlur) return;

			setTouched((prev) => ({ ...prev, [name]: true }));
			const error = await validateField(name, value);
			if (error) {
				setErrors((prev) => ({ ...prev, [name]: error }));
			} else {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[name];
					return newErrors;
				});
			}
		},
		[validateField, options?.validateOnBlur]
	);

	const handleFieldChange = useCallback(
		async (name: string, value: any) => {
			if (!options?.validateOnChange) return;
			if (!touched[name]) return; // Only validate if field was touched

			// Debounce validation
			const timeoutId = setTimeout(async () => {
				const error = await validateField(name, value);
				if (error) {
					setErrors((prev) => ({ ...prev, [name]: error }));
				} else {
					setErrors((prev) => {
						const newErrors = { ...prev };
						delete newErrors[name];
						return newErrors;
					});
				}
			}, options.debounceMs || 300);

			return () => clearTimeout(timeoutId);
		},
		[validateField, options?.validateOnChange, touched, options?.debounceMs]
	);

	const clearErrors = useCallback(() => {
		setErrors({});
		setTouched({});
	}, []);

	const clearFieldError = useCallback((name: string) => {
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[name];
			return newErrors;
		});
	}, []);

	return {
		errors,
		touched,
		isValidating,
		validateField,
		validateForm,
		handleFieldBlur,
		handleFieldChange,
		clearErrors,
		clearFieldError,
		setTouched,
	};
}

// Get helpful suggestions based on error code
function getSuggestion(fieldName: string, errorCode: string, value: any): string | undefined {
	switch (errorCode) {
		case 'invalid_string':
			if (fieldName === 'email') {
				return 'Try: example@gmail.com';
			}
			if (fieldName === 'phone') {
				return 'Format: +970 5X XXXXXXX or 05X XXXXXXX';
			}
			break;
		case 'too_small':
			if (fieldName === 'name') {
				return 'Name must be at least 2 characters';
			}
			break;
		case 'invalid_type':
			return 'Please check the format';
		default:
			return undefined;
	}
}


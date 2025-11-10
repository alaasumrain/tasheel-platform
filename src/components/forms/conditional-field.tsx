'use client';

import { useMemo } from 'react';

interface ConditionalFieldProps {
	children: React.ReactNode;
	showWhen?: {
		field: string;
		value?: any;
		operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
	};
	showWhenAny?: Array<{
		field: string;
		value?: any;
		operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
	}>;
	showWhenAll?: Array<{
		field: string;
		value?: any;
		operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
	}>;
	formData?: Record<string, any>; // Pass form data as prop instead of using useWatch
}

/**
 * ConditionalField - Shows/hides children based on form field values
 * 
 * @example
 * <ConditionalField 
 *   formData={formData}
 *   showWhen={{ field: 'hasEmail', value: true, operator: 'equals' }}
 * >
 *   <TextField name="email" />
 * </ConditionalField>
 */
export function ConditionalField({
	children,
	showWhen,
	showWhenAny,
	showWhenAll,
	formData = {},
}: ConditionalFieldProps) {
	const evaluateCondition = (
		fieldValue: any,
		expectedValue: any,
		operator: string = 'equals'
	): boolean => {
		switch (operator) {
			case 'equals':
				return fieldValue === expectedValue;
			case 'notEquals':
				return fieldValue !== expectedValue;
			case 'contains':
				if (Array.isArray(fieldValue)) {
					return fieldValue.includes(expectedValue);
				}
				if (typeof fieldValue === 'string') {
					return fieldValue.includes(String(expectedValue));
				}
				return false;
			case 'greaterThan':
				return Number(fieldValue) > Number(expectedValue);
			case 'lessThan':
				return Number(fieldValue) < Number(expectedValue);
			case 'isEmpty':
				return !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
			case 'isNotEmpty':
				return !!fieldValue && (typeof fieldValue !== 'string' || fieldValue.trim() !== '');
			default:
				return false;
		}
	};

	const shouldShow = useMemo(() => {
		if (showWhen) {
			const fieldValue = formData[showWhen.field];
			return evaluateCondition(fieldValue, showWhen.value, showWhen.operator || 'equals');
		}

		if (showWhenAny) {
			return showWhenAny.some((condition) => {
				const fieldValue = formData[condition.field];
				return evaluateCondition(fieldValue, condition.value, condition.operator || 'equals');
			});
		}

		if (showWhenAll) {
			return showWhenAll.every((condition) => {
				const fieldValue = formData[condition.field];
				return evaluateCondition(fieldValue, condition.value, condition.operator || 'equals');
			});
		}

		return true;
	}, [showWhen, showWhenAny, showWhenAll, formData]);

	if (!shouldShow) {
		return null;
	}

	return <>{children}</>;
}

// Field Dependency Hook (simplified version without react-hook-form)
export function useFieldDependency(fieldName: string, formData: Record<string, any>) {
	const fieldValue = formData[fieldName];

	return {
		value: fieldValue,
		isEmpty: !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === ''),
		isNotEmpty: !!fieldValue && (typeof fieldValue !== 'string' || fieldValue.trim() !== ''),
		equals: (value: any) => fieldValue === value,
		contains: (value: any) => {
			if (Array.isArray(fieldValue)) {
				return fieldValue.includes(value);
			}
			if (typeof fieldValue === 'string') {
				return fieldValue.includes(String(value));
			}
			return false;
		},
	};
}

// Multi-field Dependency Hook (simplified version)
export function useMultiFieldDependency(fieldNames: string[], formData: Record<string, any>) {
	const fieldValues = fieldNames.map((name) => formData[name]);

	return {
		values: fieldValues,
		allEmpty: fieldValues.every((val) => !val || (typeof val === 'string' && val.trim() === '')),
		allFilled: fieldValues.every((val) => !!val && (typeof val !== 'string' || val.trim() !== '')),
		anyFilled: fieldValues.some((val) => !!val && (typeof val !== 'string' || val.trim() !== '')),
		getValue: (fieldName: string) => {
			const index = fieldNames.indexOf(fieldName);
			return index >= 0 ? fieldValues[index] : undefined;
		},
	};
}


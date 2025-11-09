import { describe, it, expect } from 'vitest';
import { compactFormat, standardFormat, formatCurrency } from '@/lib/utils/format-number';

describe('format-number utilities', () => {
	describe('compactFormat', () => {
		it('should format small numbers correctly', () => {
			expect(compactFormat(100)).toBe('100');
			expect(compactFormat(999)).toBe('999');
		});

		it('should format thousands correctly', () => {
			expect(compactFormat(1000)).toBe('1K');
			expect(compactFormat(1500)).toBe('1.5K');
			expect(compactFormat(9999)).toBe('10K');
		});

		it('should format millions correctly', () => {
			expect(compactFormat(1000000)).toBe('1M');
			expect(compactFormat(1500000)).toBe('1.5M');
		});

		it('should handle zero', () => {
			expect(compactFormat(0)).toBe('0');
		});

		it('should handle negative numbers', () => {
			expect(compactFormat(-1000)).toBe('-1K');
		});
	});

	describe('standardFormat', () => {
		it('should format numbers with commas', () => {
			expect(standardFormat(1000)).toBe('1,000.00');
			expect(standardFormat(1234567)).toBe('1,234,567.00');
		});

		it('should format decimals correctly', () => {
			expect(standardFormat(123.456)).toBe('123.46');
			expect(standardFormat(123.4)).toBe('123.40');
		});

		it('should respect custom decimal places', () => {
			expect(standardFormat(123.456, 0)).toBe('123');
			expect(standardFormat(123.456, 4)).toBe('123.4560');
		});

		it('should handle zero', () => {
			expect(standardFormat(0)).toBe('0.00');
		});
	});

	describe('formatCurrency', () => {
		it('should format ILS currency correctly', () => {
			expect(formatCurrency(1000)).toBe('₪1,000.00');
			expect(formatCurrency(1234.56)).toBe('₪1,234.56');
		});

		it('should handle zero', () => {
			expect(formatCurrency(0)).toBe('₪0.00');
		});

		it('should handle large numbers', () => {
			expect(formatCurrency(1000000)).toBe('₪1,000,000.00');
		});
	});
});


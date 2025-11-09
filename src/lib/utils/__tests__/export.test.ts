import { describe, it, expect, vi, beforeEach } from 'vitest';
import { arrayToCSV, downloadCSV, formatDateForExport } from '@/lib/utils/export';

describe('export utilities', () => {
	describe('arrayToCSV', () => {
		it('should return empty string for empty array', () => {
			expect(arrayToCSV([])).toBe('');
		});

		it('should convert simple array to CSV', () => {
			const data = [
				{ name: 'John', age: 30 },
				{ name: 'Jane', age: 25 },
			];
			const result = arrayToCSV(data);
			expect(result).toContain('name,age');
			expect(result).toContain('John,30');
			expect(result).toContain('Jane,25');
		});

		it('should use custom columns when provided', () => {
			const data = [{ name: 'John', age: 30 }];
			const columns = [
				{ key: 'name' as const, label: 'Full Name' },
				{ key: 'age' as const, label: 'Years' },
			];
			const result = arrayToCSV(data, columns);
			expect(result).toContain('Full Name,Years');
			expect(result).toContain('John,30');
		});

		it('should escape commas in values', () => {
			const data = [{ name: 'John, Jr.', age: 30 }];
			const result = arrayToCSV(data);
			expect(result).toContain('"John, Jr.",30');
		});

		it('should escape quotes in values', () => {
			const data = [{ name: 'John "Johnny" Doe', age: 30 }];
			const result = arrayToCSV(data);
			expect(result).toContain('"John ""Johnny"" Doe",30');
		});

		it('should handle null and undefined values', () => {
			const data = [{ name: 'John', age: null, email: undefined }];
			const result = arrayToCSV(data);
			expect(result).toContain('John,,');
		});

		it('should stringify objects', () => {
			const data = [{ name: 'John', metadata: { role: 'admin' } }];
			const result = arrayToCSV(data);
			expect(result).toContain('{"role":"admin"}');
		});
	});

	describe('formatDateForExport', () => {
		it('should format date string correctly', () => {
			const date = '2024-01-15T10:30:00Z';
			const result = formatDateForExport(date);
			expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/); // MM/DD/YYYY format
		});

		it('should format Date object correctly', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = formatDateForExport(date);
			expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
		});
	});

	describe('downloadCSV', () => {
		beforeEach(() => {
			// Mock DOM methods
			global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
			global.URL.revokeObjectURL = vi.fn();
			global.document.createElement = vi.fn(() => ({
				setAttribute: vi.fn(),
				click: vi.fn(),
				style: {},
			})) as any;
			global.document.body.appendChild = vi.fn();
			global.document.body.removeChild = vi.fn();
		});

		it('should create download link and trigger download', () => {
			const data = [{ name: 'John', age: 30 }];
			const createElementSpy = vi.spyOn(document, 'createElement');
			const appendChildSpy = vi.spyOn(document.body, 'appendChild');
			const removeChildSpy = vi.spyOn(document.body, 'removeChild');

			downloadCSV(data, 'test-file');

			expect(createElementSpy).toHaveBeenCalledWith('a');
			expect(appendChildSpy).toHaveBeenCalled();
			expect(removeChildSpy).toHaveBeenCalled();
		});
	});
});


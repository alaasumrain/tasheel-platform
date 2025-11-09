import { describe, it, expect, vi } from 'vitest';
import {
	executeBeforeDbHook,
	executeAfterDbHook,
	createCrudHooksWithAudit,
	type HookContext,
} from '@/lib/utils/crud-hooks';

describe('crud-hooks utilities', () => {
	describe('executeBeforeDbHook', () => {
		it('should return data unchanged if no hook provided', async () => {
			const data = { name: 'Test' };
			const result = await executeBeforeDbHook(data, { mode: 'create', resource: 'test' });
			expect(result).toEqual(data);
		});

		it('should execute hook if provided', async () => {
			const data = { name: 'Test' };
			const hook = vi.fn(async (d) => ({ ...d, processed: true }));
			const context: HookContext = { mode: 'create', resource: 'test' };

			const result = await executeBeforeDbHook(data, context, hook);

			expect(hook).toHaveBeenCalledWith(data, context);
			expect(result).toEqual({ name: 'Test', processed: true });
		});

		it('should handle synchronous hooks', async () => {
			const data = { name: 'Test' };
			const hook = (d: typeof data) => ({ ...d, sync: true });
			const result = await executeBeforeDbHook(data, { mode: 'create', resource: 'test' }, hook);
			expect(result).toEqual({ name: 'Test', sync: true });
		});
	});

	describe('executeAfterDbHook', () => {
		it('should return result unchanged if no hook provided', async () => {
			const result = { id: '123', name: 'Test' };
			const finalResult = await executeAfterDbHook(result, { mode: 'create', resource: 'test' });
			expect(finalResult).toEqual(result);
		});

		it('should execute hook if provided', async () => {
			const result = { id: '123', name: 'Test' };
			const hook = vi.fn(async (r) => ({ ...r, logged: true }));
			const context: HookContext = { mode: 'create', resource: 'test' };

			const finalResult = await executeAfterDbHook(result, context, hook);

			expect(hook).toHaveBeenCalledWith(result, context);
			expect(finalResult).toEqual({ id: '123', name: 'Test', logged: true });
		});

		it('should pass originalData in context', async () => {
			const result = { id: '123' };
			const originalData = { name: 'Original' };
			const hook = vi.fn(async (r, ctx) => r);

			await executeAfterDbHook(result, { mode: 'edit', resource: 'test', originalData }, hook);

			expect(hook).toHaveBeenCalledWith(result, expect.objectContaining({ originalData }));
		});
	});

	describe('createCrudHooksWithAudit', () => {
		it('should create hooks with default audit behavior', () => {
			const hooks = createCrudHooksWithAudit('test-resource');

			expect(hooks.beforeDb).toBeDefined();
			expect(hooks.afterDb).toBeDefined();
		});

		it('should merge custom hooks with audit hooks', async () => {
			const customBeforeHook = vi.fn(async (d) => ({ ...d, custom: true }));
			const hooks = createCrudHooksWithAudit('test-resource', {
				beforeDb: customBeforeHook,
			});

			const data = { name: 'Test' };
			const result = await hooks.beforeDb!(data, { mode: 'create', resource: 'test-resource' });

			expect(customBeforeHook).toHaveBeenCalled();
			expect(result).toEqual({ name: 'Test', custom: true });
		});
	});
});


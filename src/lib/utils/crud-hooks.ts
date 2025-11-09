/**
 * CRUD Hooks Pattern
 * Provides beforeDb/afterDb hooks for data transformation and side effects
 */

export type HookMode = 'create' | 'edit' | 'delete';

export interface HookContext {
	mode: HookMode;
	resource: string;
	userId?: string;
	request?: Request;
}

export interface BeforeDbHook<T = any> {
	(data: T, context: HookContext): Promise<T> | T;
}

export interface AfterDbHook<T = any, R = any> {
	(result: R, context: HookContext & { originalData?: T }): Promise<R> | R;
}

export interface CrudHooks<T = any, R = any> {
	beforeDb?: BeforeDbHook<T>;
	afterDb?: AfterDbHook<T, R>;
}

/**
 * Execute beforeDb hook if provided
 */
export async function executeBeforeDbHook<T>(
	data: T,
	context: HookContext,
	hook?: BeforeDbHook<T>
): Promise<T> {
	if (!hook) return data;
	return await hook(data, context);
}

/**
 * Execute afterDb hook if provided
 */
export async function executeAfterDbHook<T, R>(
	result: R,
	context: HookContext & { originalData?: T },
	hook?: AfterDbHook<T, R>
): Promise<R> {
	if (!hook) return result;
	return await hook(result, context);
}

/**
 * Create audit log entry
 */
export interface AuditLogEntry {
	resource: string;
	resourceId: string;
	action: HookMode;
	userId?: string;
	changes?: Record<string, any>;
	timestamp: string;
}

export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
	// This would typically write to a database
	// For now, we'll just log it
	console.log('[AUDIT]', JSON.stringify(entry, null, 2));
}

/**
 * Default beforeDb hook for audit logging
 */
export function createAuditBeforeHook<T extends { id?: string }>(
	resource: string
): BeforeDbHook<T> {
	return async (data: T, context: HookContext) => {
		// You can add validation, transformation, etc. here
		return data;
	};
}

/**
 * Default afterDb hook for audit logging
 */
export function createAuditAfterHook<T extends { id?: string }, R extends { id?: string }>(
	resource: string
): AfterDbHook<T, R> {
	return async (result: R, context: HookContext & { originalData?: T }) => {
		if (result && 'id' in result) {
			await createAuditLog({
				resource,
				resourceId: String(result.id),
				action: context.mode,
				userId: context.userId,
				changes: context.originalData
					? getChanges(context.originalData, result as any)
					: undefined,
				timestamp: new Date().toISOString(),
			});
		}
		return result;
	};
}

/**
 * Get changes between two objects
 */
function getChanges<T extends Record<string, any>>(oldData: T, newData: T): Record<string, any> {
	const changes: Record<string, any> = {};
	
	for (const key in newData) {
		if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
			changes[key] = {
				old: oldData[key],
				new: newData[key],
			};
		}
	}
	
	return changes;
}

/**
 * Create CRUD hooks with audit logging
 */
export function createCrudHooksWithAudit<T extends { id?: string }, R extends { id?: string }>(
	resource: string,
	customHooks?: CrudHooks<T, R>
): CrudHooks<T, R> {
	return {
		beforeDb: customHooks?.beforeDb || createAuditBeforeHook<T>(resource),
		afterDb: customHooks?.afterDb || createAuditAfterHook<T, R>(resource),
	};
}


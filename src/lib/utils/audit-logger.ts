/**
 * Audit Logger Utility
 * Logs security events, user actions, and admin activities for compliance and forensics
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from './logger';

export type AuditAction =
	| 'login'
	| 'login_failed'
	| 'logout'
	| 'password_change'
	| 'email_change'
	| 'email_verification_sent'
	| 'email_verified'
	| 'phone_verified'
	| 'admin_action'
	| 'payment_initiated'
	| 'payment_completed'
	| 'payment_failed'
	| 'file_upload'
	| 'file_download'
	| 'file_deleted'
	| 'application_created'
	| 'application_updated'
	| 'application_status_changed'
	| 'quote_requested'
	| 'invoice_created'
	| 'invoice_updated';

export type AuditResourceType =
	| 'user'
	| 'application'
	| 'invoice'
	| 'payment'
	| 'file'
	| 'customer'
	| 'order';

export interface AuditLogDetails {
	[key: string]: any;
	// Never include: passwords, OTPs, payment card numbers, CVV
}

export interface AuditLogContext {
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Create an audit log entry
 * This function should be called for all security-sensitive operations
 */
export async function createAuditLog(
	action: AuditAction,
	options: {
		userId?: string;
		resourceType?: AuditResourceType;
		resourceId?: string;
		details?: AuditLogDetails;
		context?: AuditLogContext;
	}
): Promise<void> {
	try {
		const supabase = await createClient();

		// Get IP address and user agent from context or headers
		const ipAddress = options.context?.ipAddress;
		const userAgent = options.context?.userAgent;

		// Sanitize details - remove sensitive information
		const sanitizedDetails: AuditLogDetails = { ...options.details };
		
		// Remove sensitive fields
		delete sanitizedDetails.password;
		delete sanitizedDetails.passwordHash;
		delete sanitizedDetails.otp;
		delete sanitizedDetails.code;
		delete sanitizedDetails.cardNumber;
		delete sanitizedDetails.cvv;
		delete sanitizedDetails.cvc;
		delete sanitizedDetails.securityCode;

		// Use service role client to bypass RLS (audit logs should always be writable)
		const { createClient: createServiceClient } = await import('@supabase/supabase-js');
		const { getSupabaseUrl, getSupabaseServiceKey } = await import('../supabase-config');
		
		const serviceKey = getSupabaseServiceKey();
		if (!serviceKey) {
			logger.warn('Cannot create audit log: SUPABASE_SERVICE_ROLE_KEY not set');
			return;
		}

		const serviceClient = createServiceClient(getSupabaseUrl(), serviceKey);

		const { error } = await serviceClient.from('audit_logs').insert({
			user_id: options.userId || null,
			action,
			resource_type: options.resourceType || null,
			resource_id: options.resourceId || null,
			details: sanitizedDetails,
			ip_address: ipAddress || null,
			user_agent: userAgent || null,
		});

		if (error) {
			logger.error('Failed to create audit log', error, {
				action,
				userId: options.userId,
			});
		}
	} catch (error) {
		// Don't throw - audit logging should never break the main flow
		logger.error('Error creating audit log', error, {
			action,
			userId: options.userId,
		});
	}
}

/**
 * Helper function to get IP address from Next.js request
 */
export function getClientIP(request: Request | { headers: Headers }): string | undefined {
	const headers = request instanceof Request ? request.headers : (request as { headers: Headers }).headers;
	
	// Check various headers for real IP (considering proxies/load balancers)
	const forwarded = headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}
	
	const realIP = headers.get('x-real-ip');
	if (realIP) {
		return realIP;
	}
	
	return undefined;
}

/**
 * Helper function to get user agent from Next.js request
 */
export function getUserAgent(request: Request | { headers: Headers }): string | undefined {
	const headers = request instanceof Request ? request.headers : (request as { headers: Headers }).headers;
	return headers.get('user-agent') || undefined;
}


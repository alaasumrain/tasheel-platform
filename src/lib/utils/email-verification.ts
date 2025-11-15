/**
 * Email Verification Utilities
 * Implements Hybrid email verification (Option C):
 * - Allow browsing and quote requests without verification
 * - Require verification for payments and sensitive operations
 */

import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export interface EmailVerificationStatus {
	isVerified: boolean;
	isPhoneOnly: boolean;
	email: string | null;
	needsVerification: boolean;
}

/**
 * Check if user's email is verified
 * Returns verification status for hybrid approach
 */
export async function checkEmailVerification(
	user: User | null
): Promise<EmailVerificationStatus> {
	if (!user) {
		return {
			isVerified: false,
			isPhoneOnly: false,
			email: null,
			needsVerification: false,
		};
	}

	const email = user.email;
	const isPhoneOnly = user.user_metadata?.is_phone_only === true;
	const emailConfirmed = user.email_confirmed_at !== null;

	// Phone-only accounts with temporary emails don't need email verification
	// They can use the platform but should be prompted to add a real email
	if (isPhoneOnly && email?.endsWith('@tasheel.ps')) {
		return {
			isVerified: false,
			isPhoneOnly: true,
			email,
			needsVerification: false, // Not required for phone-only accounts
		};
	}

	// For accounts with real emails, check if verified
	return {
		isVerified: emailConfirmed,
		isPhoneOnly: false,
		email: email ?? null,
		needsVerification: !emailConfirmed && !!email,
	};
}

/**
 * Check if email verification is required for a specific operation
 * Hybrid approach: required for payments, not for browsing/quotes
 */
export async function isEmailVerificationRequired(
	user: User | null,
	operation: 'payment' | 'quote' | 'browse'
): Promise<boolean> {
	if (!user) {
		return false; // Not logged in, handled by auth check
	}

	const status = await checkEmailVerification(user);

	// Phone-only accounts: allow browsing and quotes, require email for payments
	if (status.isPhoneOnly) {
		return operation === 'payment';
	}

	// Regular accounts: require verification for payments
	if (operation === 'payment') {
		return status.needsVerification;
	}

	// Browsing and quotes don't require email verification
	return false;
}

/**
 * Get user-friendly message about email verification status
 */
export function getEmailVerificationMessage(
	status: EmailVerificationStatus,
	locale: 'en' | 'ar' = 'en'
): string | null {
	if (!status.needsVerification) {
		return null;
	}

	if (locale === 'ar') {
		if (status.isPhoneOnly) {
			return 'يرجى إضافة بريد إلكتروني للاستمرار في الدفع';
		}
		return 'يرجى التحقق من بريدك الإلكتروني للاستمرار في الدفع';
	}

	if (status.isPhoneOnly) {
		return 'Please add an email address to continue with payment';
	}
	return 'Please verify your email address to continue with payment';
}


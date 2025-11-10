/**
 * Environment Variable Validation
 * Validates critical environment variables at startup
 */

const requiredEnvVars = [
	'NEXT_PUBLIC_SUPABASE_URL',
	'NEXT_PUBLIC_SUPABASE_ANON_KEY',
	'SUPABASE_SERVICE_ROLE_KEY',
	'NEXT_PUBLIC_SITE_URL',
] as const;

const optionalButImportantEnvVars = [
	'RESEND_API_KEY',
	'CONTACT_EMAIL',
	'PAYMENT_GATEWAY_WEBHOOK_SECRET',
] as const;

const optionalEnvVars = [
	'CONTACT_PHONE',
	'PAYMENT_GATEWAY_TYPE',
	'PAYMENT_GATEWAY_API_KEY',
	'PAYMENT_GATEWAY_MERCHANT_ID',
	'WHATSAPP_ACCOUNT_SID',
	'WHATSAPP_AUTH_TOKEN',
	'WHATSAPP_FROM_NUMBER',
	'NEXT_PUBLIC_GA_ID',
	'KIT_API_KEY',
] as const;

// Note: optionalEnvVars are not currently checked but kept for future use

export interface EnvValidationResult {
	isValid: boolean;
	missing: string[];
	warnings: string[];
}

/**
 * Validate environment variables
 * Returns validation result with missing vars and warnings
 */
export function validateEnvVars(): EnvValidationResult {
	const missing: string[] = [];
	const warnings: string[] = [];

	// Check required variables
	for (const envVar of requiredEnvVars) {
		const value = process.env[envVar];
		if (!value || value === 'DUMMY_KEY' || value.trim() === '') {
			missing.push(envVar);
		}
	}

	// Check optional but important variables (warn in production)
	if (process.env.NODE_ENV === 'production') {
		for (const envVar of optionalButImportantEnvVars) {
			const value = process.env[envVar];
			if (!value || value === 'DUMMY_KEY' || value.trim() === '') {
				warnings.push(envVar);
			}
		}
	}

	return {
		isValid: missing.length === 0,
		missing,
		warnings,
	};
}

/**
 * Validate and throw if critical vars are missing
 * Call this at application startup
 */
export function requireEnvVars(): void {
	const result = validateEnvVars();
	
	if (!result.isValid) {
		const errorMessage = `❌ Missing required environment variables: ${result.missing.join(', ')}\n\nPlease check your .env file or environment configuration.`;
		if (process.env.NODE_ENV === 'production') {
			throw new Error(errorMessage);
		} else {
			console.warn(`⚠️  ${errorMessage}`);
		}
	}

	if (result.warnings.length > 0) {
		const warningMessage = `⚠️  Missing important environment variables (may cause issues): ${result.warnings.join(', ')}\n\nThese are optional but recommended for production.`;
		if (process.env.NODE_ENV === 'production') {
			console.warn(warningMessage);
		} else {
			console.warn(warningMessage);
		}
	}
}


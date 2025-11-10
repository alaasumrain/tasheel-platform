/**
 * Webhook Signature Verification Utilities
 * Supports multiple payment gateway signature verification methods
 */

import crypto from 'crypto';

/**
 * Verify webhook signature for PalPay
 */
export function verifyPalPaySignature(
	payload: string | object,
	signature: string,
	secret: string
): boolean {
	if (!secret || !signature) {
		return false;
	}

	const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payloadString)
		.digest('hex');

	return crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature)
	);
}

/**
 * Verify webhook signature for PayTabs
 */
export function verifyPayTabsSignature(
	payload: string | object,
	signature: string,
	secret: string
): boolean {
	if (!secret || !signature) {
		return false;
	}

	const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payloadString)
		.digest('hex');

	// PayTabs may use different signature format, adjust as needed
	return crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature)
	);
}

/**
 * Generic webhook signature verification
 * Tries to verify based on gateway type
 */
export function verifyWebhookSignature(
	payload: string | object,
	signature: string | null,
	secret: string | undefined,
	gatewayType: 'palpay' | 'paytabs' | 'generic' = 'generic'
): boolean {
	if (!secret || !signature) {
		// If no secret configured, allow in development only
		if (process.env.NODE_ENV === 'development') {
			return true;
		}
		return false;
	}

	switch (gatewayType) {
		case 'palpay':
			return verifyPalPaySignature(payload, signature, secret);
		case 'paytabs':
			return verifyPayTabsSignature(payload, signature, secret);
		default:
			// Generic HMAC-SHA256 verification
			const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
			const expectedSignature = crypto
				.createHmac('sha256', secret)
				.update(payloadString)
				.digest('hex');
			return crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(expectedSignature)
			);
	}
}


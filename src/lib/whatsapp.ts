/**
 * WhatsApp Business API Integration
 * 
 * ⚠️ SETUP REQUIRED:
 * 1. Sign up for Twilio WhatsApp Business API (or Meta WhatsApp Business API)
 * 2. Get API credentials (Account SID, Auth Token, WhatsApp number)
 * 3. Add to .env: WHATSAPP_ACCOUNT_SID, WHATSAPP_AUTH_TOKEN, WHATSAPP_FROM_NUMBER
 * 4. Set up webhook URL for incoming messages
 * 
 * Documentation:
 * - Twilio: https://www.twilio.com/docs/whatsapp
 * - Meta: https://developers.facebook.com/docs/whatsapp
 */

interface WhatsAppMessage {
	to: string; // Phone number in E.164 format (e.g., +970592345678)
	message: string;
	mediaUrl?: string; // For sending images/PDFs
}

interface WhatsAppTemplate {
	templateName: string;
	language: 'ar' | 'en';
	parameters?: Record<string, string>;
}

/**
 * Send WhatsApp message using Twilio API
 * 
 * TODO: Replace with actual Twilio client when credentials are available
 */
export async function sendWhatsAppMessage(params: WhatsAppMessage): Promise<{
	success: boolean;
	messageId?: string;
	error?: string;
}> {
	const accountSid = process.env.WHATSAPP_ACCOUNT_SID;
	const authToken = process.env.WHATSAPP_AUTH_TOKEN;
	const fromNumber = process.env.WHATSAPP_FROM_NUMBER;

	if (!accountSid || !authToken || !fromNumber) {
		console.log('WhatsApp credentials not configured. Skipping WhatsApp message.');
		return {
			success: false,
			error: 'WhatsApp credentials not configured',
		};
	}

	try {
		// TODO: Uncomment when Twilio is installed and configured
		// const twilio = require('twilio');
		// const client = twilio(accountSid, authToken);
		//
		// const message = await client.messages.create({
		//   from: `whatsapp:${fromNumber}`,
		//   to: `whatsapp:${params.to}`,
		//   body: params.message,
		//   mediaUrl: params.mediaUrl ? [params.mediaUrl] : undefined,
		// });
		//
		// return {
		//   success: true,
		//   messageId: message.sid,
		// };

		// TESTING MODE: Log message instead of sending
		console.log('[WhatsApp TEST MODE] Would send message:', {
			to: params.to,
			message: params.message,
			mediaUrl: params.mediaUrl,
		});

		return {
			success: true,
			messageId: `TEST-${Date.now()}`,
		};
	} catch (error: any) {
		console.error('Error sending WhatsApp message:', error);
		return {
			success: false,
			error: error.message || 'Failed to send WhatsApp message',
		};
	}
}

/**
 * Send WhatsApp template message (for approved templates)
 * 
 * WhatsApp templates must be pre-approved by Meta/Twilio
 */
export async function sendWhatsAppTemplate(params: WhatsAppTemplate & { to: string }): Promise<{
	success: boolean;
	messageId?: string;
	error?: string;
}> {
	const accountSid = process.env.WHATSAPP_ACCOUNT_SID;
	const authToken = process.env.WHATSAPP_AUTH_TOKEN;
	const fromNumber = process.env.WHATSAPP_FROM_NUMBER;

	if (!accountSid || !authToken || !fromNumber) {
		console.log('WhatsApp credentials not configured. Skipping WhatsApp template.');
		return {
			success: false,
			error: 'WhatsApp credentials not configured',
		};
	}

	try {
		// TODO: Uncomment when Twilio is installed and configured
		// const twilio = require('twilio');
		// const client = twilio(accountSid, authToken);
		//
		// const contentVariables = params.parameters
		//   ? JSON.stringify(params.parameters)
		//   : undefined;
		//
		// const message = await client.messages.create({
		//   from: `whatsapp:${fromNumber}`,
		//   to: `whatsapp:${params.to}`,
		//   contentSid: params.templateName, // Template SID from Twilio
		//   contentVariables: contentVariables,
		// });
		//
		// return {
		//   success: true,
		//   messageId: message.sid,
		// };

		// TESTING MODE
		console.log('[WhatsApp TEST MODE] Would send template:', {
			to: params.to,
			templateName: params.templateName,
			language: params.language,
			parameters: params.parameters,
		});

		return {
			success: true,
			messageId: `TEST-TEMPLATE-${Date.now()}`,
		};
	} catch (error: any) {
		console.error('Error sending WhatsApp template:', error);
		return {
			success: false,
			error: error.message || 'Failed to send WhatsApp template',
		};
	}
}

/**
 * Format phone number to E.164 format (required by WhatsApp)
 */
export function formatPhoneNumber(phone: string): string {
	// Remove all non-digit characters
	const digits = phone.replace(/\D/g, '');

	// If starts with 0, replace with country code (Palestine: +970)
	if (digits.startsWith('0')) {
		return `+970${digits.substring(1)}`;
	}

	// If already has country code, ensure it starts with +
	if (digits.startsWith('970')) {
		return `+${digits}`;
	}

	// If doesn't start with country code, add it
	if (!digits.startsWith('970')) {
		return `+970${digits}`;
	}

	return `+${digits}`;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
	const formatted = formatPhoneNumber(phone);
	// E.164 format: +[country code][number] (8-15 digits total)
	return /^\+[1-9]\d{8,14}$/.test(formatted);
}


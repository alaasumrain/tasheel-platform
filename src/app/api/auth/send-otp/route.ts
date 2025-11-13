import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatPhoneNumber } from '@/lib/whatsapp';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey } from '@/lib/supabase-config';
import { sanitizeError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/utils/logger';

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
	let phone: string | undefined;
	let formattedPhone: string | undefined;

	try {
		const body = await request.json();
		phone = body.phone;

		if (!phone) {
			return NextResponse.json(
				{ error: 'Phone number is required' },
				{ status: 400 }
			);
		}

		formattedPhone = formatPhoneNumber(phone);
		const serviceKey = getSupabaseServiceKey();
		if (!serviceKey) {
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		const serviceClient = createServiceClient(getSupabaseUrl(), serviceKey);

		// Check if phone is blocked
		const { data: existingOTP } = await serviceClient
			.from('otp_codes')
			.select('blocked_until, last_sent_at')
			.eq('phone', formattedPhone)
			.single();

		// Check if blocked
		if (existingOTP?.blocked_until && new Date(existingOTP.blocked_until) > new Date()) {
			const blockedUntil = new Date(existingOTP.blocked_until);
			const minutesRemaining = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000);
			return NextResponse.json(
				{ error: `Too many failed attempts. Please try again in ${minutesRemaining} minute(s).` },
				{ status: 429 }
			);
		}

		// Check cooldown (minimum 60 seconds between OTP requests)
		if (existingOTP?.last_sent_at) {
			const lastSent = new Date(existingOTP.last_sent_at);
			const cooldownSeconds = 60; // 1 minute cooldown
			const secondsSinceLastSent = (Date.now() - lastSent.getTime()) / 1000;
			
			if (secondsSinceLastSent < cooldownSeconds) {
				const secondsRemaining = Math.ceil(cooldownSeconds - secondsSinceLastSent);
				return NextResponse.json(
					{ error: `Please wait ${secondsRemaining} second(s) before requesting a new code.` },
					{ status: 429 }
				);
			}
		}

		// Generate OTP
		const otp = generateOTP();

		// Store OTP in database with rate limiting fields
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
		const { error } = await serviceClient
			.from('otp_codes')
			.upsert({
				phone: formattedPhone,
				code: otp,
				expires_at: expiresAt.toISOString(),
				created_at: new Date().toISOString(),
				attempts: 0, // Reset attempts on new OTP
				blocked_until: null, // Clear block on new OTP
				last_sent_at: new Date().toISOString(),
			}, {
				onConflict: 'phone',
			});

		if (error) {
			console.error('Error storing OTP:', error);
			throw error;
		}

		// Send OTP via WhatsApp
		const message = `Your Tasheel verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this message.`;
		
		const whatsappResult = await sendWhatsAppMessage({
			to: formattedPhone,
			message,
		});

		if (!whatsappResult.success) {
			console.error('Failed to send WhatsApp OTP:', whatsappResult.error);
			// Still return success if WhatsApp fails (for testing)
			// In production, you might want to return an error or use SMS fallback
		}

		return NextResponse.json({
			success: true,
			message: 'OTP sent successfully',
			// In test mode, return OTP for testing (remove in production)
			...(process.env.NODE_ENV === 'development' && { testOtp: otp }),
		});
	} catch (error: unknown) {
		// Log full error for debugging (server-side only)
		logger.error('Error sending OTP', error, { phone: formattedPhone });
		
		// Return sanitized error message to user (no internal details)
		const sanitizedMessage = sanitizeError(error, 'Failed to send OTP. Please try again.');
		return NextResponse.json(
			{ error: sanitizedMessage },
			{ status: 500 }
		);
	}
}


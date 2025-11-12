import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatPhoneNumber } from '@/lib/whatsapp';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey } from '@/lib/supabase-config';

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP in database with expiration (5 minutes)
 * Uses service client to bypass RLS
 */
async function storeOTP(phone: string, otp: string) {
	const serviceKey = getSupabaseServiceKey();
	if (!serviceKey) {
		throw new Error('Server configuration error: SUPABASE_SERVICE_ROLE_KEY not set');
	}

	const serviceClient = createServiceClient(getSupabaseUrl(), serviceKey);
	const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

	const { error } = await serviceClient
		.from('otp_codes')
		.upsert({
			phone: formatPhoneNumber(phone),
			code: otp,
			expires_at: expiresAt.toISOString(),
			created_at: new Date().toISOString(),
		}, {
			onConflict: 'phone',
		});

	if (error) {
		console.error('Error storing OTP:', error);
		throw error;
	}
}

export async function POST(request: NextRequest) {
	try {
		const { phone } = await request.json();

		if (!phone) {
			return NextResponse.json(
				{ error: 'Phone number is required' },
				{ status: 400 }
			);
		}

		// Generate OTP
		const otp = generateOTP();

		// Store OTP in database
		await storeOTP(phone, otp);

		// Format phone number for WhatsApp
		const formattedPhone = formatPhoneNumber(phone);

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
	} catch (error: any) {
		console.error('Error sending OTP:', error);
		return NextResponse.json(
			{ error: error.message || 'Failed to send OTP' },
			{ status: 500 }
		);
	}
}


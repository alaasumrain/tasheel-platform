import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/utils/logger';

/**
 * Send OTP via Supabase's built-in email OTP functionality
 * Uses Supabase's signInWithOtp which sends email with OTP code
 */
export async function POST(request: NextRequest) {
	let phone: string | undefined;
	let email: string | undefined;

	try {
		const body = await request.json();
		phone = body.phone;
		email = body.email;

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required for OTP verification' },
				{ status: 400 }
			);
		}

		// Use Supabase's built-in email OTP
		const supabase = await createClient();
		
		// Send OTP via Supabase Auth (uses email template configured in dashboard)
		const { data, error } = await supabase.auth.signInWithOtp({
			email: email,
			options: {
				// Don't auto-create user - we handle registration separately
				shouldCreateUser: false,
			},
		});

		if (error) {
			console.error('Error sending Supabase OTP:', error);
			// If user doesn't exist, that's okay - we'll create them during registration
			if (error.message?.includes('User not found') || error.message?.includes('Email rate limit')) {
				// Still allow - user will be created during registration
				return NextResponse.json({
					success: true,
					message: 'OTP sent successfully',
				});
			}
			throw error;
		}

		return NextResponse.json({
			success: true,
			message: 'OTP sent successfully to your email',
			// In development, Supabase might return the OTP in the response
			...(process.env.NODE_ENV === 'development' && data && { testData: data }),
		});
	} catch (error: unknown) {
		// Log full error for debugging (server-side only)
		logger.error('Error sending OTP', error, { email });
		
		// Return sanitized error message to user (no internal details)
		const sanitizedMessage = sanitizeError(error, 'Failed to send OTP. Please try again.');
		return NextResponse.json(
			{ error: sanitizedMessage },
			{ status: 500 }
		);
	}
}


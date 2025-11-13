import { NextRequest, NextResponse } from 'next/server';
import { formatPhoneNumber } from '@/lib/whatsapp';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey, getSupabaseAnonKey } from '@/lib/supabase-config';
import { findUserByPhone } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { sanitizeError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/utils/logger';
import { createAuditLog, getClientIP, getUserAgent } from '@/lib/utils/audit-logger';

/**
 * Verify OTP code and create Supabase session using Supabase's verifyOtp API
 * Note: We use custom OTP table for WhatsApp delivery, but verify through Supabase Auth
 */
export async function POST(request: NextRequest) {
	let phone: string | undefined;
	let otp: string | undefined;
	let formattedPhone: string | undefined;

	try {
		const body = await request.json();
		phone = body.phone;
		otp = body.otp;

		if (!phone || !otp) {
			return NextResponse.json(
				{ error: 'Phone number and OTP code are required' },
				{ status: 400 }
			);
		}

		formattedPhone = formatPhoneNumber(phone);

		// Use service client to verify OTP from our custom table (bypasses RLS)
		const serviceKey = getSupabaseServiceKey();
		if (!serviceKey) {
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		const serviceClient = createServiceClient(getSupabaseUrl(), serviceKey);

		// Verify OTP from our custom table
		const { data: otpRecord, error: fetchError } = await serviceClient
			.from('otp_codes')
			.select('*')
			.eq('phone', formattedPhone)
			.single();

		if (fetchError || !otpRecord) {
			return NextResponse.json(
				{ error: 'Invalid or expired OTP code' },
				{ status: 400 }
			);
		}

		// Check expiration
		const expiresAt = new Date(otpRecord.expires_at);
		if (new Date() > expiresAt) {
			await serviceClient.from('otp_codes').delete().eq('phone', formattedPhone);
			return NextResponse.json(
				{ error: 'OTP code has expired. Please request a new one.' },
				{ status: 400 }
			);
		}

		// Check if phone is blocked
		if (otpRecord.blocked_until && new Date(otpRecord.blocked_until) > new Date()) {
			const blockedUntil = new Date(otpRecord.blocked_until);
			const minutesRemaining = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000);
			return NextResponse.json(
				{ error: `Too many failed attempts. Please request a new code and try again in ${minutesRemaining} minute(s).` },
				{ status: 429 }
			);
		}

		// Verify OTP code
		if (otpRecord.code !== otp) {
			// Increment attempts and block if threshold reached
			const newAttempts = (otpRecord.attempts || 0) + 1;
			const maxAttempts = 3;
			const blockDurationMinutes = 60; // Block for 1 hour after 3 failed attempts
			
			let blockedUntil: string | null = null;
			if (newAttempts >= maxAttempts) {
				blockedUntil = new Date(Date.now() + blockDurationMinutes * 60 * 1000).toISOString();
			}

			// Update attempts and block status
			await serviceClient
				.from('otp_codes')
				.update({
					attempts: newAttempts,
					blocked_until: blockedUntil,
					last_attempt_at: new Date().toISOString(),
				})
				.eq('phone', formattedPhone);

			if (blockedUntil) {
				return NextResponse.json(
					{ error: `Too many failed attempts. This phone number is blocked for ${blockDurationMinutes} minutes. Please request a new code after the block expires.` },
					{ status: 429 }
				);
			}

			const remainingAttempts = maxAttempts - newAttempts;
			return NextResponse.json(
				{ error: `Invalid OTP code. ${remainingAttempts} attempt(s) remaining.` },
				{ status: 400 }
			);
		}

		// Delete used OTP
		await serviceClient.from('otp_codes').delete().eq('phone', formattedPhone);

		// Check if auth user exists with this phone number
		// Use helper function that handles pagination properly
		const authUser = await findUserByPhone(formattedPhone);
		let authUserId: string;
		let userEmail: string | undefined;

		if (!authUser) {
			// No auth user exists - create one with phone number
			// This enables phone-only sign-in as required
			// Use a temporary email format that can be updated later when user provides real email
			userEmail = `${formattedPhone.replace(/\+/g, '').replace(/\s/g, '')}@tasheel.ps`;
			
			const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
				email: userEmail,
				phone: formattedPhone,
				phone_confirm: true, // Auto-confirm phone since we verified OTP
				email_confirm: false, // Email not verified yet (temporary email - user will need to verify real email later)
				user_metadata: {
					phone: formattedPhone,
					phone_verified: true,
					is_phone_only: true, // Flag to indicate phone-only account
					email_verification_required: true, // Flag to prompt user to verify email
				},
			});

			if (createError || !newUser.user) {
				console.error('Error creating auth user:', createError);
				return NextResponse.json(
					{ error: 'Failed to create user account' },
					{ status: 500 }
				);
			}

			authUserId = newUser.user.id;
			userEmail = newUser.user.email || userEmail;
		} else {
			authUserId = authUser.id;
			userEmail = authUser.email;
		}

		// Check if customer record exists, create/update if needed
		const { data: customer } = await serviceClient
			.from('customers')
			.select('id, email, phone')
			.eq('id', authUserId)
			.single();

		if (!customer) {
			// Create customer record with auth user id
			await serviceClient.from('customers').insert({
				id: authUserId,
				email: userEmail,
				phone: formattedPhone,
				name: null, // Will be filled during profile completion
				language_preference: 'ar',
			});
		} else if (customer.phone !== formattedPhone) {
			// Update phone if it changed
			await serviceClient
				.from('customers')
				.update({ phone: formattedPhone })
				.eq('id', authUserId);
		}

		// Create session using Supabase's phone OTP verification
		// Since we verified OTP ourselves, we'll use admin API to create session
		// The proper way is to use signInWithOtp + verifyOtp, but since we're using WhatsApp,
		// we'll create a session directly using admin API
		
		// Generate a magic link for session creation
		// Use the user's email (even if temporary) to generate link
		const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
			type: 'magiclink',
			email: userEmail!,
		});

		if (linkError || !linkData) {
			console.error('Error generating magic link:', linkError);
			return NextResponse.json(
				{ error: 'Failed to create session' },
				{ status: 500 }
			);
		}

		// Use email_otp from generateLink response (supported method)
		// According to Supabase docs, generateLink returns email_otp for magiclink type
		const emailOtp = linkData.properties?.email_otp;
		
		if (!emailOtp) {
			console.error('No email_otp in magic link response:', linkData);
			return NextResponse.json(
				{ error: 'Failed to extract session token' },
				{ status: 500 }
			);
		}

		// Verify OTP using the supported method: verifyOtp with email and token
		// Use server client to set session in HttpOnly cookies (secure)
		const serverClient = await createClient();
		
		// Use the supported verifyOtp method with email_otp and type 'magiclink'
		const { data: verifyData, error: verifyError } = await serverClient.auth.verifyOtp({
			email: userEmail!,
			token: emailOtp,
			type: 'magiclink',
		});

		if (verifyError || !verifyData?.session) {
			console.error('Error verifying magic link token:', verifyError);
			return NextResponse.json(
				{ error: 'Failed to create session' },
				{ status: 500 }
			);
		}

		// Log successful authentication
		await createAuditLog('phone_verified', {
			userId: authUserId,
			details: {
				phone: formattedPhone,
				email: userEmail,
				isNewUser: !authUser,
			},
			context: {
				ipAddress: getClientIP(request),
				userAgent: getUserAgent(request),
			},
		});

		// Session is automatically set in HttpOnly cookies by the server client
		// Do NOT return tokens in JSON response (security risk)
		// Return success response without tokens
		return NextResponse.json({
			success: true,
			userId: authUserId,
			email: userEmail,
			phone: formattedPhone,
			message: 'OTP verified and session created successfully',
		});
	} catch (error: unknown) {
		// Log full error for debugging (server-side only)
		logger.error('Error verifying OTP', error, { phone: formattedPhone });
		
		// Return sanitized error message to user (no internal details)
		const sanitizedMessage = sanitizeError(error, 'Failed to verify OTP. Please try again.');
		return NextResponse.json(
			{ error: sanitizedMessage },
			{ status: 500 }
		);
	}
}


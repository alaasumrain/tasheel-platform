import { NextRequest, NextResponse } from 'next/server';
import { formatPhoneNumber } from '@/lib/whatsapp';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey } from '@/lib/supabase-config';
import { sanitizeError } from '@/lib/utils/error-handler';
import { logger } from '@/lib/utils/logger';
import { Resend } from 'resend';

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

// Lazy-initialize Resend client
function getResendClient() {
	if (!process.env.RESEND_API_KEY) {
		throw new Error('RESEND_API_KEY is not configured');
	}
	return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
	let phone: string | undefined;
	let email: string | undefined;
	let formattedPhone: string | undefined;

	try {
		const body = await request.json();
		phone = body.phone;
		email = body.email;

		if (!phone && !email) {
			return NextResponse.json(
				{ error: 'Phone number or email is required' },
				{ status: 400 }
			);
		}

		// Prefer email for OTP delivery
		if (email) {
			formattedPhone = email; // Use email as identifier for OTP storage
		} else if (phone) {
			formattedPhone = formatPhoneNumber(phone);
		}
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

		// Send OTP via Email
		if (email) {
			try {
				const resend = getResendClient();
				const emailResult = await resend.emails.send({
					from: process.env.EMAIL_FROM || 'Tasheel <noreply@tasheel.ps>',
					to: email,
					subject: 'Your Tasheel Verification Code',
					html: `
						<!DOCTYPE html>
						<html>
						<head>
							<meta charset="UTF-8">
							<style>
								body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
								.container { max-width: 600px; margin: 0 auto; padding: 20px; }
								.header { background: linear-gradient(135deg, #1F4A56 0%, #2E6F7F 50%, #4A8FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
								.content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
								.otp-code { font-size: 32px; font-weight: 700; color: #2E6F7F; text-align: center; letter-spacing: 8px; padding: 20px; background: #f9fafb; border-radius: 6px; margin: 20px 0; }
								.footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
							</style>
						</head>
						<body>
							<div class="container">
								<div class="header">
									<h1 style="margin: 0; font-size: 28px;">Tasheel</h1>
									<p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">خدمات حكومية وترجمة معتمدة</p>
								</div>
								<div class="content">
									<h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px;">Verification Code</h2>
									<p style="margin: 0 0 20px; color: #4a4a4a;">مرحباً بك في Tasheel! Welcome to Tasheel!</p>
									<p style="margin: 0 0 20px; color: #4a4a4a;">Your verification code is:</p>
									<div class="otp-code">${otp}</div>
									<p style="margin: 20px 0 0; color: #6b7280; font-size: 14px;">This code will expire in 5 minutes.</p>
									<p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
								</div>
								<div class="footer">
									<p style="margin: 0;">© 2025 Tasheel. All rights reserved.</p>
								</div>
							</div>
						</body>
						</html>
					`,
				});

				if (emailResult.error) {
					console.error('Failed to send email OTP:', emailResult.error);
					throw new Error('Failed to send verification email');
				}
			} catch (emailError) {
				console.error('Error sending email OTP:', emailError);
				// In development, still return success with test OTP
				if (process.env.NODE_ENV !== 'development') {
					throw emailError;
				}
			}
		} else if (phone) {
			// Fallback: If no email, log for now (WhatsApp disabled)
			console.log('[OTP] Phone provided but email preferred. Phone:', formattedPhone);
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


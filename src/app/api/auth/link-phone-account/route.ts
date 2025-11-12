import { NextRequest, NextResponse } from 'next/server';
import { formatPhoneNumber } from '@/lib/whatsapp';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey } from '@/lib/supabase-config';
import { findUserByPhone } from '@/lib/auth-helpers';

/**
 * Link email/password registration to existing phone-only account
 * SECURITY: Requires OTP verification to prove phone number ownership
 * This prevents account fragmentation when users sign in with phone first, then register with email
 */
export async function POST(request: NextRequest) {
	try {
		const { phone, email, password, name, otp } = await request.json();

		if (!phone || !email || !password) {
			return NextResponse.json(
				{ error: 'Phone, email, and password are required' },
				{ status: 400 }
			);
		}

		// SECURITY: Require OTP verification to prove phone ownership
		// Without this, anyone who knows a phone number could hijack accounts
		if (!otp) {
			return NextResponse.json(
				{ error: 'OTP verification required to link accounts. Please verify your phone number first.' },
				{ status: 400 }
			);
		}

		const formattedPhone = formatPhoneNumber(phone);
		const serviceKey = getSupabaseServiceKey();
		
		if (!serviceKey) {
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		const serviceClient = createServiceClient(getSupabaseUrl(), serviceKey);

		// Verify OTP from our custom table to prove phone ownership
		const { data: otpRecord, error: fetchError } = await serviceClient
			.from('otp_codes')
			.select('*')
			.eq('phone', formattedPhone)
			.single();

		if (fetchError || !otpRecord) {
			return NextResponse.json(
				{ error: 'Invalid or expired OTP code. Please request a new one.' },
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

		// Verify OTP code matches
		if (otpRecord.code !== otp) {
			return NextResponse.json(
				{ error: 'Invalid OTP code' },
				{ status: 400 }
			);
		}

		// OTP verified - delete used OTP
		await serviceClient.from('otp_codes').delete().eq('phone', formattedPhone);

		// Now safe to check for existing phone-only account
		const existingPhoneUser = await findUserByPhone(formattedPhone);

		if (!existingPhoneUser) {
			// No phone-only account exists, return null to indicate normal registration should proceed
			return NextResponse.json({
				success: true,
				linked: false,
				message: 'No existing phone account to link',
			});
		}

		// Check if the existing account is phone-only (has temporary email)
		const isPhoneOnly = existingPhoneUser.email?.endsWith('@tasheel.ps') || 
			existingPhoneUser.email === `${formattedPhone.replace(/\+/g, '').replace(/\s/g, '')}@tasheel.ps`;

		if (!isPhoneOnly) {
			// Account already has a real email, don't link
			return NextResponse.json({
				success: true,
				linked: false,
				message: 'Account already has email',
			});
		}

		// Link the accounts: update the phone-only account with the new email and password
		const { data: updatedUser, error: updateError } = await serviceClient.auth.admin.updateUserById(
			existingPhoneUser.id,
			{
				email: email,
				password: password, // Set password for the account
				email_confirm: false, // User needs to verify email
				user_metadata: {
					phone: formattedPhone,
					phone_verified: true,
					is_phone_only: false, // No longer phone-only
					name: name || null,
				},
			}
		);

		if (updateError || !updatedUser.user) {
			console.error('Error updating user:', updateError);
			// Check if error is due to email already existing
			if (updateError?.message?.includes('already registered') || updateError?.message?.includes('already exists')) {
				return NextResponse.json(
					{ error: 'This email is already registered. Please sign in instead.' },
					{ status: 400 }
				);
			}
			return NextResponse.json(
				{ error: 'Failed to link accounts' },
				{ status: 500 }
			);
		}

		// Update customer record with new email and name
		await serviceClient
			.from('customers')
			.update({
				email: email,
				name: name || null,
			})
			.eq('id', existingPhoneUser.id);

		// Return the updated user info so client can sign in
		return NextResponse.json({
			success: true,
			linked: true,
			userId: existingPhoneUser.id,
			email: email,
			message: 'Account linked successfully. Please sign in with your email and password.',
		});
	} catch (error: unknown) {
		console.error('Error linking accounts:', error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to link accounts';
		return NextResponse.json(
			{ error: errorMessage },
			{ status: 500 }
		);
	}
}

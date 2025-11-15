import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Handle email confirmation callback from Supabase
 * Users click the confirmation link in their email, which redirects here
 * 
 * Supabase sends: /api/auth/confirm?token_hash=...&type=email
 */
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get('token_hash');
	const type = searchParams.get('type') as EmailOtpType | null;
	const next = searchParams.get('next') ?? '/dashboard';

	console.log('[Email Confirm] Received request:', { 
		hasTokenHash: !!token_hash, 
		type,
		next,
	});

	if (token_hash && type) {
		const supabase = await createClient();

		const { data, error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		console.log('[Email Confirm] Verification result:', {
			hasSession: !!data?.session,
			hasUser: !!data?.user,
			error: error?.message,
		});

		if (!error && data?.session) {
			// Successfully verified - redirect to dashboard
			console.log('[Email Confirm] Success - redirecting to:', next);
			redirect(next);
		} else {
			console.error('[Email Confirm] Verification failed:', error);
		}
	} else {
		console.error('[Email Confirm] Missing token_hash or type');
	}

	// If verification failed, redirect to error page
	redirect('/auth/error?message=Invalid or expired confirmation link');
}


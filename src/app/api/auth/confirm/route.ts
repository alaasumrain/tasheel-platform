import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Handle email confirmation callback from Supabase
 * Users click the confirmation link in their email, which redirects here
 */
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get('token_hash');
	const type = searchParams.get('type') as EmailOtpType | null;
	const next = searchParams.get('next') ?? '/dashboard';

	if (token_hash && type) {
		const supabase = await createClient();

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		if (!error) {
			// Successfully verified - redirect to dashboard
			redirect(next);
		}
	}

	// If verification failed, redirect to error page
	redirect('/auth/error?message=Invalid or expired confirmation link');
}


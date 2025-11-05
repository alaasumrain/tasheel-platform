import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '../supabase-config';

/**
 * Updates the user session in middleware.
 * This function:
 * 1. Refreshes the user's session if needed
 * 2. Handles cookie management for authentication
 * 3. Can redirect unauthenticated users (currently disabled for gradual rollout)
 */
export async function updateSession(request: NextRequest, response?: NextResponse) {
	const hasCustomResponse = Boolean(response);
	let supabaseResponse = response ?? NextResponse.next({
		request,
	});

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

				if (!hasCustomResponse) {
					supabaseResponse = NextResponse.next({
						request,
					});
				}

				cookiesToSet.forEach(({ name, value, options }) =>
					supabaseResponse.cookies.set(name, value, options)
				);
			},
		},
	});

	// IMPORTANT: Avoid writing any logic between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	await supabase.auth.getUser();

	// Optional: Protect specific routes (will be enabled for /dashboard routes)
	// Uncomment to protect customer dashboard routes
	/*
	const { data: { user } } = await supabase.auth.getUser();
	if (
		!user &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/register') &&
		!request.nextUrl.pathname.startsWith('/auth') &&
		request.nextUrl.pathname.startsWith('/dashboard')
	) {
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}
	*/

	// IMPORTANT: You *must* return the supabaseResponse object as it is.
	return supabaseResponse;
}


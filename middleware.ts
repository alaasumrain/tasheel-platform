import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';
import { updateSession } from './src/lib/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Handle admin routes (skip Supabase session for admin - uses custom auth)
	if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
		return NextResponse.next();
	}

	// Handle API routes (skip Supabase session for API - handles auth in route)
	if (pathname.startsWith('/api')) {
		return NextResponse.next();
	}

	// Let next-intl handle locale detection and routing
	// It will automatically detect browser locale and handle routing
	const response = handleI18nRouting(request);

	// Update Supabase session (handles customer auth cookies)
	return updateSession(request, response);
}

export const config = {
	// Run middleware across app routes (skip API/static assets)
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};


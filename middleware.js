import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_PATHS = ['/portal', '/admin'];
const STAFF_PATHS = ['/admin'];

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const protectedPath = PROTECTED_PATHS.find((path) => req.nextUrl.pathname.startsWith(path));
  if (!protectedPath) {
    return res;
  }

  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const isStaffRoute = STAFF_PATHS.some((path) => req.nextUrl.pathname.startsWith(path));
  if (isStaffRoute) {
    const role = session.user?.app_metadata?.role;
    if (role !== 'staff') {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('error', 'staff_only');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*']
};

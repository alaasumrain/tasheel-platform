import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('next') || '/portal';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=invalid_code', request.url));
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  const supabase = createRouteHandlerClient({ request, response });

  await supabase.auth.exchangeCodeForSession(code);

  return response;
}

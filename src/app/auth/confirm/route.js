import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

async function buildSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name, options) {
        cookieStore.set({ name, value: '', ...options });
      }
    }
  });
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/portal';

  const createRedirect = (path) => {
    try {
      if (!path) {
        return requestUrl.origin;
      }
      return new URL(path, requestUrl.origin).toString();
    } catch (error) {
      console.error('Invalid redirect target', error);
      return requestUrl.origin;
    }
  };

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=invalid_link`);
  }

  const supabase = await buildSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  if (error) {
    console.error('Supabase verifyOtp error', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=invalid_link`);
  }

  return NextResponse.redirect(createRedirect(next));
}

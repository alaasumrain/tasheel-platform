import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  });

  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}

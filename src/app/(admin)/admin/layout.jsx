/**
 * Layout shell derived from Devias Material Kit React dashboard (MIT License).
 * https://github.com/devias-io/material-kit-react
 */

import AdminLayoutShell from '../AdminLayoutShell';
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // If no session at all, redirect to login
  if (!session) {
    redirect('/login?redirectedFrom=/admin');
  }

  // If logged in but not staff, redirect with clear instruction to sign out/in
  if (session?.user?.app_metadata?.role !== 'staff') {
    redirect('/login?error=staff_only&signout=true');
  }

  return <AdminLayoutShell user={session?.user || null}>{children}</AdminLayoutShell>;
}

import PortalDashboardClient from '../PortalDashboardClient';
import { fetchPortalRequests } from '@/lib/supabase/portal';
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PortalHomePage() {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const email = session?.user?.email || undefined;
  const requests = await fetchPortalRequests({ supabase, email });
  return <PortalDashboardClient requests={requests} />;
}

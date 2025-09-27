import AdminDashboardClient from '../AdminDashboardClient';
import { fetchAdminQueue } from '@/lib/supabase/portal';
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerComponentClient();
  const requests = await fetchAdminQueue({ supabase });
  return <AdminDashboardClient requests={requests} />;
}

import PortalRequestDetailClient from '@/app/(portal)/PortalRequestDetailClient';
import { fetchPortalRequestDetail } from '@/lib/supabase/portal';
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PortalRequestDetailPage({ params }) {
  const { id } = params;
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const email = session?.user?.email || undefined;
  const data = await fetchPortalRequestDetail(id, { supabase, email });

  if (!data) {
    notFound();
  }

  return <PortalRequestDetailClient data={data} />;
}

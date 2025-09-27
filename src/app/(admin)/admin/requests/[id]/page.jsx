import AdminRequestDetailClient from '@/app/(admin)/AdminRequestDetailClient';
import { fetchAdminRequestDetail } from '@/lib/supabase/portal';
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminRequestDetailPage({ params }) {
  const { id } = params;
  const supabase = await getSupabaseServerComponentClient();
  const data = await fetchAdminRequestDetail(id, { supabase });

  if (!data) {
    notFound();
  }

  return <AdminRequestDetailClient data={data} />;
}

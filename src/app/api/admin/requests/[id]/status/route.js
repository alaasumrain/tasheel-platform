import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { updateRequestStatus } from '@/lib/supabase/admin';

export async function POST(request, { params }) {
  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  const supabaseAuth = createRouteHandlerClient({ request, response });

  const {
    data: { session }
  } = await supabaseAuth.auth.getSession();

  if (!session || session.user?.app_metadata?.role !== 'staff') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await updateRequestStatus({
      applicationId: id,
      status,
      actorEmail: session.user.email
    });
    return response;
  } catch (error) {
    console.error('Failed to update status', error);
    return NextResponse.json({ error: 'Unable to update status' }, { status: 500 });
  }
}

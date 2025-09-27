import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { randomUUID } from 'node:crypto';
import { Buffer } from 'node:buffer';

import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const BUCKET = 'translation_uploads';

function buildLeadPayload(payload) {
  return {
    service_slug: payload?.meta?.service || 'translation-quote',
    full_name: payload?.contact?.fullName || '',
    email: payload?.contact?.email || '',
    phone: payload?.contact?.phone || null,
    organisation: payload?.contact?.organisation || null,
    notes: payload?.contact?.notes || null,
    document_type: payload?.documents?.documentType || '',
    document_link: payload?.documents?.link || null,
    word_count: payload?.details?.wordCount ?? null,
    deadline: payload?.details?.deadline || null,
    purpose: payload?.details?.purpose || '',
    turnaround: payload?.options?.turnaround || 'standard',
    certification: Boolean(payload?.options?.certification),
    notarisation: Boolean(payload?.options?.notarisation),
    physical_copies: Boolean(payload?.options?.physicalCopies),
    instructions: payload?.options?.instructions || null,
    payload,
    marketing_channel: payload?.meta?.marketingChannel || null
  };
}

function buildEventPayload(applicationId, payload, actorId) {
  return {
    application_id: applicationId,
    actor_id: actorId || null,
    event_type: 'quote_requested',
    notes: 'Translation quote requested via public wizard',
    data: {
      service_slug: payload?.meta?.service || 'translation-quote',
      turnaround: payload?.options?.turnaround || 'standard',
      source_language: payload?.details?.sourceLanguage || null,
      target_language: payload?.details?.targetLanguage || null
    }
  };
}

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Failed to parse form data', error);
    return NextResponse.json({ error: 'Invalid form submission' }, { status: 400 });
  }

  const payloadRaw = formData.get('payload');
  if (!payloadRaw) {
    return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(payloadRaw);
  } catch (error) {
    console.error('Unable to parse payload JSON', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const files = formData.getAll('files').filter((file) => file && typeof file === 'object' && file.size);

  const routeSupabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await routeSupabase.auth.getSession();

  const supabase = getSupabaseServiceRoleClient();

  try {
    const leadRecord = buildLeadPayload(payload);
    const sessionEmail = session?.user?.email || null;
    const applicantId = session?.user?.id || null;

    if (!leadRecord.email && sessionEmail) {
      leadRecord.email = sessionEmail;
    }

    const { data: leadData, error: leadError } = await supabase.from('leads').insert(leadRecord).select().single();

    if (leadError) {
      throw leadError;
    }

    const { data: applicationData, error: applicationError } = await supabase
      .from('applications')
      .insert({
        service_slug: leadRecord.service_slug,
        form_slug: 'translation-quote',
        applicant_id: applicantId,
        applicant_email: leadRecord.email,
        status: 'submitted',
        payload
      })
      .select()
      .single();

    if (applicationError) {
      throw applicationError;
    }

    const applicationId = applicationData.id;

    await supabase.from('leads').update({ application_id: applicationId }).eq('id', leadData.id);

    await supabase.from('application_events').insert(buildEventPayload(applicationId, payload, applicantId));

    if (files.length) {
      const attachments = [];
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const path = `lead-${leadData.id}/${Date.now()}-${randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: false
        });

        if (uploadError) {
          throw uploadError;
        }

        attachments.push({
          application_id: applicationId,
          storage_path: path,
          file_name: file.name,
          content_type: file.type || null,
          file_size: file.size || null,
          uploaded_by: applicantId || null
        });
      }

      if (attachments.length) {
        const { error: attachmentsError } = await supabase.from('application_attachments').insert(attachments);

        if (attachmentsError) {
          throw attachmentsError;
        }
      }
    }

    await supabase.from('applications').update({ last_event_at: new Date().toISOString() }).eq('id', applicationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process quote request', error);
    return NextResponse.json({ error: 'Unable to submit request' }, { status: 500 });
  }
}

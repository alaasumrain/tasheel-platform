import { getSupabaseServiceRoleClient } from './server';

const STATUS_EVENT_LABELS = {
  submitted: 'Request submitted',
  scoping: 'Scoping started',
  quote_sent: 'Quote sent to client',
  in_progress: 'Translation in progress',
  review: 'Deliverable under review',
  completed: 'Request completed',
  archived: 'Request archived',
  rejected: 'Request rejected',
  cancelled: 'Request cancelled'
};

export async function updateRequestStatus({ applicationId, status, actorEmail }) {
  const supabase = getSupabaseServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { data: application, error: updateError } = await supabase
    .from('applications')
    .update({ status, last_event_at: nowIso })
    .eq('id', applicationId)
    .select('id, payload, applicant_email')
    .maybeSingle();

  if (updateError) {
    throw updateError;
  }

  await supabase.from('application_events').insert({
    application_id: applicationId,
    event_type: `status_${status}`,
    notes: STATUS_EVENT_LABELS[status] || 'Status updated',
    data: {
      actor: actorEmail || null,
      status
    }
  });

  return application;
}

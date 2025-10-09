import { servicesCatalogue } from '@/data/services';

const serviceTitleLookup = Object.fromEntries(servicesCatalogue.map((svc) => [svc.slug, svc.title]));
const BUCKET = 'translation_uploads';
const APPLICATION_SELECT = 'id, service_slug, status, payload, submitted_at, applicant_email';
const SIGNED_URL_TTL_MS = 60 * 60 * 1000;

const attachmentUrlCache = new Map();

function getCachedSignedUrl(path) {
  const cached = attachmentUrlCache.get(path);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    attachmentUrlCache.delete(path);
    return null;
  }

  return cached.url;
}

function setCachedSignedUrl(path, url) {
  attachmentUrlCache.set(path, {
    url,
    expiresAt: Date.now() + SIGNED_URL_TTL_MS
  });
}

function mapApplication(row) {
  const payload = row.payload || {};
  const details = payload.details || {};
  const options = payload.options || {};
  const contact = payload.contact || {};

  const slug = payload.meta?.service || row.service_slug;
  const serviceName = payload.meta?.serviceName || serviceTitleLookup[slug];

  return {
    id: row.id,
    reference: row.id.slice(0, 8).toUpperCase(),
    service: serviceName || 'Translation service',
    submittedAt: row.submitted_at,
    sourceLanguage: details.sourceLanguage || null,
    targetLanguage: details.targetLanguage || null,
    turnaround: options.turnaround === 'rush' ? 'Rush' : 'Standard',
    status: row.status,
    options,
    contact,
    payload
  };
}

function requireSupabaseClient(supabase) {
  if (!supabase) {
    throw new Error('Supabase client required — pass getSupabaseServerComponentClient() when calling data helpers.');
  }
  return supabase;
}

async function signAttachmentUrl(client, path) {
  const cached = getCachedSignedUrl(path);
  if (cached) {
    return cached;
  }

  const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, 60 * 60);

  if (error) {
    console.error('createSignedUrl error', error);
    return null;
  }

  const url = data?.signedUrl || null;
  if (url) {
    setCachedSignedUrl(path, url);
  }
  return url;
}

export async function fetchPortalRequests({ supabase, email } = {}) {
  const client = requireSupabaseClient(supabase);

  let query = client.from('applications').select(APPLICATION_SELECT).order('submitted_at', { ascending: false }).limit(50);

  if (email) {
    query = query.eq('applicant_email', email);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchPortalRequests error', error);
    return [];
  }

  return (data || []).map(mapApplication);
}

export async function fetchRequestAttachments(id, { supabase } = {}) {
  const client = requireSupabaseClient(supabase);

  const { data, error } = await client
    .from('application_attachments')
    .select('id, storage_path, file_name, content_type, file_size, created_at')
    .eq('application_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('fetchRequestAttachments error', error);
    return [];
  }

  if (!data?.length) {
    return [];
  }

  const signed = await Promise.all(
    data.map(async (file) => ({
      id: file.id,
      fileName: file.file_name,
      contentType: file.content_type,
      fileSize: file.file_size,
      createdAt: file.created_at,
      url: await signAttachmentUrl(client, file.storage_path)
    }))
  );

  return signed;
}

export async function fetchPortalRequestDetail(id, { supabase, email } = {}) {
  const client = requireSupabaseClient(supabase);

  let query = client.from('applications').select(APPLICATION_SELECT).eq('id', id).maybeSingle();

  const { data: application, error } = await query;

  if (error || !application) {
    if (error) {
      console.error('fetchPortalRequestDetail error', error);
    }
    return null;
  }

  if (email && application.applicant_email && application.applicant_email.toLowerCase() !== email.toLowerCase()) {
    return null;
  }

  const base = mapApplication(application);

  const [{ data: events }, attachments] = await Promise.all([
    client
      .from('application_events')
      .select('id, event_type, notes, data, created_at')
      .eq('application_id', id)
      .order('created_at', { ascending: false }),
    fetchRequestAttachments(id, { supabase: client })
  ]);

  return {
    ...base,
    events: (events || []).map((event) => ({
      id: event.id,
      createdAt: event.created_at,
      eventType: event.event_type,
      notes: event.notes,
      data: event.data || {}
    })),
    attachments: attachments || []
  };
}

export async function fetchAdminQueue({ supabase } = {}) {
  const client = requireSupabaseClient(supabase);

  const { data, error } = await client
    .from('applications')
    .select(APPLICATION_SELECT)
    .order('submitted_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('fetchAdminQueue error', error);
    return [];
  }

  return (data || []).map((row) => {
    const mapped = mapApplication(row);
    return {
      ...mapped,
      clientEmail: row.applicant_email || mapped.contact?.email || 'Unknown'
    };
  });
}

export async function fetchAdminRequestDetail(id, { supabase } = {}) {
  return fetchPortalRequestDetail(id, { supabase });
}

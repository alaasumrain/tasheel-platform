-- Create enum for application statuses
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'cancelled');
    END IF;
END$$;

-- Applications table holds the canonical submission record
CREATE TABLE IF NOT EXISTS public.applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    form_slug text NOT NULL,
    applicant_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    applicant_email text,
    status application_status NOT NULL DEFAULT 'submitted',
    payload jsonb NOT NULL,
    submitted_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    last_event_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS applications_applicant_idx ON public.applications (applicant_id);
CREATE INDEX IF NOT EXISTS applications_form_slug_idx ON public.applications (form_slug);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_application_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE PROCEDURE public.set_application_updated_at();

-- Application events keep an audit trail
CREATE TABLE IF NOT EXISTS public.application_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL REFERENCES public.applications (id) ON DELETE CASCADE,
    actor_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    event_type text NOT NULL,
    notes text,
    data jsonb,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS application_events_app_idx ON public.application_events (application_id, created_at DESC);

-- Attachments metadata, actual files stored in Supabase Storage bucket
CREATE TABLE IF NOT EXISTS public.application_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL REFERENCES public.applications (id) ON DELETE CASCADE,
    storage_path text NOT NULL,
    file_name text NOT NULL,
    content_type text,
    file_size bigint,
    uploaded_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS application_attachments_app_idx ON public.application_attachments (application_id);

-- Enable row level security and add baseline policies
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_attachments ENABLE ROW LEVEL SECURITY;

-- Applicants can see their own applications
DROP POLICY IF EXISTS "Applicants can view own applications" ON public.applications;
CREATE POLICY "Applicants can view own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = applicant_id);

-- Applicants can insert submissions for themselves via client
DROP POLICY IF EXISTS "Applicants can insert own applications" ON public.applications;
CREATE POLICY "Applicants can insert own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

-- Applicants can view their own events
DROP POLICY IF EXISTS "Applicants can view own application events" ON public.application_events;
CREATE POLICY "Applicants can view own application events"
ON public.application_events
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_id AND a.applicant_id = auth.uid()
));

-- Applicants can view metadata for their attachments
DROP POLICY IF EXISTS "Applicants can view own attachments" ON public.application_attachments;
CREATE POLICY "Applicants can view own attachments"
ON public.application_attachments
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_id AND a.applicant_id = auth.uid()
));

-- Service role receives full access via default grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_events TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_attachments TO service_role;

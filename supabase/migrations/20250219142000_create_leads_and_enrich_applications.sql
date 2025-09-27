-- Ensure applications table has service_slug used by the web app
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS service_slug text;

-- Leads table captures quote submissions prior to authentication
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  organisation text,
  notes text,
  document_type text NOT NULL,
  document_link text,
  word_count integer,
  deadline date,
  purpose text NOT NULL,
  turnaround text NOT NULL CHECK (turnaround IN ('standard','rush')),
  certification boolean NOT NULL DEFAULT false,
  notarisation boolean NOT NULL DEFAULT false,
  physical_copies boolean NOT NULL DEFAULT false,
  instructions text,
  payload jsonb DEFAULT '{}'::jsonb,
  marketing_channel text,
  status text NOT NULL DEFAULT 'new',
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

CREATE OR REPLACE FUNCTION public.set_lead_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_lead_updated_at ON public.leads;
CREATE TRIGGER set_lead_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE PROCEDURE public.set_lead_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO service_role;

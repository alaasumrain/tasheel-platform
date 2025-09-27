-- Ensure application_status enum exists with required values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM (
      'draft',
      'submitted',
      'scoping',
      'quote_sent',
      'in_progress',
      'review',
      'completed',
      'archived',
      'rejected',
      'cancelled'
    );
  END IF;
END $$;

-- Strengthen application RLS to support session-backed access for clients and staff
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'scoping'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'scoping';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'quote_sent'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'quote_sent';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'in_progress'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'in_progress';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'review'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'review';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'completed'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'completed';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'archived'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'archived';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'rejected'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'rejected';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type typ
    JOIN pg_enum enum ON typ.oid = enum.enumtypid
    WHERE typ.typname = 'application_status' AND enum.enumlabel = 'cancelled'
  ) THEN
    ALTER TYPE application_status ADD VALUE 'cancelled';
  END IF;
END $$;

-- Helpers for readability
DROP FUNCTION IF EXISTS public._tasheel_is_owner(uuid);
CREATE OR REPLACE FUNCTION public._tasheel_is_owner(app_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = app_id
      AND (
        (a.applicant_id IS NOT NULL AND auth.uid() = a.applicant_id)
        OR (
          a.applicant_email IS NOT NULL
          AND auth.jwt() ->> 'email' IS NOT NULL
          AND lower(a.applicant_email) = lower(auth.jwt() ->> 'email')
        )
      )
  );
$$;

-- Applications policies
DROP POLICY IF EXISTS "Applicants can view own applications" ON public.applications;
CREATE POLICY "Applicants can view own applications"
ON public.applications
FOR SELECT
USING (
  (applicant_id IS NOT NULL AND auth.uid() = applicant_id)
  OR (
    applicant_email IS NOT NULL
    AND auth.jwt() ->> 'email' IS NOT NULL
    AND lower(applicant_email) = lower(auth.jwt() ->> 'email')
  )
);

DROP POLICY IF EXISTS "Applicants can insert own applications" ON public.applications;
CREATE POLICY "Applicants can insert own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "Staff can view applications" ON public.applications;
CREATE POLICY "Staff can view applications"
ON public.applications
FOR SELECT
USING (auth.jwt() ->> 'role' = 'staff');

DROP POLICY IF EXISTS "Staff can update applications" ON public.applications;
CREATE POLICY "Staff can update applications"
ON public.applications
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'staff')
WITH CHECK (auth.jwt() ->> 'role' = 'staff');

-- Application events policies
DROP POLICY IF EXISTS "Applicants can view own application events" ON public.application_events;
CREATE POLICY "Applicants can view own application events"
ON public.application_events
FOR SELECT
USING (public._tasheel_is_owner(application_id));

DROP POLICY IF EXISTS "Staff can view application events" ON public.application_events;
CREATE POLICY "Staff can view application events"
ON public.application_events
FOR SELECT
USING (auth.jwt() ->> 'role' = 'staff');

DROP POLICY IF EXISTS "Staff can insert application events" ON public.application_events;
CREATE POLICY "Staff can insert application events"
ON public.application_events
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'staff');

-- Application attachment policies
DROP POLICY IF EXISTS "Applicants can view own attachments" ON public.application_attachments;
CREATE POLICY "Applicants can view own attachments"
ON public.application_attachments
FOR SELECT
USING (public._tasheel_is_owner(application_id));

DROP POLICY IF EXISTS "Staff can view attachments" ON public.application_attachments;
CREATE POLICY "Staff can view attachments"
ON public.application_attachments
FOR SELECT
USING (auth.jwt() ->> 'role' = 'staff');

DROP POLICY IF EXISTS "Staff can insert attachments" ON public.application_attachments;
CREATE POLICY "Staff can insert attachments"
ON public.application_attachments
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'staff');

-- Ensure authenticated users can leverage RLS policies
GRANT SELECT, UPDATE ON public.applications TO authenticated;
GRANT SELECT, INSERT ON public.application_events TO authenticated;
GRANT SELECT, INSERT ON public.application_attachments TO authenticated;

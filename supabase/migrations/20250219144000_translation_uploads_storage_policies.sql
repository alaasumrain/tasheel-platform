-- Ensure translation uploads bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('translation_uploads', 'translation_uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Clean up existing policies to avoid duplicates
DROP POLICY IF EXISTS "Translation uploads staff access" ON storage.objects;
DROP POLICY IF EXISTS "Translation uploads applicant access" ON storage.objects;

-- Allow Tasheel staff full control over translation uploads
CREATE POLICY "Translation uploads staff access"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'translation_uploads' AND auth.jwt() ->> 'role' = 'staff'
)
WITH CHECK (
  bucket_id = 'translation_uploads' AND auth.jwt() ->> 'role' = 'staff'
);

-- Allow applicants to download their own files (including signed URLs)
CREATE POLICY "Translation uploads applicant access"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'translation_uploads' AND EXISTS (
    SELECT 1
    FROM public.application_attachments aa
    JOIN public.applications a ON a.id = aa.application_id
    WHERE aa.storage_path = storage.objects.name
      AND (
        (a.applicant_id IS NOT NULL AND a.applicant_id = auth.uid())
        OR (
          a.applicant_email IS NOT NULL
          AND auth.jwt() ->> 'email' IS NOT NULL
          AND lower(a.applicant_email) = lower(auth.jwt() ->> 'email')
        )
      )
  )
);

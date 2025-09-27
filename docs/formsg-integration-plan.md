# Tasheel Integration Plan (FormSG + Next.js + Supabase optional)

## Core responsibilities

- **FormSG (Node + Mongo + S3)**
  - Build and host forms, manage encryption, handle file uploads and virus scanning.
  - Provide admin console for Tasheel staff to create forms and review submissions.
  - Store full submission payloads in MongoDB; send notifications via configured email/SMS providers.

- **Tasheel Next.js portal**
  - Present service catalog and deep-link to FormSG forms.
  - Provide citizen and staff dashboards backed by the tracking layer (Supabase or direct FormSG API).
  - Surface documentation, FAQs, and updates without touching the secure submission flow.

- **Supabase (optional but recommended)**
  - Acts as the relational tracking layer (Postgres) for application metadata.
  - Supplies Auth for citizens/staff within the Tasheel portal.
  - Offers Realtime channels and Storage buckets for documents shared back to applicants.

## Data flow

1. Applicant visits Tasheel portal and follows a link to the relevant FormSG form.
2. FormSG handles the entire submission, encrypts payload, stores in Mongo, triggers notifications.
3. A FormSG webhook posts minimal metadata (submission ID, form ID, status, timestamps) to a Tasheel endpoint:
   - If Supabase is in use, the endpoint writes to a Postgres table via Supabase client.
   - Without Supabase, the endpoint updates a Mongo collection or cached view exposed by the Tasheel API.
4. Tasheel dashboards read from the tracking table to show status and history.
5. Staff drill down into the FormSG admin portal for full submission details when required.

## Immediate tasks

1. **FormSG fork baseline**
   - Complete the steps in `docs/formsg-setup.md`.
   - Disable Singapore-specific modules and confirm the UI no longer references them.

2. **Branding & localisation**
   - Replace logos/assets.
   - Add Arabic translations for key screens.
   - Review email templates for Tasheel wording.

3. **Webhook endpoint**
   - In the Tasheel Next.js project, add an API route (e.g. `src/app/api/formsg/webhook/route.ts`).
   - Validate FormSG signatures (shared secret) and persist the extracted metadata.

4. **Tracking layer**
   - If Supabase is used: define `applications` table (submission_id, form_id, applicant_email, status, last_event_at, notes).
   - Seed RLS policies so applicants only see their own records; staff roles see assigned queues.
   - If skipping Supabase: expose a lightweight API that queries FormSG’s Mongo collections for the same data.

5. **Dashboard UI**
   - Create a new dashboard route in the Next.js app that fetches tracking data and displays status timelines.
   - Provide links back to FormSG admin (staff) or to submission receipts (applicants).

6. **Deployment groundwork**
   - Plan infrastructure: Mongo ReplicaSet, S3 bucket, FormSG containers behind reverse proxy.
   - Capture backup procedures for Mongo and uploaded files.

## Later enhancements

- Integrate payments (swap Stripe with PayTabs/MyFatoorah) once core forms run.
- Add n8n or similar workflow automation if manual routing becomes a bottleneck.
- Implement analytics dashboards (Supabase or external BI) for submission metrics.

Keep this document updated as decisions evolve.

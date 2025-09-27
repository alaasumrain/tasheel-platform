# Tasheel Service Platform – Translation Vertical PRD

## 1. Overview
- **Goal:** Launch Tasheel’s first digital service vertical (professional translation) while building reusable foundations for future services.
- **Outcomes:**
  - Simple public quote/intake experience.
  - Self-service client portal for status tracking and deliverables.
  - Internal tooling for Tasheel staff to manage requests and partners.
  - Structured data model ready for additional services.

## 2. Personas & Needs
- **Client (new lead):** Needs a fast way to request translation, upload documents securely, and understand pricing/turnaround.
- **Client (returning):** Wants visibility into active jobs, history, and deliverables without emailing support.
- **Tasheel Staff:** Requires queue management, partner assignment, status logging, and deliverable uploads.
- **Linguist Partner (future):** Receives assignments, uploads translated files, communicates blockers (handled via staff for MVP).

## 3. High-Level Journey
1. Visitor browses `/services` → opens specific translation service page.
2. CTA launches multi-step quote wizard (Contacts → Documents → Project Details → Options → Review & Submit).
3. Submission creates Supabase records (`leads`, `applications`, `application_events`, optional `application_attachments` for uploads).
4. Tasheel staff notified, review in admin dashboard, assign partner, update status, upload deliverables.
5. Client receives email with magic link → signs in → `/portal` shows request status and files.
6. Completion triggers final notification + archive for reporting.

## 4. Feature Requirements

### 4.1 Public Website (existing sections updated)
- Hero, services, FAQ already rewritten for translation emphasis.
- Add “Start your translation request” CTAs leading to quote wizard.

### 4.2 Quote Wizard (public access)
- **Steps:**
  1. Contacts – name, email, phone (optional), organisation.
  2. Documents – upload files (PDF, DOCX, images) or provide links; capture document type.
  3. Project Details – source & target languages, word count (optional), deadline, purpose (legal, medical, etc.).
  4. Options – turnaround selection (Standard 2–3 business days, Rush 24 hours), certification, notarisation, physical copies, special instructions.
  5. Review – summary + consent checkbox → submit.
- **Validation:** Required fields per step, file type/size checks, rate limiting captcha (future).
- **File requirements:** Allow multiple uploads (max 5 files, up to 20 MB each). Accepted formats: PDF, DOCX, XLSX, PPTX, JPG, PNG. Display file summary on review step.
- **Submission:**
  - Insert into `leads` (new table) for marketing follow-up.
  - Insert into `applications` with `status='submitted'`, `form_slug='translation-quote'`, `payload` snapshot.
  - Create initial `application_event` (“Quote requested”).
  - Upload files to Supabase Storage bucket `translation_uploads/lead-{id}/` and record metadata in `application_attachments`.
  - Send acknowledgement email (future automation).

### 4.3 Client Portal (`/portal`)
- Authenticated with Supabase (magic link or email/password).
- Dashboard shows list of `applications` scoped by `applicant_id`; searchable by service, status, language pair.
- Request detail page displays event timeline, attachments, deliverables, and allows client comments (future).
- “Start new request” button reuses quote wizard (prefilled contact info) but requires auth.
- Deliverables accessible only when authenticated; no guest download links in MVP.
- Layout baseline: adapt Devias Material Kit React dashboard (MIT) for top navigation, sidebar, and content shell.
- Login/reset views reuse Devias Material Kit React auth template for consistent onboarding.

### 4.4 Admin Workspace (`/admin`)
- Staff-only via Supabase auth claim `role=staff`.
- **Views:**
  - Requests board/table with filters, status update actions, assignment notes.
  - Request detail with timeline, uploaded files, deliverable upload action.
  - Service catalogue manager (toggle `is_active`, edit copy/pricing).
  - Partner registry placeholder (future release).
- Track actions by inserting `application_events` entries (e.g., “Assigned partner”, “Deliverable uploaded”).
- Admin UI should enforce status progression (see §5 workflow) and prevent skipping forward without required data.
- Layout baseline: reuse Devias Material Kit React admin dashboard shell for consistency with client portal.

### 4.5 Notifications (future MVP+)
- Email triggers on submission, status change, deliverable ready.
- Optional SMS for urgent updates.

### 4.6 Reporting (future)
- Aggregate dashboards for volume, turnaround, revenue.

## 5. Data Model & API
- **Existing tables:** `applications`, `application_events`, `application_attachments` (with RLS policies).
- **New tables:**
  - `leads`: captures pre-auth submissions (id, contact info, service_slug, metadata, created_at, optional linked `application_id`).
  - Optional `linguist_partners` for future assignment tracking.
  - *Future:* `rate_cards` for automated pricing (language pair, certification fees, rush multipliers).
- **Service catalogue tables** (added previously): `service_categories`, `services`, `industries`, `service_industries` with `is_active` flags.
- **Status workflow:** `submitted` → `scoping` → `quote_sent` → `in_progress` → `review` → `completed` → `archived`; include `rejected` and `cancelled` escape statuses. Define allowed transitions in admin tooling.
- **Lead to account linking:** store email in `leads`. When user authenticates (magic link), update `applications.applicant_id` and back-reference the lead. Avoid duplicate leads by checking existing applications.
- **Pricing handling:** word count / options captured in form. Tasheel staff send manual quotes in MVP (email + event log). Payments handled offline; future release may add online payments.
- **APIs / Server actions:**
  - `/api/quote` (public) → validates wizard payload, writes Supabase records.
  - `/api/upload` or direct Supabase Storage upload with signed URL.
  - `/portal` & `/admin` use server components with Supabase client for reads.

## 6. Tech Stack Alignment
- Frontend: Next.js (App Router), React Hook Form + Zod, Material UI components.
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions if needed). No separate FastAPI for MVP.
- Files: Supabase Storage bucket per service type with signed URL access.
- Auth: Supabase email/password or magic links; service role via JWT claims.

## 7. Milestones
1. **Finalize UX & copy** (this doc) → shareable with stakeholders.
2. **Quote wizard implementation** (React) with client-side validation, stubbed submission.
3. **Supabase wiring** – create `leads` table migration, connect wizard to `/api/quote`.
4. **Client portal skeleton** – list and detail pages using mock data.
5. **Admin dashboard skeleton** – request list/detail using mock data.
6. **Auth integration** – Supabase provider, RLS, session-aware nav.
7. **Full data integration** – all reads & writes hitting Supabase.
8. **Notifications & polish** (emails, status badges, analytics).

## 7.1 Execution Plan (detailed)

### Milestone 1 – Quote Wizard UI (stubbed)
- Import MUI Checkout template into `src/components/forms/translation-wizard`.
- Define React Hook Form schema (Zod) per PRD fields.
- Implement multi-step state, progress, and review summary.
- Wire submit handler to temporary console log; add unit tests for schema.
- Integrate wizard entry point on `/services/[slug]` and `/contact` CTA.

### Milestone 2 – Supabase Schema Updates
- Create migration for `leads` table (+ indexes) and ensure `applications` `status` enum includes new lifecycle.
- Add triggers/policies if needed (RLS for `leads` optional now, but staff-only access later).
- Update seed data (`services`, etc.) if any new options referenced (turnaround strings).
- Run migrations locally (`npx supabase start`, `npx supabase migration up --local`).

### Milestone 3 – API & Storage Integration
- Build `/api/quote` route handler:
  - Validate payload server-side (Zod).
  - Insert `leads`, `applications`, `application_events`.
  - Upload files to Supabase Storage using service role key; store metadata in `application_attachments`.
  - Return success/failure to wizard.
- Configure environment variables for Supabase service role and storage bucket.
- Add minimal logging/error handling.

### Milestone 4 – Client Portal Skeleton
- Scaffold `/portal` layout using MUI dashboard template.
- Implement request list (mock data) with filters.
- Build request detail page showing timeline, attachments (placeholder data).
- Add “Start new request” button linking to wizard (prefill from session later).

### Milestone 5 – Admin Dashboard Skeleton
- Scaffold `/admin` layout (reuse MUI dashboard components).
- Implement request board/table (mock data), detail view, status action buttons (no backend yet).
- Add service catalogue admin screen referencing static data.

### Milestone 6 – Supabase Auth Integration
- Configure Supabase client provider in Next.js (server & client utilities).
- Implement login/logout UI (magic link or email/password) at `/login`.
- Guard `/portal` and `/admin` routes with server-side redirects.
- Inject user context for nav (show Dashboard/Sign out when authenticated).
- Define RLS policies for `applications`, `application_events`, `application_attachments` referencing `auth.uid()`.

### Milestone 7 – Data Wiring
- Replace mock data in portal/admin with Supabase queries (server components / API routes).
- Ensure wizard submission updates portal list in real usage.
- Implement status update mutations in admin (call Supabase update + event insert).
- Handle deliverable uploads via admin UI (Storage + metadata).

### Milestone 8 – Communications & Polish
- Implement acknowledgement email function (Supabase Edge Function or external service).
- Add status badges, empty states, loading skeletons.
- Audit accessibility (labels, focus states, error messages).
- QA full flow end-to-end (wizard → admin update → portal view).

## 8. Confirmed MVP Decisions
- Turnaround tiers limited to **Standard (2–3 business days)** and **Rush (24 hours)**; displayed in the wizard and stored with each request.
- Payments remain **offline/invoiced** for MVP; portal only captures requirements and status.
- Linguist coordination handled internally by Tasheel staff; no external partner portal in first release.
- UI launches in **English only**; Arabic localisation planned after flows stabilise.

## 9. Open Questions
- When should we introduce online payment collection (after quote acceptance vs upfront)?
- What reporting metrics matter most for leadership (volume, turnaround, revenue, partner utilisation)?
- Do we need multilingual UI parity before adding additional Tasheel service verticals?

## 10. Out of Scope (MVP)
- Real-time chat/messaging inside portal.
- Self-service partner portal (handled manually by staff initially).
- Multi-tenant white-label support.
- Advanced analytics dashboards.

## 11. Future Enhancements
- Automated pricing engine leveraging rate cards (per language pair, certification, rush multipliers) to generate instant quotes.
- Online payment integration (card, bank transfer, digital wallets) tied to quote approval.
- Partner tooling for assignment visibility and deliverable submission.

## 12. Next Steps
- Review and refine this PRD with the team.
- Lock UX for wizard steps (field list, language selection, file limits).
- Decide on authentication method (magic link vs password) before portal build.
- Prioritize milestone backlog for sprint planning.

## 13. Supabase Environment Status (September 24, 2025)
- Project `xfvwexnrxfrfqjgucchh` (eu-central-1) provisioned and healthy.
- Core schema applied: `applications`, `application_events`, `application_attachments`, `leads`, catalogue tables, and status enum updated per PRD.
- Private storage bucket `translation_uploads` created for request documents/deliverables.
- No data yet (fresh environment); ready for API integration and RLS policy tuning during auth implementation.

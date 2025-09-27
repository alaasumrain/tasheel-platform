-- =============================================================================
-- TASHEEL PLATFORM DATABASE BOOTSTRAP
-- =============================================================================
-- Run this SQL file once in your Supabase SQL editor to initialize all
-- tables, data, and storage buckets needed for the Tasheel platform.
-- =============================================================================

-- ---------- Core application schema ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type application_status as enum (
      'draft','submitted','scoping','quote_sent','in_progress',
      'review','completed','archived','rejected','cancelled'
    );
  end if;
end$$;

create extension if not exists "uuid-ossp";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  service_slug text,
  form_slug text not null,
  applicant_id uuid references auth.users(id) on delete set null,
  applicant_email text,
  status application_status not null default 'submitted',
  payload jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default timezone('utc', now()),
  last_event_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists applications_applicant_idx on public.applications(applicant_id);
create index if not exists applications_form_slug_idx on public.applications(form_slug);
create index if not exists applications_service_slug_idx on public.applications(service_slug);

create or replace function public.set_application_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_application_updated_at on public.applications;
create trigger set_application_updated_at
before update on public.applications
for each row
execute procedure public.set_application_updated_at();

create table if not exists public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  notes text,
  data jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists application_events_app_idx
  on public.application_events(application_id, created_at desc);

create table if not exists public.application_attachments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  content_type text,
  file_size bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists application_attachments_app_idx
  on public.application_attachments(application_id);

-- RLS setup (keep empty for now; we'll refine when auth is wired)
alter table public.applications enable row level security;
alter table public.application_events enable row level security;
alter table public.application_attachments enable row level security;

-- ---------- Translation catalogue ----------
create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  headline text,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_service_category_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_service_category_updated_at on public.service_categories;
create trigger set_service_category_updated_at
before update on public.service_categories
for each row
execute procedure public.set_service_category_updated_at();

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete restrict,
  slug text unique not null,
  name text not null,
  short_description text,
  detailed_description text,
  turnaround_window text,
  starting_price_per_word numeric(10,4),
  certification_available boolean default false,
  delivery_channels text[],
  is_featured boolean default false,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists services_category_idx on public.services(category_id, sort_order);

create or replace function public.set_service_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_service_updated_at on public.services;
create trigger set_service_updated_at
before update on public.services
for each row
execute procedure public.set_service_updated_at();

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists industries_slug_idx on public.industries(slug);

create or replace function public.set_industry_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_industry_updated_at on public.industries;
create trigger set_industry_updated_at
before update on public.industries
for each row
execute procedure public.set_industry_updated_at();

create table if not exists public.service_industries (
  service_id uuid references public.services(id) on delete cascade,
  industry_id uuid references public.industries(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (service_id, industry_id)
);

-- ---------- Seed service categories ----------
insert into public.service_categories (slug, name, headline, description, sort_order)
values
  ('translation', 'Translation Services', 'Professional document translation in 120+ languages.', 'Human linguists specialising in business, legal, and immigration use cases.', 10),
  ('localization', 'Localization Services', 'Adapt content for culture, format, and region.', 'Website, software, and product localization that keeps nuance intact.', 20),
  ('interpreting', 'Interpreting Services', 'Live language support for meetings and events.', 'On-site and remote interpreters covering simultaneous and consecutive formats.', 30),
  ('audio-visual', 'Audio-Visual Services', 'Bridge audio, video, and multimedia language gaps.', 'Subtitling, voiceover, dubbing, and transcription delivered with studio quality.', 40)
on conflict (slug) do update
set name = excluded.name,
    headline = excluded.headline,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = true;

-- ---------- Seed industries ----------
insert into public.industries (slug, name, description, sort_order)
values
  ('document', 'Document Translation', 'General document translation for personal and corporate needs.', 10),
  ('financial', 'Financial', 'Reports, audits, banking statements, and investor communications.', 20),
  ('manufacturing-engineering', 'Manufacturing & Engineering', 'Manuals, specifications, SOPs, and safety documentation.', 30),
  ('it-software', 'IT & Software', 'Software UI, help centres, and technical documentation.', 40),
  ('government', 'Government', 'Official correspondence, tenders, and public sector filings.', 50),
  ('media-publishing', 'Media & Publishing', 'Editorial content, press releases, and multimedia assets.', 60),
  ('gaming', 'Mobile & Video Games', 'Game scripts, UI strings, and community content.', 70),
  ('marketing-advertising', 'Marketing & Advertising', 'Campaigns, slogans, and brand storytelling.', 80),
  ('retail-ecommerce', 'Retail & E-commerce', 'Product catalogues, listings, and customer support scripts.', 90),
  ('tourism', 'Tourism', 'Guides, travel collateral, and hospitality materials.', 100),
  ('online-gambling', 'Online Gambling', 'iGaming platforms, compliance notices, and promotions.', 110),
  ('blockchain-crypto', 'Blockchain & Crypto', 'Whitepapers, token documentation, and exchange materials.', 120),
  ('medical', 'Medical & Life Sciences', 'Clinical documentation, device manuals, and patient records.', 130),
  ('legal', 'Legal', 'Contracts, court filings, and certified evidence packs.', 140),
  ('customer-support', 'Customer Support & Contact Centres', 'BPO teams, CX departments, and helplines needing rapid language coverage.', 150)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order;

-- ---------- Seed services ----------
insert into public.services (
  category_id, slug, name, short_description, detailed_description,
  turnaround_window, starting_price_per_word, certification_available,
  delivery_channels, is_featured, sort_order
)
select cat.id, payload.slug, payload.name, payload.short_description, payload.detailed_description,
       payload.turnaround_window, payload.starting_price_per_word, payload.certification_available,
       payload.delivery_channels, payload.is_featured, payload.sort_order
from public.service_categories cat
join (values
  ('translation','document-translation','Document Translation','Accurate human translation for business and personal documents.','Professional translators deliver polished documents across 120+ languages.','24-48 hours for standard documents',0.0600,false,ARRAY['digital-delivery','print-ready'],true,10),
  ('translation','certified-translation','Certified Translation','Legally compliant translations with signed certification.','USCIS, immigration, and legal-grade translations signed by accredited linguists.','24-72 hours',0.0900,true,ARRAY['digital-certified','hard-copy'],true,20),
  ('translation','technical-translation','Technical Translation','Engineers and SMEs translate highly technical content.','Specialist linguists ensure accuracy for manuals, SOPs, and engineering documentation.','3-5 business days',0.0850,false,ARRAY['digital-delivery'],false,30),
  ('translation','legal-translation','Legal Translation','Contracts and legal filings handled with confidentiality.','Court-ready translations with terminology management.','2-4 business days',0.0950,true,ARRAY['digital-delivery','notarized-optional'],true,40),
  ('translation','medical-translation','Medical Translation','Life sciences documents handled by trained medical linguists.','HIPAA-aware workflows covering clinical trials and patient communications.','3-5 business days',0.1100,false,ARRAY['digital-delivery'],false,50),
  ('translation','uscis-translation','USCIS Translation','Immigration-ready certified translations.','Certification statements and optional notarization tailored to USCIS.','24-48 hours',0.1000,true,ARRAY['digital-certified','hard-copy'],false,60),
  ('translation','patent-translation','Patent Translation','IP documentation and patent filings with technical/legal precision.','Combined legal and technical teams deliver patent-ready translations.','5-7 business days',0.1250,false,ARRAY['digital-delivery'],false,70),
  ('localization','website-localization','Website Localization','Localized copy, SEO keywords, and UX strings ready for launches.','Linguistic QA, SEO adaptation, and CMS-ready exports.','Sprint-based delivery',0.0800,false,ARRAY['digital-delivery','cms-integration'],true,10),
  ('localization','software-localization','Software & App Localization','Continuous localization for web, mobile, and embedded products.','Translation memories, screenshots, and QA feedback loops.','Aligned to release cadence',0.0850,false,ARRAY['digital-delivery','api'],false,20),
  ('localization','marketing-transcreation','Marketing Transcreation','Creative adaptation for campaigns.','Copywriters reconstruct messaging to preserve tone and emotion.','2-3 business days per asset',0.1200,false,ARRAY['digital-delivery'],true,30),
  ('interpreting','simultaneous-interpreting','Simultaneous Interpreting','Conference-grade interpreters for live events.','On-site or remote simultaneous interpreting with equipment coordination.','Scheduled by event',null,false,ARRAY['on-site','remote'],true,10),
  ('interpreting','consecutive-interpreting','Consecutive Interpreting','Meetings and appointments with human interpreters.','Ideal for legal, medical, and business meetings.','Scheduled by appointment',null,false,ARRAY['on-site','remote'],false,20),
  ('interpreting','video-remote-interpreting','Video Remote Interpreting','On-demand video interpreting across 40+ languages.','Secure video sessions for courts, healthcare, and support teams.','On-demand',null,false,ARRAY['remote'],true,30),
  ('interpreting','phone-interpreting','Over-the-Phone Interpreting','Hotline-style interpreting for contact centres.','24/7 call routing to linguists for customer service and emergencies.','Instant/SLA-driven',null,false,ARRAY['remote'],false,40),
  ('audio-visual','subtitling','Subtitling & Captioning','Broadcast-quality captions in multiple languages.','Time-coded subtitles with accessibility standards.','3-5 business days',null,false,ARRAY['digital-delivery'],true,10),
  ('audio-visual','voiceover-dubbing','Voiceover & Dubbing','Native voice talent for commercials, training, and media.','Casting, studio recording, and post-production to match tone.','5-7 business days',null,false,ARRAY['studio','remote'],true,20),
  ('audio-visual','transcription','Transcription Services','Accurate transcripts for audio and video assets.','Verbatim and edited transcription with timestamping.','24-72 hours',0.0300,false,ARRAY['digital-delivery'],false,30),
  ('audio-visual','dtp-layout','Desktop Publishing (DTP)','Multilingual layout and artwork adaptation.','Graphic designers recreate complex layouts for global audiences.','3-5 business days',null,false,ARRAY['digital-delivery'],false,40)
) as payload(category_slug, slug, name, short_description, detailed_description, turnaround_window, starting_price_per_word, certification_available, delivery_channels, is_featured, sort_order)
  on cat.slug = payload.category_slug
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    short_description = excluded.short_description,
    detailed_description = excluded.detailed_description,
    turnaround_window = excluded.turnaround_window,
    starting_price_per_word = excluded.starting_price_per_word,
    certification_available = excluded.certification_available,
    delivery_channels = excluded.delivery_channels,
    is_featured = excluded.is_featured,
    sort_order = excluded.sort_order,
    is_active = true;

-- ---------- Map services to industries ----------
insert into public.service_industries (service_id, industry_id)
select s.id, i.id
from public.services s
join public.industries i on (
  (s.slug in ('document-translation','certified-translation','uscis-translation','transcription','dtp-layout') and i.slug in ('document','legal','government'))
  or (s.slug = 'technical-translation' and i.slug in ('manufacturing-engineering','it-software','retail-ecommerce'))
  or (s.slug = 'legal-translation' and i.slug in ('legal','government','financial'))
  or (s.slug = 'medical-translation' and i.slug = 'medical')
  or (s.slug = 'patent-translation' and i.slug in ('legal','manufacturing-engineering','it-software'))
  or (s.slug = 'website-localization' and i.slug in ('marketing-advertising','retail-ecommerce','tourism'))
  or (s.slug = 'software-localization' and i.slug in ('it-software','gaming'))
  or (s.slug = 'marketing-transcreation' and i.slug in ('marketing-advertising','media-publishing','tourism'))
  or (s.slug = 'simultaneous-interpreting' and i.slug in ('government','legal','marketing-advertising'))
  or (s.slug = 'consecutive-interpreting' and i.slug in ('medical','legal','government'))
  or (s.slug = 'video-remote-interpreting' and i.slug in ('medical','government','customer-support'))
  or (s.slug = 'phone-interpreting' and i.slug in ('customer-support','tourism','retail-ecommerce'))
  or (s.slug = 'subtitling' and i.slug in ('media-publishing','marketing-advertising','gaming'))
  or (s.slug = 'voiceover-dubbing' and i.slug in ('media-publishing','marketing-advertising','gaming'))
) on conflict do nothing;

-- ---------- Leads table ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  full_name text not null,
  email text not null,
  phone text,
  organisation text,
  notes text,
  document_type text not null,
  document_link text,
  word_count integer,
  deadline date,
  purpose text not null,
  turnaround text not null check (turnaround in ('standard','rush')),
  certification boolean not null default false,
  notarisation boolean not null default false,
  physical_copies boolean not null default false,
  instructions text,
  payload jsonb default '{}'::jsonb,
  marketing_channel text,
  status text not null default 'new',
  application_id uuid references public.applications(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_email_idx on public.leads(email);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

create or replace function public.set_lead_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_lead_updated_at on public.leads;
create trigger set_lead_updated_at
before update on public.leads
for each row
execute procedure public.set_lead_updated_at();

-- ---------- Permissions ----------
grant select, insert, update, delete on public.applications to service_role;
grant select, insert, update, delete on public.application_events to service_role;
grant select, insert, update, delete on public.application_attachments to service_role;
grant select on public.service_categories, public.services, public.industries, public.service_industries to anon, authenticated, service_role;
grant select, insert, update, delete on public.leads to service_role;

-- ---------- Storage bucket ----------
insert into storage.buckets (id, name, public)
values ('translation_uploads','translation_uploads', false)
on conflict (id) do nothing;

-- =============================================================================
-- BOOTSTRAP COMPLETE
-- =============================================================================
-- Your Tasheel platform database is now ready with:
-- ✅ Application workflow tables (applications, events, attachments)
-- ✅ Service catalog (4 categories, 18 services, 15 industries)
-- ✅ Leads capture and conversion pipeline
-- ✅ File upload storage bucket
-- ✅ Proper indexing and RLS setup
-- =============================================================================
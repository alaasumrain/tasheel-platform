-- Create lookup tables for Tasheel service catalogue aligned with translation offerings

-- Service categories correspond to the major pillars (Translation, Localization, etc.)
CREATE TABLE IF NOT EXISTS public.service_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    headline text,
    description text,
    sort_order int DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE OR REPLACE FUNCTION public.set_service_category_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_service_category_updated_at ON public.service_categories;
CREATE TRIGGER set_service_category_updated_at
BEFORE UPDATE ON public.service_categories
FOR EACH ROW
EXECUTE PROCEDURE public.set_service_category_updated_at();

-- Individual services represent customer facing offerings (e.g. Certified Translation)
CREATE TABLE IF NOT EXISTS public.services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    short_description text,
    detailed_description text,
    turnaround_window text,
    starting_price_per_word numeric(10,4),
    certification_available boolean DEFAULT false,
    delivery_channels text[],
    is_featured boolean DEFAULT false,
    sort_order int DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS services_category_idx ON public.services (category_id, sort_order);

CREATE OR REPLACE FUNCTION public.set_service_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_service_updated_at ON public.services;
CREATE TRIGGER set_service_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE PROCEDURE public.set_service_updated_at();

-- Industry verticals help segment translation demand (legal, medical, etc.)
CREATE TABLE IF NOT EXISTS public.industries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    description text,
    sort_order int DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE OR REPLACE FUNCTION public.set_industry_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_industry_updated_at ON public.industries;
CREATE TRIGGER set_industry_updated_at
BEFORE UPDATE ON public.industries
FOR EACH ROW
EXECUTE PROCEDURE public.set_industry_updated_at();

-- Join table links services to their supported industries
CREATE TABLE IF NOT EXISTS public.service_industries (
    service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
    industry_id uuid REFERENCES public.industries(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, industry_id),
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS service_industries_industry_idx ON public.service_industries (industry_id);

-- Seed categories mirroring Kings of Translation pillars
INSERT INTO public.service_categories (slug, name, headline, description, sort_order)
VALUES
    ('translation', 'Translation Services', 'Professional document translation in 120+ languages.', 'Human linguists specialising in business, legal, and immigration use cases.', 10),
    ('localization', 'Localization Services', 'Adapt content for culture, format, and region.', 'Website, software, and product localization that keeps nuance intact.', 20),
    ('interpreting', 'Interpreting Services', 'Live language support for meetings and events.', 'On-site and remote interpreters covering simultaneous and consecutive formats.', 30),
    ('audio-visual', 'Audio-Visual Services', 'Bridge audio, video, and multimedia language gaps.', 'Subtitling, voiceover, dubbing, and transcription delivered with studio quality.', 40)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    headline = EXCLUDED.headline,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- Seed industries aligned with KoT marketing verticals
INSERT INTO public.industries (slug, name, description, sort_order)
VALUES
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
    ('legal', 'Legal', 'Contracts, court filings, and certified evidence packs.', 140)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- Seed services catalogue
WITH cat AS (
    SELECT slug, id FROM public.service_categories
), ind AS (
    SELECT slug, id FROM public.industries
)
INSERT INTO public.services (
    category_id,
    slug,
    name,
    short_description,
    detailed_description,
    turnaround_window,
    starting_price_per_word,
    certification_available,
    delivery_channels,
    is_featured,
    sort_order
)
VALUES
    ((SELECT id FROM cat WHERE slug = 'translation'), 'document-translation', 'Document Translation', 'Accurate human translation for business and personal documents.', 'Professional translators deliver polished documents with formatting preserved across 120+ languages.', '24-48 hours for standard documents', 0.0600, false, ARRAY['digital-delivery', 'print-ready'], true, 10),
    ((SELECT id FROM cat WHERE slug = 'translation'), 'certified-translation', 'Certified Translation', 'Legally compliant translations with signed certification.', 'USCIS, immigration, and legal-grade translations signed by accredited linguists for official acceptance.', '24-72 hours depending on volume', 0.0900, true, ARRAY['digital-certified', 'hard-copy'], true, 20),
    ((SELECT id FROM cat WHERE slug = 'translation'), 'technical-translation', 'Technical Translation', 'Engineers and SMEs translate highly technical content.', 'Specialist linguists ensure accuracy for manuals, SOPs, and engineering documentation.', '3-5 business days', 0.0850, false, ARRAY['digital-delivery'], false, 30),
    ((SELECT id FROM cat WHERE slug = 'translation'), 'legal-translation', 'Legal Translation', 'Contracts and legal filings handled with confidentiality.', 'Court-ready translations with terminology management and sworn options in supported jurisdictions.', '2-4 business days', 0.0950, true, ARRAY['digital-delivery', 'notarized-optional'], true, 40),
    ((SELECT id FROM cat WHERE slug = 'translation'), 'medical-translation', 'Medical Translation', 'Life sciences documents handled by trained medical linguists.', 'HIPAA-aware workflows covering clinical trials, IFUs, patient communications, and more.', '3-5 business days', 0.1100, false, ARRAY['digital-delivery'], false, 50),
    ((SELECT id FROM cat WHERE slug = 'translation'), 'uscis-translation', 'USCIS Translation', 'Immigration-ready certified translations bundled with notarization.', 'Specialized processing for USCIS cases including certification statements and optional notarization.', '24-48 hours for common documents', 0.1000, true, ARRAY['digital-certified', 'hard-copy'], false, 60),
    ((SELECT id FROM cat WHERE slug = 'translation'), 'patent-translation', 'Patent Translation', 'IP documentation and patent filings with technical/legal precision.', 'Combined legal and technical teams deliver patent-ready translations with glossary management.', '5-7 business days', 0.1250, false, ARRAY['digital-delivery'], false, 70),
    ((SELECT id FROM cat WHERE slug = 'localization'), 'website-localization', 'Website Localization', 'End-to-end localisation for marketing sites and portals.', 'Linguistic QA, SEO keyword adaptation, and CMS-ready exports keep global sites on-message.', 'Rolling releases / sprint-based', 0.0800, false, ARRAY['digital-delivery', 'cms-integration'], true, 10),
    ((SELECT id FROM cat WHERE slug = 'localization'), 'software-localization', 'Software & App Localization', 'UI strings, in-app flows, and release notes across platforms.', 'Continuous localization workflows with translation memories, screenshots, and QA feedback loops.', 'Within release cycles', 0.0850, false, ARRAY['digital-delivery', 'api'], false, 20),
    ((SELECT id FROM cat WHERE slug = 'localization'), 'marketing-transcreation', 'Marketing Transcreation', 'Creative adaptation for campaigns and brand storytelling.', 'Copywriters reconstruct messaging to preserve tone, emotion, and cultural nuance.', '2-3 business days per asset', 0.1200, false, ARRAY['digital-delivery'], true, 30),
    ((SELECT id FROM cat WHERE slug = 'interpreting'), 'simultaneous-interpreting', 'Simultaneous Interpreting', 'Conference-grade interpreters for live events.', 'On-site or remote simultaneous interpreting with equipment coordination and multi-channel audio.', 'Scheduled by event', NULL, false, ARRAY['on-site', 'remote'], true, 10),
    ((SELECT id FROM cat WHERE slug = 'interpreting'), 'consecutive-interpreting', 'Consecutive Interpreting', 'Meetings and appointments with human interpreters.', 'Ideal for legal, medical, and business meetings requiring pause-and-translate support.', 'Scheduled by appointment', NULL, false, ARRAY['on-site', 'remote'], false, 20),
    ((SELECT id FROM cat WHERE slug = 'interpreting'), 'video-remote-interpreting', 'Video Remote Interpreting', 'On-demand video interpreting across 40+ languages.', 'Secure video sessions for courts, healthcare, and customer support teams needing rapid coverage.', 'Within minutes (on-demand)', NULL, false, ARRAY['remote'], true, 30),
    ((SELECT id FROM cat WHERE slug = 'interpreting'), 'phone-interpreting', 'Over-the-Phone Interpreting', 'Hotline-style interpreting for contact centres.', '24/7 call routing to linguists for customer service and emergency scenarios.', 'Instant / SLA-driven', NULL, false, ARRAY['remote'], false, 40),
    ((SELECT id FROM cat WHERE slug = 'audio-visual'), 'subtitling', 'Subtitling & Captioning', 'Broadcast-quality captions in multiple languages.', 'Time-coded subtitles with accessibility standards and multiple caption formats.', '3-5 business days', NULL, false, ARRAY['digital-delivery'], true, 10),
    ((SELECT id FROM cat WHERE slug = 'audio-visual'), 'voiceover-dubbing', 'Voiceover & Dubbing', 'Native voice talent for commercials, training, and media.', 'Casting, studio recording, and post-production to match tone and timing.', '5-7 business days', NULL, false, ARRAY['studio', 'remote'], true, 20),
    ((SELECT id FROM cat WHERE slug = 'audio-visual'), 'transcription', 'Transcription Services', 'Accurate transcripts for audio and video assets.', 'Verbatim and edited transcription with timestamping, speaker identification, and QC layers.', '24-72 hours depending on duration', 0.0300, false, ARRAY['digital-delivery'], false, 30),
    ((SELECT id FROM cat WHERE slug = 'audio-visual'), 'dtp-layout', 'Desktop Publishing (DTP)', 'Formatting and layout for multilingual documents.', 'Graphic designers recreate complex layouts (InDesign, PowerPoint, Illustrator) for global audiences.', '3-5 business days', NULL, false, ARRAY['digital-delivery'], false, 40)
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    turnaround_window = EXCLUDED.turnaround_window,
    starting_price_per_word = EXCLUDED.starting_price_per_word,
    certification_available = EXCLUDED.certification_available,
    delivery_channels = EXCLUDED.delivery_channels,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order;

-- Map services to industries for targeted marketing and filtering
INSERT INTO public.service_industries (service_id, industry_id)
SELECT s.id, i.id
FROM public.services s
JOIN public.industries i ON (
    (s.slug IN ('document-translation', 'certified-translation', 'uscis-translation', 'transcription', 'dtp-layout') AND i.slug IN ('document', 'legal', 'government'))
 OR (s.slug = 'technical-translation' AND i.slug IN ('manufacturing-engineering', 'it-software', 'retail-ecommerce'))
 OR (s.slug = 'legal-translation' AND i.slug IN ('legal', 'government', 'financial'))
 OR (s.slug = 'medical-translation' AND i.slug = 'medical')
 OR (s.slug = 'patent-translation' AND i.slug IN ('legal', 'manufacturing-engineering', 'it-software'))
 OR (s.slug = 'website-localization' AND i.slug IN ('marketing-advertising', 'retail-ecommerce', 'tourism'))
 OR (s.slug = 'software-localization' AND i.slug IN ('it-software', 'gaming'))
 OR (s.slug = 'marketing-transcreation' AND i.slug IN ('marketing-advertising', 'media-publishing', 'tourism'))
 OR (s.slug = 'simultaneous-interpreting' AND i.slug IN ('government', 'legal', 'marketing-advertising'))
 OR (s.slug = 'consecutive-interpreting' AND i.slug IN ('medical', 'legal', 'government'))
 OR (s.slug = 'video-remote-interpreting' AND i.slug IN ('medical', 'government', 'customer-support'))
 OR (s.slug = 'phone-interpreting' AND i.slug IN ('customer-support', 'tourism', 'retail-ecommerce'))
OR (s.slug = 'subtitling' AND i.slug IN ('media-publishing', 'marketing-advertising', 'gaming'))
OR (s.slug = 'voiceover-dubbing' AND i.slug IN ('media-publishing', 'marketing-advertising', 'gaming'))
)
ON CONFLICT DO NOTHING;

-- Clean up potential missing industries referenced above
INSERT INTO public.industries (slug, name, description, sort_order)
VALUES ('customer-support', 'Customer Support & Contact Centres', 'BPO teams, CX departments, and helplines needing rapid language coverage.', 150)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- Re-run mappings that depend on the customer-support industry
INSERT INTO public.service_industries (service_id, industry_id)
SELECT s.id, i.id
FROM public.services s
JOIN public.industries i ON i.slug = 'customer-support'
WHERE s.slug IN ('video-remote-interpreting', 'phone-interpreting')
ON CONFLICT DO NOTHING;

-- Grant access so the Next.js app can read these catalogues
GRANT SELECT ON public.service_categories TO anon, authenticated, service_role;
GRANT SELECT ON public.services TO anon, authenticated, service_role;
GRANT SELECT ON public.industries TO anon, authenticated, service_role;
GRANT SELECT ON public.service_industries TO anon, authenticated, service_role;
GRANT SELECT, INSERT, DELETE ON public.service_industries TO service_role;

-- Allow service role to manage catalogue entries when needed
GRANT INSERT, UPDATE, DELETE ON public.service_categories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.services TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.industries TO service_role;

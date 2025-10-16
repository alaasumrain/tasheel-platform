# 🏛️ TASHEEL Website Development Blueprint

**Last Updated:** 2025-10-15
**Status:** Planning & Research Phase

---

## 📋 Table of Contents
1. [Executive Summary](#executive-summary)
2. [Competitor Analysis](#competitor-analysis)
3. [Tasheel Positioning](#tasheel-positioning)
4. [Website Structure](#website-structure)
5. [Homepage Section Breakdown](#homepage-section-breakdown)
6. [Content Requirements](#content-requirements)
7. [Technical Implementation Plan](#technical-implementation-plan)
8. [Development Phases](#development-phases)

---

## 🎯 Executive Summary

**What is Tasheel?**
Tasheel is a comprehensive government services concierge platform that handles:
- ✅ Government services facilitation (driver's licenses, permits, certificates)
- ✅ Translation services (legal, certified, notarized documents)
- ✅ Legalization & attestation (embassy, ministry, apostille)
- ✅ Municipal services (city registrations, permits)
- ✅ Corporate services (business filings, HR documents)

**Key Differentiator:** End-to-end service - users submit requests online, upload documents, and Tasheel handles the entire process with government authorities.

**Similar To:** Amer Centers (UAE), VFS Global, but digital-first and expanded scope.

---

## 🔍 Competitor Analysis

### 1. VFS Global (www.vfsglobal.com)
**Business Model:** Visa application processing and government services

**Site Structure:**
- Navigation: Services → Countries → Additional Services → About → Contact
- Homepage Sections:
  1. Hero banner carousel (multiple service promotions)
  2. Services grid (4 main services: Form Filling, Premium Lounge, SMS Alerts, Courier)
  3. Quick links to popular visa applications
  4. Footer with comprehensive links

**Key Takeaways:**
- ✅ Clear service categorization
- ✅ Visual service cards with icons
- ✅ "Additional services" upsell approach
- ✅ Country/region selectors for localization
- ✅ Premium services positioned as convenience upgrades

**What to Adopt for Tasheel:**
- Service grid layout with clear icons
- Premium/expedited service options
- Track application status feature
- Multi-step progress indicators

---

### 2. LanguageLine Solutions (www.languageline.com)
**Business Model:** Interpretation, translation, and language access services

**Site Structure:**
- Navigation: Interpretation → Translation & Localization → AI Solutions → Testing & Training → Industries → Resources
- Homepage Sections:
  1. Hero: "Welcome to the Language of Solutions" + CTA
  2. 4 Service Features blocks
  3. Statistics section (87M connections, 240+ languages)
  4. Industry expertise showcase
  5. "Why Choose Us" - 6 differentiators
  6. Testimonials (quotes from real clients)
  7. Resource center
  8. Footer with extensive links

**Key Takeaways:**
- ✅ Statistics build credibility (connections processed, languages supported)
- ✅ Industry-specific messaging
- ✅ "Why Choose Us" section addresses objections
- ✅ Multiple CTAs throughout (Schedule Consultation, Download Brochure, Learn More)
- ✅ Real client testimonials with names and organizations
- ✅ 24/7 availability emphasized
- ✅ Technology integration highlighted (EHR, CRM systems)

**What to Adopt for Tasheel:**
- Strong stats section (documents processed, success rate, turnaround time)
- Industry targeting (healthcare, legal, corporate)
- Multiple CTA types (Book Service, Track Status, Get Quote)
- Integration capabilities (government portals, payment gateways)
- 24/7 or extended hours messaging

---

### 3. TransPerfect (www.transperfect.com)
**Business Model:** Translation, localization, and global business solutions

**Site Structure:**
- Navigation: Solutions → Technology → Industries → Resources → About
- Homepage Sections:
  1. Hero: "Intelligent Performance" value proposition
  2. Featured webinar/case study highlights
  3. AI-powered content solutions showcase
  4. Client trust logos (90% of Fortune 500)
  5. Industry expertise by vertical
  6. Client success stories
  7. GlobalLink technology platform
  8. Footer organized by main categories

**Key Takeaways:**
- ✅ Trust signals (Fortune 500 clients, awards)
- ✅ Technology platform emphasis (proprietary tools)
- ✅ Industry vertical organization
- ✅ Case studies and client stories
- ✅ "Intelligent" and "AI-powered" positioning
- ✅ Global scale messaging

**About Page Structure:**
- Company story (humble beginnings → global leader)
- Impressive stats: 30+ years, 7M words/day, 300K+ projects, 160+ offices
- Team and culture emphasis
- Awards and recognition

**What to Adopt for Tasheel:**
- Trust indicators (government partnerships, certifications)
- Technology/platform positioning (portal, tracking system)
- Success metrics and growth story
- Industry-specific solutions
- "One platform for all government needs" messaging

---

## 🎨 Tasheel Positioning

### Core Value Proposition
"Skip the government office lines. Submit requests online, we handle everything."

### Key Messages to Emphasize:
1. **Convenience** - "No more waiting in government offices"
2. **Expertise** - "Expert handling of complex paperwork and processes"
3. **Speed** - "48-hour average turnaround" (adjust as needed)
4. **Compliance** - "99.8% approval success rate"
5. **Transparency** - "Track your request in real-time"
6. **Security** - "Secure document storage and handling"

### Target Audiences:
1. **Individuals** - Expats, residents needing government services
2. **Businesses** - HR departments, corporate services teams
3. **Healthcare** - Hospitals needing translation/interpretation
4. **Legal** - Law firms requiring certified translations
5. **Education** - Schools/universities with multilingual needs

---

## 🏗️ Website Structure

### Current Template Structure (page.tsx):
```
1. Hero
2. Partners
3. [Text Section - needs customization]
4. FeaturesGrid
5. FeaturesGridRemote
6. ServicesCatalog
7. Reviews
8. Video
9. FeatureLarge
10. Stats
11. Process
12. FeaturesList
13. FeaturesSlider
14. FeaturesAccordion
15. Testimonials
16. PricingPlans (Stripe)
17. FAQ
```

### Recommended Page Structure:

```
PRIMARY PAGES:
├── Home (/)
├── Services (/services)
│   ├── Government Services
│   ├── Translation Services
│   ├── Legalization & Attestation
│   └── Corporate Services
├── How It Works (/how-it-works)
├── Pricing (/pricing)
├── Track Status (/track) **NEW**
├── About (/about)
├── Contact (/contact)
└── Resources (/resources or /blog)

LEGAL PAGES:
├── Terms of Service
├── Privacy Policy
└── Cookie Policy
```

---

## 📄 Homepage Section Breakdown

### 1. **Hero Section** ✅ (Currently exists)
**Current Content:**
- Headline: "One platform for language services"
- Description: "Overcome language barriers with AI-orchestrated scheduling..."
- CTAs: "Book a service" + "Learn more"

**Recommended Update:**
```
Headline: "Your Government Services, Simplified"
OR: "Handle Government Documents Without the Wait"

Description: "From driver's license renewals to document legalization—submit online, track progress, and receive completed services. No office visits required."

Primary CTA: "Start a Request" → /services
Secondary CTA: "Track My Order" → /track

Trusted By: "Trusted by 5,000+ residents and 200+ businesses"
```

---

### 2. **Partners Section** ✅ (Currently exists)
**Purpose:** Show government entities and certifications

**Recommended Content:**
- Government ministry logos (if permitted)
- Certification badges (ISO, security certifications)
- Payment partner logos (Stripe, local payment providers)
- Translation association memberships

**Note:** Verify legal permissions before using government logos.

---

### 3. **Service Categories Section** (FeaturesGrid)
**Current Status:** Needs content

**Recommended Structure (4 main services):**

1. **Government Services**
   - Icon: Government building or ID card
   - Description: "Driver's licenses, permits, certificates, and official documents"
   - Link: /services/government

2. **Translation Services**
   - Icon: Language/globe icon
   - Description: "Certified translations for legal, medical, and official documents"
   - Link: /services/translation

3. **Legalization & Attestation**
   - Icon: Stamp/seal icon
   - Description: "Embassy legalization, ministry attestation, and apostille services"
   - Link: /services/legalization

4. **Corporate Services**
   - Icon: Briefcase icon
   - Description: "Business registrations, HR documents, and company filings"
   - Link: /services/corporate

---

### 4. **Remote Features Grid** (FeaturesGridRemote)
**Current Status:** Needs content

**Purpose:** Highlight platform capabilities

**Recommended Content:**
1. **Online Document Upload**
   - "Securely upload documents from anywhere"

2. **Real-Time Tracking**
   - "Track your request status 24/7"

3. **Digital Signatures**
   - "Sign documents electronically"

4. **Automated Notifications**
   - "Get SMS/email updates at every step"

---

### 5. **Services Catalog** ✅ (Currently exists)
**Current Status:** Check if populated

**Purpose:** Detailed list of all services offered

**Recommended Organization:**
Group by category with specific services under each.

---

### 6. **Stats Section** ⚠️ (Partially complete)
**Current Content:**
- "Impact across Tasheel deployments"
- Stats about language services (outdated for new positioning)

**Recommended Update:**
```
Headline: "Trusted by Thousands Across [Region]"

Stats:
- "5,000+ Documents processed monthly"
- "48-hour Average turnaround"
- "15+ Government entities" OR "99.8% Approval success rate"
- "24/7 Platform availability"
- "2,500+ Active users"
- "200+ Business clients"
```

---

### 7. **Process Section** (How It Works)
**Current Status:** Needs content

**Recommended 4-Step Process:**

**Step 1: Choose & Submit**
- Select your service
- Upload required documents
- Pay online securely

**Step 2: We Verify**
- Our team reviews your submission
- We check document completeness
- You'll receive confirmation within 2 hours

**Step 3: We Process**
- We handle government submissions
- Track progress in your dashboard
- Receive real-time updates

**Step 4: Receive & Done**
- Get your completed documents
- Digital + physical delivery options
- Secure document storage in your account

---

### 8. **Reviews Section**
**Current Status:** Needs content

**Recommended Content:**
- 5-star rating display
- 3-4 customer reviews with:
  - Name and role/company
  - Photo (if available)
  - Quote about time saved or ease of use

**Example:**
> "Tasheel saved me hours of waiting at government offices. I renewed my driver's license entirely online in 3 days."
> — Ahmed K., Business Owner

---

### 9. **Video Section**
**Current Status:** Needs video URL

**Recommended Content:**
- Title: "See How Tasheel Works"
- 60-90 second explainer video showing:
  - Platform dashboard
  - Document upload process
  - Tracking feature
  - Document delivery

**Alternative (if no video yet):**
- Use animated explainer graphics
- Or replace with additional feature showcase

---

### 10. **Feature Large** (Platform Overview)
**Current Status:** Needs content

**Purpose:** Showcase main platform benefit

**Recommended Content:**
```
Headline: "One Dashboard for All Your Government Needs"

Description:
- Submit multiple service requests
- Track all documents in one place
- Automated renewal reminders
- Secure document vault
- Payment history

Image/Screenshot: Dashboard mockup showing active requests
```

---

### 11. **Features List**
**Current Status:** Needs content

**Purpose:** List key benefits/features

**Recommended Content (8-10 items):**
- ✅ No government office visits required
- ✅ Expert handling of complex paperwork
- ✅ Compliance guaranteed by certified professionals
- ✅ Secure encrypted document storage
- ✅ Multi-service request tracking
- ✅ Automated status notifications
- ✅ Payment plans available
- ✅ Dedicated customer support

---

### 12. **Features Slider** (Service Showcase)
**Current Status:** Needs content

**Purpose:** Visual showcase of service categories

**Recommended 4 Slides:**

**Slide 1: Government Services**
- Image: Government building or ID card
- Services: Driver's licenses, permits, certificates

**Slide 2: Translation Services**
- Image: Documents with multiple languages
- Services: Legal, medical, business translations

**Slide 3: Legalization Services**
- Image: Official stamps/seals
- Services: Embassy, ministry, apostille

**Slide 4: Corporate Services**
- Image: Business documents
- Services: Registrations, HR filings, licenses

---

### 13. **Features Accordion** (Integrations)
**Current Status:** Needs content

**Purpose:** Show platform integrations/technical capabilities

**Recommended Content:**
1. **Government Portal Integrations**
   - Connected to major government systems for real-time status

2. **Payment Gateway Support**
   - Stripe, local payment methods, installment plans

3. **Document Management**
   - Cloud storage, version control, secure sharing

4. **Notification Systems**
   - SMS, email, WhatsApp updates

5. **Calendar Integration**
   - Appointment scheduling, reminder sync

---

### 14. **Testimonials Section**
**Current Status:** Needs content

**Recommended Format:**
Large testimonial card with:
- Quote (2-3 sentences)
- Customer name and company
- Photo
- Service used

**Example:**
> "As an HR manager, Tasheel has transformed how we handle employee documentation. What used to take weeks now takes days, and we can track everything in real-time."
> — Sara M., HR Director at [Company Name]

---

### 15. **Pricing Plans** (Stripe Integration)
**Current Status:** Needs Stripe price IDs

**Recommended Approach:**

**Option A: Service-Based Pricing**
- Show starting prices per service type
- "From $XX per document"
- CTA: "Get Custom Quote"

**Option B: Subscription Plans** (if applicable)
- Individual Plan: X services/month
- Business Plan: Unlimited + priority processing
- Enterprise: Custom solutions

**Option C: No pricing page** (quote-based)
- Remove Stripe integration
- Use contact form for quotes
- "Request a Quote" CTA

---

### 16. **FAQ Section**
**Current Status:** Check if populated

**Recommended Questions:**
1. How long does processing take?
2. What documents do I need to upload?
3. Is my information secure?
4. Can I track my request?
5. What payment methods do you accept?
6. Do you deliver internationally?
7. What if my application is rejected?
8. How do I contact support?

---

## ✍️ Content Requirements

### Writing Guidelines:
1. **Tone:** Professional but approachable
2. **Voice:** Active, confident, solution-focused
3. **Length:**
   - Headlines: 5-10 words
   - Descriptions: 15-30 words
   - Section content: 50-100 words
4. **Keywords to Include:**
   - Government services
   - Document processing
   - Translation and legalization
   - Online platform
   - Secure and compliant
   - Fast turnaround

### Content Creation Priority:
1. **Critical (Must have for launch):**
   - Hero section
   - Services overview (4 main categories)
   - Stats section
   - Process (How it works)
   - FAQ

2. **High Priority (Should have):**
   - About page
   - Contact page
   - Reviews/testimonials
   - Features list

3. **Nice to Have (Post-launch):**
   - Video explainer
   - Blog/resources
   - Case studies
   - Detailed service pages

---

## 🔧 Technical Implementation Plan

### Phase 1: Critical Setup ⚡
**Priority:** MUST DO FIRST

#### 1.1 Update SEO Metadata (`src/app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  title: 'Tasheel - Government Services & Translation Platform',
  description: 'Skip the wait. Handle government documents, translations, and legalizations entirely online. Fast, secure, and compliant service delivery.',
};
```

#### 1.2 Environment Variables (`.env.local`)
```
# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# Resend (for contact form emails)
RESEND_API_KEY=re_...

# Kit (for newsletter)
CONVERTKIT_API_KEY=...
```

#### 1.3 Update Navigation (`src/components/sections/header.tsx`)
```
Current: Solutions → Industries → Resources → Company
Proposed: Services → How It Works → Pricing → Track Status → About → Contact
```

#### 1.4 Fix/Update Social Links (`src/components/sections/footer.tsx`)
- Replace placeholder social media URLs with real Tasheel accounts

---

### Phase 2: Content Population 📝

#### 2.1 Hero Section (`src/components/sections/hero.tsx`)
- Update headline, description, CTAs
- Replace avatar images (if needed)
- Update trusted-by text

#### 2.2 Stats Section (`src/components/sections/stats.tsx`)
- Replace all 6 stats with Tasheel-specific numbers
- Update headline and description

#### 2.3 Process Section (`src/components/sections/process.tsx`)
- Create 4-step process content
- Add appropriate icons
- Write step descriptions

#### 2.4 Features Grid (`src/components/sections/features-grid.tsx`)
- Add 4 main service categories
- Write descriptions
- Add icons

#### 2.5 Features Grid Remote (`src/components/sections/features-grid-remote.tsx`)
- Add platform features content

#### 2.6 Features List (`src/components/sections/features-list.tsx`)
- Add 8-10 key benefits

#### 2.7 Features Slider (`src/components/sections/features-slider.tsx`)
- Add 4 service category slides with images

#### 2.8 Features Accordion (`src/components/sections/features-accordion.tsx`)
- Add integration/technical features

#### 2.9 Reviews Section (`src/components/sections/reviews.tsx`)
- Add customer reviews (3-4 reviews)

#### 2.10 Testimonials (`src/components/sections/testimonials.tsx`)
- Add featured testimonial

#### 2.11 Video Section (`src/components/sections/video.tsx`)
- Add video URL or placeholder

#### 2.12 Feature Large (`src/components/sections/feature-large.tsx`)
- Add platform overview content

#### 2.13 FAQ Section (`src/components/sections/faq.tsx`)
- Add 8-10 common questions and answers

#### 2.14 Pricing Plans (`src/components/sections/pricing-plans-stripe.tsx`)
- Add Stripe price IDs OR remove if not using Stripe
- Update plan details

---

### Phase 3: New Pages 🆕

#### 3.1 Track Status Page (`/track`)
**Purpose:** Allow users to check their request status

**Features:**
- Input field for order/tracking number
- Status display (Submitted → Processing → Completed)
- Timeline view
- Download completed documents button

**File:** `src/app/track/page.tsx` (NEW)

#### 3.2 Services Page (`/services`)
**Purpose:** Detailed list of all services

**Structure:**
- Hero with service overview
- 4 service categories with expandable details
- CTA to submit request

**File:** `src/app/services/page.tsx` (check if exists)

#### 3.3 About Page (`/about`)
**Content:**
- Tasheel's mission and story
- Team photos (optional)
- Why we exist
- Certifications and partnerships

**File:** `src/app/about/page.tsx` (check if exists)

#### 3.4 How It Works Page (`/how-it-works`)
**Content:**
- Detailed 4-step process
- Video walkthrough
- FAQ specific to process

**File:** `src/app/how-it-works/page.tsx` (NEW)

---

### Phase 4: Assets & Polish 🎨

#### 4.1 Image Requirements
| Section | Image Needed | Dimensions | Notes |
|---------|-------------|------------|-------|
| Hero | Dashboard screenshot | 1271x831 | Light and dark versions |
| Partners | Government logos | 200x80 | Check legal permissions |
| Services | Service icons | 64x64 | SVG preferred |
| Features Slider | Service category images | 800x600 | High quality |
| Testimonials | Customer photos | 200x200 | Circle crop |

#### 4.2 Logo Updates
- Replace legacy template logos with Tasheel logos
- Locations:
  - `/public/dark/logo-header.png`
  - `/public/dark/logo-footer.png`
  - `/public/light/logo-header.png`
  - `/public/light/logo-footer.png`

#### 4.3 Favicon
- Create/upload Tasheel favicon
- Add to `src/app/layout.tsx`

---

## 📅 Development Phases

### ✅ Phase 1: Discovery & Planning (COMPLETED)
- [x] Competitor research
- [x] Site structure mapping
- [x] Content strategy
- [x] Blueprint creation

---

### 🔄 Phase 2: Foundation (1-2 days)
**Goal:** Get site ready for content

**Tasks:**
- [ ] Update SEO metadata
- [ ] Create/update `.env.local` with API keys
- [ ] Fix navigation structure
- [ ] Update social links in footer
- [ ] Replace logos (header/footer)

**Estimated Time:** 4-6 hours

---

### 📝 Phase 3: Content Population (2-3 days)
**Goal:** Fill all homepage sections with Tasheel content

**Tasks:**
- [ ] Hero section update
- [ ] Stats section (6 new stats)
- [ ] Process section (4 steps)
- [ ] Features Grid (4 services)
- [ ] Features Grid Remote (4 features)
- [ ] Features List (8-10 items)
- [ ] Features Slider (4 slides)
- [ ] Features Accordion (5 items)
- [ ] Reviews (3-4 reviews)
- [ ] Testimonials (1 featured)
- [ ] Video section (add URL)
- [ ] Feature Large (platform overview)
- [ ] FAQ (8-10 questions)
- [ ] Pricing (configure Stripe or remove)

**Estimated Time:** 8-12 hours

---

### 🆕 Phase 4: New Pages (2-3 days)
**Goal:** Build essential pages

**Tasks:**
- [ ] Create `/track` page (status tracking)
- [ ] Update/create `/services` page
- [ ] Update/create `/about` page
- [ ] Create `/how-it-works` page
- [ ] Update legal pages (Terms, Privacy, Cookies)

**Estimated Time:** 6-10 hours

---

### 🎨 Phase 5: Assets & Polish (1-2 days)
**Goal:** Visual polish and quality assurance

**Tasks:**
- [ ] Replace all placeholder images
- [ ] Add service icons
- [ ] Upload customer photos (testimonials)
- [ ] Add partner/government logos
- [ ] Create/add favicon
- [ ] Test all links
- [ ] Mobile responsiveness check
- [ ] Dark/light mode verification

**Estimated Time:** 4-6 hours

---

### 🚀 Phase 6: Launch Prep (1 day)
**Goal:** Final checks before launch

**Tasks:**
- [ ] Final content proofread
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Analytics setup (Google Analytics, etc.)
- [ ] Contact form testing
- [ ] Payment testing (if applicable)
- [ ] Deploy to production

**Estimated Time:** 4-6 hours

---

## 📊 Success Metrics (Post-Launch)

### Key Metrics to Track:
1. **Traffic:** Unique visitors, page views
2. **Engagement:** Time on site, bounce rate
3. **Conversions:**
   - Contact form submissions
   - Service requests submitted
   - Track status checks
4. **Top Pages:** Which services are most viewed
5. **User Flow:** Where users drop off

### Recommended Tools:
- Google Analytics 4
- Hotjar (heatmaps)
- Google Search Console (SEO)

---

## 🤝 Next Steps

### Immediate Actions:
1. ✅ Review this blueprint
2. ⏳ Approve/modify recommended content structure
3. ⏳ Gather assets (logos, images, testimonials)
4. ⏳ Decide on pricing strategy (Stripe vs quote-based)
5. ⏳ Provide API keys for integrations
6. ⏳ Begin Phase 2 implementation

### Questions to Answer:
- [ ] Do you have Stripe setup or prefer quote-based pricing?
- [ ] Do you have permission to use government logos?
- [ ] Do you have customer testimonials/reviews?
- [ ] Do you have a video or need to create one?
- [ ] What are the actual stats (documents processed, success rate, etc.)?
- [ ] What social media accounts exist?

---

## 📞 Resources & Links

### Competitor Sites:
- VFS Global: https://www.vfsglobal.com/en/individuals/index.html
- LanguageLine: https://www.languageline.com
- TransPerfect: https://www.transperfect.com

### Current Site:
- Local: http://localhost:3000
- Template Docs: (reference legacy template documentation if needed)

---

**End of Blueprint** 🎯

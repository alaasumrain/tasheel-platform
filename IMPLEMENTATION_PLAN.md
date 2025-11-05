# Tasheel Platform - Comprehensive Implementation Plan

**Project:** Tasheel Service Platform  
**Date:** January 2025  
**Current Status:** Phase 1 Complete ✅ | Phase 2 Day 2-3 Complete ✅ (~40% of total project)  
**Target:** Full Platform per PROPOSAL_BUSINESS.md (5 weeks, $20,500)

---

## Executive Summary

This document provides a comprehensive implementation plan based on:
- ✅ **Current Codebase Analysis** - What's already built
- ✅ **Database Schema Review** - What exists in Supabase
- ✅ **Proposal Requirements** - PROPOSAL_BUSINESS.md (5-week plan)
- ✅ **Best Practices** - Scalable architecture, security, performance

**Strategy:** Build incrementally in 4 phases, with each phase being production-ready before moving to the next.

---

## Current State Assessment

### ✅ What's Already Built

#### Frontend (Next.js 14)
- ✅ Landing page with bilingual structure (95% complete)
- ✅ Service catalog page (12 services in `src/data/services.ts`)
- ✅ Service detail pages with dynamic routing
- ✅ Quote request form (`/services/[slug]/quote`)
- ✅ Admin panel structure (`/admin/*`)
- ✅ Basic authentication (session-based admin login)
- ✅ Order tracking page (`/track`)
- ✅ Email notifications via Resend

#### Backend (Supabase)
- ✅ **Database Tables:**
  - `applications` - Quote requests/orders (5 rows)
  - `application_events` - Audit trail (7 rows)
  - `application_attachments` - File uploads (2 rows)
  - `services` - Service catalog (18 services)
  - `service_categories` - Categories (4 categories)
  - `leads` - Lead generation (2 rows)
- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Migrations:** 8 migrations applied
- ✅ **Supabase Storage** configured for file uploads

#### Infrastructure
- ✅ Next.js 14 App Router with TypeScript
- ✅ Material UI v6 + Tailwind CSS
- ✅ Supabase client configured
- ✅ Resend email integration
- ✅ Environment variables setup

---

## Gap Analysis: What's Missing

### Critical Gaps (Phase 1 Requirements)

#### 1. Database Schema Gaps
- ❌ **`customers` table** - For customer portal registration/login
- ❌ **`users` table** - For admin/staff management (currently using auth.users only)
- ❌ **`invoices` table** - For invoice generation
- ❌ **`payments` table** - For payment tracking
- ❌ **Bilingual fields missing** - Services table needs `name_en`, `name_ar`, `description_en`, `description_ar`
- ❌ **Service metadata** - Missing `required_documents`, `process_steps`, `pricing` structure

#### 2. Customer Portal (Phase 2)
- ❌ Customer registration/login pages
- ❌ Customer dashboard (`/dashboard`)
- ❌ Order tracking for logged-in customers
- ❌ File upload/download functionality
- ❌ Profile settings page

#### 3. Payment Integration (Phase 2)
- ❌ Payment gateway integration (PalPay or PayTabs)
- ❌ Invoice generation (PDF)
- ❌ Payment link creation
- ❌ Payment webhook handling
- ❌ Payment status tracking

#### 4. Admin Panel Enhancements (Phase 1)
- ❌ User management (create/edit admin/officer users)
- ❌ Invoice creation interface
- ❌ Quote generation workflow
- ❌ Advanced search/filter on orders
- ❌ File management (upload completed work)

#### 5. Service Catalog (Phase 1)
- ❌ Only 18 services exist (need 30 for Phase 1, 149 total)
- ❌ Missing bilingual content (Arabic translations)
- ❌ Missing required documents lists
- ❌ Missing process workflow visualization data

#### 6. Advanced Features (Phase 3-4)
- ❌ Task management system
- ❌ 5-role RBAC system (Admin, Supervisor, Officer, Intake, Auditor)
- ❌ SLA tracking
- ❌ Custom workflow pipelines
- ❌ Automation rules
- ❌ Advanced dashboards with charts
- ❌ Kanban board view
- ❌ Data export (CSV/Excel)
- ❌ Audit logs viewer

---

## Implementation Roadmap

### Phase 1: Launch (Week 1) - $5,000
**Goal:** Get website live with 30 services, basic admin panel, quote requests working

#### Week 1 Tasks

**Day 1: Bilingual Infrastructure Setup (CRITICAL - Do First)**
**Why:** Everything else depends on this. Bilingual must be set up before content work.

1. Install and configure `next-intl`:
   ```bash
   npm install next-intl
   ```
2. Create locale structure:
   - Create `messages/en.json` and `messages/ar.json`
   - Add ~50 common translation keys (navigation, buttons, forms, errors)
3. Set up middleware for locale routing:
   - Create `middleware.ts` with next-intl routing
   - Configure Arabic as default, English at `/en` prefix
4. Update root layout for bilingual support:
   - Add `[locale]` route group structure
   - Set `dir="rtl"` for Arabic, `dir="ltr"` for English
   - Add Arabic font (Tajawal or Cairo) via next/font
5. Create language switcher component:
   - **Use Geneva button pattern** for switcher
   - Add to header (Geneva header.tsx)
   - Test switching between languages
6. Update theme.ts for RTL support:
   - Add `direction` based on locale
   - Test theme switching

**Day 2: Database Schema Updates**
1. Create missing tables:
   - `customers` table (for future customer portal)
   - `users` table (admin/staff management)
   - `invoices` table (basic structure - no payment links yet)
   - `payments` table (structure only, integration in Phase 2)
2. Update `services` table:
   - Add bilingual fields (`name_en`, `name_ar`, `description_en`, `description_ar`)
   - Add `required_documents` (JSONB array)
   - Add `process_steps` (JSONB array)
   - Add `pricing` structure (JSONB)
   - Add `turnaround_days` (integer)
3. Create RLS policies for new tables:
   - `users` table: Only admins can view/edit
   - `customers` table: Customers see only their data
   - `invoices` table: Tied to applications
4. Set up indexes for performance:
   - Index on `services.slug`, `services.category_id`
   - Index on `applications.order_number`, `applications.status`
   - Index on `users.email`, `users.role`

**Day 3: Service Catalog Migration**
1. Migrate existing 12 services from `src/data/services.ts` to database:
   - Create migration script or manual SQL
   - Transfer all service data
   - Verify data integrity
2. Add 12 more services (total 30):
   - Client provides service details OR use existing service list
   - Add to database with all required fields
3. Update service detail pages to pull from database:
   - Replace hardcoded data with Supabase queries
   - Use `useTranslations()` from next-intl for bilingual content
   - Test dynamic routing `/[locale]/services/[slug]`

**Day 4: Service Content & Bilingual Completion**
1. Add bilingual content for all 30 services:
   - English content: Use existing or client provides
   - Arabic content: Translate or use AI translation tool
   - Add to `messages/ar.json` for UI elements
2. Add required documents lists (bilingual):
   - Store in database `required_documents` JSONB field
   - Display with proper RTL support
3. Add process workflow steps (bilingual):
   - Store in database `process_steps` JSONB field
   - Display with Geneva Card components
4. Test bilingual service pages:
   - Test RTL layout on Arabic pages
   - Test language switching
   - Verify all text displays correctly

**Day 5 Morning: Admin Panel Enhancements**
1. Build user management page (`/admin/users`):
   - **Use Geneva Card component** for layout
   - **Use MUI DataGrid** for user table
   - **Use Geneva form pattern** (extend contact-form.tsx) for create/edit
   - Create/edit admin/officer users
   - Password reset functionality (basic)
   - User activation/deactivation
2. Enhance orders list page:
   - **Use MUI DataGrid** (not custom table)
   - **Use Geneva Card** as container
   - Basic search (order number, customer name)
   - Filter by status, date range
   - Sort and pagination (built into DataGrid)

**Day 5 Afternoon: Quote & Invoice Interface (Basic)**
**Note:** Payment links come in Phase 2. Phase 1 just creates quotes/invoices.

1. Build quote generation workflow (admin):
   - **Use Geneva Card** for quote interface
   - **Use Geneva form pattern** for inputs
   - Admin can set quote amount
   - Save quote to database (no payment link yet)
   - Send quote email to customer (with manual payment instructions)
2. Build invoice creation interface (basic):
   - **Use Geneva Card** for invoice form
   - **Use Geneva form pattern** for inputs
   - Create invoice from order
   - Generate invoice number (format: `INV-YYYYMMDD-XXX`)
   - Set amount and due date
   - Display invoice (PDF generation in Phase 2)

**Day 5 Evening: Testing & Staging Deployment**
1. End-to-end testing:
   - Quote request flow (customer submits → admin sees)
   - Admin login and order management
   - Email notifications (test in both languages)
   - Language switching works
   - RTL layout works
   - File uploads (if already implemented)
2. Deploy to staging environment
3. Document known limitations:
   - Payment links not yet active (Phase 2)
   - Customer portal not yet built (Phase 2)
   - Some advanced features pending (Phase 3-4)

**Deliverables:**
- ✅ **Bilingual infrastructure** fully set up (next-intl, RTL, language switcher)
- ✅ 30 services live in catalog (bilingual)
- ✅ Admin can manage orders and create quotes
- ✅ Quote requests working with email notifications (bilingual)
- ✅ Basic invoice creation (display only, no PDF download yet)
- ✅ Staging deployment ready for client testing

**Phase 1 Limitations (Will be Fixed in Phase 2):**
- ⚠️ No payment links (quotes are created but customer pays manually)
- ⚠️ No customer portal (customers track via `/track` page with order number)
- ⚠️ No PDF invoice download (invoices display on screen only)
- ⚠️ No online payment processing (Phase 2 feature)

**Success Criteria:**
- Website is live and accessible
- Customer can browse services in Arabic/English
- Customer can submit quote requests
- Admin receives email notifications
- Admin can view orders and create quotes
- All pages work in both languages with proper RTL

---

### Phase 2: Customers & Payments (Week 2) - $6,000
**Goal:** Customers can register, login, pay online, track orders

#### Week 2 Tasks

**Day 1-2: Customer Authentication**
1. Set up Supabase Auth for customers
2. Build customer registration page (`/register`)
   - **Extend Geneva contact-form.tsx pattern**
   - **Use Geneva Card component**
   - **Use Geneva button components**
3. Build customer login page (`/login`)
   - **Extend Geneva contact-form.tsx pattern**
   - **Use Geneva Card component**
   - **Use Geneva button components**
4. Build password reset flow
   - **Use Geneva form pattern**
5. Create customer profile sync (auth.users → customers table)
6. Add email verification

**Day 2-3: Customer Dashboard**
1. Build customer dashboard layout (`/dashboard`)
   - **Use Geneva Card** for dashboard widgets
   - **Use RevealSection** for animations
   - **Use Geneva layout patterns** (Container, Stack, Grid)
2. Build "My Requests" page showing all customer orders
   - **Use MUI DataGrid** for table (Geneva-compatible)
   - **Use Geneva Card** as container
3. Build request detail page:
   - **Use Geneva Card** for each section
   - **Use RevealSection** for smooth reveals
   - Show order details
   - Status timeline (use MUI Timeline or custom with Geneva Card)
   - Upload files section (use Geneva form pattern)
   - Download completed files
4. Build profile settings page:
   - **Extend Geneva contact-form.tsx pattern**
   - **Use Geneva Card** for form container
   - Update name, phone, email
   - Change password
   - Language preference
5. Add file upload/download functionality
   - **Use Geneva form pattern** for upload
   - Customer can upload required documents
   - Customer can download completed work
   - Secure file access with signed URLs

**Day 3-4: Payment Integration**
1. Choose payment gateway (PalPay or PayTabs)
2. Set up payment gateway account (sandbox + production)
3. Build payment link creation API
4. Build payment webhook handler
5. Integrate payment flow:
   - Admin creates quote → generates payment link
   - Customer receives payment link via email
   - Customer pays via gateway
   - Webhook updates payment status
   - Customer receives confirmation email
6. Build payment status tracking:
   - Pending, Paid, Failed states
   - Payment history in order detail

**Day 4-5: Invoice Generation**
1. Build invoice creation interface (admin)
   - **Use Geneva Card** for invoice form
   - **Use Geneva form pattern** for inputs
2. Generate PDF invoices
   - **Option 1:** Use browser print (window.print()) with CSS print styles
   - **Option 2:** Use MUI components to render, then convert to PDF
   - **NO custom PDF library** - use browser-native or MUI
3. Invoice includes:
   - Company logo and details
   - Invoice number (auto-generated)
   - Order number reference
   - Customer information
   - Service name
   - Amount
   - Payment status
   - Issue date, due date
4. Bilingual invoices (Arabic/English)
   - **Use same bilingual system** as rest of site
5. Customer can download invoice from dashboard
   - **Use Geneva button** for download
6. Admin can regenerate/resend invoice
   - **Use Geneva button** for actions

**Day 5: WhatsApp Integration (Basic)**
1. Set up WhatsApp Business API (or use click-to-chat)
2. Add WhatsApp buttons to customer communications
3. Send order confirmations via WhatsApp
4. Status updates via WhatsApp
5. Customer can reply via WhatsApp (if API set up)

**Deliverables:**
- ✅ Customer portal with registration/login
- ✅ Customer dashboard with order tracking
- ✅ Online payment processing
- ✅ Invoice generation and download
- ✅ WhatsApp notifications (basic)

---

### Phase 3: Team & All Services (Weeks 3-4) - $6,500
**Goal:** Complete service catalog, 5-role system, task management, SLA tracking

#### Week 3 Tasks

**Day 1-2: Complete Service Catalog**
1. Add remaining 119 services (total 149)
2. Organize by ministry/department
3. Add subcategories if needed
4. Migrate all service data from client
5. Add bilingual content for all services
6. Enhanced service listing page:
   - Advanced search
   - Filters (price range, turnaround time, category)
   - Sort options

**Day 2-3: 5-Role RBAC System**
1. Update `users` table:
   - Add `role` enum: 'admin', 'supervisor', 'officer', 'intake', 'auditor'
   - Add `team_id` (optional)
   - Add `permissions` JSONB (optional, for future flexibility)
2. Create permission system:
   - Define permissions per role
   - Create permission checking utilities
3. Update RLS policies for role-based access:
   - Officers see only assigned requests
   - Supervisors see team requests
   - Admins see all
   - Auditors read-only
4. Build user management interface:
   - Create users with role assignment
   - Edit user roles
   - Deactivate users
   - Reset passwords

**Day 3-4: Task Management System**
1. Create `tasks` table
2. Build task creation interface:
   - Create task from order
   - Assign to officer
   - Set due date and priority
   - Task types: Call, WhatsApp, Email, Office Visit, Ministry Visit, QA Check
3. Build task views:
   - "My Tasks" (officer view)
   - "All Tasks" (admin/supervisor view)
   - "Overdue Tasks"
   - "Today's Tasks"
4. Build task management:
   - Update task status
   - Add outcome notes
   - Log time spent
5. Add task notifications:
   - Email reminder 1 day before due
   - Overdue task alerts
   - Task assignment notifications

**Day 4-5: Custom Workflow Pipelines**
1. Define 3 pipeline types:
   - Translation Services pipeline
   - Government Services pipeline
   - Business Services pipeline
2. Update status system to support pipelines
3. Build Kanban board view:
   - Visual board with columns
   - Drag-and-drop between stages
   - Filter by officer, service, priority
4. Add pipeline progress tracking:
   - Visual progress bar
   - Estimated time remaining

#### Week 4 Tasks

**Day 1-2: SLA Tracking**
1. Create `sla_configs` table
2. Build SLA configuration per service:
   - Target turnaround time (business days)
   - Warning threshold (70%)
3. Build SLA calculation engine:
   - Track time elapsed
   - Calculate business days (exclude weekends)
   - Calculate time remaining
4. Build SLA visual indicators:
   - Green/Yellow/Red badges
   - Progress bar
   - Countdown timer
5. Build SLA alerts:
   - Email at 70% warning
   - Email on breach (100%)
   - Escalation task creation
6. Build SLA dashboard/reporting

**Day 2-3: Team Dashboards**
1. Build Admin Dashboard:
   - Revenue metrics (total, monthly, growth)
   - Request metrics (total, by status, over time)
   - Service analytics (top services, categories)
   - Performance metrics (completion time, SLA compliance)
   - Team performance (officer stats)
2. Build Supervisor Dashboard:
   - Team workload
   - Pending approvals
   - Quality metrics
   - Revenue insights
3. Build Officer Dashboard:
   - My requests summary
   - My tasks summary
   - Performance metrics
   - Quick actions

**Day 3-4: Appointment Booking System**
1. Create `appointments` table
2. Build appointment booking interface:
   - Book office consultations
   - Book ministry appointments
   - Calendar view
   - Set office hours and capacity
3. Build appointment management:
   - Accept/reschedule appointments
   - Send appointment reminders
   - Link appointments to orders
4. Add appointment status tracking

**Day 4-5: Internal Communication Tools**
1. Create `communications` table
2. Build communication log:
   - Log calls, emails, WhatsApp, office visits
   - Add conversation summaries
   - Set next follow-up dates
   - Track outcomes
3. Build internal notes system:
   - Add notes to orders (staff-only)
   - Notes history timeline
   - @ mention functionality
   - Pin important notes

**Deliverables:**
- ✅ All 149 services in catalog
- ✅ 5-role RBAC system working
- ✅ Task management system
- ✅ Custom workflow pipelines
- ✅ SLA tracking and alerts
- ✅ Team dashboards
- ✅ Appointment booking system

---

### Phase 4: Automation & Intelligence (Week 5) - $3,000
**Goal:** Smart automation, advanced analytics, complete platform

#### Week 5 Tasks

**Day 1-2: Automation Rules**
1. Create `automation_logs` table
2. Build automated task creation:
   - Status → "Screening": Auto-create "Verify documents" task
   - Status → "Submitted to Ministry": Auto-create "Follow up" task
   - Status → "QA Review": Auto-create "Quality check" task
3. Build daily digest emails:
   - Sent to officers at 8:30 AM Palestine time
   - Tasks due today
   - Overdue tasks
   - Requests approaching SLA
   - Weekly performance summary
4. Build payment reminders:
   - If quote unpaid after 48 hours
   - Send reminder email
   - One reminder only

**Day 2-3: Advanced Dashboards**
1. Enhance Admin Dashboard:
   - Revenue trends (line chart)
   - Service demand (pie chart)
   - Team performance (bar chart)
   - SLA compliance rate
   - Export to CSV/Excel
2. Add predictive insights:
   - Forecast revenue
   - Identify trends
   - Highlight bottlenecks
3. Build custom report builder:
   - Date range selection
   - Filter by multiple criteria
   - Export reports

**Day 3-4: Data Export & Audit Logs**
1. Build export functionality:
   - Export orders to CSV
   - Export orders to Excel
   - Respect filters
   - Date range selection
   - Max 10,000 rows
2. Build audit logs viewer:
   - View all system activity
   - Filter by user, action, date
   - Search by entity ID
   - Export audit logs
3. Ensure audit logs are immutable

**Day 4-5: Final Polish & Testing**
1. Performance optimization:
   - Database query optimization
   - Image optimization
   - Code splitting
   - Caching strategies
2. Security audit:
   - Review RLS policies
   - Test authentication
   - Check file upload security
   - Rate limiting
3. End-to-end testing:
   - Test all user flows
   - Test all admin flows
   - Test payment flow
   - Test email notifications
   - Test file uploads/downloads
4. Documentation:
   - Admin user guide
   - API documentation
   - Deployment guide
5. Client training session

**Deliverables:**
- ✅ Automation rules working
- ✅ Advanced dashboards with charts
- ✅ Data export functionality
- ✅ Complete audit logs
- ✅ Performance optimized
- ✅ Security hardened
- ✅ Full documentation

---

## Database Schema Updates Required

### New Tables to Create

#### 1. `customers` Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT,
  language_preference TEXT DEFAULT 'ar', -- 'ar' or 'en'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
```

#### 2. `users` Table (Admin/Staff)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'officer', -- 'admin', 'supervisor', 'officer', 'intake', 'auditor'
  team_id UUID REFERENCES teams(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 3. `invoices` Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ILS',
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'cancelled'
  payment_link TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_application_id ON invoices(application_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

#### 4. `payments` Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL, -- 'palpay', 'paytabs'
  transaction_id TEXT,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### 5. `tasks` Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'call', 'whatsapp', 'email', 'office_visit', 'ministry', 'qa'
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'done', 'cancelled'
  time_spent_minutes INTEGER,
  outcome_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
```

#### 6. `sla_configs` Table
```sql
CREATE TABLE sla_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) UNIQUE,
  target_days INTEGER NOT NULL, -- business days
  warning_threshold_percent INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `communications` Table
```sql
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- 'call', 'email', 'whatsapp', 'office_visit'
  user_id UUID REFERENCES users(id),
  summary TEXT,
  next_followup_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_communications_application_id ON communications(application_id);
```

#### 8. `appointments` Table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id),
  customer_id UUID REFERENCES customers(id),
  appointment_type TEXT NOT NULL, -- 'office_consultation', 'ministry_visit'
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'rescheduled', 'cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
```

#### 9. `automation_logs` Table
```sql
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_type TEXT NOT NULL,
  application_id UUID REFERENCES applications(id),
  task_id UUID REFERENCES tasks(id),
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 10. `teams` Table (Optional, for Phase 3)
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Updates to Existing Tables

#### Update `services` Table
```sql
-- Add bilingual fields
ALTER TABLE services ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Add service metadata
ALTER TABLE services ADD COLUMN IF NOT EXISTS required_documents JSONB;
ALTER TABLE services ADD COLUMN IF NOT EXISTS process_steps JSONB;
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing JSONB;
ALTER TABLE services ADD COLUMN IF NOT EXISTS turnaround_days INTEGER;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
```

#### Update `applications` Table
```sql
-- Add missing fields
ALTER TABLE applications ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'standard';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_applications_customer_id ON applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_applications_service_id ON applications(service_id);
CREATE INDEX IF NOT EXISTS idx_applications_assigned_to ON applications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_order_number ON applications(order_number);
```

---

## Technical Architecture

### ⚠️ CRITICAL: Geneva Template Conformance

**ALL components MUST use Geneva template patterns. NO custom components outside the system.**

#### Existing Geneva Components to REUSE:
- ✅ `Card` (`components/ui/card.tsx`) - For all cards/containers
- ✅ `RevealSection` (`components/ui/reveal-section.tsx`) - For all animations
- ✅ `Image` (`components/ui/image.tsx`) - For all images
- ✅ `Logo` (`components/ui/logo.tsx`) - For branding
- ✅ `ThemeToggle` (`components/ui/theme-toggle.tsx`) - Dark/light mode
- ✅ Button components (`components/buttons/*`) - GetStarted, Contact, Login, Video
- ✅ Form components (`components/forms/*`) - ContactForm, SubscribeForm patterns
- ✅ Section components (`components/sections/*`) - All landing page sections

#### Stack (Geneva Template):
- **Next.js 14** (current) - will upgrade to 15 if needed
- **Material UI v6** (current) - matches Geneva v7 patterns
- **Tailwind CSS v4** - for utility classes
- **Motion** - for animations (same as Geneva)
- **Tabler Icons** - for icons
- **Resend** - for emails (already in use)
- **Supabase** - for database/auth

### File Structure (Geneva-Conformant)
```
src/
├── app/
│   ├── (site)/              # Public website (uses Geneva sections)
│   │   ├── page.tsx         # Homepage (Hero, FeaturesGrid, etc.)
│   │   ├── services/        # Services catalog
│   │   ├── track/           # Order tracking
│   │   └── ...
│   ├── (customer-portal)/   # Customer dashboard (Phase 2)
│   │   ├── dashboard/       # Uses Geneva Card + RevealSection
│   │   ├── login/           # Uses Geneva forms pattern
│   │   └── register/        # Uses Geneva forms pattern
│   ├── (admin-routes)/       # Admin panel
│   │   ├── admin/           # Uses Geneva Card + MUI DataGrid
│   │   │   ├── orders/      # Geneva Card layout
│   │   │   ├── users/       # Geneva Card layout
│   │   │   └── ...
│   │   └── login/           # Geneva form pattern
│   └── api/
│       ├── auth/            # Supabase Auth
│       ├── payments/         # Payment endpoints
│       └── webhooks/        # Webhook handlers
├── components/
│   ├── admin/               # Admin components (uses Geneva Card)
│   ├── buttons/             # ✅ Geneva buttons (reuse)
│   ├── forms/               # ✅ Geneva forms (extend patterns)
│   ├── sections/            # ✅ Geneva sections (reuse/extend)
│   └── ui/                  # ✅ Geneva UI components (reuse)
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── admin-auth.ts        # Admin authentication
│   ├── permissions.ts       # RBAC permissions
│   ├── email-notifications.ts
│   ├── payments.ts          # Payment utilities
│   ├── invoices.ts          # Invoice generation
│   └── utils.ts             # ✅ Geneva utils (reuse)
├── data/
│   └── services.ts          # Service data (migrate to DB)
├── theme.ts                 # ✅ Geneva theme (reuse)
└── providers.tsx            # ✅ Geneva providers (reuse)
```

### Component Patterns (Geneva Template)

#### 1. **All Pages Use Geneva Layout Pattern:**
```typescript
// Example: Customer dashboard page
import { Container, Stack } from '@mui/material';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

export default function DashboardPage() {
  return (
    <Container>
      <RevealSection delay={0.1}>
        <Card>
          {/* Content */}
        </Card>
      </RevealSection>
    </Container>
  );
}
```

#### 2. **All Forms Use Geneva Form Pattern:**
```typescript
// Extend existing contact-form.tsx pattern
import { Card, CardContent } from '@mui/material';
import { Card as GenevaCard } from '@/components/ui/card';
// Use same form structure as contact-form.tsx
```

#### 3. **All Tables Use MUI DataGrid (Geneva-compatible):**
```typescript
// Use MUI DataGrid (not custom table)
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '@/components/ui/card';
```

#### 4. **All Buttons Use Geneva Button Components:**
```typescript
// Reuse existing button components
import GetStarted from '@/components/buttons/get-started-button';
import ContactButton from '@/components/buttons/contact-button';
// Or extend with same styling
```

### Key Libraries (Geneva Template Stack)
**NO new libraries unless absolutely necessary. Use what Geneva has:**

```json
{
  "dependencies": {
    // ✅ Already in package.json (Geneva stack)
    "@mui/material": "^6.5.0",          // Already have
    "@mui/icons-material": "^6.5.0",    // Already have
    "@tabler/icons-react": "^3.34.0",  // Already have
    "motion": "^12.23.0",               // Already have
    "resend": "^4.6.0",                 // Already have
    "@supabase/supabase-js": "^2.75.0", // Already have
    "recharts": "^3.2.1",               // Already have (for charts)
    
    // ✅ REQUIRED for Phase 1 (bilingual support)
    "next-intl": "^3.0.0",              // Bilingual/routing (MUST HAVE)
    
    // ✅ Add for Phase 2 (customer auth)
    "@supabase/auth-helpers-nextjs": "^0.8.7",  // For customer auth
    
    // ✅ Add for admin password hashing (Phase 1)
    "bcryptjs": "^2.4.3",                       // For admin password hashing
    
    // ✅ Optional utilities (lightweight)
    "date-fns": "^3.0.0",                       // Date utilities
    "zod": "^3.22.4"                           // Validation (if needed)
  }
}
```

**DO NOT ADD:**
- ❌ Custom form libraries (use MUI forms)
- ❌ Custom table libraries (use MUI DataGrid)
- ❌ Custom PDF libraries (use browser print or MUI)
- ❌ Custom chart libraries (use Recharts if needed, already have)
- ❌ Any UI library outside MUI

---

## Security Best Practices

### 1. Row Level Security (RLS)
- ✅ Already enabled on all tables
- ✅ Need to review and update policies for new tables
- ✅ Test policies thoroughly

### 2. Authentication
- ✅ Admin: Session-based with httpOnly cookies
- ✅ Customer: Supabase Auth (OAuth + email/password)
- ✅ Password hashing: bcrypt (admin) or Supabase Auth (customers)

### 3. File Upload Security
- ✅ Validate file types and sizes
- ✅ Use signed URLs for file access
- ✅ Private buckets for customer uploads
- ✅ Scan for malware (optional, Phase 3)

### 4. API Security
- ✅ Rate limiting on API routes
- ✅ Input validation and sanitization
- ✅ CSRF protection
- ✅ Secure headers (helmet.js)

### 5. Payment Security
- ✅ Never store card details
- ✅ Use payment gateway tokens
- ✅ Verify webhook signatures
- ✅ Log all payment events

---

## Performance Optimization

### 1. Database
- ✅ Indexes on frequently queried fields
- ✅ Use database views for complex queries
- ✅ Connection pooling
- ✅ Query optimization

### 2. Frontend
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Static generation where possible

### 3. Caching
- ✅ Service catalog cached (ISR)
- ✅ Static assets via CDN
- ✅ API response caching (Redis optional)

### 4. Monitoring
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring
- ✅ Database query monitoring

---

## Testing Strategy

### 1. Unit Tests
- Test utility functions
- Test permission logic
- Test order number generation

### 2. Integration Tests
- Test API endpoints
- Test database operations
- Test email sending

### 3. E2E Tests
- Test customer registration/login
- Test quote request flow
- Test payment flow
- Test admin workflows

### 4. Manual Testing Checklist
- [ ] All pages render correctly
- [ ] Forms validate correctly
- [ ] Email notifications sent
- [ ] File uploads work
- [ ] Payments process correctly
- [ ] Admin can manage orders
- [ ] Customer can track orders
- [ ] Mobile responsive

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Email templates tested
- [ ] Payment gateway configured
- [ ] Domain DNS configured
- [ ] SSL certificate active

### Deployment
- [ ] Build passes without errors
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify all features work

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify email delivery
- [ ] Test payment processing
- [ ] Gather user feedback

---

## Success Metrics

### Phase 1 Success
- ✅ 30 services live
- ✅ Bilingual website working
- ✅ Admin can manage orders
- ✅ Quote requests working
- ✅ Email notifications sent

### Phase 2 Success
- ✅ Customers can register/login
- ✅ Payments processed successfully
- ✅ Invoices generated
- ✅ Customer dashboard functional

### Phase 3 Success
- ✅ All 149 services live
- ✅ 5-role system working
- ✅ Task management operational
- ✅ SLA tracking accurate

### Phase 4 Success
- ✅ Automation rules working
- ✅ Dashboards show accurate data
- ✅ Export functionality works
- ✅ Platform fully operational

---

## Risk Mitigation

### Technical Risks
1. **Database Performance** - Solution: Add indexes, optimize queries
2. **Payment Gateway Issues** - Solution: Fallback to manual payment
3. **Email Delivery** - Solution: Use Resend (reliable), monitor delivery rates
4. **File Storage Limits** - Solution: Use Supabase Storage (generous limits)

### Business Risks
1. **Scope Creep** - Solution: Stick to proposal, quote changes separately
2. **Timeline Delays** - Solution: Weekly milestones, daily communication
3. **Client Feedback Delays** - Solution: Set clear feedback deadlines

---

## Next Steps

1. **Review this plan** with client
2. **Confirm Phase 1 scope** and timeline
3. **Set up development environment** if not already done
4. **Create database migrations** for Phase 1
5. **Start Week 1 development**

---

## ⚠️ CRITICAL: Geneva Template Compliance Rules

### ✅ DO:
- ✅ Use existing Geneva components (`Card`, `RevealSection`, buttons, forms)
- ✅ Extend Geneva patterns (don't create new patterns)
- ✅ Use MUI components exactly as Geneva does
- ✅ Use same theme system (already identical)
- ✅ Use same animation patterns (RevealSection)
- ✅ Use same form patterns (contact-form.tsx structure)
- ✅ Use same button patterns (get-started-button.tsx structure)
- ✅ Use MUI DataGrid for all tables (Geneva-compatible)
- ✅ Use Geneva Card for all containers
- ✅ Use Container, Stack, Grid from MUI (Geneva patterns)

### ❌ DON'T:
- ❌ Create custom components outside Geneva structure
- ❌ Use different styling system (no custom CSS)
- ❌ Import new UI libraries
- ❌ Build custom tables (use MUI DataGrid)
- ❌ Build custom forms (extend Geneva form pattern)
- ❌ Build custom PDF library (use browser print or MUI)
- ❌ Build custom charts (use Recharts if needed, already have)
- ❌ Change theme structure (already matches Geneva)

### Component Reuse Strategy:
1. **For new pages:** Copy existing Geneva section/page structure
2. **For new forms:** Extend `contact-form.tsx` or `subscribe-form.tsx`
3. **For new buttons:** Extend existing button components
4. **For new cards:** Use `Card` from `components/ui/card.tsx`
5. **For animations:** Always use `RevealSection`
6. **For tables:** Always use MUI DataGrid

## Questions & Considerations

1. **Payment Gateway:** Which one? PalPay or PayTabs?
2. **WhatsApp Integration:** Full API or click-to-chat?
3. **Service Content:** Who provides Arabic translations?
4. **Domain:** What's the custom domain?
5. **Email Domain:** What email address for notifications?
6. **Geneva Template:** Confirm we should use MUI v6 (current) or upgrade to v7 (Geneva template)?

---

**This plan is a living document and will be updated as development progresses.**


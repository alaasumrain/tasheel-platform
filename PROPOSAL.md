# Tasheel Platform - Development Proposal

**Prepared for:** Tasheel Services
**Prepared by:** [Your Name]
**Date:** January 2025
**Valid until:** 30 days from date

---

## Executive Summary

This proposal outlines the development of the **Tasheel Platform** - a comprehensive bilingual service facilitation platform that enables Palestinian citizens and businesses to complete official paperwork and government-related services online.

The platform will provide a complete digital ecosystem including customer portal, payment processing, advanced CRM for team management, and workflow automation for all 149 services (57 translation services + 92 government services).

**Total Investment:** $15,000
**Timeline:** 8 weeks
**Ongoing Support:** $1,500/month (optional, starts Month 3)

---

## Project Scope

### Phase 1: Go Live - $8,000 (4 weeks)
### Phase 2: Scale & Automate - $7,000 (4 weeks)
### Phase 3: Premium Features - TBD (future)

---

## Phase 1: Go Live
**Investment: $8,000 | Timeline: 4 weeks**

### Objective
Launch a fully functional bilingual platform where customers can browse services, submit requests, pay online, and track their orders. Admin team can manage all incoming requests with basic workflow tools.

---

### 1.1 Bilingual Website (Arabic/English)

**Included:**
- ✅ Full Arabic and English language support
- ✅ Language switcher component in header (AR/EN toggle)
- ✅ RTL (right-to-left) layout for Arabic
- ✅ Bilingual pages:
  - Homepage
  - Services listing page
  - Service detail pages (dynamic)
  - About page
  - Contact page
  - Privacy Policy & Terms of Service
- ✅ Arabic font configuration (Tajawal or similar)
- ✅ All UI elements translated (buttons, forms, navigation, error messages)

**Not Included:**
- ❌ Blog/news section
- ❌ Custom Arabic content writing (client provides content, we translate)
- ❌ More than listed pages

---

### 1.2 Service Catalog (50 Services)

**Included:**
- ✅ **50 services** (client selects from their 149-service list)
- ✅ Each service includes:
  - Title (Arabic/English)
  - Description (Arabic/English)
  - Price or "Request Quote"
  - Turnaround time estimate
  - List of required documents
  - 4-step process workflow visualization
  - Service category tag
- ✅ Service listing page with:
  - Grid and list view toggle
  - Filter by category (4 main categories: Government, Translation, Legalization, Business)
  - Search by service name
  - Mobile responsive design
- ✅ Dynamic service detail pages (SEO-friendly URLs)

**Not Included:**
- ❌ All 149 services (remaining 99 added in Phase 2)
- ❌ Advanced filters (by price range, turnaround time)
- ❌ Service comparison feature
- ❌ Customer reviews/ratings

---

### 1.3 Customer Portal

**Included:**
- ✅ Customer registration (email + password)
- ✅ Customer login page
- ✅ Password reset flow (email-based)
- ✅ Email verification
- ✅ Customer dashboard showing:
  - Table of all customer requests
  - Order number, service name, status, submission date
  - Color-coded status badges
  - Search and filter capabilities
- ✅ Request detail page displaying:
  - Service information
  - Submitted form data
  - Current status with visual indicator
  - Timeline of status changes
  - Uploaded files (view/download)
  - Completed files (download when ready)
  - Payment status
- ✅ Profile settings page:
  - Update name, phone number, email
  - Change password
  - Language preference
- ✅ File upload functionality (customer uploads required documents)
- ✅ File download functionality (customer downloads completed work)
- ✅ Fully responsive mobile design

**Not Included:**
- ❌ In-app messaging between customer and staff
- ❌ Customer reviews/ratings system
- ❌ Save draft functionality for forms
- ❌ Multiple user profiles per account

---

### 1.4 Quote Request System

**Included:**
- ✅ Service-specific quote request forms (dynamic fields per service type)
- ✅ Standard form fields:
  - Service selection (dropdown)
  - Customer name, email, phone number
  - Service-specific questions (up to 8 custom fields per service)
  - File upload (up to 5 files, maximum 10MB per file)
  - Additional notes (text area)
  - Urgency level selection (Standard, Express, Urgent)
- ✅ Comprehensive form validation:
  - Required field checking
  - Email format validation
  - Phone number format validation
  - File size and type restrictions
- ✅ File upload to secure Supabase Storage
- ✅ Form submission saved to database
- ✅ Auto-generated unique order number
- ✅ Confirmation screen after submission

**Not Included:**
- ❌ Multi-step wizard interface (simple single-page form in Phase 1)
- ❌ Save draft functionality
- ❌ Real-time price estimation calculator
- ❌ Appointment booking system

---

### 1.5 Payment Integration

**Included:**
- ✅ Payment gateway integration (PalPay **OR** PayTabs - client chooses one)
- ✅ Sandbox environment testing
- ✅ Production gateway setup
- ✅ Admin creates quote workflow:
  - Admin enters total amount
  - System generates payment link
  - Customer receives email with payment link
- ✅ Customer online payment:
  - Credit/debit card processing
  - Secure payment page (gateway-hosted)
  - Payment confirmation redirect
- ✅ Payment status tracking (Pending, Paid, Failed)
- ✅ Payment confirmation email to customer
- ✅ Payment notification to admin

**Not Included:**
- ❌ Multiple payment gateways simultaneously
- ❌ Installment/split payment options
- ❌ Automated refund processing (manual only)
- ❌ Subscription/recurring payments
- ❌ Payment reminder automation

---

### 1.6 Invoice Generation

**Included:**
- ✅ Admin invoice creation interface
- ✅ Invoice includes:
  - Company logo and details
  - Invoice number (auto-generated)
  - Order number reference
  - Customer name and contact information
  - Service name
  - Total amount (single line item)
  - Payment status indicator
  - Issue date
  - Due date
- ✅ PDF invoice generation
- ✅ Bilingual invoices (English or Arabic based on customer language preference)
- ✅ Customer can download invoice from dashboard
- ✅ Admin can regenerate/resend invoice
- ✅ Basic professional invoice template

**Not Included:**
- ❌ Line-item breakdown (shows total only in Phase 1)
- ❌ Tax calculations (VAT, etc.)
- ❌ Multiple invoice templates/themes
- ❌ Automatic invoice numbering customization
- ❌ Invoice payment tracking separate from order payment

---

### 1.7 Email Notification System

**Included:**
- ✅ **6 automated email templates (all bilingual):**

  1. **Request Submitted Confirmation** (to customer)
     - Order number
     - Service details
     - Next steps
     - Tracking link

  2. **New Request Alert** (to admin)
     - Customer details
     - Service requested
     - Urgency level
     - Link to admin panel

  3. **Status Changed Notification** (to customer)
     - Order number
     - New status
     - What happens next
     - Tracking link

  4. **Payment Link Sent** (to customer)
     - Quote amount
     - Payment link
     - Instructions

  5. **Payment Received Confirmation** (to customer)
     - Payment amount
     - Receipt number
     - Next steps

  6. **Request Completed Notification** (to customer)
     - Download link for completed documents
     - Instructions
     - Feedback request

- ✅ Emails sent in customer's preferred language
- ✅ Professional HTML email templates (responsive design)
- ✅ Plain text fallback for email clients
- ✅ Email delivery via Resend API
- ✅ From/Reply-To configured with client's domain

**Not Included:**
- ❌ More than 6 email types in Phase 1
- ❌ Email scheduling (send at specific time)
- ❌ Email template editing by admin
- ❌ SMS notifications
- ❌ WhatsApp notifications
- ❌ Email marketing campaigns

---

### 1.8 Admin Panel (Basic)

**Included:**
- ✅ Secure admin login (password-based authentication)
- ✅ Session management with httpOnly cookies
- ✅ **2 user roles:**

  **Admin Role:**
  - View all requests
  - Edit all requests
  - Assign requests to officers
  - Change request status
  - Upload completed files
  - Create invoices and quotes
  - Add/edit/delete services
  - Manage users
  - View dashboard metrics

  **Officer Role:**
  - View assigned requests only
  - Update status of assigned requests
  - Add internal notes
  - Upload completed files
  - View own performance metrics

- ✅ Requests management dashboard:
  - Table view of all customer requests
  - Columns: Order #, Customer, Service, Status, Date, Assigned To, Actions
  - Search functionality:
    - By order number
    - By customer name
    - By customer email
    - By customer phone
  - Filter options:
    - By status (dropdown)
    - By date range (date pickers)
    - By service type
    - By assigned officer
  - Sort options:
    - By submission date (newest/oldest)
    - By status
    - By service name
  - Pagination (20 requests per page)

- ✅ Request detail page showing:
  - Complete customer information
  - Service requested with details
  - All form submission data
  - Files uploaded by customer (view/download)
  - Status change dropdown (admin can update)
  - Internal notes field (staff-only, not visible to customer)
  - Assign to officer dropdown
  - Upload completed files section
  - Status change history (timeline view)
  - Payment information
  - Invoice generation button

- ✅ Simple dashboard with 4 key metrics:
  - Total requests (all time)
  - Pending requests (current)
  - Completed requests (this month)
  - Revenue this month (from paid invoices)

- ✅ File management:
  - Upload multiple completed files
  - Preview uploaded files
  - Download files
  - Delete files

**Not Included:**
- ❌ More than 2 roles (5-role system is Phase 2)
- ❌ Advanced dashboard charts
- ❌ Task management system
- ❌ Kanban board view
- ❌ Bulk actions (update multiple requests simultaneously)
- ❌ Export to CSV/Excel
- ❌ Custom report builder

---

### 1.9 Status Workflow

**Included:**
- ✅ **5 request statuses:**

  1. **New** - Request just submitted, awaiting review
  2. **In Progress** - Officer actively working on request
  3. **Review** - Work completed, awaiting admin approval
  4. **Completed** - Request finished, ready for customer
  5. **Cancelled** - Customer cancelled or request rejected

- ✅ Status change functionality:
  - Admin/Officer can change status via dropdown
  - Status transition validation
  - Automatic timestamp recording

- ✅ Status change triggers:
  - Email notification sent to customer
  - Status history record created
  - Timeline updated on customer dashboard

- ✅ Visual status indicators:
  - Color-coded badges (blue, yellow, green, red)
  - Status timeline visualization
  - Progress percentage (estimated)

- ✅ Status history tracking:
  - Who changed the status
  - When it was changed
  - From what status to what status
  - Timeline view in request detail

**Not Included:**
- ❌ Custom status creation
- ❌ Conditional status transitions (workflow gates/rules)
- ❌ Automated status changes based on time
- ❌ Sub-statuses or status branches

---

### 1.10 Technical Infrastructure

**Included:**
- ✅ **Database Setup (Supabase PostgreSQL):**
  - customers table
  - applications (requests) table
  - application_events (status history) table
  - services table
  - users (admin/officers) table
  - files/documents table
  - invoices table
  - payments table

- ✅ **Supabase Storage Configuration:**
  - Customer uploads bucket (private)
  - Completed files bucket (private)
  - Public assets bucket (logos, images)
  - Secure file access with signed URLs

- ✅ **Row Level Security (RLS) Policies:**
  - Customers can only view their own data
  - Officers can only view assigned requests
  - Admins have full access
  - Audit logging for security events

- ✅ **Production Deployment:**
  - Deployed to Netlify (or client's preferred platform)
  - Custom domain connection (client provides domain)
  - SSL certificate configuration (HTTPS)
  - Environment variables secured
  - Database backups configured

- ✅ **Performance Optimization:**
  - Image optimization (Next.js Image component)
  - Code splitting for faster load times
  - Database indexes on frequently queried fields
  - CDN for static assets

- ✅ **Security Measures:**
  - Authentication with secure session management
  - Password hashing (bcrypt)
  - CSRF protection
  - Input sanitization
  - File upload validation (type, size)
  - Rate limiting on API endpoints

**Not Included:**
- ❌ Redis caching layer
- ❌ Advanced CDN configuration
- ❌ Load balancing for high traffic
- ❌ Database replication/clustering

---

## Phase 1: Exclusions

**The following are NOT included in Phase 1 and will be part of Phase 2 or Phase 3:**

- ❌ All 149 services (only 50 services in Phase 1)
- ❌ Advanced CRM with 5 roles (only 2 roles in Phase 1)
- ❌ Task management system
- ❌ SLA tracking and alerts
- ❌ Custom workflow pipelines
- ❌ Advanced dashboards with charts
- ❌ Automated task creation
- ❌ Export to CSV/Excel
- ❌ Audit logs viewer
- ❌ Kanban board view
- ❌ In-app messaging
- ❌ WhatsApp integration
- ❌ SMS notifications
- ❌ Multi-step wizard forms

---

## Phase 1: Deliverables Summary

At the end of Phase 1 (Week 4), the client will have:

✅ **Fully functional bilingual website** (Arabic/English with RTL)
✅ **50 services** available for customers to request
✅ **Customer portal** where customers can register, submit requests, upload files, track orders, and download completed work
✅ **Payment processing** via integrated payment gateway
✅ **Invoice generation** with PDF download
✅ **Email notifications** for all major events (6 types)
✅ **Admin panel** for 2 roles (Admin, Officer) to manage requests
✅ **Status workflow** with 5 states and email triggers
✅ **Production deployment** on custom domain with SSL
✅ **Mobile responsive** design across all pages

**Result: Client can start accepting customer orders and making revenue immediately.**

---

## Phase 2: Scale & Automate
**Investment: $7,000 | Timeline: 4 weeks (Weeks 5-8)**

### Objective
Expand to all 149 services, implement advanced CRM with 5 roles and full RBAC, add task management, SLA tracking with automation, advanced dashboards, and professional workflow tools for team collaboration and scaling.

---

### 2.1 Complete Service Catalog (149 Services)

**Included:**
- ✅ Add remaining **99 services** (total 149 services)
  - 57 translation services
  - 92 government/ministry services
- ✅ All services include:
  - Bilingual title and description
  - Pricing information
  - Turnaround time estimate
  - Required documents checklist
  - Process workflow steps
  - Service category and tags
- ✅ Service organization:
  - Grouped by ministry/department (Ministry of Interior, Ministry of Transport, etc.)
  - Subcategories for easier navigation
- ✅ Enhanced service listing page:
  - Advanced search (search in descriptions, not just titles)
  - Advanced filters:
    - By price range (slider)
    - By turnaround time (1-3 days, 3-7 days, 7+ days)
    - By category/ministry
    - By popularity (most requested)
  - Sort options:
    - By price (low to high, high to low)
    - By turnaround time (fastest first)
    - By name (A-Z)
    - By popularity

**Not Included:**
- ❌ Service comparison tool
- ❌ AI-powered service recommendations
- ❌ Customer reviews/ratings per service

---

### 2.2 Advanced CRM - 5 Roles with RBAC

**Included:**
- ✅ **5 distinct user roles with granular permissions:**

#### **1. Admin (Full Access)**
  - View all requests across entire organization
  - Edit any request
  - Assign/reassign requests to any user
  - Change any status
  - View all financial data (revenue, payments, invoices)
  - Manage users (create, edit, delete, change roles)
  - Delete/archive requests
  - View complete audit logs
  - Access all reports and dashboards
  - Configure system settings

#### **2. Supervisor**
  - View all requests within assigned team
  - Edit requests within scope
  - Assign/reassign requests within team
  - Approve/reject quotes before sending to customer
  - View financial data (read-only)
  - View SLA reports and breaches
  - Escalate issues to Admin
  - Cannot delete requests
  - Cannot manage users

#### **3. Officer**
  - View only assigned requests
  - Update status of assigned requests
  - Add internal notes to assigned requests
  - Upload completed files for assigned requests
  - Create tasks for themselves
  - View own performance metrics
  - Cannot view other officers' requests
  - Cannot view financial data
  - Cannot assign requests

#### **4. Intake Specialist**
  - View only new/unassigned requests
  - Assign new requests to officers
  - Add screening notes
  - Verify document completeness
  - Change status from "New" to "Screening" only
  - Cannot progress beyond screening stage
  - Cannot view completed requests
  - Cannot view financial data

#### **5. Auditor**
  - View all requests (read-only)
  - View complete audit logs
  - Export reports and data
  - Cannot edit any data
  - Cannot change statuses
  - Cannot assign requests
  - Compliance and quality review focus

- ✅ **User Management Interface:**
  - Admin can create new users
  - Assign roles to users
  - Deactivate/reactivate users
  - Reset user passwords
  - View user activity logs

- ✅ **Permission Enforcement:**
  - UI elements hidden based on role
  - API endpoints protected with role checks
  - Database Row Level Security (RLS) policies per role
  - Attempted unauthorized actions logged

**Not Included:**
- ❌ Custom role creation (only these 5 predefined roles)
- ❌ Per-user custom permissions (roles are fixed)
- ❌ Department/team hierarchy beyond basic assignment

---

### 2.3 Custom Workflow Pipelines

**Included:**
- ✅ **3 pre-configured pipeline types based on service category:**

#### **Pipeline 1: Translation Services**
  - New
  - Screening (verify documents, page count)
  - In Process (translation work)
  - QA Review (quality check, accuracy verification)
  - Ready (invoice prepared, awaiting payment)
  - Delivered (stamped PDF sent to customer)
  - Closed (archived)

#### **Pipeline 2: Government Services (IDs, Passports, Certificates)**
  - New
  - Screening (verify eligibility, documents)
  - In Process (prepare submission)
  - Submitted to Ministry (application filed)
  - Pending Feedback (awaiting ministry response)
  - Ready (received from ministry)
  - Delivered (handed to customer)
  - Closed (archived)

#### **Pipeline 3: Business Services (Registration, Licensing)**
  - New
  - Screening (verify requirements)
  - Document Preparation (gather paperwork)
  - Submitted (filed with authority)
  - Pending Approval (awaiting decision)
  - Ready (approved)
  - Delivered (certificate/license to customer)
  - Closed (archived)

- ✅ **Pipeline Features:**
  - Each service automatically assigned to appropriate pipeline
  - Status transitions follow pipeline sequence
  - Visual pipeline progress indicator
  - Pipeline-specific validation rules

- ✅ **Kanban Board View:**
  - Visual board with columns for each pipeline stage
  - Drag-and-drop requests between stages
  - Color-coded cards by service type
  - Quick view card details
  - Filter by officer, service, priority
  - Works on desktop (mobile shows list view)

- ✅ **Pipeline Progress Tracking:**
  - Visual progress bar on request detail page
  - Shows current stage and upcoming stages
  - Estimated time remaining per stage

**Not Included:**
- ❌ More than 3 pipeline types
- ❌ Admin-configurable custom pipelines
- ❌ Conditional pipeline branching (if/then logic)
- ❌ Parallel pipeline stages

---

### 2.4 Task Management System

**Included:**
- ✅ **Task Creation:**
  - Admin/Supervisor can create tasks
  - Task fields:
    - Task title
    - Task type (Call, WhatsApp, Email, Office Visit, Ministry Visit, QA Check, Follow-up)
    - Description
    - Assigned to (select officer)
    - Due date and time
    - Priority (Low, Normal, High, Urgent)
    - Parent request (linked to specific customer request)
    - Status (Open, In Progress, Done, Cancelled)

- ✅ **Task Views:**
  - **My Tasks** - Officer sees tasks assigned to them
  - **All Tasks** - Admin/Supervisor sees all tasks
  - **Overdue Tasks** - Filter for tasks past due date
  - **Today's Tasks** - Tasks due today
  - **By Request** - All tasks for a specific customer request

- ✅ **Task Management:**
  - Officer can update task status
  - Mark task as complete (Done)
  - Add outcome notes (what happened)
  - Log time spent (manual entry in minutes)
  - Set next action if needed

- ✅ **Task Notifications:**
  - Email reminder 1 day before task due
  - Overdue task alert email
  - Task assignment notification

- ✅ **Task Dashboard Widget:**
  - Officer dashboard shows task summary:
    - Tasks due today
    - Overdue tasks count
    - Completed this week

**Not Included:**
- ❌ Recurring tasks (repeat daily/weekly)
- ❌ Task dependencies (task A must finish before task B starts)
- ❌ Automatic task creation (Phase 2 has manual only - automation added below)
- ❌ Time tracking timer (just manual minutes entry)
- ❌ Task templates

---

### 2.5 SLA Tracking & Alerts

**Included:**
- ✅ **SLA Configuration:**
  - SLA settings per service:
    - Service name
    - Target turnaround time (in business days)
    - Warning threshold percentage (default 70%)
  - Pre-configured for all 149 services based on client's specifications
  - Business days calculation (excludes weekends: Friday/Saturday for Palestine)

- ✅ **SLA Calculation Engine:**
  - Automatically tracks time elapsed since request submission
  - Calculates time remaining until SLA breach
  - Excludes weekends and configurable holidays
  - Shows "X days remaining" or "Overdue by X days"
  - Updates in real-time

- ✅ **SLA Visual Indicators:**
  - **Green badge:** < 50% of time elapsed (on track)
  - **Yellow badge:** 50-100% of time elapsed (at risk)
  - **Red badge:** > 100% time elapsed (breached/overdue)
  - Progress bar showing time elapsed
  - Countdown timer on request detail page

- ✅ **SLA Alerts & Notifications:**
  - **70% Warning:**
    - Email sent to assigned officer
    - Badge appears in officer's dashboard
    - Highlighted in request list
  - **SLA Breach (100%):**
    - Email sent to assigned officer
    - Email sent to supervisor
    - Escalation task created automatically
    - Red alert badge in all views
    - Logged in audit trail

- ✅ **SLA Reporting:**
  - SLA dashboard page showing:
    - Requests at risk (70-99% time elapsed)
    - Breached requests (100%+ overdue)
    - SLA compliance rate (% of requests completed on time)
    - Average completion time per service type
    - Officer SLA performance comparison
  - Export SLA report to CSV

**Not Included:**
- ❌ Custom SLA rules per customer (enterprise feature)
- ❌ Pause SLA timer (e.g., "waiting on customer")
- ❌ SLA calculation per pipeline stage (overall request SLA only)

---

### 2.6 Automation Rules

**Included:**
- ✅ **Automated Task Creation (3 triggers):**

  **Trigger 1: Status changes to "Screening"**
  - Auto-creates task: "Verify document quality and completeness"
  - Task type: QA Check
  - Assigned to: Intake Specialist or assigned officer
  - Due: 1 business day

  **Trigger 2: Status changes to "Submitted to Ministry"**
  - Auto-creates task: "Follow up with ministry on submission status"
  - Task type: Ministry Visit / Call
  - Assigned to: Officer handling the request
  - Due: 3 business days

  **Trigger 3: Status changes to "QA Review"**
  - Auto-creates task: "Quality check translation/documents"
  - Task type: QA Check
  - Assigned to: Supervisor or QA officer
  - Due: 1 business day

- ✅ **Daily Digest Email (8:30 AM Palestine time):**
  - Sent to all active officers
  - Email contains:
    - Tasks due today (list)
    - Overdue tasks (list)
    - Requests approaching SLA breach (within 2 days)
    - Summary stats (total assigned, completed this week)
  - Bilingual email (based on user's language preference)

- ✅ **Payment Reminder:**
  - If quote sent to customer but not paid after 48 hours:
    - Send reminder email to customer
    - Include payment link again
    - Friendly reminder message
  - Limit: One reminder only (no spam)

**Not Included:**
- ❌ Custom automation rule builder (only these 3 predefined automations)
- ❌ Webhook integrations to external systems
- ❌ Zapier/Make integration
- ❌ Conditional automation (if/then/else logic beyond above)

---

### 2.7 Advanced Dashboards

**Included:**

#### **Admin Dashboard**
- ✅ **Revenue Metrics:**
  - Total revenue (all time)
  - Revenue this month
  - Revenue last month
  - Month-over-month growth percentage
  - Average order value

- ✅ **Request Metrics:**
  - Total requests (all time)
  - New requests this month
  - Requests by status (pie chart)
  - Requests over time (line chart, last 30 days)
  - Completion rate

- ✅ **Service Analytics:**
  - Top 5 services by request volume (bar chart)
  - Top 5 services by revenue (bar chart)
  - Service category breakdown (pie chart)

- ✅ **Performance Metrics:**
  - Average completion time (overall)
  - Average completion time per service type
  - SLA compliance rate
  - First-time-right percentage (requests completed without revisions)

- ✅ **Team Performance:**
  - Requests completed per officer (table)
  - Average completion time per officer
  - SLA compliance per officer
  - Current workload distribution (bar chart)

#### **Supervisor Dashboard**
- ✅ **Team Workload:**
  - Active requests per officer (bar chart)
  - Officer capacity status (green/yellow/red)
  - Unassigned requests count

- ✅ **Pending Items:**
  - Pending approvals count (quotes awaiting approval)
  - Review queue count (requests in Review status)

- ✅ **Quality Metrics:**
  - SLA breaches count (this week)
  - At-risk requests count (approaching SLA)
  - Overdue tasks count

- ✅ **Revenue Insights:**
  - Revenue by service type (pie chart)
  - Outstanding payments (total amount)
  - Payment collection rate

#### **Officer Dashboard**
- ✅ **My Requests:**
  - Total assigned to me
  - In progress count
  - Completed this week

- ✅ **My Tasks:**
  - Tasks due today
  - Overdue tasks
  - Completed tasks this week

- ✅ **My Performance:**
  - Average completion time (my requests)
  - SLA compliance rate (my requests)
  - Total requests completed (all time)

- ✅ **Quick Actions:**
  - Button to view my tasks
  - Button to view my requests
  - Shortcut to most common operations

**Not Included:**
- ❌ Custom dashboard builder (drag-and-drop widgets)
- ❌ Predictive analytics (forecasting, trends)
- ❌ Customer lifetime value (CLV) calculations
- ❌ Cohort analysis
- ❌ A/B testing insights

---

### 2.8 Search, Filters & Data Export

**Included:**

#### **Advanced Search:**
- ✅ Global search across:
  - Order number (exact match)
  - Customer name (partial match)
  - Customer email (partial match)
  - Customer phone number (partial match)
  - Service name
  - Internal notes (admin only)
- ✅ Search results highlighted
- ✅ Search history (last 5 searches saved)

#### **Advanced Filters:**
- ✅ Filter requests by:
  - Status (multi-select dropdown)
  - Service category (multi-select)
  - Date range (from/to date pickers)
  - Assigned officer (multi-select)
  - Payment status (Pending, Paid, Failed)
  - SLA status (On Track, At Risk, Breached)
  - Priority (Low, Normal, High, Urgent)
  - Customer language preference (Arabic, English)
- ✅ Combine multiple filters (AND logic)
- ✅ Save filter combinations (bookmark)
- ✅ Clear all filters button

#### **Data Export:**
- ✅ **Export to CSV:**
  - Export filtered request results
  - Columns included:
    - Order number, Date submitted, Customer name, Email, Phone
    - Service name, Status, Assigned to, SLA status
    - Amount, Payment status, Completion date
  - Filename: `tasheel_requests_YYYY-MM-DD.csv`

- ✅ **Export to Excel (.xlsx):**
  - Same data as CSV
  - Basic formatting:
    - Headers bold
    - Status column color-coded
    - Auto-sized columns
  - Single worksheet

- ✅ **Export Controls:**
  - Export current view (respects filters)
  - Export all (ignores filters, exports everything user can access)
  - Date range selector for exports
  - Maximum 10,000 rows per export (performance protection)

**Not Included:**
- ❌ Saved custom filter sets
- ❌ Scheduled exports (auto-send weekly report)
- ❌ Export to PDF
- ❌ Advanced Excel formatting (charts, pivot tables)
- ❌ Export with charts/graphs included

---

### 2.9 Audit Logs

**Included:**
- ✅ **Comprehensive Activity Logging:**
  - All actions logged automatically:
    - User logins
    - Request creation
    - Status changes (from → to)
    - Task creation/completion
    - File uploads/downloads
    - Invoice creation
    - Quote generation
    - Payment processing
    - User creation/deletion
    - Settings changes

- ✅ **Log Entry Details:**
  - Who: User who performed action (name, role, user ID)
  - What: Action type (created, updated, deleted, viewed)
  - When: Timestamp (date and time)
  - Where: Entity type (request, task, user, invoice, etc.)
  - Entity ID: Specific record affected
  - Before/After: Changed values (for edits)
  - IP address
  - User agent (browser/device)

- ✅ **Audit Log Viewer:**
  - Accessible by Admin and Auditor roles only
  - Table view with columns:
    - Timestamp, User, Action, Entity, Details
  - Filter options:
    - By user (dropdown)
    - By action type (dropdown)
    - By entity type (dropdown)
    - By date range
  - Search by entity ID (e.g., find all actions on Order #12345)
  - Sort by timestamp (newest/oldest)
  - Pagination (50 logs per page)

- ✅ **Audit Log Export:**
  - Export to CSV for compliance purposes
  - Includes all columns
  - Respects filter selections

- ✅ **Data Integrity:**
  - Logs are immutable (cannot be edited or deleted)
  - Stored in separate database table
  - Retention: 3 years (configurable)

**Not Included:**
- ❌ Real-time audit log streaming
- ❌ Automated audit reports (manual export only)
- ❌ Anomaly detection in audit logs
- ❌ Integration with SIEM systems

---

### 2.10 Internal Communication Tools

**Included:**

#### **Internal Notes System:**
- ✅ Add internal notes to any request
- ✅ Notes are staff-only (never visible to customer)
- ✅ Each note shows:
  - Author (user name and role)
  - Timestamp
  - Note content (rich text)
- ✅ Notes history in timeline view
- ✅ Mention other users with @ symbol (sends notification)
- ✅ Pin important notes to top

#### **Communication Log:**
- ✅ Log customer interactions:
  - Call logs
  - Email correspondence (summary)
  - WhatsApp messages (summary)
  - In-person visits
- ✅ Each communication entry includes:
  - Channel (Call, Email, WhatsApp, Office Visit)
  - Timestamp
  - Staff member who handled it
  - Summary of conversation (text field)
  - Next follow-up date (optional)
  - Outcome (Resolved, Pending Customer, Escalated, etc.)
- ✅ Communication timeline view
- ✅ Filter communications by channel or date

**Not Included:**
- ❌ In-app chat between staff members (Slack-like)
- ❌ Direct messaging with customers in the app (email only)
- ❌ WhatsApp Business API integration (that's Phase 3)
- ❌ Automatic call recording
- ❌ Email inbox integration

---

## Phase 2: Deliverables Summary

At the end of Phase 2 (Week 8), the client will have:

✅ **All 149 services** available in the catalog
✅ **5-role RBAC system** (Admin, Supervisor, Officer, Intake, Auditor) with granular permissions
✅ **3 custom workflow pipelines** for different service types
✅ **Task management system** with assignments, due dates, and tracking
✅ **SLA tracking** with automated alerts and escalations
✅ **Automation rules** (auto-create tasks, daily digests, payment reminders)
✅ **Advanced dashboards** for Admin, Supervisor, and Officer roles
✅ **Export functionality** (CSV/Excel) with advanced filters
✅ **Complete audit logs** for compliance and security
✅ **Internal communication tools** (notes, communication logs)
✅ **Kanban board view** for visual workflow management

**Result: Professional, scalable operations ready to handle high volume and team growth.**

---

## Phase 3: Premium Features (Future)
**Investment: TBD | Timeline: TBD**

Phase 3 includes optional premium features that can be added later based on business needs. These are **not required** for launch and will be priced separately when the client is ready.

### Potential Phase 3 Features:

**Communication Enhancements:**
- 📱 WhatsApp Business API integration (2-way messaging with customers)
- 📲 SMS gateway for urgent alerts and OTP verification
- 💬 In-app live chat widget for customers

**Advanced Analytics:**
- 📊 Predictive analytics (forecast revenue, demand trends)
- 🎯 Customer lifetime value (CLV) calculations
- 📈 Cohort analysis and retention metrics
- 🔮 AI-powered insights and recommendations

**Integrations:**
- 💼 Accounting software integration (QuickBooks, Zoho Books, Odoo)
- 📧 Email marketing automation (Mailchimp, SendGrid campaigns)
- 🔗 REST API for third-party integrations
- 🔌 Zapier/Make integration

**Mobile & Extended Reach:**
- 📱 Native mobile app (iOS and Android)
- 🌐 Progressive Web App (PWA) for offline access
- 🖥️ Desktop application (Electron-based)

**Enterprise Features:**
- 🏢 Multi-branch/multi-location support
- 👥 Department hierarchy and teams
- 🎫 Advanced ticketing system for complex requests
- ⭐ Customer reviews and ratings system
- 🔄 Subscription/recurring service packages

**Each Phase 3 feature will be scoped and priced individually when needed.**

---

## Investment & Payment Terms

### Total Project Investment: $15,000

#### Phase 1: $8,000 (4 weeks)
- **Payment 1:** $4,000 upon contract signing (starts development)
- **Payment 2:** $4,000 upon Phase 1 delivery (Week 4, after client testing approval)

#### Phase 2: $7,000 (4 weeks)
- **Payment 3:** $3,500 upon Phase 2 start (Week 5)
- **Payment 4:** $3,500 upon Phase 2 delivery (Week 8, after client testing approval)

### Payment Methods
- Bank transfer (preferred)
- PayPal (+ 3% processing fee)
- Other methods by arrangement

### Payment Terms
- Payments due within 5 business days of invoice
- Development pauses if payment is delayed beyond 7 days
- Final deployment to production occurs after final payment received

---

## Monthly Support Retainer (Optional)
**Investment: $1,500/month | Starts Month 3 (after project delivery)**

### What's Included:

✅ **Up to 12 hours** of development/support time per month
✅ **Unlimited bug fixes** (anything broken gets fixed, no charge)
✅ **Content updates:**
  - Add/edit up to 5 services per month
  - Update pricing, descriptions, required documents
  - Change text, images, contact information

✅ **Minor feature adjustments:**
  - Add a form field
  - Change button text or styling
  - Adjust email templates
  - Modify dashboard widgets

✅ **Security & performance:**
  - Security patches and updates
  - Dependency updates (npm packages, frameworks)
  - Performance monitoring
  - Database optimization

✅ **Support & communication:**
  - Priority email support (24-hour response time)
  - One 30-minute strategy call per month
  - Access to project management board (Trello/Asana)

✅ **First month FREE** (included in $15,000 project price)

### What's NOT Included (quoted separately):
- ❌ Major new features (WhatsApp integration, mobile app, etc.)
- ❌ Complete redesigns
- ❌ Third-party integrations
- ❌ Custom reports beyond what's built in Phase 2
- ❌ Marketing/SEO services
- ❌ Content writing (client provides text)

### Retainer Terms:
- **Contract:** Month-to-month (either party can cancel with 30 days notice)
- **Unused hours:** Do NOT roll over to next month
- **Extra hours:** $150/hour if monthly limit exceeded
- **Payment:** Due on the 1st of each month
- **First payment:** Month 3 (Months 1-2 covered in project price)

### Example Retainer Month:
- 2 hours: Fix bug with file upload on Safari browser
- 3 hours: Add 4 new services to catalog
- 2 hours: Update pricing on 12 services
- 1 hour: Modify quote request form (add new field)
- 2 hours: Investigate "slow dashboard" performance issue
- 1 hour: Monthly check-in call
- 1 hour: Security update for Next.js dependency

**Total: 12 hours**

---

## Project Timeline

### Week 1-4: Phase 1 Development
- **Week 1:** Bilingual setup, service catalog (50 services), customer portal foundation
- **Week 2:** Quote request system, payment integration, invoice generation
- **Week 3:** Email notifications, admin panel, status workflow
- **Week 4:** Testing, bug fixes, production deployment, training

**Milestone: Client can start taking customer orders**

### Week 5-8: Phase 2 Development
- **Week 5:** Complete service catalog (149 services), 5-role RBAC, user management
- **Week 6:** Custom pipelines, task management, kanban board
- **Week 7:** SLA tracking, automation rules, advanced dashboards
- **Week 8:** Audit logs, exports, communication tools, testing, final deployment

**Milestone: Professional operations platform ready to scale**

### Month 3+: Ongoing Support (Optional Retainer)
- Monthly maintenance, updates, and enhancements
- New features from Phase 3 as needed (quoted separately)

---

## What Client Must Provide

For the project to stay on schedule, the client must provide the following:

### Before Development Starts (Week 0):
- ✅ **Service list:** Prioritized list of 50 services for Phase 1 (from their 149-service catalog)
- ✅ **Brand assets:**
  - Logo files (SVG and PNG, transparent background)
  - Brand colors (hex codes)
  - Fonts (if custom fonts used)
- ✅ **Content for existing pages:**
  - About page text (Arabic and English)
  - Contact information (phone, email, WhatsApp, address)
  - Social media links
- ✅ **Domain name:** Custom domain purchased and DNS access provided
- ✅ **Payment gateway credentials:**
  - PalPay OR PayTabs sandbox account
  - API keys for testing
  - Production keys provided before Phase 1 delivery
- ✅ **Email domain:** Professional email address for sending notifications (e.g., noreply@tasheel.ps)

### During Phase 1 (Weeks 1-4):
- ✅ **Service descriptions:** For each of the 50 services in Phase 1:
  - Title (Arabic/English)
  - Description (Arabic/English) - 2-3 sentences
  - Pricing (fixed price or "Request Quote")
  - Turnaround time estimate
  - List of required documents
- ✅ **Feedback:** Review staging site and provide feedback within 48 hours
- ✅ **Testing:** Test payment gateway, forms, emails in Week 4

### During Phase 2 (Weeks 5-8):
- ✅ **Remaining 99 service details** (same information as Phase 1)
- ✅ **User accounts:** List of initial staff members (name, email, role)
- ✅ **SLA targets:** Confirm turnaround time expectations per service
- ✅ **Holiday calendar:** List of Palestinian public holidays for SLA calculation

### Ongoing:
- ✅ **Timely feedback:** Respond to questions within 24-48 hours to avoid delays
- ✅ **Content updates:** Provide any new text, images, or changes in editable format
- ✅ **Testing participation:** Test new features on staging before production deployment

**Note:** If client cannot provide content on time, timeline may be extended. Content creation services (writing service descriptions, translations) can be provided at an additional cost of $50/hour.

---

## Terms & Conditions

### Scope & Change Requests
- This proposal defines the exact scope for Phase 1 and Phase 2
- Any features not explicitly listed in this proposal are out of scope
- Change requests or additional features will be quoted separately
- Minor adjustments within the same feature (e.g., change button color) are included
- Major changes (e.g., add a new page type) require additional budget

### Timeline & Delays
- 8-week timeline assumes client provides content and feedback on schedule
- Client feedback delays extend timeline proportionally
- Developer will provide weekly progress updates every Friday
- If client is unresponsive for 14+ days, project is paused

### Testing & Acceptance
- Developer deploys to staging environment for client testing
- Client has 5 business days to test and provide feedback
- Developer fixes bugs found during testing (included)
- After client approves staging, deployment to production occurs
- Client must test thoroughly on staging; production bugs fixed under retainer (if active) or quoted separately

### Intellectual Property
- Upon final payment, all code and designs transfer to client
- Client owns all custom code written for this project
- Developer retains right to use as portfolio piece (with permission)
- Open source libraries used remain under their respective licenses

### Support & Warranty
- **30-day warranty:** Free bug fixes for 30 days after Phase 2 delivery
- Bugs defined as: features not working as specified in this proposal
- **Not covered:** Browser compatibility issues (supports latest Chrome, Firefox, Safari, Edge)
- **Not covered:** Third-party service outages (Supabase, Netlify, payment gateway)
- After 30 days, support via retainer or quoted separately

### Hosting & Third-Party Services
- Client responsible for hosting costs (estimated $20-50/month):
  - Netlify/Vercel hosting
  - Supabase database
  - Supabase Storage
  - Domain renewal
- Client responsible for transaction fees (payment gateway typically 2.9% + $0.30 per transaction)
- Client responsible for email sending costs (Resend: free for first 3,000 emails/month)

### Confidentiality
- Developer will not share client's proprietary information or data
- Client data stored securely, access limited to project team
- Code repository kept private during and after development

### Liability
- Developer's liability limited to project fee paid ($15,000 maximum)
- Developer not liable for business losses, lost revenue, or indirect damages
- Developer not liable for third-party service failures (payment gateway downtime, etc.)

### Termination
- Either party may terminate with 14 days written notice
- Client pays for work completed to date of termination
- Upon termination, developer delivers work-in-progress (as-is)
- Retainer can be cancelled by either party with 30 days notice

---

## Why Work With Me?

✅ **Family relationship** - Direct communication, trust, and shared success
✅ **Modern tech stack** - Next.js 14, Supabase, TypeScript - fast, scalable, maintainable
✅ **AI-accelerated development** - Leveraging latest AI tools to deliver faster
✅ **Bilingual expertise** - Native understanding of Arabic RTL and cultural context
✅ **Regional market knowledge** - Understanding of Palestinian business environment
✅ **Ongoing partnership** - Not just build and disappear; invested in long-term success
✅ **Transparent pricing** - Clear scope, no hidden fees, pay-as-you-go retainer
✅ **Quality focus** - Production-ready code, security best practices, scalable architecture

---

## Next Steps

1. **Review this proposal** - Take your time, ask any questions
2. **Discuss any adjustments** - Let's ensure we're aligned on scope and pricing
3. **Sign agreement** - Simple contract based on this proposal
4. **Make first payment** - $4,000 to start Phase 1
5. **Kick-off meeting** - 1-hour video call to align on details, timeline, and content needs
6. **Weekly updates** - Every Friday you'll see progress and provide feedback
7. **Go live** - Week 4, start taking customer orders
8. **Scale** - Week 8, full platform ready to grow

---

## Questions?

I'm here to answer any questions about this proposal:

📧 Email: [your-email@example.com]
📱 WhatsApp: [your-number]
📅 Schedule a call: [calendly-link or availability]

**Proposal valid for 30 days from date above.**

Looking forward to building Tasheel together! 🚀

---

**[Your Name]**
Full-Stack Developer
[Your Website/Portfolio]
[LinkedIn Profile]
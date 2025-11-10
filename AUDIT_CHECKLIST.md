# Website Audit Checklist - Issues to Fix

**Date:** January 2025  
**Status:** 🔍 Complete Page-by-Page Audit - Action Items Below

---

## 🔴 CRITICAL - Fix Immediately

- [ ] **Payment Webhook Security** - `src/app/api/payment/webhook/route.ts`
  - Implement signature verification for payment gateway webhooks
  - Currently has TODO comment, webhooks can be spoofed

- [ ] **Test Payment Endpoint** - `src/app/api/payment/test-complete/route.ts`
  - Disable in production or require admin auth
  - Currently allows marking invoices as paid without payment

- [ ] **Environment Variables Validation**
  - Add validation for critical env vars at startup
  - Currently uses 'DUMMY_KEY' silently if missing
  - Files: `submit-quote-request.ts`, `resend-send-message.ts`, `email-notifications.ts`

- [ ] **Dashboard Security Issue** - `src/app/(ar)/dashboard/page.tsx`, `src/app/en/dashboard/page.tsx`
  - Fetching ALL orders and filtering client-side by email
  - Should filter server-side or use customer_id
  - Security risk: exposes all orders to any authenticated user

- [ ] **Dashboard Requests Security** - `src/app/(ar)/dashboard/requests/page.tsx`, `src/app/en/dashboard/requests/page.tsx`
  - Same issue: fetching all orders, filtering by email client-side
  - Should use proper RLS or server-side filtering

---

## 🟠 HIGH PRIORITY

- [ ] **Admin Login Page Hardcoded Text** - `src/app/admin/login/page.tsx`
  - "Admin Login", "Enter your credentials to access the admin dashboard", "Logging in...", "Login"
  - Should use translations

- [ ] **Forgot Password Page Hardcoded Text** - `src/app/(ar)/forgot-password/page.tsx`
  - "Reset Password", "Enter your email to receive a password reset link"
  - Should use `useTranslations('Auth.forgotPassword')`

- [ ] **Reset Password Page Hardcoded Text** - `src/app/(ar)/reset-password/page.tsx`
  - "Set New Password", "Enter your new password below"
  - Should use `useTranslations('Auth.resetPassword')`

- [ ] **Admin Breadcrumbs Hardcoded** - Multiple admin pages
  - Hardcoded: "Dashboard", "Orders", "Users", "Customers", "Settings", "Tasks", "Financials", "SLA Tracking"
  - Files: `admin/orders/page.tsx`, `admin/users/page.tsx`, `admin/customers/page.tsx`, `admin/settings/page.tsx`, `admin/tasks/page.tsx`, `admin/financials/page.tsx`, `admin/sla/page.tsx`
  - Should use translations from `Admin.breadcrumbs`

- [ ] **Admin User Role Labels Hardcoded** - `src/components/admin/UsersPageClient.tsx:35-39`
  - Hardcoded: "Admin", "Supervisor", "Officer", "Intake", "Auditor"
  - Should use translations from `Admin.users.roles`

- [ ] **Customer Dashboard Breadcrumbs Hardcoded** - `src/app/(ar)/dashboard/requests/[id]/page.tsx`
  - Hardcoded: "Dashboard", "My Requests"
  - Should use translations

- [ ] **Privacy & Terms Pages Placeholder Text** - `src/app/(ar)/privacy/page.tsx`, `src/app/(ar)/terms/page.tsx`
  - Using Lorem ipsum placeholder text
  - Need actual privacy policy and terms of service content

- [ ] **Payment Success Page Hardcoded Arabic** - `src/app/(ar)/payment/success/page.tsx:81`
  - Hardcoded Arabic text: "وضع الاختبار: بوابة الدفع غير مُكوّنة. هذه عملية دفع تجريبية."
  - Should use translations

- [ ] **Error Boundary Integration** - `src/components/ui/error-boundary.tsx`
  - Wrap root layout with ErrorBoundary
  - Wrap critical components (Wizard, PaymentFlow, FileUpload)
  - Currently exists but not used

- [ ] **Error Boundary Translations** - `src/components/ui/error-boundary.tsx`
  - Replace hardcoded English text with translations
  - Add translation keys to `messages/en.json` and `messages/ar.json`

- [ ] **Database Function Security**
  - Fix `search_path` parameter in Supabase functions
  - Functions: `generate_order_number`, `set_order_number`
  - Supabase advisor flagged this as security risk

- [ ] **Create .env.example File**
  - Document all required environment variables
  - Add comments explaining each variable
  - Currently missing, developers don't know what's needed

- [ ] **Centralize File Size Limits**
  - Create single constant for MAX_FILE_SIZE
  - Currently defined in multiple places (wizard, FileUploadField, etc.)
  - Make configurable via environment variable

- [ ] **Add Rate Limiting**
  - Implement rate limiting on API routes
  - Different limits for authenticated vs public routes
  - Currently vulnerable to abuse/DDoS

---

## 🟡 MEDIUM PRIORITY

- [ ] **Console.error Statements** - Multiple pages, components, API routes, and server actions
  - **Pages:**
    - `src/app/(ar)/services/[slug]/page.tsx` - console.error in generateMetadata
    - `src/app/(ar)/confirmation/page.tsx:71` - console.error
    - `src/app/en/confirmation/page.tsx:71` - console.error
    - `src/app/(ar)/dashboard/requests/[id]/page.tsx:97` - console.error
    - `src/app/(admin-routes)/admin/services/page.tsx:43` - console.error
  - **Components:**
    - `src/components/admin/OrdersPageClient.tsx:27` - console.error
    - `src/components/admin/ServicesPageClient.tsx:49` - console.error
    - `src/components/admin/UsersPageClient.tsx:28` - console.error
    - `src/components/admin/CustomersPageClient.tsx:25` - console.error
  - **API Routes:**
    - `src/app/api/payment/webhook/route.ts:68,87,128,144,151` - console.error
    - `src/app/api/payment/test-complete/route.ts:72,90,142,147,157` - console.error, console.log
    - `src/app/api/payment/create-session/route.ts:118,173,206` - console.error
    - `src/app/api/analytics/track/route.ts:25,31` - console.error
    - `src/app/api/whatsapp/webhook/route.ts:26,56,84,92` - console.log, console.error
    - `src/app/api/admin/login/route.ts:63` - console.error
    - `src/app/api/admin/logout/route.ts:11` - console.error
    - `src/app/api/admin/invoices/route.ts:45,64` - console.error
    - `src/app/api/admin/services/route.ts:21,119,140,222` - console.log (audit), console.error
    - `src/app/api/admin/services/[id]/route.ts:18,87,96,194,237` - console.log (audit), console.error
    - `src/app/api/admin/orders/[id]/status/route.ts:31,40` - console.error
    - `src/app/api/customer/profile/route.ts:44,53,92,101` - console.error
  - **Server Actions:**
    - `src/app/actions/submit-quote-request.ts:12,101,131,182,214,218,238` - console.log, console.error
    - `src/app/actions/submit-checkout.ts:142` - console.error
    - `src/app/actions/track-order.ts:48` - console.error
    - `src/app/actions/file-upload.ts:30,42,100,117,147,159,167` - console.error
  - **Libraries:**
    - `src/lib/email-notifications.ts:76,106,120,124,169,171,216,218,259,261` - console.log, console.error
    - `src/lib/whatsapp.ts:42,67,78,101,130,142` - console.log, console.error
    - `src/lib/admin-auth.ts:45` - console.error
  - Should use proper error logging service (e.g., Sentry, LogRocket, or structured logging)

- [ ] **Hardcoded URLs in Email Templates** - `src/app/actions/submit-quote-request.ts:177`
  - Hardcoded admin URL: `https://tasheel.ps/admin/orders/${application.id}`
  - Should use `process.env.NEXT_PUBLIC_SITE_URL` or environment variable

- [ ] **Hardcoded Contact Phone Number** - `src/app/actions/submit-quote-request.ts:200`
  - Hardcoded: `'+970 2 240 1234'`
  - Should use environment variable `CONTACT_PHONE`

- [ ] **Hardcoded Default Language** - `src/app/api/customer/profile/route.ts:34,84`
  - Hardcoded: `'ar'` as default language preference
  - Should detect from user's browser/locale or make configurable

- [ ] **Missing Input Validation** - Multiple API routes
  - `src/app/api/payment/create-session/route.ts` - No validation for amount, currency format
  - `src/app/api/payment/webhook/route.ts` - No validation for webhook payload structure
  - `src/app/api/whatsapp/webhook/route.ts` - Basic validation but could be stricter
  - `src/app/api/customer/profile/route.ts` - No validation for phone number format, name length
  - Should add Zod schemas for all API route inputs

- [ ] **Missing Error Handling** - `src/app/api/payment/webhook/route.ts`
  - No try-catch around email/WhatsApp sending
  - If notifications fail, webhook still succeeds but customer doesn't get notified
  - Should handle gracefully and log failures

- [ ] **Admin Services Audit Logging** - `src/app/api/admin/services/route.ts:21`, `src/app/api/admin/services/[id]/route.ts:18`
  - Using console.log for audit trail
  - Should use proper audit logging system or database table

- [ ] **WhatsApp Webhook Security** - `src/app/api/whatsapp/webhook/route.ts:28`
  - TODO comment: "Verify webhook signature"
  - Currently accepts any POST request without verification
  - Security risk: anyone can send fake WhatsApp messages

- [ ] **Payment Webhook Missing Validation** - `src/app/api/payment/webhook/route.ts:56`
  - No validation that invoiceId exists before processing
  - No validation that amount matches invoice amount
  - Could allow payment manipulation

- [ ] **Test Payment Endpoint Security** - `src/app/api/payment/test-complete/route.ts:48`
  - `isPlaceholder` flag bypasses authentication
  - Should require admin auth even in placeholder mode
  - Or disable entirely in production

- [ ] **Missing Rate Limiting on Public APIs**
  - `src/app/api/analytics/track/route.ts` - No rate limiting, could be abused
  - `src/app/api/whatsapp/webhook/route.ts` - No rate limiting
  - `src/app/api/payment/webhook/route.ts` - No rate limiting
  - Should implement rate limiting middleware

- [ ] **Email Configuration Fallbacks** - `src/lib/email-notifications.ts`
  - Uses `'noreply@tasheel.com'` as fallback if `CONTACT_EMAIL` not set
  - Should fail loudly in production instead of silent fallback
  - Multiple functions check but don't throw errors

- [ ] **WhatsApp Integration Incomplete** - `src/lib/whatsapp.ts`
  - All functions in TESTING MODE
  - TODO comments indicate Twilio not installed
  - Functions return fake success responses
  - Should document this clearly or implement properly

- [ ] **Missing Invoice Email** - `src/app/api/admin/invoices/route.ts:57`
  - TODO comment: "Send email to customer (Phase 2)"
  - Invoice creation doesn't notify customer
  - Should send email when invoice is created

- [ ] **Customer Profile Default Language** - `src/app/api/customer/profile/route.ts:34,84`
  - Always defaults to Arabic
  - Should detect from Accept-Language header or user's browser locale

- [ ] **Console.error in Library Files** - Additional locations
  - `src/lib/admin-queries.ts:106,137` - console.error
  - `src/lib/service-queries.ts:18,49,71,93,113,131` - console.error
  - `src/lib/utils/crud-hooks.ts:67` - console.log for audit (should use proper audit system)
  - `src/components/forms/service-quote-wizard.tsx:105,462,505` - console.error
  - `src/components/forms/enhanced/EnhancedFileUploadField.tsx:185,293` - console.error
  - Should use proper error logging service

- [ ] **TypeScript `any` Types** - Multiple files
  - `src/lib/utils/query-builder.ts:12,39,94` - `any` types
  - `src/lib/utils/export.ts:9,56,92,114,131,151,171,193` - `any[]` types
  - `src/lib/utils/error-handler.ts:11,16,48,65,79,94` - `any` types
  - `src/lib/utils/crud-hooks.ts:15,19,23,48,73,85,96` - `any` types
  - `src/components/sections/service-detail-sidebar.tsx:32,34` - `any` for QRCode import
  - `src/components/sections/services-filter-sidebar.tsx:178` - `as any` for translation
  - `src/components/sections/services-catalog-with-search.tsx:508,739,759` - `as any` for translation
  - `src/components/sections/service-detail-enhanced.tsx:39,99,100,161` - `any` types
  - `src/components/forms/conditional-field.tsx:9,14,19,22,44,45,105,112,113` - `any` types
  - Should replace with proper types or generic constraints

- [ ] **Hardcoded Date Formatting** - `src/lib/utils/export.ts:80`
  - Using hardcoded 'en-US' locale for date formatting
  - Should accept locale parameter or use user's locale

- [ ] **File Upload Max Size Hardcoded** - `src/components/forms/FileUploadField.tsx:40`
  - Default maxSize: `10 * 1024 * 1024` (10MB)
  - Should use centralized constant or environment variable
  - Already covered in "Centralize File Size Limits" but this is another instance

- [ ] **Audit Logging Using Console.log** - `src/lib/utils/crud-hooks.ts:67`
  - Audit logs written to console.log
  - Should write to database audit table or proper logging service
  - Currently used by admin services API routes

- [ ] **Server-Side Input Validation**
  - Add Zod validation to API routes
  - Validate FormData extraction
  - Currently some routes don't validate inputs

- [ ] **Improve TypeScript Types**
  - Replace `any` types in form handlers and API routes
  - **Found:** ~30+ instances of `any` types
  - Files: `query-builder.ts`, `export.ts`, `error-handler.ts`, `crud-hooks.ts`, multiple components
  - Prioritize user-facing code and API routes
  - Keep MUI `sx?: any` pattern (standard)
  - Use proper generic constraints instead of `any`

- [ ] **Missing Error Handling**
  - Standardize error handling in database queries
  - Add proper null checks
  - Sanitize error messages for production

- [ ] **API Route Authentication Audit**
  - Verify all admin routes use `requireAdminAuthAPI()`
  - Document which routes are intentionally public
  - Routes to check: `/api/analytics/track`, `/api/whatsapp/webhook`

- [ ] **Track Page Date Formatting** - `src/components/sections/track.tsx:238,259`
  - Using hardcoded 'en-US' locale for date formatting
  - Should use current locale

- [ ] **Customer Requests Table Date Formatting** - `src/components/dashboard/CustomerRequestsTable.tsx:48`
  - Using hardcoded 'en-US' locale for date formatting
  - Should use current locale

---

## 🟢 LOW PRIORITY

- [ ] **Add API Documentation**
  - Generate OpenAPI/Swagger documentation
  - Document request/response schemas

- [ ] **Add Health Check Endpoint**
  - Create `/api/health` endpoint
  - Check database connectivity
  - Check external service availability

- [ ] **Move Hardcoded Values to Env Vars**
  - Default WhatsApp number: `'+970592345678'`
  - Default site URL: `'http://localhost:3000'` (found in 5+ files)
  - File size limits (already covered above)
  - Admin URL: `'https://tasheel.ps/admin/orders/'` (hardcoded in email template)
  - Contact phone: `'+970 2 240 1234'` (hardcoded in submit-quote-request.ts)
  - Payment gateway defaults: `'palpay'`, `'sandbox'` (should be configurable)

- [ ] **Financial Dashboard TODO** - `src/components/admin/FinancialDashboard.tsx:67`
  - TODO comment: "Calculate actual revenue per day"
  - Currently shows 0 for revenue

---

## ✅ Already Fixed (From Previous Audits)

- ✅ Required documents validation (now blocking)
- ✅ Service-specific fields saving
- ✅ File uploads working correctly
- ✅ Admin file viewing working
- ✅ Navbar currency spacing fixed
- ✅ Wizard layout and RTL support fixed
- ✅ Phone number validation improved

---

## 📝 Page-by-Page Summary

### Public Pages (Arabic & English)
- ✅ Homepage - Good, uses components with translations
- ✅ Services Listing - Good, uses translations
- ✅ Service Detail - Good, uses translations
- ✅ Service Quote - Good, wizard component handles translations
- ✅ Contact - ⚠️ Locale issue (always 'en')
- ✅ Track Order - ⚠️ Date formatting uses 'en-US'
- ✅ Login - ✅ Good, uses translations
- ✅ Register - ✅ Good, uses translations
- ⚠️ Forgot Password - Hardcoded English text
- ⚠️ Reset Password - Hardcoded English text
- ✅ Confirmation - ⚠️ Has console.error
- ✅ Payment Success - ⚠️ Hardcoded Arabic text
- ✅ Payment Cancel - ✅ Good, uses translations
- ⚠️ Privacy - Lorem ipsum placeholder
- ⚠️ Terms - Lorem ipsum placeholder
- ✅ About - Uses component, likely good

### Customer Dashboard
- ⚠️ Dashboard - Security issue (fetches all orders)
- ⚠️ Requests List - Security issue (fetches all orders)
- ⚠️ Request Detail - Hardcoded breadcrumbs, console.error
- ✅ Profile - Good, uses translations

### Admin Pages
- ⚠️ Admin Login - Hardcoded English text
- ✅ Admin Dashboard - Good, uses translations
- ⚠️ Admin Orders - Hardcoded breadcrumbs, console.error in component
- ✅ Admin Orders Detail - Good, uses translations
- ✅ Admin Services - ⚠️ Has console.error in page and component
- ⚠️ Admin Users - Hardcoded breadcrumbs, hardcoded role labels, console.error
- ⚠️ Admin Customers - Hardcoded breadcrumbs, console.error
- ⚠️ Admin Settings - Hardcoded breadcrumbs
- ⚠️ Admin Tasks - Hardcoded breadcrumbs
- ⚠️ Admin Financials - Hardcoded breadcrumbs
- ⚠️ Admin SLA - Hardcoded breadcrumbs

---

- [ ] **Root Layout Hardcoded Language** - `src/app/layout.tsx:79`
  - Hardcoded `lang="ar" dir="rtl"` in root HTML
  - Should be dynamic based on locale or removed (handled by LocaleHtmlAttributes)

- [ ] **Dashboard Route Protection Disabled** - `src/lib/supabase/middleware.ts:52-65`
  - Commented out code that would protect `/dashboard` routes
  - Currently relies on layout-level `requireAuth()` which is good
  - Consider enabling middleware protection for additional security layer

- [ ] **Missing .env.example File**
  - No `.env.example` file exists
  - Developers don't know what environment variables are needed
  - Should document all required variables with descriptions

---

## 📊 Audit Summary Statistics

**Total Issues Found:** ~60+ issues across all categories

**By Priority:**
- 🔴 Critical: 5 issues (security vulnerabilities)
- 🟠 High Priority: 15 issues (UX, translations, security)
- 🟡 Medium Priority: 20+ issues (code quality, validation, logging)
- 🟢 Low Priority: 5+ issues (documentation, nice-to-haves)

**By Category:**
- **Security:** 8 issues (webhooks, auth, data exposure)
- **Translations:** 12 issues (hardcoded text, missing translations)
- **Error Handling/Logging:** 50+ console statements across codebase
- **TypeScript:** 30+ `any` types
- **Input Validation:** 5+ API routes missing validation
- **Hardcoded Values:** 10+ instances (URLs, phone numbers, defaults)
- **Date Formatting:** 4 instances using hardcoded 'en-US'
- **Content:** 2 pages with Lorem ipsum placeholder

**Files Audited:**
- Pages: 40+ pages (public, dashboard, admin)
- Components: 80+ components
- API Routes: 20+ routes
- Server Actions: 6 actions
- Libraries: 15+ utility files
- Configuration: 5+ config files

---

## 📝 Notes

- **Most critical issues are security-related** - Payment webhooks, dashboard data exposure, test endpoints
- **Many pages have hardcoded text** - 12+ instances that should use translations
- **Privacy/Terms pages need actual content** - Currently using Lorem ipsum
- **Dashboard security issue is critical** - Exposes all orders to any authenticated user
- **Console logging is pervasive** - 50+ instances across codebase, should use proper logging service
- **TypeScript `any` types** - 30+ instances, should be replaced with proper types
- **Codebase structure is generally good** - Well-organized, uses modern patterns
- **Focus on critical and high priority items first** - Security and UX issues
- **Many medium/low priority items are improvements** - Not blockers but good to fix
- **Missing .env.example** - Makes onboarding difficult for new developers
- **WhatsApp integration incomplete** - All functions in TESTING MODE
- **Payment gateway placeholder mode** - Works but should be documented clearly
- **Error boundaries exist but not used** - Should wrap critical components
- **Audit logging uses console.log** - Should write to database or proper logging service

**Last Updated:** January 2025


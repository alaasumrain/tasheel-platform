# What's Left - Remaining Tasks

## ✅ Already Completed

### Critical Security
- ✅ Payment webhook signature verification
- ✅ Test payment endpoint disabled in production
- ✅ Dashboard security (server-side filtering)
- ✅ Environment variable validation script
- ✅ .env.example file created
- ✅ Critical console.error replaced with logger

### High Priority
- ✅ Admin login translations
- ✅ Forgot/Reset password translations
- ✅ Payment success page translations
- ✅ Dashboard breadcrumbs translations

---

## 🔴 CRITICAL - Must Fix Before Production

### 1. Error Boundary Integration
**Status:** Not implemented  
**Files:** `src/components/ui/error-boundary.tsx` (exists but not used)  
**Action:** 
- Wrap root layout with ErrorBoundary
- Wrap critical components (Wizard, PaymentFlow, FileUpload)
- Add translations for error messages

### 2. Database Function Security
**Status:** Security risk flagged by Supabase  
**Files:** Supabase functions `generate_order_number`, `set_order_number`  
**Action:** Fix `search_path` parameter in database functions

### 3. Rate Limiting
**Status:** Not implemented  
**Risk:** Vulnerable to abuse/DDoS  
**Action:** 
- Implement rate limiting on public API routes
- Add rate limiting to payment webhooks
- Add rate limiting to form submissions

---

## 🟠 HIGH PRIORITY - Should Fix

### 1. Remaining Console Statements
**Status:** ~192 console statements remaining  
**Priority:** Replace in critical paths  
**Files:** 
- API routes (payment, admin, customer)
- Server actions (file-upload, track-order, submit-checkout)
- Library files (email-notifications, whatsapp, admin-queries)

### 2. Privacy & Terms Pages
**Status:** Using Lorem ipsum placeholder  
**Files:** 
- `src/app/(ar)/privacy/page.tsx`
- `src/app/(ar)/terms/page.tsx`
- `src/app/en/privacy/page.tsx`
- `src/app/en/terms/page.tsx`
**Action:** Add actual content

### 3. Admin Breadcrumbs (Remaining)
**Status:** Partially fixed  
**Files:** 
- `admin/users/page.tsx`
- `admin/customers/page.tsx`
- `admin/settings/page.tsx`
- `admin/tasks/page.tsx`
- `admin/financials/page.tsx`
- `admin/sla/page.tsx`
**Action:** Add translations for breadcrumbs

### 4. Admin User Role Labels
**Status:** Hardcoded  
**File:** `src/components/admin/UsersPageClient.tsx:35-39`  
**Action:** Add translations for role labels

### 5. Hardcoded Values
**Status:** Found in multiple places  
**Files:**
- `src/app/actions/submit-quote-request.ts` - Hardcoded admin URL
- `src/app/actions/submit-quote-request.ts` - Hardcoded phone number (partially fixed)
- `src/app/api/customer/profile/route.ts` - Hardcoded default language

---

## 🟡 MEDIUM PRIORITY

### 1. TypeScript `any` Types
**Status:** ~30+ instances  
**Files:** Multiple utility files and components  
**Action:** Replace with proper types

### 2. Date Formatting
**Status:** Using hardcoded 'en-US' locale  
**Files:**
- `src/components/sections/track.tsx`
- `src/components/dashboard/CustomerRequestsTable.tsx`
**Action:** Use current locale

### 3. Centralize File Size Limits
**Status:** Defined in multiple places  
**Action:** Create single constant, make configurable via env var

### 4. Input Validation
**Status:** Missing in some API routes  
**Action:** Add Zod validation schemas

---

## 📊 Summary Statistics

**Total Remaining Issues:** ~50+ items

**By Priority:**
- 🔴 Critical: 3 items (Error boundaries, Database security, Rate limiting)
- 🟠 High: 5 items (Console cleanup, Content, Translations)
- 🟡 Medium: 4+ items (TypeScript, Validation, Configuration)

**By Category:**
- **Security:** 2 items (Database functions, Rate limiting)
- **Code Quality:** ~200 console statements, ~30 any types
- **Content:** 2 pages (Privacy, Terms)
- **Translations:** ~10 instances (Admin breadcrumbs, role labels)
- **Configuration:** 3 hardcoded values

---

## 🎯 Recommended Next Steps

### Before Production Launch:
1. **Error Boundaries** (Critical for UX)
2. **Rate Limiting** (Critical for security)
3. **Privacy & Terms Content** (Legal requirement)
4. **Remaining Admin Translations** (UX consistency)

### Can Be Done Post-Launch:
- Console statement cleanup (non-blocking)
- TypeScript any types (code quality)
- Date formatting (minor UX)
- File size centralization (refactoring)

---

## 📝 Notes

- **Most critical items are security-related** - Rate limiting and database functions
- **Content items require business input** - Privacy policy and Terms of Service
- **Many items are code quality improvements** - Not blocking but good to fix
- **Console statements are pervasive** - Focus on critical paths first

**Last Updated:** January 2025


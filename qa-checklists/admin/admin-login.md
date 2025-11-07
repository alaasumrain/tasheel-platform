# QA Checklist: Admin Login (`/admin/login`)

**Page Route:** `/admin/login`  
**Component:** `src/app/admin/login/page.tsx`  
**Last Tested:** 2025-01-27  
**Tester:** AI QA Assistant  
**Status:** ❌ Failed - Critical Issue Found

---

## 🎯 Page Purpose

The admin login page allows admin users to authenticate and access the admin panel. Critical for:
- Admin account access
- Secure authentication (Supabase Auth)
- Admin-only access control

---

## ✅ Functionality Checklist

### Form Functionality
- [ ] **Email field:** Accepts valid email addresses
- [ ] **Password field:** Accepts password input (masked)
- [ ] **Submit button:** Submits form on click
- [ ] **Enter key:** Submits form on Enter key press
- [ ] **Form validation:** Shows errors for invalid inputs
  - [ ] Empty email shows error
  - [ ] Invalid email format shows error
  - [ ] Empty password shows error
- [ ] **Loading state:** Button shows loading spinner during submission
- [ ] **Success:** Redirects to `/admin` on successful login
- [ ] **Error handling:** Shows error message for invalid credentials
- [ ] **Admin check:** Verifies user is in `users` table with `is_active=true`

### Authentication Flow
- [ ] **Valid admin credentials:** Logs in successfully
- [ ] **Invalid email:** Shows appropriate error
- [ ] **Invalid password:** Shows appropriate error
- [ ] **Non-admin user:** Shows "Access denied" error (403)
- [ ] **Inactive admin:** Shows "Access denied" error
- [ ] **Session creation:** Creates Supabase Auth session
- [ ] **Redirect:** Redirects to `/admin` after login
- [ ] **Protected routes:** Can access admin routes after login

### Security
- [ ] **Supabase Auth:** Uses Supabase Auth (not shared password)
- [ ] **JWT tokens:** Uses JWT tokens for session
- [ ] **No cookie-only auth:** Doesn't use insecure cookie auth
- [ ] **User verification:** Verifies user exists in `users` table

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **Centered:** Form centered on page
- [ ] **Spacing:** Proper spacing between elements
- [ ] **Visual hierarchy:** Clear title, form, links
- [ ] **Professional:** Clean, business-appropriate design

### Form Design
- [ ] **Input fields:** Consistent styling
  - [ ] Proper padding
  - [ ] Border radius matches design system
  - [ ] Focus states visible
  - [ ] Error states styled correctly
- [ ] **Labels:** Labels positioned correctly
- [ ] **Placeholders:** Placeholder text helpful (if used)

### Button Design
- [ ] **Submit button:**
  - [ ] Primary color
  - [ ] Proper size (56px height)
  - [ ] Rounded (50vh border radius)
  - [ ] Full width on mobile
  - [ ] Loading state shows spinner
  - [ ] Disabled state when form invalid

---

## 🌐 Translation Checklist

### Content
- [ ] **Page title:** "تسجيل دخول المدير" or "Admin Login"
- [ ] **Form labels:** "البريد الإلكتروني", "كلمة المرور" or "Email", "Password"
- [ ] **Button:** "تسجيل الدخول" or "Login"
- [ ] **Error messages:** All error messages translated
  - [ ] "البريد الإلكتروني مطلوب" / "Email is required"
  - [ ] "كلمة المرور مطلوبة" / "Password is required"
  - [ ] "البريد الإلكتروني أو كلمة المرور غير صحيحة" / "Invalid email or password"
  - [ ] "غير مصرح لك بالدخول" / "Access denied"

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] Form full width with padding
- [ ] Input fields full width
- [ ] Button full width
- [ ] Touch targets at least 44x44px
- [ ] Keyboard doesn't cover form

### Tablet (sm-md)
- [ ] Form constrained width (max 400-500px)
- [ ] Centered on page

### Desktop (lg+)
- [ ] Form constrained width
- [ ] Centered vertically and horizontally

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper `<form>`, `<label>`, `<button>`
- [ ] **ARIA:** Proper ARIA attributes
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Focus:** Visible focus indicators
- [ ] **Screen reader:** Form announced correctly

---

## 🔒 Security Checklist

### Authentication
- [ ] **Supabase Auth:** Uses Supabase Auth (not shared password)
- [ ] **HTTPS:** Page served over HTTPS
- [ ] **Password:** Never logged or exposed
- [ ] **Session:** Secure session creation
- [ ] **Admin verification:** Verifies admin role in database

### Error Messages
- [ ] **Generic errors:** Don't reveal if email exists
- [ ] **No user enumeration:** Same error for invalid email/password
- [ ] **Rate limiting:** Prevents brute force (if implemented)

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1s
- [ ] **Form submission:** Response < 2s
- [ ] **No layout shift:** No CLS on load

---

## 🔗 Navigation Checklist

- [ ] **After login:** Redirects to `/admin`
- [ ] **Already logged in:** Redirects to `/admin` if already authenticated
- [ ] **Back button:** Browser back works

---

## 🎭 Theme Checklist

- [ ] **Light mode:** Form readable
- [ ] **Dark mode:** Form readable
- [ ] **Input fields:** Visible in both themes
- [ ] **Buttons:** Proper contrast in both themes

---

## ✅ Final Checklist

- [ ] Login works with Supabase Auth
- [ ] Admin verification works
- [ ] Error handling works
- [ ] Form validation works
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Secure (no vulnerabilities)
- [ ] Performance acceptable

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
| 1 | Admin login page missing email field | 🔴 Critical | ❌ Found | Page only has password field, but API expects email+password. Login will fail. |
| 2 | Hard-coded English text | Medium | 🟡 Found | "Admin Login", "Enter your password...", "Password", "Login", "Logging in..." all hard-coded |
| 3 | Error messages hard-coded | Medium | 🟡 Found | "Invalid password", "An error occurred..." hard-coded in English |

---

## 📝 Notes

_Additional notes:_

### Critical Issue Found:
The admin login page (`src/app/admin/login/page.tsx`) is **incompatible** with the API route:
- **Page sends:** `{ password }` only
- **API expects:** `{ email, password }`
- **Result:** Admin login will fail completely

### Required Fix:
1. Add email field to admin login form
2. Update form submission to send both email and password
3. Update error handling to match API responses
4. Add translations for all text

### Current State:
- API route: ✅ Uses Supabase Auth correctly
- Login page: ❌ Missing email field, incompatible with API

See `CRITICAL-ADMIN-LOGIN-ISSUE.md` for full details.

# QA Checklist: Arabic Customer Login (`/ar/login`)

**Page Route:** `/ar/login`  
**Component:** `src/app/(ar)/login/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The login page allows customers to authenticate and access their dashboard. Critical for:
- Customer account access
- Secure authentication
- Password recovery flow
- Registration redirect

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
- [ ] **Success:** Redirects to dashboard on successful login
- [ ] **Error handling:** Shows error message for invalid credentials
- [ ] **Remember me:** Checkbox works (if implemented)

### Authentication Flow
- [ ] **Valid credentials:** Logs in successfully
- [ ] **Invalid email:** Shows appropriate error
- [ ] **Invalid password:** Shows appropriate error
- [ ] **Account not found:** Shows appropriate error
- [ ] **Session creation:** Creates session cookie
- [ ] **Redirect:** Redirects to `/ar/dashboard` after login
- [ ] **Protected routes:** Can access dashboard after login

### Links & Navigation
- [ ] **Forgot password:** Links to `/ar/forgot-password`
- [ ] **Register:** Links to `/ar/register`
- [ ] **Back to home:** Logo/back link works
- [ ] **Language switcher:** Switches to `/en/login`

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Form flows right-to-left
- [ ] **Centered:** Form centered on page
- [ ] **Spacing:** Proper spacing between elements
- [ ] **Visual hierarchy:** Clear title, form, links

### Form Design
- [ ] **Input fields:** Consistent styling
  - [ ] Proper padding
  - [ ] Border radius matches design system
  - [ ] Focus states visible
  - [ ] Error states styled correctly
- [ ] **Labels:** Labels positioned correctly (above or floating)
- [ ] **Placeholders:** Placeholder text helpful (if used)
- [ ] **Icons:** Icons in input fields (if used) positioned correctly for RTL

### Button Design
- [ ] **Submit button:** 
  - [ ] Primary color (#0E21A0)
  - [ ] Proper size (56px height)
  - [ ] Rounded (50vh border radius)
  - [ ] Full width on mobile
  - [ ] Loading state shows spinner
  - [ ] Disabled state when form invalid

### Visual Design
- [ ] **Typography:** Clear, readable fonts
- [ ] **Colors:** Matches design system
- [ ] **Contrast:** Sufficient contrast for accessibility
- [ ] **Logo:** Logo displays correctly
- [ ] **Background:** Background color/image appropriate

---

## 🌐 Translation Checklist

### Content
- [ ] **Page title:** "تسجيل الدخول" or equivalent
- [ ] **Form labels:** "البريد الإلكتروني", "كلمة المرور" in Arabic
- [ ] **Button:** "تسجيل الدخول" in Arabic
- [ ] **Links:** "نسيت كلمة المرور؟", "إنشاء حساب" in Arabic
- [ ] **Error messages:** All error messages in Arabic
  - [ ] "البريد الإلكتروني مطلوب"
  - [ ] "كلمة المرور مطلوبة"
  - [ ] "البريد الإلكتروني أو كلمة المرور غير صحيحة"
- [ ] **Success messages:** Success messages in Arabic

### RTL Layout
- [ ] Form fields align right
- [ ] Labels align right
- [ ] Icons positioned correctly
- [ ] Text direction correct

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] Form full width with padding
- [ ] Input fields full width
- [ ] Button full width
- [ ] Touch targets at least 44x44px
- [ ] Keyboard doesn't cover form
- [ ] Easy to scroll

### Tablet (sm-md)
- [ ] Form constrained width (max 400-500px)
- [ ] Centered on page
- [ ] Comfortable spacing

### Desktop (lg+)
- [ ] Form constrained width
- [ ] Centered vertically and horizontally
- [ ] Optimal spacing

---

## ♿ Accessibility Checklist

### Semantic HTML
- [ ] **Form:** Proper `<form>` element
- [ ] **Labels:** `<label>` elements associated with inputs
- [ ] **Inputs:** Proper `type` attributes (`email`, `password`)
- [ ] **Button:** `<button type="submit">` not `<div>`
- [ ] **Error messages:** Associated with inputs via `aria-describedby`

### ARIA
- [ ] **Required fields:** `aria-required="true"` on required inputs
- [ ] **Error states:** `aria-invalid="true"` on invalid inputs
- [ ] **Error messages:** `role="alert"` on error messages
- [ ] **Loading state:** `aria-busy="true"` on button when loading

### Keyboard Navigation
- [ ] **Tab order:** Logical tab order (email → password → submit)
- [ ] **Focus:** Visible focus indicators
- [ ] **Enter key:** Submits form
- [ ] **Escape key:** Clears form (if implemented)

### Screen Readers
- [ ] Form announced correctly
- [ ] Labels read correctly
- [ ] Error messages announced
- [ ] Success messages announced

---

## 🔒 Security Checklist

### Input Validation
- [ ] **Email:** Validates email format
- [ ] **Password:** No length restrictions exposed
- [ ] **XSS:** Inputs sanitized (handled by framework)
- [ ] **SQL injection:** Protected (handled by Supabase)

### Authentication
- [ ] **HTTPS:** Page served over HTTPS
- [ ] **Password:** Never logged or exposed
- [ ] **Session:** Secure session creation
- [ ] **CSRF:** CSRF protection (if applicable)

### Error Messages
- [ ] **Generic errors:** Don't reveal if email exists
- [ ] **No user enumeration:** Same error for invalid email/password
- [ ] **Rate limiting:** Prevents brute force (if implemented)

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1s
- [ ] **Form submission:** Response < 2s
- [ ] **No layout shift:** No CLS on load
- [ ] **Smooth animations:** Form transitions smooth

---

## 🔍 SEO Checklist

- [ ] **Title:** "تسجيل الدخول - Tasheel"
- [ ] **Meta description:** Descriptive Arabic text
- [ ] **Robots:** `noindex` (login pages shouldn't be indexed)
- [ ] **Canonical:** Canonical URL set

---

## 🐛 Error Handling Checklist

### Form Errors
- [ ] **Empty email:** Shows error message
- [ ] **Invalid email:** Shows format error
- [ ] **Empty password:** Shows error message
- [ ] **Invalid credentials:** Shows generic error
- [ ] **Network error:** Shows connection error
- [ ] **Server error:** Shows generic error

### Edge Cases
- [ ] **Very long email:** Handles gracefully
- [ ] **Special characters:** Handles in email/password
- [ ] **Already logged in:** Redirects to dashboard
- [ ] **Expired session:** Handles gracefully

---

## 🔗 Navigation Checklist

- [ ] **Forgot password link:** Works correctly
- [ ] **Register link:** Works correctly
- [ ] **Home link:** Works correctly
- [ ] **Language switcher:** Switches to English version
- [ ] **After login:** Redirects correctly
- [ ] **Back button:** Works correctly

---

## 🎭 Theme Checklist

- [ ] **Light mode:** Form readable, proper contrast
- [ ] **Dark mode:** Form readable, proper contrast
- [ ] **Input fields:** Visible in both themes
- [ ] **Buttons:** Proper contrast in both themes

---

## ✅ Final Checklist

- [ ] Login works correctly
- [ ] Error handling works
- [ ] Form validation works
- [ ] Responsive on all devices
- [ ] Accessible (keyboard, screen reader)
- [ ] Secure (no vulnerabilities)
- [ ] Performance acceptable

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





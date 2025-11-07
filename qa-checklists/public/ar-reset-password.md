# QA Checklist: Arabic Reset Password (`/ar/reset-password`)

**Page Route:** `/ar/reset-password`  
**Component:** `src/app/(ar)/reset-password/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

Allows customers to reset password using token from email. Critical for account recovery.

---

## ✅ Functionality Checklist

### Token Validation
- [ ] **Token check:** Validates reset token from URL
- [ ] **Invalid token:** Shows error if token invalid/expired
- [ ] **Expired token:** Shows error if token expired

### Form Functionality
- [ ] **New password field:** Password input works
- [ ] **Confirm password field:** Confirm password input works
- [ ] **Validation:** Shows errors
  - [ ] Password empty
  - [ ] Passwords don't match
  - [ ] Password too weak (if implemented)
- [ ] **Submit button:** Submits form
- [ ] **Loading state:** Shows loading spinner
- [ ] **Success:** Password reset successfully
- [ ] **Redirect:** Redirects to login after success

---

## 🎨 UX/UI Checklist

- [ ] **RTL Layout:** Form flows right-to-left
- [ ] **Centered:** Form centered on page
- [ ] **Form styling:** Consistent with design system
- [ ] **Button:** Submit button styled correctly

---

## 🌐 Translation Checklist

- [ ] **Page title:** "إعادة تعيين كلمة المرور" in Arabic
- [ ] **Form labels:** "كلمة المرور الجديدة", "تأكيد كلمة المرور" in Arabic
- [ ] **Button:** "إعادة التعيين" in Arabic
- [ ] **Error messages:** All error messages in Arabic
- [ ] **Success message:** "تم إعادة تعيين كلمة المرور بنجاح" in Arabic

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Full-width form
- [ ] **Tablet:** Constrained width
- [ ] **Desktop:** Constrained width, centered

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper form structure
- [ ] **Labels:** All inputs have labels
- [ ] **ARIA:** Proper ARIA attributes
- [ ] **Keyboard:** Can navigate with keyboard

---

## 🔒 Security Checklist

- [ ] **Token validation:** Validates token server-side
- [ ] **One-time use:** Token invalidated after use
- [ ] **HTTPS:** Served over HTTPS
- [ ] **Password strength:** Validates password strength

---

## 🔗 Navigation Checklist

- [ ] **After reset:** Redirects to `/ar/login`
- [ ] **Login link:** Links to `/ar/login`

---

## ✅ Final Checklist

- [ ] Password reset works correctly
- [ ] Token validation works
- [ ] Error handling works
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Secure

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|       |
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





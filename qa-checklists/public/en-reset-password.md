# QA Checklist: English Reset Password (`/en/reset-password`)

**Page Route:** `/en/reset-password`  
**Component:** `src/app/en/reset-password/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

Same as Arabic version but in English/LTR. Allows customers to reset password using token from email.

---

## ✅ Functionality Checklist

- [ ] Token validation works
- [ ] Password reset works
- [ ] Form validation works
- [ ] Redirects to login after success
- [ ] Error handling works
- [ ] LTR layout correct

---

## 🌐 Translation Checklist

- [ ] **Page title:** "Reset Password" in English
- [ ] **Form labels:** "New Password", "Confirm Password" in English
- [ ] **Button:** "Reset" in English
- [ ] **Error messages:** All error messages in English
- [ ] **Success message:** "Password reset successfully" in English

### LTR Layout
- [ ] Form fields align left
- [ ] Labels align left

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





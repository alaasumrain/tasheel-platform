# QA Checklist: Arabic Forgot Password (`/ar/forgot-password`)

**Page Route:** `/ar/forgot-password`  
**Component:** `src/app/(ar)/forgot-password/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

Allows customers to request password reset email. Critical for account recovery.

---

## ✅ Functionality Checklist

### Form Functionality
- [ ] **Email field:** Email input works
- [ ] **Submit button:** Submits form
- [ ] **Validation:** Shows error if email empty or invalid
- [ ] **Loading state:** Shows loading spinner
- [ ] **Success message:** Shows success message after submission
- [ ] **Error handling:** Shows error if email not found

### Password Reset Flow
- [ ] **Email sent:** Sends password reset email
- [ ] **Success message:** Shows "Check your email" message
- [ ] **No user enumeration:** Same message whether email exists or not
- [ ] **Rate limiting:** Prevents spam (if implemented)

---

## 🎨 UX/UI Checklist

- [ ] **RTL Layout:** Form flows right-to-left
- [ ] **Centered:** Form centered on page
- [ ] **Form styling:** Consistent with design system
- [ ] **Button:** Submit button styled correctly

---

## 🌐 Translation Checklist

- [ ] **Page title:** "نسيت كلمة المرور" in Arabic
- [ ] **Form label:** "البريد الإلكتروني" in Arabic
- [ ] **Button:** "إرسال رابط إعادة التعيين" in Arabic
- [ ] **Success message:** "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني" in Arabic
- [ ] **Error messages:** All error messages in Arabic
- [ ] **Links:** "تذكرت كلمة المرور؟ تسجيل الدخول" in Arabic

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Full-width form
- [ ] **Tablet:** Constrained width
- [ ] **Desktop:** Constrained width, centered

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper form structure
- [ ] **Labels:** Input has label
- [ ] **ARIA:** Proper ARIA attributes
- [ ] **Keyboard:** Can navigate with keyboard

---

## 🔒 Security Checklist

- [ ] **No user enumeration:** Same message for all emails
- [ ] **Rate limiting:** Prevents brute force
- [ ] **HTTPS:** Served over HTTPS

---

## 🔗 Navigation Checklist

- [ ] **Login link:** Links to `/ar/login`
- [ ] **Back button:** Browser back works

---

## ✅ Final Checklist

- [ ] Form works correctly
- [ ] Email sent correctly
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





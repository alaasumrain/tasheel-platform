# QA Checklist: Arabic Customer Profile Settings (`/ar/dashboard/profile`)

**Page Route:** `/ar/dashboard/profile`  
**Component:** `src/app/(ar)/dashboard/profile/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The profile settings page allows customers to update their account information. Customers can:
- Update name
- Update email
- Update phone
- Change password
- Update language preference (if applicable)

---

## ✅ Functionality Checklist

### Form Fields
- [ ] **Name field:** Pre-filled with current name, can update
- [ ] **Email field:** Pre-filled with current email, can update
- [ ] **Phone field:** Pre-filled with current phone, can update
- [ ] **Password fields:** Can change password
  - [ ] Current password field
  - [ ] New password field
  - [ ] Confirm password field

### Form Functionality
- [ ] **Load data:** Current profile data loads correctly
- [ ] **Form validation:** Shows errors for invalid inputs
- [ ] **Submit button:** Saves changes on submit
- [ ] **Loading state:** Shows loading during save
- [ ] **Success message:** Shows success message after save
- [ ] **Error handling:** Shows error message on failure

### Password Change
- [ ] **Current password:** Validates current password
- [ ] **New password:** Validates new password strength
- [ ] **Password match:** Confirms passwords match
- [ ] **Success:** Password changed successfully

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Form flows right-to-left
- [ ] **Dashboard layout:** Uses dashboard layout
- [ ] **Card design:** Form in card with proper styling
- [ ] **Spacing:** Proper spacing between fields

### Form Design
- [ ] **Input fields:** Consistent styling
- [ ] **Labels:** Labels positioned correctly
- [ ] **Button:** Save button styled correctly
- [ ] **Success/error:** Messages styled correctly

---

## 🌐 Translation Checklist

- [ ] **Page title:** "الملف الشخصي" or "الإعدادات" in Arabic
- [ ] **Form labels:** All labels in Arabic
  - [ ] "الاسم الكامل"
  - [ ] "البريد الإلكتروني"
  - [ ] "رقم الهاتف"
  - [ ] "كلمة المرور الحالية"
  - [ ] "كلمة المرور الجديدة"
- [ ] **Button:** "حفظ التغييرات" in Arabic
- [ ] **Success message:** "تم حفظ التغييرات بنجاح" in Arabic
- [ ] **Error messages:** All error messages in Arabic

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Full-width form with padding
- [ ] **Tablet:** Constrained width, centered
- [ ] **Desktop:** Optimal spacing

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper form structure
- [ ] **Labels:** All inputs have labels
- [ ] **ARIA:** Proper ARIA attributes
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Form announced correctly

---

## 🔒 Security Checklist

- [ ] **Authentication:** Requires valid session
- [ ] **Own profile:** Can only update own profile
- [ ] **Password:** Password never exposed
- [ ] **HTTPS:** Served over HTTPS

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1.5s
- [ ] **Data load:** < 1s
- [ ] **Form submission:** < 2s

---

## 🔗 Navigation Checklist

- [ ] **Dashboard:** Links to `/ar/dashboard`
- [ ] **Requests:** Links to `/ar/dashboard/requests`
- [ ] **Sidebar navigation:** All sidebar links work

---

## ✅ Final Checklist

- [ ] Profile loads correctly
- [ ] Form updates work
- [ ] Password change works
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





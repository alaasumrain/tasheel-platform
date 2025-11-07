# QA Checklist: Arabic Contact Page (`/ar/contact`)

**Page Route:** `/ar/contact`  
**Component:** `src/app/(ar)/contact/page.tsx` → `src/components/sections/contact.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The contact page allows customers to submit quote requests and contact Tasheel. It includes:
- Quote request form
- Contact information display
- Visual image/illustration

---

## ✅ Functionality Checklist

### Quote Request Form
- [ ] **Form displays:** Quote request form renders correctly
- [ ] **Service dropdown:** Service selection dropdown works
- [ ] **All fields:** Name, email, phone, message fields work
- [ ] **Form validation:** Shows errors for invalid inputs
- [ ] **Form submission:** Submits successfully
- [ ] **Success redirect:** Redirects to confirmation page after submission
- [ ] **Error handling:** Shows error message on failure

### Page Layout
- [ ] **Two-column layout:** Form left, image right (desktop)
- [ ] **Single column:** Stacks vertically on mobile
- [ ] **Image displays:** Contact image displays correctly
- [ ] **Responsive:** Layout adapts to screen size

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Page flows right-to-left
- [ ] **Grid layout:** Uses Grid2 component correctly
- [ ] **Card styling:** Form card has proper styling (border radius 36px)
- [ ] **Spacing:** Proper spacing between sections
- [ ] **Image aspect ratio:** Image maintains aspect ratio (596/702)

### Form Design
- [ ] **Card background:** Card has correct background color
- [ ] **Card border:** Card has border color
- [ ] **Form fields:** Consistent with design system
- [ ] **Button:** Submit button styled correctly

---

## 🌐 Translation Checklist

- [ ] **Page title:** "اتصل بنا" or equivalent in Arabic
- [ ] **Form title:** "طلب عرض سعر" in Arabic
- [ ] **All form labels:** Translated to Arabic
- [ ] **Button:** "إرسال" or equivalent in Arabic
- [ ] **Error messages:** All error messages in Arabic

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Single column, form above image
- [ ] **Tablet:** Two columns or stacked
- [ ] **Desktop:** Two columns side by side
- [ ] **Image scaling:** Image scales correctly on all sizes

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper structure
- [ ] **Form labels:** All fields have labels
- [ ] **Alt text:** Image has alt text (currently empty - needs fix)
- [ ] **Keyboard:** Can navigate form with keyboard
- [ ] **Focus:** Focus indicators visible

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1.5s
- [ ] **Image load:** Image loads efficiently
- [ ] **Form submission:** < 3s response time

---

## 🔍 SEO Checklist

- [ ] **Title:** "اتصل بنا - Tasheel"
- [ ] **Meta description:** Descriptive Arabic text
- [ ] **H1:** Page has H1 heading

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
| 1 | Image alt text is empty | Medium | | Should have descriptive alt text |

---

## 📝 Notes

_Additional notes:_





# QA Checklist: Quote Request Form Component

**Component:** `src/components/forms/quote-request-form.tsx`  
**Used On:** Contact page, Service quote pages  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Component Purpose

Reusable form component for quote requests. Used on:
- Contact page (`/contact`)
- Service-specific quote pages (`/services/[slug]/quote`)

---

## ✅ Functionality Checklist

### Form Fields
- [ ] **Service dropdown:** Service selection works (if services prop provided)
- [ ] **Name field:** Text input, required
- [ ] **Email field:** Email input, required, validates format
- [ ] **Phone field:** Tel input, required, validates format
- [ ] **Message field:** Textarea, optional
- [ ] **Urgency:** Radio buttons or select
  - [ ] Standard option
  - [ ] Express option
  - [ ] Urgent option

### Form Submission
- [ ] **Validation:** Shows errors for invalid inputs
- [ ] **Submit button:** Submits form
- [ ] **Loading state:** Shows loading spinner
- [ ] **Success:** Redirects to confirmation page
- [ ] **Error handling:** Shows error message on failure

### Service-Specific Behavior
- [ ] **With services prop:** Shows service dropdown
- [ ] **Without services prop:** Hides service dropdown (if on service-specific page)
- [ ] **Pre-filled service:** Service pre-filled on service-specific pages

---

## 🎨 UX/UI Checklist

### Form Design
- [ ] **Input fields:** Consistent styling
- [ ] **Labels:** Labels positioned correctly
- [ ] **Error states:** Error messages styled correctly
- [ ] **Button:** Submit button styled correctly
- [ ] **Spacing:** Proper spacing between fields

### Component Consistency
- [ ] **Same styling:** Same styling whether on contact or service page
- [ ] **Responsive:** Adapts to container width

---

## 🌐 Translation Checklist

- [ ] **Form labels:** All labels translated
- [ ] **Button:** Submit button translated
- [ ] **Error messages:** All error messages translated
- [ ] **Urgency options:** All options translated
- [ ] **Service dropdown:** Service names translated

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Full-width form
- [ ] **Tablet:** Constrained width
- [ ] **Desktop:** Optimal width

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper form structure
- [ ] **Labels:** All inputs have labels
- [ ] **ARIA:** Proper ARIA attributes
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Form announced correctly

---

## ⚡ Performance Checklist

- [ ] **Form render:** Renders quickly
- [ ] **Form submission:** < 3s response time
- [ ] **No layout shift:** No CLS

---

## 🔗 Integration Checklist

- [ ] **Contact page:** Works correctly on contact page
- [ ] **Service pages:** Works correctly on service quote pages
- [ ] **Redirect:** Redirects to confirmation page after submission

---

## ✅ Final Checklist

- [ ] Form works correctly
- [ ] Validation works
- [ ] Submission works
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Works in all contexts

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|       |
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





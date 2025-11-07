# QA Checklist: Arabic Quote Request Form (`/ar/services/[slug]/quote`)

**Page Route:** `/ar/services/[slug]/quote`  
**Component:** `src/app/(ar)/services/[slug]/quote/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The quote request form allows customers to submit service requests. Critical for:
- Service request submission
- Document upload
- Customer information collection
- Order creation

---

## ✅ Functionality Checklist

### Form Fields
- [ ] **Service name:** Pre-filled and read-only (from URL)
- [ ] **Customer name:** Text input, required
- [ ] **Email:** Email input, required, validates format
- [ ] **Phone:** Tel input, required, validates format
- [ ] **Message/Notes:** Textarea, optional
- [ ] **Urgency:** Radio buttons or select
  - [ ] Standard option
  - [ ] Express option
  - [ ] Urgent option
- [ ] **File upload:** File input (if applicable)
  - [ ] Accepts multiple files
  - [ ] Validates file types
  - [ ] Validates file size (max 10MB per file)
  - [ ] Shows file preview/names
  - [ ] Allows file removal

### Form Submission
- [ ] **Validation:** Shows errors for required fields
- [ ] **Submit button:** Submits form on click
- [ ] **Loading state:** Button shows loading spinner
- [ ] **Success:** Redirects to confirmation page
- [ ] **Error handling:** Shows error message on failure
- [ ] **Order number:** Generates unique order number (TSH-YYYYMMDD-XXX)

### Form Behavior
- [ ] **Auto-save:** Saves draft (if implemented)
- [ ] **Clear form:** Reset button works (if implemented)
- [ ] **Cancel:** Cancel button returns to service detail
- [ ] **Enter key:** Submits form (if appropriate)

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Form flows right-to-left
- [ ] **Centered:** Form centered on page
- [ ] **Spacing:** Proper spacing between fields
- [ ] **Visual hierarchy:** Clear title, form sections

### Form Design
- [ ] **Input fields:** Consistent styling
  - [ ] Proper padding
  - [ ] Border radius matches design system
  - [ ] Focus states visible
  - [ ] Error states styled correctly
- [ ] **Labels:** Labels positioned correctly (above or floating)
- [ ] **Placeholders:** Placeholder text helpful
- [ ] **Required indicators:** Asterisk or "مطلوب" for required fields
- [ ] **Field grouping:** Related fields grouped visually

### File Upload UI
- [ ] **Upload area:** Clear drop zone or button
- [ ] **File list:** Shows uploaded files with names
- [ ] **File preview:** Shows preview for images (if applicable)
- [ ] **Remove button:** Easy to remove files
- [ ] **Progress:** Shows upload progress (if applicable)
- [ ] **Size limit:** Shows file size limit clearly

### Button Design
- [ ] **Submit button:**
  - [ ] Primary color (#0E21A0)
  - [ ] Proper size (56px height)
  - [ ] Rounded (50vh border radius)
  - [ ] Full width on mobile
  - [ ] Loading state shows spinner
  - [ ] Disabled when form invalid
- [ ] **Cancel button:** Secondary style, clear

---

## 🌐 Translation Checklist

### Content
- [ ] **Page title:** "طلب عرض سعر" or equivalent
- [ ] **Form labels:** All labels in Arabic
  - [ ] "الاسم الكامل"
  - [ ] "البريد الإلكتروني"
  - [ ] "رقم الهاتف"
  - [ ] "الرسالة" or "ملاحظات"
  - [ ] "الأولوية" or "الاستعجال"
- [ ] **Button:** "إرسال الطلب" in Arabic
- [ ] **Error messages:** All error messages in Arabic
  - [ ] "هذا الحقل مطلوب"
  - [ ] "البريد الإلكتروني غير صحيح"
  - [ ] "رقم الهاتف غير صحيح"
  - [ ] "حجم الملف كبير جداً"
- [ ] **Success message:** "تم إرسال طلبك بنجاح" or equivalent
- [ ] **Urgency options:** "عادي", "عاجل", "فوري" in Arabic

### RTL Layout
- [ ] Form fields align right
- [ ] Labels align right
- [ ] Radio buttons/checkboxes align right
- [ ] File upload area aligns right

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] Form full width with padding
- [ ] Input fields full width
- [ ] Buttons full width
- [ ] File upload area full width
- [ ] Touch targets at least 44x44px
- [ ] Keyboard doesn't cover form
- [ ] Easy to scroll

### Tablet (sm-md)
- [ ] Form constrained width (max 600px)
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
- [ ] **Inputs:** Proper `type` attributes
- [ ] **Button:** `<button type="submit">` not `<div>`
- [ ] **Error messages:** Associated with inputs via `aria-describedby`

### ARIA
- [ ] **Required fields:** `aria-required="true"`
- [ ] **Error states:** `aria-invalid="true"` on invalid inputs
- [ ] **Error messages:** `role="alert"` on error messages
- [ ] **Loading state:** `aria-busy="true"` on button when loading
- [ ] **File upload:** Proper ARIA labels

### Keyboard Navigation
- [ ] **Tab order:** Logical tab order
- [ ] **Focus:** Visible focus indicators
- [ ] **Enter key:** Submits form
- [ ] **File upload:** Keyboard accessible

---

## 🔒 Security Checklist

### Input Validation
- [ ] **Email:** Validates email format
- [ ] **Phone:** Validates phone format
- [ ] **File types:** Only allows allowed file types
- [ ] **File size:** Enforces size limits
- [ ] **XSS:** Inputs sanitized
- [ ] **SQL injection:** Protected (handled by Supabase)

### File Upload Security
- [ ] **File type validation:** Server-side validation
- [ ] **File size validation:** Server-side validation
- [ ] **Virus scanning:** If implemented
- [ ] **Secure storage:** Files stored securely in Supabase Storage

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1s
- [ ] **Form submission:** Response < 3s
- [ ] **File upload:** Progress indicator, doesn't block UI
- [ ] **No layout shift:** No CLS on load
- [ ] **Smooth animations:** Form transitions smooth

---

## 🐛 Error Handling Checklist

### Form Errors
- [ ] **Empty required fields:** Shows error message
- [ ] **Invalid email:** Shows format error
- [ ] **Invalid phone:** Shows format error
- [ ] **File too large:** Shows size error
- [ ] **Invalid file type:** Shows type error
- [ ] **Network error:** Shows connection error
- [ ] **Server error:** Shows generic error

### Edge Cases
- [ ] **Very long text:** Handles gracefully
- [ ] **Special characters:** Handles in all fields
- [ ] **Multiple files:** Handles multiple uploads
- [ ] **Large files:** Shows appropriate error
- [ ] **Network interruption:** Handles gracefully

---

## 🔗 Navigation Checklist

- [ ] **Back to service:** Link works correctly
- [ ] **Cancel button:** Returns to service detail
- [ ] **After submission:** Redirects to confirmation page
- [ ] **Language switcher:** Switches to English version
- [ ] **Header navigation:** Links work

---

## 🎭 Theme Checklist

- [ ] **Light mode:** Form readable, proper contrast
- [ ] **Dark mode:** Form readable, proper contrast
- [ ] **Input fields:** Visible in both themes
- [ ] **Buttons:** Proper contrast in both themes
- [ ] **File upload area:** Visible in both themes

---

## ✅ Final Checklist

- [ ] Form submits correctly
- [ ] File upload works
- [ ] Validation works
- [ ] Error handling works
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





# QA Checklist: Arabic Track Order (`/ar/track`)

**Page Route:** `/ar/track`  
**Component:** `src/app/(ar)/track/page.tsx` → `src/components/sections/track.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The track order page allows customers to track their order status by order number. Critical for:
- Order status lookup
- Timeline display
- Status updates visibility

---

## ✅ Functionality Checklist

### Order Search
- [ ] **Search input:** Order number input field works
- [ ] **Search button:** Search button triggers lookup
- [ ] **Enter key:** Enter key triggers search
- [ ] **URL parameter:** Auto-loads order if `?order=TSH-XXX` in URL
- [ ] **Validation:** Shows error if order number empty
- [ ] **Loading state:** Shows loading spinner during search

### Order Display
- [ ] **Order found:** Displays order information correctly
  - [ ] Order number
  - [ ] Service name
  - [ ] Current status
  - [ ] Customer information
- [ ] **Status badge:** Status displayed with color-coded badge
- [ ] **Timeline:** Shows order timeline/events
  - [ ] Event types display correctly
  - [ ] Event dates display correctly
  - [ ] Event notes display correctly
- [ ] **Status colors:** Status colors match design system
  - [ ] draft: #9E9E9E (gray)
  - [ ] submitted: #2196F3 (blue)
  - [ ] scoping: #FF9800 (orange)
  - [ ] quote_sent: #9C27B0 (purple)
  - [ ] in_progress: #FFC107 (yellow)
  - [ ] review: #00BCD4 (cyan)
  - [ ] completed: #4CAF50 (green)
  - [ ] archived: #607D8B (blue-gray)
  - [ ] rejected: #F44336 (red)
  - [ ] cancelled: #757575 (gray)

### Error Handling
- [ ] **Order not found:** Shows "Order not found" message
- [ ] **Network error:** Shows connection error message
- [ ] **Empty search:** Shows validation error
- [ ] **Error messages:** All error messages in Arabic

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Page flows right-to-left
- [ ] **Centered:** Search form centered
- [ ] **Card design:** Order info displayed in card
- [ ] **Timeline:** Timeline displays clearly
- [ ] **Spacing:** Proper spacing between elements

### Visual Design
- [ ] **Status badges:** Color-coded chips display correctly
- [ ] **Icons:** Status icons display (if applicable)
- [ ] **Typography:** Clear, readable text
- [ ] **Empty state:** Friendly empty state message

---

## 🌐 Translation Checklist

- [ ] **Page title:** "تتبع الطلب" or equivalent
- [ ] **Search label:** "رقم الطلب" in Arabic
- [ ] **Search button:** "تتبع" or "بحث" in Arabic
- [ ] **Status labels:** All status labels translated
  - [ ] "مسودة", "مقدم", "قيد المراجعة", etc.
- [ ] **Error messages:** All error messages in Arabic
- [ ] **Timeline labels:** Timeline labels in Arabic

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Single column, full-width search
- [ ] **Tablet:** Centered search, readable timeline
- [ ] **Desktop:** Optimal spacing, clear layout

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper form structure
- [ ] **Labels:** Input has label
- [ ] **ARIA:** Proper ARIA attributes
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Status announced correctly

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1s
- [ ] **Search response:** < 2s
- [ ] **Smooth updates:** No janky updates

---

## 🔍 SEO Checklist

- [ ] **Title:** "تتبع الطلب - Tasheel"
- [ ] **Meta description:** Descriptive Arabic text
- [ ] **H1:** Page has H1 heading

---

## 🔗 URL Parameters

- [ ] **Order param:** `?order=TSH-XXX` auto-loads order
- [ ] **Preserves param:** Language switch preserves order param
- [ ] **Deep link:** Direct URLs work correctly

---

## ✅ Final Checklist

- [ ] Search works correctly
- [ ] Order display works
- [ ] Timeline displays correctly
- [ ] Status colors correct
- [ ] Error handling works
- [ ] URL parameters work
- [ ] Responsive on all devices
- [ ] Accessible

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





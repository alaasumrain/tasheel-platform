# QA Checklist: Arabic Service Detail (`/ar/services/[slug]`)

**Page Route:** `/ar/services/[slug]`  
**Component:** `src/app/(ar)/services/[slug]/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The service detail page provides comprehensive information about a specific service. Users can:
- View full service description
- See pricing and turnaround time
- View required documents
- See process steps
- Request a quote
- Navigate to related services

---

## ✅ Functionality Checklist

### Core Features
- [ ] Page loads with correct service data from database
- [ ] Service slug matches URL parameter
- [ ] All service information displays correctly:
  - [ ] Service name (Arabic)
  - [ ] Service name (English) - if bilingual display
  - [ ] Full description
  - [ ] Short description
  - [ ] Pricing information
  - [ ] Turnaround time
  - [ ] Required documents list
  - [ ] Process steps
  - [ ] Category badge
- [ ] "Request Quote" button links to `/ar/services/[slug]/quote`
- [ ] Related services section displays (if implemented)
- [ ] Breadcrumbs display correctly: "الرئيسية > الخدمات > [Service Name]"

### Dynamic Content
- [ ] Different services load correctly (test with multiple slugs)
- [ ] 404 page shows for invalid service slug
- [ ] Loading state while fetching service data
- [ ] Error state if service fetch fails

### Interactive Elements
- [ ] Process steps expand/collapse (if accordion)
- [ ] Required documents checklist interactive (if implemented)
- [ ] Share buttons work (if implemented)
- [ ] Print button works (if implemented)

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Page flows right-to-left
- [ ] **Two-column layout:** Service info left, quote sidebar right (desktop)
- [ ] **Single column:** Stacks vertically on mobile
- [ ] **Sticky sidebar:** Quote sidebar sticks on scroll (if implemented)

### Service Information Display
- [ ] **Hero section:** Service name prominent, clear
- [ ] **Description:** Readable, proper line height
- [ ] **Pricing card:** Clear, prominent pricing display
- [ ] **Required documents:** Easy to scan list
- [ ] **Process steps:** Visual step indicators
- [ ] **Category badge:** Color-coded or styled consistently

### Quote Sidebar
- [ ] **Sticky:** Stays visible on scroll (desktop)
- [ ] **Pricing:** Clear pricing display
- [ ] **Turnaround:** Clear turnaround time
- [ ] **CTA button:** Prominent "Request Quote" button
- [ ] **Mobile:** Moves to bottom or separate section on mobile

### Typography
- [ ] **H1:** Service name uses h1 (4rem)
- [ ] **H2:** Section headings use h2 (3rem)
- [ ] **Body:** Readable font size (16-18px)
- [ ] **Arabic font:** Tajawal or similar renders correctly

---

## 🌐 Translation Checklist

### Content
- [ ] **Service name:** Arabic name displays
- [ ] **Description:** Full Arabic description
- [ ] **Section headings:** "الوصف", "المستندات المطلوبة", "خطوات العملية" in Arabic
- [ ] **Pricing label:** "السعر" or equivalent
- [ ] **Turnaround label:** "مدة التنفيذ" or equivalent
- [ ] **Button:** "اطلب عرض سعر" in Arabic
- [ ] **Breadcrumbs:** All breadcrumb text in Arabic
- [ ] **Related services:** "خدمات ذات صلة" in Arabic

### RTL Layout
- [ ] Content aligns right
- [ ] Sidebar positioned correctly for RTL
- [ ] Icons positioned correctly
- [ ] Process steps flow right-to-left

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] Single column layout
- [ ] Service info stacks vertically
- [ ] Quote sidebar moves to bottom or separate section
- [ ] Images scale to fit viewport
- [ ] Process steps stack vertically
- [ ] Touch targets at least 44x44px

### Tablet (sm-md)
- [ ] Two-column layout possible
- [ ] Quote sidebar may be below content
- [ ] Comfortable spacing

### Desktop (lg+)
- [ ] Two-column layout (content + sidebar)
- [ ] Quote sidebar sticky
- [ ] Optimal use of screen space
- [ ] Related services in grid

---

## ⚡ Performance Checklist

- [ ] Service data loads quickly (< 1s)
- [ ] Images lazy load
- [ ] Smooth scrolling
- [ ] No layout shift on load
- [ ] Related services load efficiently

---

## 🔍 SEO Checklist

- [ ] **Title:** Service name in title tag
- [ ] **Meta description:** Service description in meta tag
- [ ] **H1:** Single H1 with service name
- [ ] **Structured data:** Service schema markup (if implemented)
- [ ] **URL:** Clean slug-based URL
- [ ] **Canonical:** Canonical URL set

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper use of `<article>`, `<section>`
- [ ] **Headings:** Proper hierarchy
- [ ] **Alt text:** Service images have alt text
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Content announced correctly
- [ ] **Focus:** Focus indicators visible

---

## 🔗 Navigation Checklist

- [ ] **Breadcrumbs:** Links work correctly
- [ ] **Back button:** Browser back works
- [ ] **Related services:** Links to other services work
- [ ] **Request quote:** Links to quote page
- [ ] **Header navigation:** Links work

---

## 🎭 Theme Checklist

- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Pricing card readable in both themes
- [ ] Process steps visible in both themes

---

## ✅ Final Checklist

- [ ] Service information displays correctly
- [ ] Quote sidebar works
- [ ] Responsive on all devices
- [ ] Performance acceptable
- [ ] Accessibility passed

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





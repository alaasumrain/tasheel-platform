# QA Checklist: Arabic Services Listing (`/ar/services`)

**Page Route:** `/ar/services`  
**Component:** `src/app/(ar)/services/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The services listing page displays all available services. Users can:
- Browse all services
- Filter by category
- Search for specific services
- View service details
- Request quotes

---

## ✅ Functionality Checklist

### Core Features
- [ ] Page loads and displays services from database
- [ ] Services grid/list view displays correctly
- [ ] Search functionality works
  - [ ] Search by service name (Arabic)
  - [ ] Search by service name (English)
  - [ ] Search results update in real-time
  - [ ] Empty search shows all services
- [ ] Category filters work
  - [ ] Filter by "Translation" (ترجمة)
  - [ ] Filter by "Government" (حكومي)
  - [ ] Filter by "Legalization" (تصديق)
  - [ ] Filter by "Business" (أعمال)
  - [ ] "All" filter shows all services
  - [ ] Multiple filters can be combined
- [ ] Service cards link to detail pages (`/ar/services/[slug]`)
- [ ] Pagination works (if implemented)
- [ ] Sort functionality works (if implemented)

### Service Card Display
- [ ] Each card shows:
  - [ ] Service icon/image
  - [ ] Service name (Arabic)
  - [ ] Service name (English) - if bilingual display
  - [ ] Short description
  - [ ] Price or "Request Quote"
  - [ ] Turnaround time
  - [ ] Category badge
- [ ] Cards are clickable
- [ ] Hover effect on cards
- [ ] Cards maintain aspect ratio

### Empty States
- [ ] No services found message (if search returns empty)
- [ ] Loading state while fetching services
- [ ] Error state if API fails

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Page flows right-to-left
- [ ] **Grid:** Services display in grid (3 columns desktop, 2 tablet, 1 mobile)
- [ ] **Spacing:** Consistent spacing between cards
- [ ] **Alignment:** Cards align properly in grid

### Search & Filter UI
- [ ] **Search bar:** Prominent, easy to find
- [ ] **Search icon:** Search icon visible
- [ ] **Filter buttons:** Category filters clearly visible
- [ ] **Active filter:** Active filter highlighted
- [ ] **Filter count:** Shows number of results (if implemented)
- [ ] **Clear filters:** Easy way to clear all filters

### Service Cards
- [ ] **Consistent design:** All cards same size/style
- [ ] **Hover state:** Cards lift/shadow on hover
- [ ] **Click target:** Entire card is clickable
- [ ] **Visual hierarchy:** Important info (name, price) prominent
- [ ] **Category badges:** Color-coded or styled consistently

### Typography
- [ ] **Page title:** Large, clear heading
- [ ] **Service names:** Readable, proper font size
- [ ] **Descriptions:** Appropriate font size, not too small
- [ ] **Arabic font:** Tajawal or similar renders correctly

---

## 🌐 Translation Checklist

### Content
- [ ] **Page title:** "خدماتنا" or equivalent
- [ ] **Search placeholder:** "ابحث عن خدمة..." in Arabic
- [ ] **Category labels:** All categories in Arabic
- [ ] **Service names:** Display Arabic names
- [ ] **Service descriptions:** Arabic descriptions
- [ ] **Buttons:** "عرض التفاصيل" or equivalent
- [ ] **Empty state:** "لا توجد خدمات" message in Arabic
- [ ] **Filter labels:** "الكل", "ترجمة", etc. in Arabic

### RTL Layout
- [ ] Search bar aligns right
- [ ] Filter buttons align right
- [ ] Service cards flow right-to-left
- [ ] Icons positioned correctly for RTL

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] Single column layout
- [ ] Search bar full width
- [ ] Filters scroll horizontally or stack
- [ ] Service cards stack vertically
- [ ] Touch targets at least 44x44px
- [ ] Easy to scroll through services

### Tablet (sm-md)
- [ ] 2-column grid for services
- [ ] Search and filters visible
- [ ] Comfortable spacing

### Desktop (lg+)
- [ ] 3-column grid for services
- [ ] Search bar prominent
- [ ] Filters in sidebar or horizontal bar
- [ ] Optimal use of screen space

---

## ⚡ Performance Checklist

### Loading
- [ ] Services load quickly (< 1s)
- [ ] Images lazy load
- [ ] Smooth scrolling
- [ ] Search doesn't lag

### Optimization
- [ ] Pagination or virtual scrolling for many services
- [ ] Images optimized (WebP/AVIF)
- [ ] Minimal API calls

---

## 🔍 SEO Checklist

- [ ] **Title:** "خدماتنا - Tasheel" or similar
- [ ] **Meta description:** Descriptive Arabic text
- [ ] **H1:** "خدماتنا" or equivalent
- [ ] **URL:** Clean URL `/ar/services`
- [ ] **Structured data:** Service schema markup (if applicable)

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper use of `<main>`, `<section>`, `<article>`
- [ ] **Headings:** Proper hierarchy
- [ ] **Alt text:** Service images have alt text
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Search and filters announced correctly
- [ ] **Focus:** Focus indicators visible

---

## 🔗 Navigation Checklist

- [ ] **Breadcrumbs:** "الرئيسية > الخدمات" (if implemented)
- [ ] **Back button:** Browser back works
- [ ] **Service links:** Links to detail pages work
- [ ] **Header navigation:** Links to other pages work

---

## 🎭 Theme Checklist

- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Service cards readable in both themes
- [ ] Category badges visible in both themes

---

## 🐛 Error Handling Checklist

- [ ] **API error:** Shows user-friendly error message
- [ ] **No services:** Shows empty state message
- [ ] **Search no results:** Shows "no results" message
- [ ] **Network error:** Handles gracefully

---

## ✅ Final Checklist

- [ ] All services display correctly
- [ ] Search works in Arabic and English
- [ ] Filters work correctly
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





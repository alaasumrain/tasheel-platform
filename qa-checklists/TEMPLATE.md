# QA Checklist Template

**Use this template to create checklists for remaining pages.**

**Page Route:** `/[locale]/[page-path]`  
**Component:** `src/app/[locale]/[page-path]/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

_[Describe what this page does and its role in the user journey]_

---

## ✅ Functionality Checklist

### Core Features
- [ ] Page loads without errors
- [ ] All main features work correctly
- [ ] Interactive elements respond to clicks
- [ ] Forms submit correctly (if applicable)
- [ ] Data displays correctly (if applicable)

### Specific Features
_[List page-specific features to test]_

---

## 🎨 UX/UI Checklist

### Visual Design
- [ ] **Layout:** Correct layout (RTL for Arabic, LTR for English)
- [ ] **Spacing:** Consistent spacing between elements
- [ ] **Typography:** Proper font sizes and hierarchy
- [ ] **Colors:** Matches design system
- [ ] **Contrast:** Sufficient contrast for readability
- [ ] **Images:** All images load and have alt text
- [ ] **Icons:** Consistent icon style and size

### Component Consistency
- [ ] **Buttons:** All buttons use same style
  - [ ] Primary buttons: `contained` variant, primary color
  - [ ] Secondary buttons: `outlined` or `text` variant
  - [ ] Button height: 56px (sizeMedium)
  - [ ] Button border radius: 50vh
  - [ ] Button text transform: none
- [ ] **Cards:** Consistent card styling (if applicable)
- [ ] **Forms:** Consistent form field styling (if applicable)
- [ ] **Typography:** Proper heading hierarchy

### Animations & Transitions
- [ ] **Page load:** Smooth fade-in (if implemented)
- [ ] **Scroll animations:** Sections reveal on scroll (if implemented)
- [ ] **Hover effects:** Smooth hover transitions
- [ ] **No janky animations:** All animations run at 60fps

---

## 🌐 Translation & Localization Checklist

### Content Translation
- [ ] **All text:** Translated to appropriate language
- [ ] **Headings:** All headings translated
- [ ] **Body text:** All paragraphs translated
- [ ] **Buttons:** All button labels translated
- [ ] **Form labels:** All form labels translated (if applicable)
- [ ] **Error messages:** All error messages translated
- [ ] **No mixed languages:** No untranslated text visible

### Layout Direction
- [ ] **Arabic pages:** RTL layout (`dir="rtl"`)
- [ ] **English pages:** LTR layout (`dir="ltr"`)
- [ ] **Text alignment:** Correct alignment for language
- [ ] **Icons:** Positioned correctly for layout direction
- [ ] **Spacing:** Margin/padding adjusted for layout direction

### Language Switcher
- [ ] **Visibility:** Language switcher visible (if applicable)
- [ ] **Current language:** Shows active language
- [ ] **Switch works:** Clicking switches to other language
- [ ] **URL preservation:** Query params preserved on switch
- [ ] **No flash:** No layout flash during switch

---

## 📱 Responsive Design Checklist

### Mobile (xs: 0-599px)
- [ ] **Layout:** Single column layout
- [ ] **Navigation:** Hamburger menu (if applicable)
- [ ] **Typography:** Font sizes scale appropriately
- [ ] **Buttons:** Full-width buttons (if appropriate)
- [ ] **Spacing:** Reduced padding/margins
- [ ] **Images:** Images scale to fit viewport
- [ ] **Touch targets:** At least 44x44px

### Tablet (sm-md: 600-1317px)
- [ ] **Layout:** 2-column grid where appropriate
- [ ] **Navigation:** Collapsible or horizontal menu
- [ ] **Typography:** Medium font sizes
- [ ] **Spacing:** Moderate padding/margins

### Desktop (lg+: 1318px+)
- [ ] **Layout:** Multi-column grid where appropriate
- [ ] **Navigation:** Full horizontal navigation
- [ ] **Spacing:** Full padding/margins
- [ ] **Typography:** Full font sizes
- [ ] **Max width:** Content constrained to max-width container

### Breakpoint Testing
- [ ] Test at 375px (iPhone SE)
- [ ] Test at 768px (iPad)
- [ ] Test at 1024px (iPad Pro)
- [ ] Test at 1318px (Desktop breakpoint)
- [ ] Test at 1920px (Large desktop)

---

## ♿ Accessibility Checklist

### Semantic HTML
- [ ] **HTML lang:** `<html lang="[ar|en]" dir="[rtl|ltr]">` set correctly
- [ ] **Headings:** Proper heading hierarchy (h1 → h2 → h3)
- [ ] **Landmarks:** Proper use of `<header>`, `<main>`, `<footer>`, `<nav>`
- [ ] **Lists:** Use `<ul>` or `<ol>` for lists
- [ ] **Buttons:** Use `<button>` not `<div>` for buttons
- [ ] **Links:** Use `<a>` with proper href attributes

### ARIA & Screen Readers
- [ ] **Alt text:** All images have descriptive alt text
- [ ] **ARIA labels:** Buttons without visible text have aria-label
- [ ] **ARIA landmarks:** Navigation has `role="navigation"`
- [ ] **Skip links:** Skip to main content link (if implemented)
- [ ] **Focus indicators:** All interactive elements have visible focus states

### Keyboard Navigation
- [ ] **Tab order:** Logical tab order through page
- [ ] **Focus visible:** Focus indicators visible on all elements
- [ ] **Keyboard shortcuts:** No keyboard shortcuts conflict with browser
- [ ] **Modal/overlay:** Can close with Escape key (if applicable)

### Color & Contrast
- [ ] **Text contrast:** Minimum 4.5:1 for normal text
- [ ] **Large text:** Minimum 3:1 for large text (18px+)
- [ ] **Interactive elements:** 3:1 contrast for buttons/links
- [ ] **Not color-only:** Information not conveyed by color alone

---

## ⚡ Performance Checklist

### Loading Performance
- [ ] **First Contentful Paint:** < 1.5s
- [ ] **Largest Contentful Paint:** < 2.5s
- [ ] **Time to Interactive:** < 3.5s
- [ ] **Total page load:** < 3s on 3G connection
- [ ] **Images optimized:** Images use WebP/AVIF formats
- [ ] **Lazy loading:** Images below fold lazy load
- [ ] **Font loading:** Fonts load efficiently (font-display: swap)

### Runtime Performance
- [ ] **No layout shift:** Cumulative Layout Shift < 0.1
- [ ] **Smooth scrolling:** 60fps scrolling
- [ ] **No jank:** Animations run smoothly
- [ ] **Memory:** No memory leaks on navigation

### Network
- [ ] **API calls:** Minimal API calls on page load
- [ ] **Caching:** Static assets cached properly
- [ ] **CDN:** Assets served from CDN (if applicable)

---

## 🔍 SEO Checklist

### Meta Tags
- [ ] **Title:** `<title>` tag in appropriate language, descriptive
- [ ] **Description:** `<meta name="description">` in appropriate language
- [ ] **OG tags:** Open Graph tags present
  - [ ] `og:title`
  - [ ] `og:description`
  - [ ] `og:image`
  - [ ] `og:url`
  - [ ] `og:type`
- [ ] **Twitter cards:** Twitter card meta tags (if applicable)
- [ ] **Canonical:** Canonical URL set correctly

### Content SEO
- [ ] **H1:** Single H1 tag with main keyword
- [ ] **Headings:** Proper heading hierarchy
- [ ] **Keywords:** Relevant keywords in content (natural, not stuffed)
- [ ] **Alt text:** Images have SEO-friendly alt text
- [ ] **Internal links:** Links to other pages on site
- [ ] **URL structure:** Clean, readable URLs

### Technical SEO
- [ ] **Sitemap:** Page included in sitemap.xml
- [ ] **Robots:** robots.txt allows indexing (or blocks if login page)
- [ ] **Structured data:** Schema.org markup (if applicable)
- [ ] **HTTPS:** Page served over HTTPS
- [ ] **Mobile-friendly:** Google Mobile-Friendly test passes

---

## 🐛 Error Handling Checklist

### Error States
- [ ] **404 errors:** Custom 404 page (if applicable)
- [ ] **500 errors:** Graceful error handling
- [ ] **Network errors:** User-friendly error messages
- [ ] **Form errors:** Validation errors display correctly (if applicable)
- [ ] **Loading errors:** Fallback content if data fails to load

### Edge Cases
- [ ] **Empty states:** Empty data shows message (if applicable)
- [ ] **No data:** Sections handle missing data gracefully
- [ ] **Long content:** Long text doesn't break layout
- [ ] **Special characters:** Special characters render correctly

---

## 🔗 Navigation & Links Checklist

### Internal Navigation
- [ ] **Header links:** All header navigation links work
- [ ] **Footer links:** All footer links work
- [ ] **Breadcrumbs:** Breadcrumbs accurate (if present)
- [ ] **Back button:** Browser back button works
- [ ] **Deep links:** Direct URLs work

### External Links
- [ ] **Social media:** Social links open in new tab
- [ ] **External sites:** External links have `rel="noopener"`
- [ ] **WhatsApp:** WhatsApp links work correctly

---

## 🎭 Theme & Dark Mode Checklist

### Light Mode
- [ ] **Background:** Light background color (#E7E9F6)
- [ ] **Text:** Dark text color (#10101E)
- [ ] **Buttons:** Proper contrast in light mode
- [ ] **Images:** Light mode images display correctly

### Dark Mode
- [ ] **Background:** Dark background color (#111111)
- [ ] **Text:** Light text color (#FFFFFF)
- [ ] **Buttons:** Proper contrast in dark mode
- [ ] **Images:** Dark mode images/logo display correctly
- [ ] **Theme toggle:** Smooth transition between modes

### Theme Persistence
- [ ] **Saves preference:** Theme preference saved in localStorage
- [ ] **Loads preference:** Theme loads on page refresh
- [ ] **No flash:** No flash of wrong theme on load

---

## 📝 Content Checklist

### Accuracy
- [ ] **Content:** All content accurate and up-to-date
- [ ] **No placeholders:** No "Lorem ipsum" or placeholder text
- [ ] **No broken images:** All images load correctly
- [ ] **No missing translations:** All text translated

### Completeness
- [ ] **All sections:** All planned sections present
- [ ] **No broken links:** All links work
- [ ] **No 404s:** No broken internal links

---

## ✅ Final Checklist

### Pre-Launch
- [ ] All critical issues fixed
- [ ] All high-priority issues fixed
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Tested on iOS and Android
- [ ] Performance metrics acceptable
- [ ] Accessibility audit passed
- [ ] SEO audit passed
- [ ] Content reviewed and approved

### Sign-off
- [ ] **Developer:** ___________ Date: ___________
- [ ] **Designer:** ___________ Date: ___________
- [ ] **QA:** ___________ Date: ___________
- [ ] **Product Owner:** ___________ Date: ___________

---

## 📸 Screenshots

**Mobile View:** [Attach screenshot]  
**Tablet View:** [Attach screenshot]  
**Desktop View:** [Attach screenshot]  
**Dark Mode:** [Attach screenshot]

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## 📝 Notes

_Additional notes, observations, or recommendations:_





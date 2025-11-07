# QA Checklist: Arabic Homepage (`/ar/`)

**Page Route:** `/ar/`  
**Component:** `src/app/(ar)/page.tsx`  
**Last Tested:** 2025-01-27  
**Tester:** AI QA Assistant  
**Status:** 🟡 In Progress

---

## 🎯 Page Purpose

The homepage is the first impression of Tasheel platform. It should:
- Clearly communicate what Tasheel does (government services concierge)
- Showcase key services
- Build trust through testimonials and stats
- Guide users to request services or browse catalog
- Work flawlessly in Arabic (RTL layout)

---

## ✅ Functionality Checklist

### Core Features
- [ ] Page loads without errors
- [ ] All sections render correctly
- [ ] Hero section displays with correct content
- [ ] Services catalog preview shows 6+ services
- [ ] Partners/logos section displays (if applicable)
- [ ] Features grid displays 3+ features
- [ ] Testimonials/reviews section displays
- [ ] Video section plays correctly (if present)
- [ ] Process steps section displays
- [ ] FAQ accordion expands/collapses
- [ ] Footer displays with all links

### Interactive Elements
- [ ] "Request Service" button links to `/ar/services`
- [ ] "Browse Services" button links to `/ar/services`
- [ ] Service cards link to `/ar/services/[slug]`
- [ ] All footer links work correctly
- [ ] Social media links open in new tab
- [ ] WhatsApp button opens WhatsApp chat
- [ ] Language switcher toggles to English (`/en/`)
- [ ] Theme toggle switches between light/dark mode

### Forms & CTAs
- [ ] Newsletter subscription form works (if present)
- [ ] Contact form accessible from footer
- [ ] All CTAs have proper hover states
- [ ] Buttons show loading states when clicked (if applicable)

---

## 🎨 UX/UI Checklist

### Visual Design
- [ ] **Layout:** RTL (right-to-left) layout applied correctly
- [ ] **Spacing:** Consistent spacing between sections (check theme spacing scale)
- [ ] **Typography:** Arabic font (Tajawal or similar) renders correctly
- [ ] **Colors:** Primary color (#0E21A0) used consistently
- [ ] **Accent color:** Accent color (#FF4B91) used for CTAs
- [ ] **Contrast:** Text has sufficient contrast (WCAG AA minimum)
- [ ] **Images:** All images load and have proper alt text
- [ ] **Icons:** Icons are consistent in style and size

### Component Consistency
- [ ] **Buttons:** All buttons use same style (rounded, proper padding, shadow)
  - [ ] Primary buttons: `contained` variant, primary color
  - [ ] Secondary buttons: `outlined` or `text` variant
  - [ ] Button height: 56px (sizeMedium)
  - [ ] Button border radius: 50vh (pill shape)
  - [ ] Button text transform: none (not uppercase)
- [ ] **Cards:** Service cards have consistent styling
  - [ ] Same padding
  - [ ] Same border radius
  - [ ] Same shadow/elevation
  - [ ] Same hover effects
- [ ] **Typography:** Headings follow hierarchy
  - [ ] H1: 4rem (page title)
  - [ ] H2: 3rem (section headers)
  - [ ] H3: 2.5rem (card titles)
  - [ ] Body text: Proper font weight (500-600)

### Animations & Transitions
- [ ] **Page load:** Smooth fade-in animation (if implemented)
- [ ] **Scroll animations:** Sections reveal on scroll (if implemented)
- [ ] **Hover effects:** Buttons have smooth hover transitions
- [ ] **Card hover:** Service cards have hover lift/shadow effect
- [ ] **FAQ accordion:** Smooth expand/collapse animation
- [ ] **No janky animations:** All animations run at 60fps

---

## 🌐 Translation & Localization Checklist

### Content Translation
- [ ] **Hero section:** All text in Arabic
- [ ] **Headings:** All section headings translated
- [ ] **Body text:** All paragraphs in Arabic
- [ ] **Buttons:** All button labels translated
  - [ ] "Request Service" → "اطلب الخدمة"
  - [ ] "Browse Services" → "تصفح الخدمات"
  - [ ] "Learn More" → "اعرف المزيد"
- [ ] **Navigation:** Header links in Arabic
- [ ] **Footer:** Footer content in Arabic
- [ ] **Form labels:** All form labels in Arabic
- [ ] **Error messages:** Error messages in Arabic (if any)

### RTL Layout
- [ ] **Text direction:** `dir="rtl"` applied to HTML
- [ ] **Text alignment:** Text aligns right
- [ ] **Icons:** Icons positioned correctly (e.g., arrow icons flip)
- [ ] **Navigation:** Menu items align right
- [ ] **Forms:** Form fields align right
- [ ] **Cards:** Card content flows right-to-left
- [ ] **Spacing:** Margin/padding adjusted for RTL
  - [ ] `marginLeft` → `marginRight` where needed
  - [ ] `paddingLeft` → `paddingRight` where needed

### Language Switcher
- [ ] **Visibility:** Language switcher visible in header
- [ ] **Current language:** Shows "العربية" or "AR" as active
- [ ] **Switch to English:** Clicking switches to `/en/`
- [ ] **URL preservation:** Query params preserved on switch
- [ ] **No flash:** No LTR/RTL flash during switch

---

## 📱 Responsive Design Checklist

### Mobile (xs: 0-599px)
- [ ] **Layout:** Single column layout
- [ ] **Header:** Hamburger menu displays
- [ ] **Hero:** Hero section stacks vertically
- [ ] **Services:** Service cards stack (1 per row)
- [ ] **Typography:** Font sizes scale appropriately
- [ ] **Buttons:** Full-width buttons on mobile
- [ ] **Spacing:** Reduced padding/margins
- [ ] **Images:** Images scale to fit viewport
- [ ] **Navigation:** Mobile menu works correctly
- [ ] **Footer:** Footer stacks vertically

### Tablet (sm-md: 600-1317px)
- [ ] **Layout:** 2-column grid where appropriate
- [ ] **Services:** 2 service cards per row
- [ ] **Navigation:** Collapsible sidebar or horizontal menu
- [ ] **Typography:** Medium font sizes
- [ ] **Spacing:** Moderate padding/margins

### Desktop (lg+: 1318px+)
- [ ] **Layout:** 3-column grid for services
- [ ] **Navigation:** Full horizontal navigation visible
- [ ] **Spacing:** Full padding/margins applied
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
- [ ] **HTML lang:** `<html lang="ar" dir="rtl">` set correctly
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
- [ ] **Title:** `<title>` tag in Arabic, descriptive
- [ ] **Description:** `<meta name="description">` in Arabic
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
- [ ] **Robots:** robots.txt allows indexing
- [ ] **Structured data:** Schema.org markup (if applicable)
- [ ] **HTTPS:** Page served over HTTPS
- [ ] **Mobile-friendly:** Google Mobile-Friendly test passes

---

## 🐛 Error Handling Checklist

### Error States
- [ ] **404 errors:** Custom 404 page (if applicable)
- [ ] **500 errors:** Graceful error handling
- [ ] **Network errors:** User-friendly error messages
- [ ] **Form errors:** Validation errors display correctly
- [ ] **Loading errors:** Fallback content if data fails to load

### Edge Cases
- [ ] **Empty states:** Empty service catalog shows message
- [ ] **No data:** Sections handle missing data gracefully
- [ ] **Long content:** Long text doesn't break layout
- [ ] **Special characters:** Arabic special characters render correctly

---

## 🔗 Navigation & Links Checklist

### Internal Navigation
- [ ] **Header links:** All header navigation links work
- [ ] **Footer links:** All footer links work
- [ ] **Breadcrumbs:** Breadcrumbs accurate (if present)
- [ ] **Back button:** Browser back button works
- [ ] **Deep links:** Direct URLs work (e.g., `/ar/#services`)

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
- [ ] **Company info:** Company name, address, contact correct
- [ ] **Service descriptions:** Service descriptions accurate
- [ ] **Pricing:** Pricing information correct (if displayed)
- [ ] **Contact info:** Phone, email, address correct
- [ ] **Social links:** Social media links correct

### Completeness
- [ ] **All sections:** All planned sections present
- [ ] **No placeholders:** No "Lorem ipsum" or placeholder text
- [ ] **No broken images:** All images load correctly
- [ ] **No missing translations:** All text translated

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
| 1 | HTML lang/dir set client-side causing flash | High | 🟡 Found | `LocaleHtmlAttributes` uses useEffect to set lang/dir, causing LTR/RTL flash on load. Should be set server-side in layout. |
| 2 | Language switcher may lose query params | Medium | 🟡 Found | Language switcher uses `router.push()` which may not preserve query parameters. Need to verify `?order=TSH-XXX` preservation. |
| 3 | Get Started button hard-coded English label | Medium | 🟡 Found | `GetStarted` component has hard-coded `label = 'Get Started'` instead of using translations. |
| 4 | Need to verify button loading states | Medium | ⬜ Pending | Check if buttons use LoadingButton or custom loading prop correctly |
| 5 | Need to verify RTL spacing adjustments | Medium | ⬜ Pending | Check if marginLeft/paddingLeft properly converted to marginRight/paddingRight for RTL |

---

## 📝 Notes

_Additional notes, observations, or recommendations:_

### Initial Code Review Findings:

1. **RTL/LTR Flash Issue (Critical):**
   - `LocaleHtmlAttributes` component sets `lang` and `dir` attributes client-side using `useEffect`
   - This causes a flash of wrong language/direction on initial page load
   - **Impact:** SEO issues, accessibility problems, poor UX
   - **Recommendation:** Set `lang` and `dir` server-side in the layout component

2. **Homepage Structure:**
   - Uses 6 main sections: Hero, WhyUs, ServicesCatalog, ServiceDetails, PerfectJob, HomepageContact
   - All components are client-side ('use client')
   - Uses RevealSection for scroll animations

3. **Next Steps:**
   - Test actual page rendering in browser
   - Verify all translations load correctly
   - Check RTL layout visually
   - Test responsive breakpoints
   - Verify button functionality and links
   - Check performance metrics

### Testing Priority:
1. ✅ Code review complete
2. ⬜ Visual/functional testing needed
3. ⬜ Performance testing needed
4. ⬜ Accessibility audit needed
5. ⬜ Cross-browser testing needed



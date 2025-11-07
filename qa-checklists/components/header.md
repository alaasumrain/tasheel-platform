# QA Checklist: Header Component

**Component:** `src/components/sections/header.tsx`  
**Used On:** All public pages  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Component Purpose

The header component provides site-wide navigation. It includes:
- Logo
- Navigation links
- Language switcher
- Theme toggle
- CTA button
- Mobile menu

---

## ✅ Functionality Checklist

### Logo
- [ ] **Logo displays:** Logo image loads correctly
- [ ] **Logo links:** Links to homepage (`/` or `/ar/` or `/en/`)
- [ ] **Dark mode logo:** Shows correct logo in dark mode
- [ ] **Light mode logo:** Shows correct logo in light mode
- [ ] **Alt text:** Logo has alt text

### Navigation Links
- [ ] **All links work:** All navigation links navigate correctly
  - [ ] Services link
  - [ ] Track link
  - [ ] Pricing link (if applicable)
  - [ ] About link
  - [ ] Contact link
- [ ] **Active state:** Current page highlighted (if implemented)
- [ ] **Hover state:** Links have hover effect

### Language Switcher
- [ ] **Displays:** Language switcher visible
- [ ] **Current language:** Shows active language
- [ ] **Switch works:** Clicking switches language
- [ ] **URL preservation:** Preserves query params on switch
- [ ] **No flash:** No layout flash during switch

### Theme Toggle
- [ ] **Displays:** Theme toggle visible
- [ ] **Toggle works:** Clicking switches theme
- [ ] **Persistence:** Theme preference saved
- [ ] **Smooth transition:** Smooth theme transition

### CTA Button
- [ ] **Displays:** "Request Service" or equivalent button visible
- [ ] **Links correctly:** Links to services page
- [ ] **Style:** Matches design system (primary color, rounded)
- [ ] **Hover effect:** Has hover effect

### Mobile Menu
- [ ] **Hamburger icon:** Shows on mobile
- [ ] **Menu opens:** Clicking opens full-screen menu
- [ ] **Menu closes:** Clicking X closes menu
- [ ] **Menu links:** All links work in mobile menu
- [ ] **Backdrop:** Backdrop visible when menu open
- [ ] **Escape key:** Escape key closes menu

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **Desktop:** Horizontal layout with logo, nav, controls
- [ ] **Mobile:** Logo + hamburger menu
- [ ] **Spacing:** Consistent spacing between elements
- [ ] **Height:** Consistent header height
- [ ] **Sticky:** Header sticky on scroll (if implemented)

### Visual Design
- [ ] **Background:** Header background color correct
- [ ] **Border:** Bottom border or shadow (if applicable)
- [ ] **Typography:** Navigation text readable
- [ ] **Icons:** Icons consistent size and style
- [ ] **Logo size:** Logo appropriate size

### Responsive Behavior
- [ ] **Desktop:** Full navigation visible
- [ ] **Tablet:** May show condensed navigation
- [ ] **Mobile:** Hamburger menu, logo, controls

---

## 🌐 Translation Checklist

### Content
- [ ] **Navigation links:** All links translated
  - [ ] Arabic: "الخدمات", "تتبع الطلب", "عن الشركة", "اتصل بنا"
  - [ ] English: "Services", "Track Order", "About", "Contact"
- [ ] **Button:** CTA button translated
  - [ ] Arabic: "اطلب الخدمة"
  - [ ] English: "Request Service"
- [ ] **Language labels:** Language switcher labels correct

### RTL/LTR Layout
- [ ] **Arabic pages:** Navigation aligns right
- [ ] **English pages:** Navigation aligns left
- [ ] **Icons:** Icons positioned correctly for layout direction
- [ ] **Spacing:** Margin/padding adjusted for layout direction

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] **Layout:** Logo + hamburger menu
- [ ] **Menu:** Full-screen mobile menu
- [ ] **Touch targets:** At least 44x44px
- [ ] **Logo size:** Appropriate size for mobile

### Tablet (sm-md)
- [ ] **Layout:** May show condensed navigation
- [ ] **Menu:** May use hamburger or horizontal menu

### Desktop (lg+)
- [ ] **Layout:** Full horizontal navigation
- [ ] **Spacing:** Optimal spacing
- [ ] **No hamburger:** Hamburger hidden

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper `<header>`, `<nav>` elements
- [ ] **ARIA:** Proper ARIA labels
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Focus:** Visible focus indicators
- [ ] **Screen reader:** Navigation announced correctly
- [ ] **Skip link:** Skip to main content link (if implemented)

---

## ⚡ Performance Checklist

- [ ] **Logo loads:** Logo loads quickly
- [ ] **No layout shift:** No CLS on load
- [ ] **Smooth animations:** Menu animations smooth
- [ ] **Efficient rendering:** Doesn't cause performance issues

---

## 🎭 Theme Checklist

- [ ] **Light mode:** Header visible and readable
- [ ] **Dark mode:** Header visible and readable
- [ ] **Logo:** Correct logo for each theme
- [ ] **Icons:** Icons visible in both themes
- [ ] **Background:** Background color correct for theme

---

## 🔗 Navigation Checklist

- [ ] **All links:** All navigation links work
- [ ] **Home link:** Logo links to homepage
- [ ] **External links:** External links open correctly
- [ ] **Active page:** Current page highlighted (if implemented)

---

## ✅ Final Checklist

- [ ] All functionality works
- [ ] Responsive on all devices
- [ ] Translations correct
- [ ] Accessible
- [ ] Performance acceptable
- [ ] Theme support works

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





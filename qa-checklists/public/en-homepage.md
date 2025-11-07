# QA Checklist: English Homepage (`/en/`)

**Page Route:** `/en/`  
**Component:** `src/app/en/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The English homepage mirrors the Arabic version but in LTR layout. It should:
- Communicate Tasheel's value proposition clearly
- Showcase services in English
- Build trust through testimonials
- Guide users to request services
- Provide seamless language switching to Arabic

---

## ✅ Functionality Checklist

### Core Features
- [ ] Page loads without errors
- [ ] All sections render correctly (same as Arabic version)
- [ ] Hero section displays with English content
- [ ] Services catalog preview shows services
- [ ] Language switcher toggles to Arabic (`/ar/`)
- [ ] All interactive elements work

### LTR Layout Specific
- [ ] **Text direction:** `dir="ltr"` applied correctly
- [ ] **Text alignment:** Text aligns left
- [ ] **Icons:** Icons positioned correctly for LTR
- [ ] **Navigation:** Menu items align left
- [ ] **Spacing:** Margin/padding correct for LTR

---

## 🌐 Translation Checklist

### Content Translation
- [ ] All hero text in English
- [ ] All section headings in English
- [ ] All button labels in English
  - [ ] "Request Service"
  - [ ] "Browse Services"
  - [ ] "Learn More"
- [ ] All navigation links in English
- [ ] Footer content in English
- [ ] No Arabic text visible (unless intentional)

### Language Consistency
- [ ] Content matches Arabic version (same sections, same structure)
- [ ] Terminology consistent across site
- [ ] No machine translation artifacts
- [ ] Professional English writing

---

## 📱 Responsive Design Checklist

- [ ] Mobile (xs): Single column, hamburger menu
- [ ] Tablet (sm-md): 2-column grids
- [ ] Desktop (lg+): 3-column grids, full navigation
- [ ] All breakpoints tested

---

## ♿ Accessibility Checklist

- [ ] `<html lang="en" dir="ltr">` set correctly
- [ ] Proper heading hierarchy
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

---

## ⚡ Performance Checklist

- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Images optimized and lazy loaded
- [ ] Smooth 60fps scrolling
- [ ] No layout shift

---

## 🔍 SEO Checklist

- [ ] English title tag
- [ ] English meta description
- [ ] OG tags in English
- [ ] Proper heading hierarchy
- [ ] Clean URL structure

---

## 🎨 UX/UI Checklist

### Visual Design
- [ ] LTR layout correct
- [ ] Consistent spacing
- [ ] English font renders correctly
- [ ] Colors match design system
- [ ] Button styles consistent

### Component Consistency
- [ ] Buttons: Same style as Arabic version
- [ ] Cards: Consistent styling
- [ ] Typography: Proper hierarchy

### Animations
- [ ] Smooth page load
- [ ] Scroll animations work
- [ ] Hover effects smooth
- [ ] No janky animations

---

## 🔗 Navigation Checklist

- [ ] Language switcher to `/ar/` works
- [ ] All internal links work
- [ ] External links open correctly
- [ ] Browser back button works

---

## 🎭 Theme Checklist

- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Theme toggle works
- [ ] Theme persists on refresh

---

## ✅ Final Checklist

- [ ] All critical issues fixed
- [ ] Tested in multiple browsers
- [ ] Tested on multiple devices
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





# QA Checklist: Language Switcher Component

**Component:** `src/components/ui/language-switcher.tsx`  
**Used On:** All pages (in header)  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Component Purpose

The language switcher allows users to switch between Arabic and English. Critical for:
- Bilingual navigation
- Preserving context (query params, current page)
- Smooth language transitions

---

## ✅ Functionality Checklist

### Switching
- [ ] **Current language:** Shows active language (AR/EN)
- [ ] **Switch to Arabic:** Switches to `/ar/[current-page]`
- [ ] **Switch to English:** Switches to `/en/[current-page]`
- [ ] **URL preservation:** Preserves query parameters on switch
  - [ ] `?order=TSH-XXX` preserved
  - [ ] `?service=xxx` preserved
  - [ ] Other query params preserved
- [ ] **Deep links:** Works from any page depth
- [ ] **Homepage:** Switches homepage correctly (`/ar/` ↔ `/en/`)

### Edge Cases
- [ ] **Admin pages:** Works correctly (if applicable)
- [ ] **Dashboard pages:** Works correctly
- [ ] **Dynamic routes:** Works with `[slug]` and `[id]` routes
- [ ] **Hash links:** Preserves hash fragments (if applicable)

---

## 🎨 UX/UI Checklist

### Visual Design
- [ ] **Button style:** Consistent with design system
- [ ] **Active state:** Active language highlighted
- [ ] **Hover state:** Hover effect works
- [ ] **Icons:** Language flags/icons display (if used)
- [ ] **Text:** Language labels readable

### Layout
- [ ] **Position:** Positioned correctly in header
- [ ] **Spacing:** Proper spacing from other elements
- [ ] **Mobile:** Accessible on mobile
- [ ] **Desktop:** Visible on desktop

---

## 🌐 Translation Checklist

- [ ] **Labels:** "العربية" and "English" or "AR" and "EN"
- [ ] **Tooltip:** Tooltip text (if applicable) translated
- [ ] **Accessibility:** ARIA labels in both languages

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Accessible in mobile menu
- [ ] **Tablet:** Visible and accessible
- [ ] **Desktop:** Visible in header
- [ ] **Touch target:** At least 44x44px on mobile

---

## ♿ Accessibility Checklist

- [ ] **Keyboard:** Can activate with keyboard
- [ ] **Focus:** Visible focus indicator
- [ ] **ARIA:** Proper ARIA labels
- [ ] **Screen reader:** Announces language change
- [ ] **Semantic:** Proper button/link element

---

## ⚡ Performance Checklist

- [ ] **Fast switch:** Language switch is instant
- [ ] **No flash:** No layout flash during switch
- [ ] **No reload:** Uses client-side navigation (if applicable)

---

## 🐛 Known Issues to Check

Based on codebase analysis:
- [ ] **Query string loss:** Verify query strings preserved
- [ ] **Router usage:** Uses Next.js router correctly
- [ ] **No context loss:** Current page context preserved

---

## ✅ Final Checklist

- [ ] Language switching works correctly
- [ ] Query params preserved
- [ ] Works on all page types
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Performance acceptable

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|       |
| 1 | Query strings may be lost | High | | Check implementation |

---

## 📝 Notes

_Additional notes:_





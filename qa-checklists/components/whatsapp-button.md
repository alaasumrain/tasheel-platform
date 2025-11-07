# QA Checklist: WhatsApp Button Component

**Component:** `src/components/ui/whatsapp-button.tsx`  
**Used On:** Multiple pages (contact, service detail, etc.)  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Component Purpose

WhatsApp button allows users to quickly contact Tasheel via WhatsApp. Critical for:
- Customer communication
- Quick inquiries
- Customer support

---

## ✅ Functionality Checklist

### Button Functionality
- [ ] **Button click:** Opens WhatsApp chat
- [ ] **WhatsApp link:** Uses correct WhatsApp URL format
- [ ] **Phone number:** Uses correct phone number
- [ ] **Message:** Pre-fills message (if implemented)
- [ ] **New tab:** Opens in new tab/window (if applicable)
- [ ] **Mobile:** Opens WhatsApp app on mobile
- [ ] **Desktop:** Opens WhatsApp Web on desktop

### Message Pre-fill (if implemented)
- [ ] **Default message:** Pre-fills default message
- [ ] **Service-specific:** Pre-fills service name (if on service page)
- [ ] **Custom message:** Allows custom message (if implemented)

---

## 🎨 UX/UI Checklist

### Visual Design
- [ ] **Button style:** Consistent with design system
- [ ] **WhatsApp green:** Uses WhatsApp brand color (if applicable)
- [ ] **Icon:** WhatsApp icon displays correctly
- [ ] **Hover state:** Hover effect works
- [ ] **Size:** Appropriate size
- [ ] **Position:** Positioned appropriately (floating or inline)

### Layout
- [ ] **Floating button:** If floating, positioned correctly
- [ ] **Inline button:** If inline, flows with content
- [ ] **Mobile:** Accessible on mobile
- [ ] **Desktop:** Visible on desktop

---

## 🌐 Translation Checklist

- [ ] **Button text:** "تواصل عبر واتساب" / "Contact via WhatsApp" translated
- [ ] **ARIA label:** Translated appropriately
- [ ] **Tooltip:** Tooltip text (if applicable) translated

---

## 📱 Responsive Design Checklist

### Mobile
- [ ] **Touch target:** At least 44x44px
- [ ] **Position:** Doesn't obstruct content
- [ ] **WhatsApp app:** Opens WhatsApp app correctly

### Desktop
- [ ] **WhatsApp Web:** Opens WhatsApp Web correctly
- [ ] **Position:** Positioned appropriately

---

## ♿ Accessibility Checklist

- [ ] **Keyboard:** Can activate with keyboard
- [ ] **Focus:** Visible focus indicator
- [ ] **ARIA:** Proper ARIA label
- [ ] **Screen reader:** Announces button purpose
- [ ] **Semantic:** Proper button/link element

---

## ⚡ Performance Checklist

- [ ] **Loads quickly:** Button doesn't slow page load
- [ ] **Icon loads:** WhatsApp icon loads efficiently
- [ ] **No layout shift:** No CLS from button

---

## 🔗 Integration Checklist

- [ ] **Contact page:** Works on contact page
- [ ] **Service pages:** Works on service pages
- [ ] **Dashboard:** Works on dashboard (if applicable)
- [ ] **All contexts:** Works in all contexts where used

---

## ✅ Final Checklist

- [ ] WhatsApp link works correctly
- [ ] Opens WhatsApp appropriately (app/web)
- [ ] Message pre-fill works (if implemented)
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Performance acceptable

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|       |
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





# QA Checklist: Arabic Customer Requests List (`/ar/dashboard/requests`)

**Page Route:** `/ar/dashboard/requests`  
**Component:** `src/app/(ar)/dashboard/requests/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The requests list page shows all customer's orders/requests. Customers can:
- View all their requests
- See request status
- Navigate to request details
- Filter/search requests (if implemented)

---

## ✅ Functionality Checklist

### Authentication
- [ ] **Protected route:** Redirects to login if not authenticated
- [ ] **Customer check:** Only shows customer's own requests
- [ ] **Session check:** Validates customer session

### Requests Display
- [ ] **Table loads:** Requests table displays correctly
- [ ] **Data filtering:** Only shows customer's requests (filtered by email)
- [ ] **Columns display:** All columns display correctly
  - [ ] Order number
  - [ ] Service name
  - [ ] Status
  - [ ] Date submitted
  - [ ] Actions (if applicable)
- [ ] **Status badges:** Status displayed with color-coded badges
- [ ] **Empty state:** Shows message if no requests
- [ ] **Loading state:** Shows loading while fetching

### Table Functionality
- [ ] **Row click:** Rows link to request detail page
- [ ] **Sorting:** Columns sortable (if implemented)
- [ ] **Filtering:** Can filter by status (if implemented)
- [ ] **Search:** Can search requests (if implemented)
- [ ] **Pagination:** Pagination works (if implemented)

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Table flows right-to-left
- [ ] **Dashboard layout:** Uses dashboard layout with sidebar
- [ ] **Spacing:** Proper spacing
- [ ] **Card design:** Table in card with border radius 20px

### Table Design
- [ ] **Table styling:** Clean, professional table
- [ ] **Header row:** Table headers styled correctly
- [ ] **Row hover:** Rows have hover effect
- [ ] **Status badges:** Color-coded status chips
- [ ] **Typography:** Readable font sizes

---

## 🌐 Translation Checklist

- [ ] **Page title:** "طلباتي" or "طلباتي" in Arabic
- [ ] **Description:** Page description in Arabic
- [ ] **Table headers:** All headers in Arabic
  - [ ] "رقم الطلب"
  - [ ] "الخدمة"
  - [ ] "الحالة"
  - [ ] "تاريخ التقديم"
- [ ] **Status labels:** All status labels translated
- [ ] **Empty state:** "لا توجد طلبات" in Arabic
- [ ] **Actions:** Action buttons in Arabic

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Table scrolls horizontally or becomes card view
- [ ] **Tablet:** Table readable, may scroll
- [ ] **Desktop:** Full table view, optimal spacing

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper table structure
- [ ] **Table headers:** Proper `<th>` elements
- [ ] **Keyboard:** Can navigate table with keyboard
- [ ] **Screen reader:** Table announced correctly
- [ ] **ARIA:** Proper ARIA labels

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 2s
- [ ] **Data fetch:** < 2s
- [ ] **Table render:** Renders quickly
- [ ] **Smooth scrolling:** Smooth table scroll

---

## 🔒 Security Checklist

- [ ] **Data isolation:** Only shows customer's own requests
- [ ] **No data leak:** Can't access other customers' data
- [ ] **Authentication:** Requires valid session

---

## 🔗 Navigation Checklist

- [ ] **Request detail:** Links to `/ar/dashboard/requests/[id]`
- [ ] **Dashboard home:** Links to `/ar/dashboard`
- [ ] **Profile:** Links to `/ar/dashboard/profile`
- [ ] **Sidebar navigation:** All sidebar links work

---

## ✅ Final Checklist

- [ ] Requests display correctly
- [ ] Only customer's requests shown
- [ ] Table functional
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Secure

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





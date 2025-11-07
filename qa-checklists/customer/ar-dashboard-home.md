# QA Checklist: Arabic Customer Dashboard Home (`/ar/dashboard`)

**Page Route:** `/ar/dashboard`  
**Component:** `src/app/(ar)/dashboard/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The customer dashboard home provides an overview of the customer's account. Users can:
- View account summary
- See recent requests
- Quick access to key actions
- View account stats

---

## ✅ Functionality Checklist

### Authentication
- [ ] **Protected route:** Redirects to login if not authenticated
- [ ] **Session check:** Validates user session
- [ ] **User data:** Loads current user data
- [ ] **Logout:** Logout button works

### Dashboard Content
- [ ] **Welcome message:** Shows user's name
- [ ] **Stats cards:** Display key metrics
  - [ ] Total requests
  - [ ] Pending requests
  - [ ] Completed requests
  - [ ] In progress requests
- [ ] **Recent requests:** Shows recent requests list
- [ ] **Quick actions:** Quick action buttons/links
  - [ ] "New Request" button
  - [ ] "View All Requests" link
  - [ ] "Update Profile" link

### Data Loading
- [ ] **Loading state:** Shows loading spinner while fetching
- [ ] **Empty state:** Shows message if no requests
- [ ] **Error state:** Shows error message if fetch fails
- [ ] **Refresh:** Data refreshes correctly

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Dashboard flows right-to-left
- [ ] **Dashboard layout:** Sidebar + main content (if applicable)
- [ ] **Spacing:** Consistent spacing between sections
- [ ] **Visual hierarchy:** Clear sections

### Stats Cards
- [ ] **Design:** Consistent card design
- [ ] **Icons:** Icons match metrics
- [ ] **Colors:** Color-coded by status (if applicable)
- [ ] **Numbers:** Large, readable numbers
- [ ] **Labels:** Clear labels in Arabic

### Recent Requests List
- [ ] **Table/Cards:** Consistent display format
- [ ] **Columns/Fields:** Order number, service, status, date
- [ ] **Status badges:** Color-coded status indicators
- [ ] **Clickable rows:** Rows link to request detail
- [ ] **Empty state:** Friendly empty state message

### Navigation
- [ ] **Sidebar:** Dashboard navigation sidebar (if applicable)
- [ ] **Active state:** Current page highlighted
- [ ] **Menu items:** All menu items in Arabic
- [ ] **Mobile menu:** Hamburger menu on mobile

---

## 🌐 Translation Checklist

### Content
- [ ] **Page title:** "لوحة التحكم" or "لوحة المعلومات" in Arabic
- [ ] **Welcome:** "مرحباً [Name]" in Arabic
- [ ] **Stats labels:** All labels in Arabic
  - [ ] "إجمالي الطلبات"
  - [ ] "الطلبات المعلقة"
  - [ ] "الطلبات المكتملة"
  - [ ] "الطلبات قيد التنفيذ"
- [ ] **Section headings:** All headings in Arabic
- [ ] **Buttons:** All buttons in Arabic
  - [ ] "طلب جديد"
  - [ ] "عرض جميع الطلبات"
  - [ ] "تحديث الملف الشخصي"
- [ ] **Table headers:** All table headers in Arabic
- [ ] **Empty state:** "لا توجد طلبات" or equivalent
- [ ] **Error messages:** All error messages in Arabic

### RTL Layout
- [ ] Dashboard aligns right
- [ ] Sidebar on right (if applicable)
- [ ] Table content aligns right
- [ ] Stats cards align right

---

## 📱 Responsive Design Checklist

### Mobile (xs)
- [ ] **Layout:** Single column, no sidebar
- [ ] **Stats cards:** Stack vertically or 2x2 grid
- [ ] **Table:** Scrollable or card view
- [ ] **Navigation:** Hamburger menu
- [ ] **Touch targets:** At least 44x44px

### Tablet (sm-md)
- [ ] **Layout:** May show sidebar as overlay
- [ ] **Stats cards:** 2x2 grid
- [ ] **Table:** Scrollable table

### Desktop (lg+)
- [ ] **Layout:** Sidebar + main content
- [ ] **Stats cards:** 4-column grid
- [ ] **Table:** Full table view
- [ ] **Optimal spacing:** Full padding/margins

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper use of `<main>`, `<nav>`, `<section>`
- [ ] **Headings:** Proper hierarchy
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Content announced correctly
- [ ] **Focus:** Focus indicators visible
- [ ] **ARIA:** Proper ARIA labels for navigation

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 1.5s
- [ ] **Data fetch:** < 2s
- [ ] **Smooth scrolling:** 60fps
- [ ] **No layout shift:** No CLS on load
- [ ] **Efficient queries:** Minimal API calls

---

## 🔒 Security Checklist

- [ ] **Authentication:** Requires valid session
- [ ] **Authorization:** Only shows user's own data
- [ ] **Data isolation:** Can't access other users' data
- [ ] **HTTPS:** Served over HTTPS
- [ ] **Session timeout:** Handles expired sessions

---

## 🔗 Navigation Checklist

- [ ] **Sidebar links:** All navigation links work
- [ ] **Request detail:** Links to `/ar/dashboard/requests/[id]`
- [ ] **All requests:** Links to `/ar/dashboard/requests`
- [ ] **Profile:** Links to `/ar/dashboard/profile`
- [ ] **Logout:** Logs out and redirects
- [ ] **Back button:** Browser back works

---

## 🎭 Theme Checklist

- [ ] **Light mode:** Dashboard readable
- [ ] **Dark mode:** Dashboard readable
- [ ] **Stats cards:** Visible in both themes
- [ ] **Table:** Readable in both themes

---

## ✅ Final Checklist

- [ ] Dashboard loads correctly
- [ ] Stats display correctly
- [ ] Recent requests display correctly
- [ ] Navigation works
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Secure
- [ ] Performance acceptable

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





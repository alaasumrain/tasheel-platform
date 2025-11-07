# QA Checklist: Arabic Customer Request Detail (`/ar/dashboard/requests/[id]`)

**Page Route:** `/ar/dashboard/requests/[id]`  
**Component:** `src/app/(ar)/dashboard/requests/[id]/page.tsx`  
**Last Tested:** ___________  
**Tester:** ___________  
**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## 🎯 Page Purpose

The request detail page shows full information about a specific customer request. Customers can:
- View request details
- See status and timeline
- Upload files
- View uploaded files
- Make payment (if quote sent)
- Download completed files

---

## ✅ Functionality Checklist

### Authentication & Authorization
- [ ] **Protected route:** Redirects if not authenticated
- [ ] **Own request:** Only shows customer's own request
- [ ] **404:** Shows 404 if request doesn't exist or not owned by customer

### Request Information Display
- [ ] **Request details:** All information displays correctly
  - [ ] Order number
  - [ ] Service name
  - [ ] Current status
  - [ ] Customer information
  - [ ] Submission date
  - [ ] Request notes/message
- [ ] **Status badge:** Status displayed with color-coded badge
- [ ] **Timeline:** Shows request timeline/events
  - [ ] Event types display correctly
  - [ ] Event dates display correctly
  - [ ] Event notes display correctly
  - [ ] Timeline ordered chronologically

### File Management
- [ ] **File upload:** File upload works (if applicable)
  - [ ] Can upload files
  - [ ] File types validated
  - [ ] File size validated
  - [ ] Upload progress shown
- [ ] **File list:** Uploaded files display correctly
- [ ] **File download:** Can download files (if applicable)
- [ ] **File preview:** File preview works (if applicable)

### Payment (if applicable)
- [ ] **Payment button:** "Pay Now" button displays if quote sent
- [ ] **Payment link:** Links to payment page
- [ ] **Payment status:** Payment status displays correctly

---

## 🎨 UX/UI Checklist

### Layout
- [ ] **RTL Layout:** Page flows right-to-left
- [ ] **Dashboard layout:** Uses dashboard layout
- [ ] **Card sections:** Information organized in cards
- [ ] **Spacing:** Proper spacing between sections

### Visual Design
- [ ] **Status badge:** Color-coded status chip
- [ ] **Timeline:** Clear timeline visualization
- [ ] **File list:** Clean file list display
- [ ] **Buttons:** Action buttons styled correctly

---

## 🌐 Translation Checklist

- [ ] **Page title:** Request title or order number in Arabic
- [ ] **Section headings:** All headings in Arabic
  - [ ] "تفاصيل الطلب"
  - [ ] "الحالة"
  - [ ] "الجدول الزمني"
  - [ ] "الملفات"
- [ ] **Labels:** All labels in Arabic
- [ ] **Status labels:** All status labels translated
- [ ] **Buttons:** All buttons in Arabic
  - [ ] "رفع ملف"
  - [ ] "دفع الآن"
  - [ ] "تحميل"

---

## 📱 Responsive Design Checklist

- [ ] **Mobile:** Single column, stacked sections
- [ ] **Tablet:** Readable layout
- [ ] **Desktop:** Optimal spacing, clear layout

---

## ♿ Accessibility Checklist

- [ ] **Semantic HTML:** Proper structure
- [ ] **Headings:** Proper hierarchy
- [ ] **Keyboard:** Can navigate with keyboard
- [ ] **Screen reader:** Content announced correctly
- [ ] **File upload:** Accessible file upload

---

## ⚡ Performance Checklist

- [ ] **Page load:** < 2s
- [ ] **Data fetch:** < 2s
- [ ] **File operations:** File upload/download efficient

---

## 🔒 Security Checklist

- [ ] **Data isolation:** Only shows customer's own request
- [ ] **File access:** Can only access own files
- [ ] **No data leak:** Can't access other customers' data

---

## 🔗 Navigation Checklist

- [ ] **Back to list:** Links to `/ar/dashboard/requests`
- [ ] **Dashboard:** Links to `/ar/dashboard`
- [ ] **Payment:** Links to payment page (if applicable)

---

## ✅ Final Checklist

- [ ] Request details display correctly
- [ ] Timeline displays correctly
- [ ] File upload/download works
- [ ] Payment flow works (if applicable)
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Secure

---

## 🐛 Issues Found

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|       |
|   |       |          |        |       |

---

## 📝 Notes

_Additional notes:_





# Translation Issues Summary

**Date:** 2025-01-27  
**Status:** 🟡 Multiple translation issues found

---

## 🐛 Components with Hard-Coded English Text

### Critical (Affects User-Facing Pages)
1. **Get Started Button** (`src/components/buttons/get-started-button.tsx`)
   - Hard-coded: `'Get Started'`
   - Impact: Button won't show Arabic text

2. **Quote Request Form** (`src/components/forms/quote-request-form.tsx`)
   - Hard-coded: "Name", "Email", "Phone Number", "Service Required", "Select a service", "Service Urgency", "Send Request"
   - Impact: Form won't display Arabic labels

3. **Pricing Plans** (`src/components/sections/pricing-plans.tsx`)
   - Hard-coded: "Our Pricing", "Essential Services", "Attestation Suite", "Corporate Concierge", "Monthly", "Yearly", "Get Started", "Popular", all feature descriptions
   - Impact: Entire pricing section won't show Arabic text

4. **Service Detail Sidebar** (`src/components/sections/service-detail-sidebar.tsx`)
   - Hard-coded: Some values like "منصة تسهيل" / "Tasheel Platform", "PalPay / PayTabs"
   - Impact: Some metadata values not translatable

### Admin Interface (Lower Priority)
4. **Admin Order Detail** (`src/components/admin/OrderDetailClient.tsx`)
   - Hard-coded: "Assigned To", "Updating...", "Update Assignment"
   - Impact: Admin interface not bilingual

---

## ✅ Components Using Translations Correctly

1. ✅ **LoginForm** - Uses `useTranslations('Auth.login')`
2. ✅ **Footer** - Uses `useTranslations('Footer')`
3. ✅ **Header** - Uses `useTranslations('Header')`
4. ✅ **Hero** - Uses `useTranslations('Homepage.hero')`

---

## 📋 Fix Priority

### High Priority (User-Facing)
1. Get Started Button
2. Quote Request Form
3. Pricing Plans

### Medium Priority (Admin)
4. Admin Order Detail
5. Other admin components (to be reviewed)

---

## 🔧 Recommended Fix Pattern

For each component:
1. Import `useTranslations` hook
2. Get translations: `const t = useTranslations('Namespace');`
3. Replace hard-coded strings with `t('key')`
4. Add translation keys to locale files

**Example:**
```typescript
// Before
const label = 'Get Started';

// After
const t = useTranslations('Common');
const label = t('getStarted');
```

---

## 📝 Translation Keys Needed

### Common/Buttons
- `getStarted` - "Get Started" / "اطلب الخدمة"

### Quote Form
- `fields.name` - "Name" / "الاسم"
- `fields.email` - "Email" / "البريد الإلكتروني"
- `fields.phone` - "Phone Number" / "رقم الهاتف"
- `fields.service` - "Service Required" / "الخدمة المطلوبة"
- `fields.selectService` - "Select a service" / "اختر خدمة"
- `fields.urgency` - "Service Urgency" / "أولوية الخدمة"
- `submit` - "Send Request" / "إرسال الطلب"

### Pricing
- `plans.headline` - "Our Pricing" / "أسعارنا"
- `plans.subHeadline` - "Tasheel offers transparent plans..." / "..."
- `plans.monthly` - "Monthly" / "شهري"
- `plans.yearly` - "Yearly" / "سنوي"
- `plans.save20` - "Save 20%" / "وفر 20%"
- `plans.popular` - "Popular" / "الأكثر شعبية"
- `plans.essential.title` - "Essential Services" / "الخدمات الأساسية"
- `plans.essential.features.*` - All feature descriptions
- `plans.attestation.title` - "Attestation Suite" / "حزمة التصديق"
- `plans.corporate.title` - "Corporate Concierge" / "خدمات الشركات"
- `plans.getStarted` - "Get Started" / "ابدأ الآن"

### Admin
- `admin.assignedTo` - "Assigned To" / "مخصص ل"
- `admin.updating` - "Updating..." / "جاري التحديث..."
- `admin.updateAssignment` - "Update Assignment" / "تحديث التخصيص"

---

**See `TESTING-PROGRESS.md` for detailed findings.**


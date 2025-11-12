# Requirements Implementation Checklist

Based on the provided images and requirements, here's what has been implemented and what still needs to be done.

---

## ✅ **IMPLEMENTED**

### 1. Registration & Authentication (Partial)
- ✅ Registration form exists (`src/components/auth/RegisterForm.tsx`)
  - Fields: Name, Email, Phone, Password, Confirm Password
  - Uses Supabase Auth
- ✅ Login form exists (`src/components/auth/LoginForm.tsx`)
  - Email/Password authentication
- ✅ Customer profile creation after registration

### 2. Language & Localization
- ✅ Language switcher component (`src/components/ui/language-switcher.tsx`)
- ✅ Bilingual support (Arabic/English)
- ⚠️ **ISSUE**: Automatic language detection is **DISABLED** (`localeDetection: false` in `src/i18n/routing.ts`)

### 3. Header Components
- ✅ Currency switcher exists (`src/components/ui/currency-switcher.tsx`)
  - Supports: USD, EUR, NIS (ILS)
- ✅ Theme toggle (dark/light mode)
- ✅ Language switcher
- ✅ Search icon
- ✅ Navigation links

### 4. Service Cards & Catalog
- ✅ Service cards component (`src/components/sections/service-card.tsx`)
- ✅ Service catalog with search (`src/components/sections/services-catalog-with-search.tsx`)
- ✅ Filter sidebar (`src/components/sections/services-filter-sidebar.tsx`)
- ✅ Category filtering
- ✅ Grid/List view modes

### 5. WhatsApp Integration
- ✅ WhatsApp notification functions (`src/lib/whatsapp-notifications.ts`)
- ✅ WhatsApp webhook handler (`src/app/api/whatsapp/webhook/route.ts`)
- ⚠️ **NOTE**: Currently in TEST MODE (logs instead of sending)

---

## ❌ **MISSING / NEEDS IMPLEMENTATION**

### 1. Authentication Requirements

#### ❌ Two-Factor Authentication (2FA)
- **Status**: NOT IMPLEMENTED
- **Requirement**: "Sign in methods should be with two-authentication factor"
- **Current State**: Only email/password authentication exists
- **Action Needed**: 
  - Implement 2FA using Supabase Auth MFA
  - Add TOTP (Time-based One-Time Password) support
  - Add SMS/Email OTP as second factor

#### ❌ Phone/WhatsApp OTP Sign-In
- **Status**: NOT IMPLEMENTED
- **Requirement**: "customers can choose to sign in by phone number (whatsapp otp will be sent) or email"
- **Current State**: 
  - WhatsApp integration exists but only for notifications
  - No OTP-based authentication
- **Action Needed**:
  - Add phone number sign-in option to login form
  - Implement WhatsApp OTP sending via Twilio/Meta API
  - Add OTP verification step
  - Allow users to choose between email/password or phone/OTP

#### ❌ Registration Requirement Enforcement
- **Status**: PARTIAL
- **Requirement**: "Registration Requirement for any user"
- **Current State**: Registration form exists but may not be enforced on all routes
- **Action Needed**: Ensure all protected routes require registration

---

### 2. Language Detection

#### ❌ Automatic Language Detection
- **Status**: DISABLED
- **Requirement**: "Language should be automatically generated as the user's device preference"
- **Current State**: `localeDetection: false` in `src/i18n/routing.ts` (line 17)
- **Action Needed**: 
  - Enable `localeDetection: true` in routing config
  - Implement browser locale detection in middleware
  - Map browser locales to supported locales (ar/en)

---

### 3. Header/UI Issues

#### ❌ Logo Appearance on English Page
- **Status**: NEEDS VERIFICATION
- **Requirement**: "Logo Appearance in english language page is wrong"
- **Current State**: Logo uses same image for both languages (`/dark/logo-header.png` or `/light/logo-header.png`)
- **Action Needed**: 
  - Check if logo needs different styling/positioning for English vs Arabic
  - Verify logo text/formatting for English locale
  - May need locale-specific logo variants

#### ❌ Brand Colors Alignment
- **Status**: NEEDS VERIFICATION
- **Requirement**: "Website colors not aligned with brand color"
- **Current State**: Uses MUI theme colors
- **Action Needed**: 
  - Verify brand colors match design system
  - Check primary/secondary color definitions
  - Update theme colors if needed

#### ❌ Icon Sizes
- **Status**: NEEDS VERIFICATION
- **Requirement**: "Icons are large, make them appear smaller"
- **Current State**: 
  - Search icon: `size={16}` (line 164 in header.tsx)
  - Theme toggle and language switcher use default sizes
- **Action Needed**: 
  - Review all icon sizes in header
  - Reduce icon sizes if they appear too large
  - Ensure consistent sizing across header icons

#### ✅ Currency Selector
- **Status**: IMPLEMENTED
- **Requirement**: "add currency icon USD, EURO, NIS"
- **Current State**: Currency switcher exists with USD, EUR, ILS (NIS) options

---

### 4. Content Changes

#### ❌ Remove "No office visits required" Text
- **Status**: NEEDS REMOVAL
- **Requirement**: "Remove No Office visits required"
- **Current Location**: 
  - `messages/en.json` line 1418: `"description": "...No office visits required."`
  - `TASHEEL-BLUEPRINT.md` line 218
- **Action Needed**: 
  - Remove "No office visits required" from the description text
  - Update both English and Arabic translations

---

### 5. Service Cards & Catalog

#### ❌ Add Photos to Service Cards
- **Status**: NOT IMPLEMENTED
- **Requirement**: "add photo for each service"
- **Current State**: Service cards (`src/components/sections/service-card.tsx`) don't display images
- **Action Needed**: 
  - Add image field to Service type
  - Display service images in cards
  - Add image upload/management in admin panel
  - Ensure images are responsive

#### ❌ Change Service Card Colors
- **Status**: NEEDS UPDATE
- **Requirement**: "change colors"
- **Current State**: Uses theme colors (primary, success, info, warning)
- **Action Needed**: 
  - Review and update color scheme for service cards
  - Align with brand colors
  - Update category color mappings

#### ❌ Mobile Filter Improvements
- **Status**: NEEDS IMPROVEMENT
- **Requirement**: "make the filter more friendly on mobile"
- **Current State**: Filter sidebar exists but may not be optimized for mobile
- **Action Needed**: 
  - Review mobile filter UX
  - Consider drawer/modal for mobile filters
  - Improve touch targets and spacing
  - Test on various mobile devices

#### ❌ Filter Services by Category
- **Status**: NEEDS IMPLEMENTATION
- **Requirement**: "only keep services sent from our side within the right category and remove all other added ones"
- **Current State**: Filtering exists but may show all services
- **Action Needed**: 
  - Ensure only services from database are shown
  - Filter out any hardcoded/test services
  - Verify category assignments are correct
  - Add admin control for service visibility

---

### 6. Shipping Rates on Checkout

#### ❌ Shipping Rates Implementation
- **Status**: NOT IMPLEMENTED
- **Requirement**: Add shipping rates based on location and delivery type

**Required Rates:**
- **West Bank:**
  - One time/service delivery: 20 NIS
  - Multiple deliveries (2+): 15 NIS/delivery
  
- **Jerusalem:**
  - One time/service delivery: 30 NIS
  - Multiple deliveries (2+): 50 NIS/delivery
  
- **48 Area:**
  - One time/service delivery: 70 NIS
  - Multiple deliveries (2+): 65 NIS/delivery
  
- **International:**
  - One delivery: 200 NIS

**Current State**: 
- Checkout flow exists (`src/components/forms/service-quote-wizard.tsx`)
- No shipping rate calculation implemented
- Payment session creation (`src/app/api/payment/create-session/route.ts`) has `hide_shipping: true`

**Action Needed**:
1. Add shipping address/location selection in checkout form
2. Add delivery type selection (single vs multiple deliveries)
3. Calculate shipping rates based on:
   - Location (West Bank, Jerusalem, 48 Area, International)
   - Delivery type (single vs multiple)
4. Display shipping costs in checkout summary
5. Add shipping cost to total amount
6. Store shipping information in order/application record
7. Update payment session to include shipping costs

---

## 📋 **PRIORITY SUMMARY**

### High Priority (Core Features)
1. ❌ Two-Factor Authentication (2FA)
2. ❌ Phone/WhatsApp OTP Sign-In
3. ❌ Shipping Rates on Checkout
4. ❌ Automatic Language Detection

### Medium Priority (UX Improvements)
5. ❌ Remove "No office visits required" text
6. ❌ Add photos to service cards
7. ❌ Mobile filter improvements
8. ❌ Logo appearance fix for English page

### Low Priority (Polish)
9. ❌ Brand colors alignment
10. ❌ Icon size adjustments
11. ❌ Service card color updates
12. ❌ Filter services by category (ensure only valid services shown)

---

## 🔍 **FILES TO REVIEW/MODIFY**

### Authentication
- `src/components/auth/LoginForm.tsx` - Add phone/OTP option
- `src/components/auth/RegisterForm.tsx` - May need updates
- `src/lib/supabase/client.ts` - May need 2FA setup
- `src/lib/whatsapp.ts` - Enable OTP sending

### Language Detection
- `src/i18n/routing.ts` - Enable `localeDetection: true`
- `middleware.ts` - Add browser locale detection logic

### Header/UI
- `src/components/sections/header.tsx` - Fix logo, reduce icon sizes
- `src/components/ui/theme-toggle.tsx` - Check icon size
- `src/components/ui/language-switcher.tsx` - Check icon size

### Content
- `messages/en.json` - Remove "No office visits required"
- `messages/ar.json` - Remove equivalent Arabic text

### Service Cards
- `src/components/sections/service-card.tsx` - Add image display
- `src/lib/types/service.ts` - Add image field to Service type
- `src/components/sections/services-filter-sidebar.tsx` - Improve mobile UX

### Shipping
- `src/components/forms/service-quote-wizard.tsx` - Add shipping selection
- `src/app/actions/submit-checkout.ts` - Add shipping calculation
- `src/app/api/payment/create-session/route.ts` - Include shipping in payment
- Database schema - Add shipping fields to applications/orders table

---

## 📝 **NOTES**

- WhatsApp integration is currently in TEST MODE - needs production setup
- Currency switcher is implemented but may need visual improvements
- Service filtering exists but may need refinement for category filtering
- Checkout flow exists but doesn't include shipping rates yet


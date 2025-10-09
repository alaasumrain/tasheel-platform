# Tasheel Platform - Current State Documentation

**Last Updated**: 2025-10-09
**Status**: Production-ready with clean wizard UI

## 🎯 Platform Overview

Tasheel is Palestine's digital gateway for translation and government services, built with:
- **Frontend**: Next.js 15.4.2 + React 19 + Material-UI v7
- **Forms**: React Hook Form 7.60.0 with custom multi-step wizards
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Material-UI with custom Tasheel theme

## 🔐 Authentication & Access

### User Roles
- **Regular Users**: Access `/portal` for submitting translation requests
- **Staff Users**: Access `/admin` for managing all requests + user portal access

### Staff Accounts (Admin Access)
```
✅ alaasumrain@outlook.com
✅ adham.sumrain97@gmail.com
✅ meraykumkam8@gmail.com
```

### Known Auth Issue
⚠️ **JWT Token Staleness**: When a user is granted staff role, their existing session JWT doesn't automatically update with new `app_metadata`.

**Workaround**: Users must sign out and sign back in for role changes to take effect.

**Current Mitigation**: `/admin` layout redirects non-staff users to `/login?signout=true` which forces sign-out.

## 📁 Key File Structure

```
src/
├── app/
│   ├── (admin)/                    # Admin portal (staff-only)
│   │   ├── admin/layout.jsx        # Enforces staff-only access
│   │   ├── AdminDashboardClient.jsx
│   │   └── AdminRequestDetailClient.jsx
│   ├── (portal)/                   # User portal
│   │   ├── PortalDashboardClient.jsx
│   │   └── components/
│   │       ├── LatestRequestCard.jsx
│   │       └── RequestTableCard.jsx
│   ├── (default)/
│   │   ├── login/page.jsx          # Auth handling + redirects
│   │   └── services/page.jsx       # Service catalog
│   └── layout.jsx                  # Root layout
├── components/
│   ├── forms/
│   │   └── translation-wizard/
│   │       ├── TranslationWizard.jsx       # Main wizard component
│   │       ├── layout/WizardLayout.jsx     # Single-column layout
│   │       └── steps/                      # ContactStep, DocumentsStep, etc.
│   ├── MainCard.jsx                # Shared card component
│   └── TasheelButton.jsx           # Branded button
├── data/
│   └── services.js                 # Service catalog (18 services)
└── lib/
    └── supabase/                   # Supabase client utilities
```

## 🎨 Recent UI Improvements

### 1. Translation Wizard Refactoring
**Before**: Cluttered 2-column layout with nested cards
**After**: Clean single-column centered design

**Changes**:
- `WizardLayout.jsx`: Removed sidebar, made summary inline
- `TranslationWizard.jsx`: Simplified stepper using MUI `alternativeLabel` pattern
- Summary: Two-column layout (label | value)
- Stepper: Standard MUI pattern with custom icon component

### 2. Dashboard Cards Enhancement
- **MainCard**: Increased border-radius to 2, enhanced box-shadows
- **LatestRequestCard**: Added boxShadow prop, polished typography
- **RequestTableCard**: Added hover effects and transitions

```jsx
// Example enhancement pattern
boxShadow: '0 4px 12px rgba(15,46,83,0.08)',
'&:hover': {
  boxShadow: '0 8px 20px rgba(15,46,83,0.12)',
  borderColor: 'primary.light'
}
```

## 🗄️ Database Schema

### Main Tables
- `applications` - Translation/service requests
- `services` - Service catalog (linked to wizard)
- `service_categories` - Translation, Localization, Interpreting, Audio-Visual
- `industries` - Industry classifications
- `service_industries` - Many-to-many relationship

### Security Status
✅ **RLS Enabled** on all catalog tables
✅ **Trigger Functions** use immutable search paths
✅ **Staff Role Management** functions created
⚠️ **1 Warning Remaining**: Leaked password protection (requires manual Supabase dashboard setting)

## 🔧 Available Services (18 Total)

### Translation (6 services)
- Document Translation
- Certified Translation
- Technical Translation
- Legal Translation
- Medical Translation
- USCIS Translation
- Patent Translation

### Localization (3 services)
- Website Localization
- Software & App Localization
- Marketing Transcreation

### Interpreting (4 services)
- Simultaneous Interpreting
- Consecutive Interpreting
- Video Remote Interpreting
- Phone Interpreting

### Audio & Visual (4 services)
- Subtitling & Captioning
- Voiceover & Dubbing
- Transcription Services
- Desktop Publishing (DTP)

## 🚀 Development Commands

```bash
npm run dev           # Start dev server with Turbopack
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run prettier      # Format code
npm run test          # Run Vitest tests
```

## 📋 Pending Work

### High Priority
1. **Resolve JWT staleness issue** - Need server-side session refresh mechanism
2. **Enable leaked password protection** - Manual Supabase dashboard setting required

### Feature Expansion
3. **Government Services Infrastructure**
   - Add new service category: "Government Services"
   - Create `GovernmentServiceWizard.jsx` component
   - Add services: Driver license renewal, passport applications, etc.
   - Update routing to use appropriate wizard based on service category

### Architecture Pattern for New Wizard
```jsx
// Route: /services/driver-license-renewal
// Use same pattern as TranslationWizard:
// 1. Clone TranslationWizard.jsx → GovernmentServiceWizard.jsx
// 2. Define new steps (e.g., PersonalInfo, DocumentUpload, Payment, Review)
// 3. Reuse WizardLayout.jsx (already supports any wizard)
// 4. Submit to same /api/quote endpoint with different service type
```

## 🔍 Debugging Tips

### Check User Role
```sql
SELECT email, raw_app_meta_data->>'role' as role
FROM auth.users
WHERE email = 'user@example.com';
```

### Grant Staff Role
```sql
SELECT public.grant_staff_role('user@example.com');
```

### View All Applications
```sql
SELECT id, service_type, status, created_at, contact_email
FROM applications
ORDER BY created_at DESC
LIMIT 10;
```

## 📞 Support

For technical issues or questions:
- Repository: `/Users/Alaa/tasheel-platform`
- Primary Contact: alaasumrain@outlook.com
- Staff Access: Alaa, Adham, Meray

---

**Next Development Phase**: Expand beyond translation services to include government document processing and renewal services.

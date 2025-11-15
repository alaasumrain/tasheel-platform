# Tasheel Platform - Tech Stack & Useful Resources

## Current Tech Stack

### Core Framework
- **Next.js 14.2.26** (App Router)
- **React 18.3.1**
- **TypeScript 5**

### UI Libraries
- **Material UI (MUI) v6.5.0** - Primary component library
- **Tailwind CSS v4** - Utility-first CSS
- **@tabler/icons-react** - Icon library
- **Motion (Framer Motion)** - Animations

### Backend & Database
- **Supabase** - Authentication & Database
  - `@supabase/supabase-js` v2.75.0
  - `@supabase/ssr` v0.7.0

### State Management & Data Fetching
- **TanStack React Query v5.82.0** - Server state management
- **Zod v4.1.12** - Schema validation

### Internationalization
- **next-intl v4.4.0** - Multi-language support (English/Arabic)

### Payments
- **Stripe** - Payment processing
  - `stripe` v18.3.0
  - `@stripe/stripe-js` v7.4.0

### Forms & File Handling
- **react-dropzone** - File uploads
- **@dnd-kit** - Drag and drop functionality

### Email
- **Resend** - Email service
- **@react-email/components** - Email templates

### Charts & Data Visualization
- **Recharts** - Chart library
- **@mui/x-data-grid** - Data tables
- **@mui/x-date-pickers** - Date pickers

### Other Libraries
- **react-hot-toast** - Toast notifications
- **date-fns** - Date utilities
- **embla-carousel-react** - Carousel component
- **qrcode.react** - QR code generation
- **@react-pdf/renderer** - PDF generation

### Testing
- **Vitest** - Unit testing
- **@testing-library/react** - React testing utilities

---

## Useful GitHub Repositories to Explore

### 1. **Next.js + MUI Starter Templates**

#### [bryopsida/nextjs-mui-starter-template](https://github.com/bryopsida/nextjs-mui-starter-template)
- Next.js with Material UI starter
- Good for basic MUI integration patterns

#### [VaxobjanovDev/nextjs-mui-starter](https://github.com/VaxobjanovDev/nextjs-mui-starter)
- Next.js App Router + Material UI + TypeScript
- Modern setup with App Router

#### [sdsna/nextjs-starter](https://github.com/sdsna/nextjs-starter)
- Next.js with Material UI & Styled Components
- Alternative styling approach

### 2. **Next.js + Supabase Templates**

#### [Mohamed-4rarh/next-supabase-starter](https://github.com/Mohamed-4rarh/next-supabase-starter)
- Next.js 15 + Supabase + React Query
- **Highly relevant!** Uses same stack (Next.js, Supabase, React Query)
- Includes authentication wrappers
- Good patterns for Supabase integration

#### [Razikus/supabase-nextjs-template](https://github.com/Razikus/supabase-nextjs-template)
- Production-ready SaaS template
- Next.js 15 + Supabase + Tailwind CSS
- Includes: auth, user management, file storage, task management
- **Great for admin components!**

#### [ojasskapre/nextjs-starter-template](https://github.com/ojasskapre/nextjs-starter-template)
- Next.js + Supabase Auth + Langchain
- TypeScript + Tailwind CSS
- Good authentication patterns

### 3. **MUI Component Libraries**

#### [mui/material-ui](https://github.com/mui/material-ui)
- Official Material UI repository
- **Check the examples folder!**
- Component demos and patterns
- [Example Projects Page](https://mui.com/material-ui/getting-started/example-projects/)

### 4. **Admin Dashboard Templates**

#### Materio Free MUI Next.js Admin Template
- Next.js 14 Dashboard with App Router
- Full admin panel components
- **Check your `temp/materio-nextjs/` folder - you already have this!**
- Great for admin components (tables, forms, charts)

### 5. **Awesome Collections**

#### [officialrajdeepsingh/awesome-nextjs](https://github.com/officialrajdeepsingh/awesome-nextjs)
- Curated list of Next.js resources
- Components, libraries, tools

---

## Components You Can Extract

### From Next.js + Supabase Templates:
1. **Authentication Components**
   - Login/Register forms with Supabase
   - OTP verification patterns
   - Session management
   - Protected route wrappers

2. **Data Fetching Patterns**
   - React Query hooks for Supabase
   - Server action patterns
   - Real-time subscriptions

3. **File Upload Components**
   - Supabase Storage integration
   - Progress indicators
   - File preview components

### From MUI Examples:
1. **Form Components**
   - Advanced form patterns
   - Validation examples
   - Multi-step forms

2. **Data Display**
   - Table components
   - Card layouts
   - List components

3. **Navigation**
   - App bar patterns
   - Drawer components
   - Breadcrumbs

### From Admin Templates:
1. **Dashboard Components**
   - Stats cards
   - Charts integration
   - Data tables with sorting/filtering
   - Pagination components

2. **Form Builders**
   - Dynamic form generation
   - Field editors
   - Conditional fields

---

## Newly Cloned Repositories (in `temp/` folder)

Just cloned these fresh repos using GitHub CLI! 🎉

### 1. **next-supabase-starter** ⭐ HIGHLY RECOMMENDED
- **Repo**: `Mohamed-4rarh/next-supabase-starter`
- **Stack**: Next.js 15 + Supabase + React Query
- **Why it's perfect**: Matches your exact stack!
- **What to extract**:
  - Authentication patterns with Supabase
  - React Query hooks for Supabase
  - Protected route wrappers
  - Session management
  - Server action patterns

### 2. **nextjs14-supabase-dashboard**
- **Repo**: `w3labkr/nextjs14-supabase-dashboard`
- **Stack**: Next.js 14 + Supabase
- **What to extract**:
  - Dashboard layouts
  - Supabase integration patterns
  - Data fetching examples

### 3. **nextjs-mui-starter**
- **Repo**: `VaxobjanovDev/nextjs-mui-starter`
- **Stack**: Next.js App Router + Material UI + TypeScript
- **What to extract**:
  - MUI integration with App Router
  - Theme setup patterns
  - Component examples

### 4. **nextjs-mui-starter-ts**
- **Repo**: `karpolan/nextjs-mui-starter-ts`
- **Stack**: Next.js + MUI + TypeScript
- **What to extract**:
  - Reusable components
  - Utilities
  - TypeScript patterns

### 5. **supa-next-starter**
- **Repo**: `michaeltroya/supa-next-starter`
- **Stack**: Next.js + Supabase + Tailwind
- **What to extract**:
  - Supabase auth patterns
  - File upload components
  - Database query examples

### 6. **nextjs-mui-hook-form-starter**
- **Repo**: `AlexStack/nextjs-materia-mui-typescript-hook-form-scaffold-boilerplate-starter`
- **Stack**: Next.js 15 + MUI 6 + React Hook Form + TypeScript
- **What to extract**:
  - Form components with React Hook Form
  - Form validation patterns
  - MUI form integration

### 7. **next-app-router-tailwind-mui**
- **Repo**: `manavm1990/next-app-router-tailwind-mui-starter`
- **Stack**: Next.js App Router + Tailwind + MUI
- **What to extract**:
  - Tailwind + MUI integration
  - Layout patterns
  - Component examples

---

## Your Existing Templates (in `temp/` folder)

You already have several excellent templates! Here's what's available:

### 1. **Materio Next.js Admin Template** (`temp/materio-nextjs/`)
- **TypeScript version**: `temp/materio-nextjs/typescript-version/`
- **JavaScript version**: `temp/materio-nextjs/javascript-version/`
- Full admin dashboard with MUI
- Components include:
  - Layouts (`@layouts/`)
  - Core components (`@core/`)
  - Menu system (`@menu/`)
  - Views/examples (`views/`)
- **Best for**: Admin panel components, layouts, navigation

### 2. **Next.js Admin Dashboard** (`temp/nextjs-admin-dashboard/`)
- TypeScript + Tailwind CSS
- 61 components in `src/components/`
- Dashboard patterns
- **Best for**: Dashboard layouts, charts, data visualization

### 3. **Next Admin** (`temp/next-admin/`)
- Full admin framework
- Multiple packages in monorepo
- Examples in `apps/example/`
- **Best for**: Admin framework patterns, form builders

### 4. **React Admin** (`temp/react-admin/`)
- Full-featured admin framework
- Examples in `examples/` folder:
  - `crm/` - CRM example (222 files!)
  - `demo/` - Full demo
  - `simple/` - Simple example
- **Best for**: Complex admin patterns, data management

### 5. **React Admin Dashboard** (`temp/react_admin_dashboard/`)
- GraphQL-based
- 32 components
- **Best for**: GraphQL patterns, component examples

### 6. **Refine Dashboard** (`temp/refine_dashboard/`)
- Similar to react-admin
- 32 components
- **Best for**: Alternative admin patterns

---

## Recommended Next Steps

1. **Explore Your Existing Templates** (Start here!)
   - **Materio**: `temp/materio-nextjs/typescript-version/src/components/`
   - **Next.js Admin**: `temp/nextjs-admin-dashboard/src/components/`
   - **React Admin Examples**: `temp/react-admin/examples/crm/`
   
2. **Specific Components to Check**
   - Tables: `temp/materio-nextjs/typescript-version/src/components/`
   - Forms: `temp/react-admin/examples/crm/src/`
   - Charts: `temp/nextjs-admin-dashboard/src/components/`
   - Layouts: `temp/materio-nextjs/typescript-version/src/@layouts/`

3. **Check MUI Examples**
   - Visit: https://mui.com/material-ui/getting-started/example-projects/
   - Look for Next.js + MUI examples

4. **Review Supabase Templates**
   - Clone and explore: `Mohamed-4rarh/next-supabase-starter`
   - Check authentication patterns
   - Review React Query integration

5. **Component Extraction Strategy**
   - Start with simple components (buttons, cards)
   - Then move to complex ones (forms, tables)
   - Always adapt to your i18n setup (next-intl)
   - Ensure TypeScript compatibility

---

## Quick Links

- [MUI Examples](https://mui.com/material-ui/getting-started/example-projects/)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples/react/basic)

---

## Notes

- Your project already has several template folders in `temp/` - explore those first!
- Make sure any components you extract are compatible with:
  - Next.js App Router (not Pages Router)
  - next-intl for translations
  - Your existing theme setup
  - TypeScript strict mode


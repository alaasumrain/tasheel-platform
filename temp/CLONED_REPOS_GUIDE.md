# Cloned Repositories Quick Reference Guide

## 🎯 Start Here: Most Relevant Repos

### 1. **next-supabase-starter** ⭐⭐⭐
**Location**: `temp/next-supabase-starter/`

**What's Inside**:
- ✅ Authentication forms (login, register)
- ✅ React Query hooks (`hooks/use-client-fetch.ts`, `hooks/use-client-mutation.ts`)
- ✅ Supabase client setup (`supabase/client.ts`, `supabase/server.ts`)
- ✅ Auth context (`lib/auth-context.tsx`)
- ✅ UI components (`components/ui/`)
- ✅ Protected routes with middleware

**Key Files to Check**:
```
app/(auth)/login/login-form.tsx      # Login form pattern
app/(auth)/register/register-form.tsx # Register form pattern
hooks/use-client-fetch.ts            # React Query + Supabase pattern
supabase/server.ts                   # Server-side Supabase setup
components/user-auth-state.tsx       # Auth state management
```

**What You Can Extract**:
- Authentication flow patterns
- React Query integration with Supabase
- Server/client component patterns
- Form validation patterns

---

### 2. **nextjs14-supabase-dashboard** ⭐⭐
**Location**: `temp/nextjs14-supabase-dashboard/`

**What's Inside**:
- Dashboard layouts
- Supabase integration examples
- Data fetching patterns

**What You Can Extract**:
- Dashboard component structures
- Supabase query patterns
- Data table implementations

---

### 3. **nextjs-mui-starter** ⭐⭐
**Location**: `temp/nextjs-mui-starter/`

**What's Inside**:
- MUI integration with Next.js App Router
- Theme configuration
- Component examples

**What You Can Extract**:
- MUI theme setup
- App Router integration patterns
- Component styling examples

---

### 4. **nextjs-mui-starter-ts** ⭐⭐
**Location**: `temp/nextjs-mui-starter-ts/`

**What's Inside**:
- Reusable MUI components
- TypeScript patterns
- Utilities

**What You Can Extract**:
- Reusable component patterns
- TypeScript utility types
- Component composition examples

---

### 5. **supa-next-starter** ⭐⭐
**Location**: `temp/supa-next-starter/`

**What's Inside**:
- Supabase authentication
- File upload patterns
- Database query examples

**What You Can Extract**:
- File upload components
- Supabase Storage integration
- Database query patterns

---

### 6. **nextjs-mui-hook-form-starter** ⭐⭐⭐
**Location**: `temp/nextjs-mui-hook-form-starter/`

**What's Inside**:
- React Hook Form integration
- MUI form components
- Form validation patterns

**What You Can Extract**:
- Form components with validation
- React Hook Form + MUI patterns
- Form error handling

---

### 7. **next-app-router-tailwind-mui** ⭐⭐
**Location**: `temp/next-app-router-tailwind-mui/`

**What's Inside**:
- Tailwind + MUI integration
- Layout patterns
- Component examples

**What You Can Extract**:
- Tailwind + MUI hybrid patterns
- Layout components
- Styling approaches

---

## 🔍 Quick Search Commands

### Find all authentication components:
```bash
cd temp/next-supabase-starter
find . -name "*auth*" -o -name "*login*" -o -name "*register*"
```

### Find all React Query hooks:
```bash
cd temp/next-supabase-starter
find . -name "*hook*" -o -name "*query*" -o -name "*mutation*"
```

### Find all form components:
```bash
cd temp/nextjs-mui-hook-form-starter
find . -name "*form*" -o -name "*input*"
```

### Find all Supabase patterns:
```bash
cd temp/next-supabase-starter
find . -name "*supabase*" -o -name "*client*" -o -name "*server*"
```

---

## 📋 Component Extraction Checklist

When extracting components, make sure to:

1. ✅ Check TypeScript compatibility
2. ✅ Adapt to your i18n setup (next-intl)
3. ✅ Update imports to match your project structure
4. ✅ Replace their Supabase setup with yours (if different)
5. ✅ Update theme/styling to match your MUI theme
6. ✅ Test with your existing components
7. ✅ Add proper error handling
8. ✅ Update translations for Arabic/English

---

## 🚀 Recommended Extraction Order

1. **Start Simple**: UI components (buttons, inputs, cards)
2. **Then**: Form patterns and validation
3. **Next**: Authentication flows
4. **Finally**: Complex patterns (dashboards, data tables)

---

## 💡 Pro Tips

- **Compare patterns**: Look at how different repos solve the same problem
- **Mix and match**: Combine patterns from multiple repos
- **Adapt, don't copy**: Always adapt to your project's needs
- **Test thoroughly**: Test extracted components in your app context

---

## 📚 Additional Resources

- Check the README.md in each repo for setup instructions
- Look at package.json to see what dependencies they use
- Review their folder structure for organization patterns
- Check their TypeScript configs for type patterns


# Claude Assistant - Tasheel Platform Rules

**Project:** Tasheel Service Platform  
**Last Updated:** January 2025

---

## ⚠️ CRITICAL RULES

### 1. Geneva Template Compliance
**ALL components MUST use Geneva template patterns. NO custom components outside the system.**

**Study First:**
- Review `geneva-template/` directory for available components
- Review `arabie.ai/arabie.ai-geneva/` for bilingual implementation patterns
- Always check existing patterns before creating new ones

**DO:**
- ✅ Use existing Geneva components (`Card`, `RevealSection`, buttons, forms)
- ✅ Extend Geneva patterns (don't create new patterns)
- ✅ Use MUI components exactly as Geneva does
- ✅ Use `MuiLink component={Link}` pattern (NOT `passHref`)
- ✅ Follow arabie.ai bilingual implementation pattern exactly

**DON'T:**
- ❌ Create custom components outside Geneva structure
- ❌ Import new UI libraries
- ❌ Build custom tables (use MUI DataGrid)
- ❌ Build custom forms (extend Geneva form pattern)
- ❌ Use `passHref` pattern

### 2. Bilingual Implementation Pattern
**Follow arabie.ai pattern exactly:**

**Route Structure:**
- `(ar)/` - Arabic (default, no prefix)
- `en/` - English (with `/en` prefix)

**Files Pattern:**
- `src/i18n/routing.ts` - Routing configuration
- `src/i18n/navigation.ts` - Navigation helpers
- `src/i18n/request.ts` - Request config
- `middleware.ts` - Locale routing
- `messages/en.json` and `messages/ar.json` - Translations
- `src/components/LocaleHtmlAttributes.tsx` - HTML attributes
- `src/components/ui/language-switcher.tsx` - Language switcher

**Navigation:**
```typescript
import { Link } from '@/i18n/navigation';
<MuiLink component={Link} href="/services" underline="none" prefetch>
```

### 3. Component Patterns

**For Navigation Links:**
```typescript
// ✅ CORRECT (arabie.ai pattern)
<MuiLink component={Link} href="/services" underline="none" prefetch>
  <Typography>Services</Typography>
</MuiLink>

// ❌ WRONG
<Link href="/services" passHref>
  <MuiLink>Services</MuiLink>
</Link>
```

**For Tables:**
- Always use MUI DataGrid (not custom tables)

**For Forms:**
- Extend `contact-form.tsx` pattern

**For Cards:**
- Use `Card` from `components/ui/card.tsx`

**For Animations:**
- Always use `RevealSection`

### 4. Development Workflow

**Before Building:**
1. Study existing implementations (arabie.ai, Geneva template)
2. Check if pattern already exists
3. Duplicate pattern, don't invent new ones

**When Building:**
1. Use Geneva components
2. Follow arabie.ai patterns
3. Test bilingual support (Arabic/English)
4. Test RTL layout

**Code Quality:**
- Use TypeScript
- Follow existing code style
- Use Geneva theme system
- Test in both languages

### 5. File Structure Rules

**Bilingual Routes:**
- `src/app/(ar)/` - Arabic pages (default)
- `src/app/en/` - English pages
- `src/app/(admin-routes)/` - Admin (no bilingual needed)

**Components:**
- `src/components/ui/` - Geneva UI components
- `src/components/sections/` - Page sections
- `src/components/buttons/` - Button components
- `src/components/forms/` - Form components

**i18n:**
- `messages/en.json` - English translations
- `messages/ar.json` - Arabic translations
- `src/i18n/` - i18n configuration

### 6. Stack Requirements

**Required Libraries:**
- Next.js 14
- Material UI v6
- Tailwind CSS v4
- Supabase (database + auth)
- Resend (emails)
- Motion (animations)
- Tabler Icons
- next-intl (bilingual)
- Recharts (charts)

**DO NOT ADD:**
- Custom form libraries
- Custom table libraries
- Custom PDF libraries
- Custom chart libraries (use Recharts)

### 7. Database Schema

**Follow IMPLEMENTATION_PLAN.md for schema:**
- Use Supabase MCP tools when possible
- Create RLS policies for all tables
- Add indexes for performance
- Use migrations for schema changes

### 8. Testing Requirements

**Before Marking Complete:**
- ✅ Test in Arabic (default route)
- ✅ Test in English (`/en` route)
- ✅ Test RTL layout
- ✅ Test language switching
- ✅ Test all navigation links
- ✅ Test responsive design

### 9. Documentation

**Always Update:**
- `PHASE_SUMMARY.md` - Progress tracking
- `IMPLEMENTATION_PLAN.md` - Technical details
- This file (`Claude.md`) - Rules and patterns

### 10. Communication Style

**Be Direct and Decisive:**
- Make decisions, don't ask for permission
- Be brief and clear
- Focus on execution, not explanations
- Internalize reasoning, show results

---

## Quick Reference

**Bilingual Setup:**
- Route groups: `(ar)` and `en/`
- Middleware: `middleware.ts`
- Navigation: `MuiLink component={Link}`
- Translations: `useTranslations('Header')`

**Geneva Components:**
- Cards: `Card` from `components/ui/card.tsx`
- Animations: `RevealSection`
- Buttons: `GetStarted`, `ContactButton`, etc.
- Forms: Extend `contact-form.tsx`

**Patterns to Study:**
- `arabie.ai/arabie.ai-geneva/` - Bilingual implementation
- `geneva-template/` - Component patterns

---

**Last Updated:** January 2025  
**Maintained By:** Development Team


# Open Source Repositories & Components for Tasheel Platform
## Actionable GitHub Search Guide & Recommendations

**Created:** January 2025  
**Purpose:** Identify and integrate open-source components to accelerate development

---

## 🎯 SEARCH STRATEGY

### GitHub Search Queries to Use

#### 1. Admin Dashboard Templates
```bash
# Search terms:
"next.js" "material-ui" admin dashboard stars:>100
"next.js" "mui" admin template typescript
"next.js 14" "app router" admin panel supabase
nextjs-admin-dashboard mui
```

#### 2. Specific Components
```bash
# Kanban Board
react-kanban next.js mui typescript
react-beautiful-dnd next.js kanban

# Invoice/PDF Generation
react-pdf next.js invoice generation
jsPDF invoice template react
@react-pdf/renderer examples

# File Upload & Preview
react-dropzone next.js supabase
file-upload preview component next.js

# Calendar/Appointments
react-big-calendar next.js mui
fullcalendar react next.js
```

#### 3. Email Templates
```bash
# Email Templates
resend email templates react
mjml email templates next.js
react-email examples
```

#### 4. Bilingual/i18n Examples
```bash
# next-intl examples
next-intl arabic rtl example
next-intl supabase example github
next.js bilingual template arabic
```

---

## 📦 RECOMMENDED REPOSITORIES

### 1. Admin Dashboard Templates

#### **material-react-table** (DataGrid Alternative)
- **GitHub:** `https://github.com/KevinVandy/material-react-table`
- **Stars:** 1.5k+
- **Use Case:** Advanced DataGrid with filtering, sorting, pagination
- **Why:** Better than MUI DataGrid for complex admin tables
- **Install:** `npm install material-react-table`
- **License:** MIT

#### **next-admin** (Full Admin Template)
- **GitHub:** Search for "next-admin" or "nextjs-admin"
- **Use Case:** Complete admin panel structure
- **Check:** Look for Next.js 14 + MUI + Supabase combinations

#### **shadcn/ui** (Component Library)
- **GitHub:** `https://github.com/shadcn-ui/ui`
- **Stars:** 60k+
- **Use Case:** High-quality React components (can be used with MUI)
- **Why:** Well-designed, accessible components
- **Note:** Can be adapted to work with MUI theme

### 2. Kanban Board Components

#### **react-beautiful-dnd** (Drag & Drop)
- **GitHub:** `https://github.com/atlassian/react-beautiful-dnd`
- **Stars:** 31k+
- **Use Case:** Drag-and-drop kanban board
- **Install:** `npm install react-beautiful-dnd`
- **License:** Apache 2.0
- **Note:** MUI-compatible

#### **@dnd-kit/core** (Modern Alternative)
- **GitHub:** `https://github.com/clauderic/dnd-kit`
- **Stars:** 8k+
- **Use Case:** Modern drag-and-drop (better than react-beautiful-dnd)
- **Install:** `npm install @dnd-kit/core @dnd-kit/sortable`
- **License:** MIT
- **Why:** Better TypeScript support, more flexible

#### **react-kanban-board** (Complete Kanban)
- **GitHub:** Search for "react-kanban" or "kanban-react"
- **Use Case:** Ready-made kanban board component
- **Check:** Look for MUI-styled versions

### 3. PDF/Invoice Generation

#### **@react-pdf/renderer** (React PDF)
- **GitHub:** `https://github.com/diegomura/react-pdf`
- **Stars:** 7k+
- **Use Case:** Generate PDF invoices in React
- **Install:** `npm install @react-pdf/renderer`
- **License:** MIT
- **Example Repo:** Search for "@react-pdf/renderer invoice example"

#### **jsPDF** (Client-Side PDF)
- **GitHub:** `https://github.com/parallax/jsPDF`
- **Stars:** 28k+
- **Use Case:** Generate PDFs on client-side
- **Install:** `npm install jspdf`
- **License:** MIT
- **Note:** Simpler but less flexible than react-pdf

#### **PDFKit** (Server-Side)
- **GitHub:** `https://github.com/foliojs/pdfkit`
- **Stars:** 10k+
- **Use Case:** Generate PDFs on server (API route)
- **Install:** `npm install pdfkit`
- **License:** MIT
- **Why:** Better for server-side generation

### 4. File Upload & Preview

#### **react-dropzone** (File Upload)
- **GitHub:** `https://github.com/react-dropzone/react-dropzone`
- **Stars:** 11k+
- **Use Case:** Drag-and-drop file upload
- **Install:** `npm install react-dropzone`
- **License:** MIT
- **Integration:** Works with Supabase Storage

#### **react-pdf** (PDF Preview)
- **GitHub:** `https://github.com/wojtekmaj/react-pdf`
- **Stars:** 8k+
- **Use Case:** Preview PDFs in browser
- **Install:** `npm install react-pdf`
- **License:** MIT

#### **react-image-gallery** (Image Preview)
- **GitHub:** `https://github.com/xiaolin/react-image-gallery`
- **Stars:** 3k+
- **Use Case:** Image gallery with preview
- **Install:** `npm install react-image-gallery`
- **License:** MIT

### 5. Calendar & Appointments

#### **react-big-calendar** (Full Calendar)
- **GitHub:** `https://github.com/jquense/react-big-calendar`
- **Stars:** 6k+
- **Use Case:** Full calendar view for appointments
- **Install:** `npm install react-big-calendar`
- **License:** MIT
- **Note:** Can be styled with MUI theme

#### **@fullcalendar/react** (Alternative)
- **GitHub:** `https://github.com/fullcalendar/fullcalendar`
- **Stars:** 18k+
- **Use Case:** Feature-rich calendar
- **Install:** `npm install @fullcalendar/react @fullcalendar/daygrid`
- **License:** MIT

#### **MUI X Date Pickers** (Already Have)
- **Package:** `@mui/x-date-pickers`
- **Use Case:** Date/time selection (already in MUI ecosystem)
- **Install:** `npm install @mui/x-date-pickers`
- **Why:** Native MUI component, better integration

### 6. Email Templates

#### **react-email** (Vercel)
- **GitHub:** `https://github.com/resend/react-email`
- **Stars:** 13k+
- **Use Case:** Build email templates in React
- **Install:** `npm install react-email @react-email/components`
- **License:** MIT
- **Why:** Made by Resend team, perfect for our stack
- **Example:** `https://github.com/resend/react-email/tree/main/examples`

#### **mjml-react** (MJML for React)
- **GitHub:** `https://github.com/wix-incubator/mjml-react`
- **Stars:** 600+
- **Use Case:** Responsive email templates
- **Install:** `npm install mjml-react`
- **License:** MIT

### 7. WhatsApp Integration

#### **whatsapp-web.js** (Node.js)
- **GitHub:** `https://github.com/pedroslopez/whatsapp-web.js`
- **Stars:** 13k+
- **Use Case:** WhatsApp automation (unofficial)
- **License:** GPL-3.0
- **Note:** Not official API, use with caution

#### **Twilio WhatsApp API** (Official)
- **Docs:** `https://www.twilio.com/docs/whatsapp`
- **Use Case:** Official WhatsApp Business API
- **Why:** More reliable, official support
- **Cost:** Pay-per-message

### 8. Form Builders & Wizards

#### **react-hook-form** (Already Using via TanStack)
- **GitHub:** `https://github.com/react-hook-form/react-hook-form`
- **Use Case:** Form validation and management
- **Status:** Can be added if needed

#### **formik** (Alternative)
- **GitHub:** `https://github.com/jaredpalmer/formik`
- **Stars:** 33k+
- **Use Case:** Form state management
- **License:** Apache 2.0

### 9. Charts & Analytics

#### **recharts** (Already Have)
- **Status:** ✅ Already installed
- **Use Case:** Charts and graphs
- **Note:** Keep using this

#### **nivo** (Alternative)
- **GitHub:** `https://github.com/plouc/nivo`
- **Stars:** 10k+
- **Use Case:** More advanced charts
- **License:** MIT

### 10. Bilingual/i18n Examples

#### **next-intl Examples**
- **Search:** "next-intl example" or "next-intl arabic"
- **GitHub:** Look for repos with `next-intl` in description
- **Use Case:** Reference implementations

#### **next.js i18n Examples**
- **Search:** "next.js arabic rtl example"
- **Use Case:** See how others handle RTL

---

## 🔍 HOW TO SEARCH GITHUB EFFECTIVELY

### Using GitHub CLI

```bash
# Install GitHub CLI (if not installed)
brew install gh  # macOS
# or visit: https://cli.github.com/

# Authenticate
gh auth login

# Search for repos
gh search repos "next.js material-ui admin" --language TypeScript --stars ">100"

# Search for code
gh search code "useState" --language TypeScript --repo "owner/repo"

# View a specific repo
gh repo view owner/repo-name

# Clone a repo to explore
gh repo clone owner/repo-name
```

### Using GitHub Web Search

1. **Go to:** `https://github.com/search`
2. **Search syntax:**
   ```
   next.js material-ui admin stars:>100 language:TypeScript
   next.js supabase admin panel
   react-pdf invoice example
   ```

3. **Filter by:**
   - Language: TypeScript
   - Stars: >100 (quality indicator)
   - Updated: Recently (active maintenance)
   - License: MIT or Apache-2.0 (permissive)

### Search Operators

```
# Find repos with specific tech stack
"next.js" "material-ui" "supabase" stars:>50

# Find code examples
language:typescript "react-pdf" "invoice"

# Find recent activity
"next.js admin" pushed:>2024-01-01

# Find by license
"kanban board" license:mit
```

---

## 📋 PRIORITY COMPONENTS TO INTEGRATE

### **HIGH PRIORITY (Do First)**

1. **@dnd-kit/core** - Kanban board (Phase 3)
   - Modern, TypeScript-first
   - Better than react-beautiful-dnd
   - MUI-compatible

2. **react-email** - Email templates (Phase 2)
   - Made by Resend (we're using Resend)
   - Perfect integration
   - Great examples

3. **@react-pdf/renderer** - Invoice generation (Phase 2)
   - Professional PDF generation
   - React components
   - Good examples available

4. **@mui/x-date-pickers** - Appointment calendar (Phase 1/3)
   - Native MUI component
   - Already in ecosystem
   - Better than third-party

### **MEDIUM PRIORITY**

5. **react-dropzone** - File upload (Phase 2)
   - Better UX than native input
   - Works with Supabase Storage

6. **react-pdf** - PDF preview (Phase 2)
   - Preview documents in browser
   - Good UX

7. **material-react-table** - Advanced tables (Phase 3)
   - If MUI DataGrid isn't enough
   - Better filtering/sorting

### **LOW PRIORITY (Future)**

8. **react-big-calendar** - Full calendar (Phase 3)
   - If MUI date pickers aren't enough

9. **nivo** - Advanced charts (Phase 4)
   - If recharts isn't enough

---

## 🛠️ INTEGRATION GUIDE

### Step 1: Evaluate Repo

Before using any repo, check:
- [ ] License is permissive (MIT, Apache-2.0)
- [ ] Recent commits (active maintenance)
- [ ] Stars >100 (community validation)
- [ ] TypeScript support
- [ ] Documentation quality
- [ ] Issue tracker (not abandoned)

### Step 2: Test Integration

1. **Create test branch:**
   ```bash
   git checkout -b test/component-name
   ```

2. **Install package:**
   ```bash
   npm install package-name
   ```

3. **Create test component:**
   ```typescript
   // src/components/test/TestComponent.tsx
   import { Component } from 'package-name';
   
   export default function TestComponent() {
     // Test implementation
   }
   ```

4. **Test in isolation first**

### Step 3: Adapt to Geneva Style

- Use Geneva `Card` wrapper
- Use Geneva colors/theme
- Use Geneva spacing patterns
- Use Geneva animations (`RevealSection`)

### Step 4: Document

- Add to component documentation
- Note any customizations
- Document props/usage

---

## 📚 USEFUL GITHUB REPOSITORIES TO EXPLORE

### Admin Panels
```
# Search for these specific patterns:
- "nextjs-admin-dashboard"
- "next-admin-panel"
- "nextjs-crm-admin"
- "supabase-admin-dashboard"
```

### Complete Examples
```
# Look for full-stack examples:
- "next.js supabase starter"
- "next.js admin template"
- "nextjs-boilerplate"
```

### Component Libraries
```
# MUI-based:
- "mui-x" (official MUI extensions)
- "material-ui-extras"
- "react-admin" (admin framework)
```

---

## 🎯 RECOMMENDED SEARCHES TO RUN

### Run These GitHub Searches:

1. **Admin Dashboard:**
   ```
   "next.js" "material-ui" admin dashboard stars:>100 language:TypeScript
   ```

2. **Kanban Board:**
   ```
   react-kanban mui typescript stars:>50
   ```

3. **PDF Invoice:**
   ```
   "@react-pdf/renderer" invoice example
   ```

4. **Email Templates:**
   ```
   "react-email" resend template
   ```

5. **File Upload:**
   ```
   react-dropzone supabase example
   ```

6. **Calendar:**
   ```
   react-big-calendar next.js mui
   ```

7. **Bilingual:**
   ```
   next-intl arabic rtl example
   ```

---

## 💡 QUICK WINS (Easiest to Integrate)

### 1. **react-email** (30 minutes)
- Install: `npm install react-email @react-email/components`
- Use existing Resend setup
- Replace current email HTML with React components
- **Benefit:** Better email templates, easier maintenance

### 2. **@dnd-kit/core** (2 hours)
- Install: `npm install @dnd-kit/core @dnd-kit/sortable`
- Build kanban board for Phase 3
- **Benefit:** Modern drag-and-drop, better UX

### 3. **@mui/x-date-pickers** (1 hour)
- Install: `npm install @mui/x-date-pickers`
- Use for appointment booking
- **Benefit:** Native MUI, consistent design

### 4. **react-dropzone** (1 hour)
- Install: `npm install react-dropzone`
- Replace file input in quote forms
- **Benefit:** Better UX, drag-and-drop

---

## 🔗 DIRECT LINKS TO EXPLORE

### Component Libraries
- **shadcn/ui:** `https://github.com/shadcn-ui/ui`
- **MUI X:** `https://github.com/mui/mui-x`
- **react-admin:** `https://github.com/marmelab/react-admin`

### Examples & Templates
- **Next.js Examples:** `https://github.com/vercel/next.js/tree/canary/examples`
- **Supabase Examples:** `https://github.com/supabase/supabase/tree/master/examples`
- **Resend Examples:** `https://github.com/resend/react-email/tree/main/examples`

### Tools & Utilities
- **react-pdf:** `https://github.com/wojtekmaj/react-pdf`
- **react-dropzone:** `https://github.com/react-dropzone/react-dropzone`
- **@dnd-kit:** `https://github.com/clauderic/dnd-kit`

---

## ⚠️ IMPORTANT NOTES

### License Compatibility
- **MIT & Apache-2.0:** ✅ Safe to use
- **GPL-3.0:** ⚠️ Check if you can use (may require open-sourcing)
- **Commercial:** ❌ Avoid unless purchasing

### Maintenance Status
- Check "Last updated" date
- Look at recent commits
- Check issue tracker
- Review PR activity

### TypeScript Support
- Prefer packages with built-in TypeScript
- Check `@types/package-name` availability
- Review TypeScript examples in repo

### Bundle Size
- Check package size before adding
- Use `bundlephobia.com` to analyze
- Consider code-splitting for large packages

---

## 🚀 NEXT STEPS

1. **Run the GitHub searches above**
2. **Evaluate top 3 repos for each category**
3. **Create test branches for each**
4. **Integrate highest-value components first**
5. **Document all integrations**

---

**This document should be updated as we discover and integrate new components.**



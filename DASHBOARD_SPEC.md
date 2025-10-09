# Tasheel Portal Dashboard - Technical Specification

## Overview
Client-facing translation request management dashboard built with Next.js App Router, Supabase, and Material-UI.

---

## Architecture

### Route Structure
```
/portal                          → Portal dashboard (main page)
/portal/quote                    → New request form (stays in portal layout)
/portal/requests/[id]            → Individual request detail page
```

### Layout Hierarchy
```
app/(portal)/portal/layout.jsx   → Server component, passes session to shell
  ↓
PortalLayoutShell.jsx            → Client component with layout structure
  ├── PortalTopNav               → Fixed top navigation bar
  ├── PortalSideNav              → Desktop sidebar (280px wide)
  ├── PortalMobileNav            → Mobile drawer navigation
  └── <main>                     → Content area (children)
       └── page.jsx              → Fetches data, renders PortalDashboardClient
            └── PortalDashboardClient.jsx → Main dashboard UI
```

---

## Data Flow

### 1. Data Fetching (Server Side)
**File:** `src/app/(portal)/portal/page.jsx`
```javascript
// Fetches user session + requests from Supabase
const supabase = await getSupabaseServerComponentClient();
const session = await supabase.auth.getSession();
const email = session?.user?.email;
const requests = await fetchPortalRequests({ supabase, email });

// Returns array of request objects:
[
  {
    id: uuid,
    reference: string,
    status: enum,
    serviceName: string,
    sourceLanguage: string,
    targetLanguage: string,
    submittedAt: timestamp,
    turnaround: string,
    options: {
      translationType: 'certified' | 'translation_only' | 'notarized',
      turnaround: 'rush' | 'standard',
      deliveryMethod: 'digital' | 'digital_physical'
    },
    estimatedTotal: number
  }
]
```

### 2. Data Processing (Client Side)
**File:** `src/app/(portal)/PortalDashboardClient.jsx`

Transforms raw request data into:
- **Summary metrics** (active, completed, rush counts)
- **Table columns** (desktop view with 8 columns)
- **Latest request** (first item in array)
- **Formatters** (for consistent data display)

---

## Component Breakdown

### Layout Components

#### PortalLayoutShell
**File:** `src/app/(portal)/PortalLayoutShell.jsx`
- **Purpose:** Main layout wrapper with auth state management
- **Features:**
  - Flexbox layout (sidebar + main content)
  - Auth listener (syncs session state)
  - Sign out handler
  - Mobile nav toggle
  - Sidebar width: 280px
  - Main content padding: top 10-12, sides 3-6

#### PortalTopNav
**File:** `src/app/(portal)/_components/portal-top-nav.jsx`
- **Purpose:** Fixed top navigation bar
- **Elements:**
  - Left: Mobile menu button (hamburger), Title "Translation dashboard"
  - Right: Notifications bell (badge), Avatar (user initial), Sign out button
- **Styling:** AppBar with border-bottom, blur backdrop

#### PortalSideNav
**File:** `src/app/(portal)/_components/portal-side-nav.jsx`
- **Purpose:** Desktop navigation menu
- **Nav Items:**
  1. Overview → /portal (dashboard icon)
  2. Start new request → /portal/quote (file-plus icon)
  3. Invoices → # (disabled)
  4. Account → # (disabled)
- **Footer:** User email + support email
- **Uses:** Next.js Link for client-side navigation (no flashes)

---

### Dashboard Components

#### 1. Welcome Banner
**Location:** `PortalDashboardClient.jsx` lines 117-188
- **Layout:** Card with gradient background
- **Content:**
  - Overline: "Tasheel client workspace"
  - Heading: "Welcome back"
  - Description: "Track requests, upload supporting documents..."
  - Actions: "New request" button, "Help" button (mailto)

#### 2. SummaryCards
**File:** `src/app/(portal)/components/SummaryCards.jsx`
- **Purpose:** Display 3 metric cards
- **Data Source:** `derivePortalSummaryCards(requests)` from `utils/dashboard/metrics.js`
- **Cards:**
  1. Active requests (statuses: submitted, scoping, quote_sent, in_progress, review)
  2. Completed (status: completed)
  3. Rush jobs (turnaround = "rush" or "rush (24 hours)")
- **Layout:** Grid 12/6/4 (xs/sm/md)
- **Card Structure:**
  - Icon box (52x52, colored background)
  - Value (h3, bold)
  - Title (body2, secondary)

#### 3. LatestRequestCard
**File:** `src/app/(portal)/components/LatestRequestCard.jsx`
- **Purpose:** Show most recent request details
- **Data:** First item from requests array
- **Content:**
  - Header: "Latest request" + Status chip
  - Service name
  - Info grid (7 fields in responsive layout):
    * Reference
    * Language pair (sourceLanguage → targetLanguage)
    * Submitted (date)
    * Turnaround
    * Translation type
    * Delivery method
    * Estimated total
  - Actions: "View request", "New request"
- **Empty State:** Alert box with message to start first project

#### 4. RequestTableCard
**File:** `src/app/(portal)/components/RequestTableCard.jsx`
- **Purpose:** List all requests (table or cards)
- **Desktop View (md+):**
  - QueueTable component with 8 columns:
    1. Reference
    2. Service
    3. Language pair
    4. Submitted
    5. Status (colored chip)
    6. Turnaround
    7. Translation type
    8. Delivery
    9. Actions (View button)
- **Mobile View (md-):**
  - Stack of cards, each showing:
    * Service name + reference
    * Status chip
    * 6 info items in grid
    * View button
- **Empty State:** Icon, heading, description, "New request" button

---

## Utility Functions

### Status Management
**File:** `src/utils/dashboard/status.js`

Status metadata map:
```javascript
{
  submitted: { label: 'Submitted', color: 'info' },
  scoping: { label: 'Scoping', color: 'default' },
  quote_sent: { label: 'Quote sent', color: 'warning' },
  in_progress: { label: 'In progress', color: 'primary' },
  review: { label: 'Review', color: 'secondary' },
  completed: { label: 'Completed', color: 'success' },
  archived: { label: 'Archived', color: 'default' },
  rejected: { label: 'Rejected', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'error' }
}
```

### Formatters
**File:** `src/utils/dashboard/formatters.js`

- `formatLanguagePair(request)` → "English → Arabic"
- `formatDate(value)` → "Jan 15, 2025"
- `formatDateTime(value)` → "Jan 15, 2025, 3:45 PM"
- `formatTurnaround(request)` → "Rush (24 hours)" | "Standard (2-3 business days)"
- `formatTranslationType(request)` → "Certified translation" | "Professional translation only" | "Notarized translation"
- `formatDeliveryMethod(request)` → "Digital delivery (PDF)" | "Digital + physical copies"
- `formatEstimatedTotal(request)` → "$150.00" | "Pending quote — shared after Tasheel review"

### Metrics
**File:** `src/utils/dashboard/metrics.js`

- `derivePortalSummaryCards(requests)` → Returns 3 card objects with title, value, icon
- `deriveAdminMetrics(requests)` → Admin version (different metrics)

---

## Navigation Flow

### Current Implementation (Client-Side)
✅ All navigation uses Next.js Link component:
- Sidebar nav items: `<ListItemButton component={Link}>`
- All buttons: Use `LinkButton` which wraps Next.js Link
- IconButtons: `<IconButton component={Link}>`

**Result:** Smooth transitions, no layout flashing, portal shell stays mounted

---

## Responsive Breakpoints

- **xs (0-600px):** Mobile, single column, mobile nav
- **sm (600-900px):** Tablet, 2 columns
- **md (900-1200px):** Small desktop, sidebar appears, 3 columns
- **lg (1200px+):** Large desktop, wider layout

---

## Key Features to Preserve

1. ✅ **Server-side data fetching** (SSR for initial load)
2. ✅ **Client-side navigation** (no page reloads)
3. ✅ **Auth state sync** (real-time session updates)
4. ✅ **Responsive design** (mobile → desktop)
5. ✅ **Supabase integration** (auth + data)
6. ✅ **Type-safe formatters** (consistent data display)
7. ✅ **Empty states** (for new users)
8. ✅ **Loading boundaries** (Suspense + loading.jsx)

---

## What Needs Mantis UI Replacement

### HIGH PRIORITY (ugly components):
1. ❌ **SummaryCards** - Basic cards, need better styling
2. ❌ **PortalSideNav** - Boring sidebar design
3. ❌ **PortalTopNav** - Plain header
4. ❌ **Welcome Banner** - Generic card
5. ❌ **LatestRequestCard** - Could be more polished
6. ❌ **RequestTableCard** - Table styling is basic

### KEEP (functional components):
1. ✅ **PortalLayoutShell** structure (flex layout)
2. ✅ **All utility functions** (formatters, metrics, status)
3. ✅ **Data fetching logic** (Supabase queries)
4. ✅ **Routing structure** (Next.js App Router)
5. ✅ **Auth flow** (session management)

---

## Mantis Integration Strategy

### Phase 1: Layout Components (2 hours)
1. Replace PortalSideNav with Mantis mini-drawer/sidebar
2. Replace PortalTopNav with Mantis header
3. Update PortalLayoutShell to use Mantis layout structure
4. Update color theme to match Mantis

### Phase 2: Dashboard Components (2 hours)
1. Replace SummaryCards with Mantis analytic cards
2. Replace Welcome Banner with Mantis welcome card
3. Replace LatestRequestCard with Mantis data widget
4. Replace RequestTableCard with Mantis table component

### Phase 3: Polish (1 hour)
1. Update typography (Mantis font system)
2. Update spacing (Mantis grid system)
3. Add Mantis shadows/borders
4. Test responsive behavior
5. Test navigation flow

---

## Success Criteria

✅ Dashboard looks like Mantis template
✅ All data displays correctly
✅ Navigation works without flashing
✅ Mobile responsive
✅ Auth still works
✅ No regressions in functionality
✅ Supabase queries unchanged
✅ Loading states work

---

## Files to Modify (in order)

1. `src/app/(portal)/_components/portal-side-nav.jsx`
2. `src/app/(portal)/_components/portal-top-nav.jsx`
3. `src/app/(portal)/PortalLayoutShell.jsx`
4. `src/app/(portal)/components/SummaryCards.jsx`
5. `src/app/(portal)/components/LatestRequestCard.jsx`
6. `src/app/(portal)/components/RequestTableCard.jsx`
7. `src/app/(portal)/PortalDashboardClient.jsx`
8. Theme/color configuration

---

## Data Schema Reference

```typescript
interface TranslationRequest {
  id: string;
  reference: string;
  status: 'submitted' | 'scoping' | 'quote_sent' | 'in_progress' | 'review' | 'completed' | 'archived' | 'rejected' | 'cancelled';
  serviceName?: string;
  service?: string;
  sourceLanguage: string;
  targetLanguage: string;
  submittedAt: string; // ISO timestamp
  turnaround?: string;
  options?: {
    translationType?: 'certified' | 'translation_only' | 'notarized';
    turnaround?: 'rush' | 'standard' | string;
    deliveryMethod?: 'digital' | 'digital_physical';
  };
  estimatedTotal?: number;
  quoteAmount?: number;
}
```

---

## Next Steps

1. Clone Mantis repo: `git clone https://github.com/codedthemes/mantis-free-react-admin-template.git`
2. Analyze Mantis components in `src/layout/` and `src/sections/dashboard/`
3. Map Mantis components to our spec
4. Start replacing components one by one
5. Test after each replacement
6. Keep data flow and routing identical

---

**END OF SPEC**

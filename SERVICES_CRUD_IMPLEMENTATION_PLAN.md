# Services CRUD - Full Implementation Plan

## 🎯 Overview
Build complete CRUD for Services management in admin panel, following our existing patterns (QuoteCreationCard, OrdersTable) and using Geneva Card + MUI components.

---

## 📋 Implementation Steps

### Phase 1: API Routes (Foundation)
**Time: 1-1.5 hours**

#### 1.1 GET /api/admin/services (List)
- Query all services from Supabase
- Support filtering by category, status
- Return formatted data

#### 1.2 POST /api/admin/services (Create)
- Validate input (Zod schema)
- Insert into Supabase
- Handle pricing JSON structure
- Handle arrays (features, process_steps, required_documents)
- Return created service

#### 1.3 GET /api/admin/services/[id] (Get One)
- Fetch service by ID
- Include category name
- Return formatted data

#### 1.4 PUT /api/admin/services/[id] (Update)
- Validate input
- Update in Supabase
- Handle all fields including nested objects
- Return updated service

#### 1.5 DELETE /api/admin/services/[id] (Delete)
- Soft delete (set is_active = false) or hard delete
- Return success

---

### Phase 2: Core Components
**Time: 3-4 hours**

#### 2.1 PricingEditor Component
**File:** `src/components/admin/PricingEditor.tsx`
- Type selector: Fixed / Starting From / Quote
- Conditional amount field (only if Fixed/Starting)
- Notes fields (EN/AR)
- Uses MUI Select, TextField

#### 2.2 ArrayFieldEditor Component
**File:** `src/components/admin/ArrayFieldEditor.tsx`
- List of text inputs
- Add button
- Remove button per item
- For: features, required_documents
- Uses MUI List, TextField, IconButton

#### 2.3 ProcessStepsEditor Component
**File:** `src/components/admin/ProcessStepsEditor.tsx`
- List of step cards (Geneva Card)
- Each step:
  - Number (auto-increment)
  - Title (EN/AR) - side by side
  - Description (EN/AR) - side by side
- Add step button
- Remove step button
- Reorder (optional)

---

### Phase 3: Main Form Component
**Time: 2-3 hours**

#### 3.1 ServiceForm Component
**File:** `src/components/admin/ServiceForm.tsx`
- React Hook Form setup
- Zod validation schema
- 8 Sections:
  1. **Basic Info**: Name (EN/AR), Slug, Category
  2. **Descriptions**: Short (EN/AR), Detailed (EN/AR)
  3. **Pricing**: PricingEditor component
  4. **Features**: ArrayFieldEditor
  5. **Process Steps**: ProcessStepsEditor
  6. **Required Documents**: ArrayFieldEditor
  7. **Media**: Icon, Image Light, Image Dark
  8. **Settings**: Is Active, Is Featured, Sort Order, Turnaround
- Uses MUI Grid2 for layout
- Side-by-side EN/AR fields

---

### Phase 4: Table & List Page
**Time: 1 hour**

#### 4.1 ServicesTable Component
**File:** `src/components/admin/ServicesTable.tsx`
- MUI DataGrid (like OrdersTable)
- Columns:
  - Name (with category badge)
  - Category
  - Price (formatted)
  - Status (Active/Inactive chip)
  - Featured (chip)
  - Actions (Edit, Delete buttons)
- Search by name
- Filter by category
- Filter by status
- Sort by name, date, sort_order
- Wrapped in Geneva Card

#### 4.2 Services List Page
**File:** `src/app/(admin-routes)/admin/services/page.tsx`
- Server component
- Fetch services
- Fetch categories
- Render ServicesTable
- Add "Create Service" button (opens dialog)

---

### Phase 5: Create & Edit Pages
**Time: 1.5-2 hours**

#### 5.1 ServiceCreateDialog Component
**File:** `src/components/admin/ServiceCreateDialog.tsx`
- Dialog wrapper (like QuoteCreationCard)
- ServiceForm inside
- Create handler
- Success/error handling
- Router refresh on success

#### 5.2 Service Edit Page
**File:** `src/app/(admin-routes)/admin/services/[id]/edit/page.tsx`
- Server component: Fetch service data
- Client component: ServiceForm with pre-filled data
- Update handler
- Delete button
- Breadcrumbs

---

### Phase 6: Navigation & Translations
**Time: 30 minutes**

#### 6.1 Add to AdminLayout
- Add "Services" menu item
- Icon: Services icon
- Link to /admin/services

#### 6.2 Add Translations
**File:** `messages/en.json`
- Admin.services namespace
- All labels, buttons, messages

---

## 📁 File Structure

```
src/
├── app/
│   ├── api/admin/services/
│   │   ├── route.ts                    # GET (list), POST (create)
│   │   └── [id]/
│   │       └── route.ts                # GET (one), PUT (update), DELETE
│   └── (admin-routes)/admin/services/
│       ├── page.tsx                    # List page
│       ├── new/
│       │   └── page.tsx                # Create page (with dialog)
│       └── [id]/
│           └── edit/
│               └── page.tsx            # Edit page
│
├── components/admin/
│   ├── ServicesTable.tsx               # Table component
│   ├── ServiceForm.tsx                 # Main form
│   ├── ServiceCreateDialog.tsx         # Create dialog
│   ├── PricingEditor.tsx               # Pricing section
│   ├── ArrayFieldEditor.tsx            # Simple arrays
│   └── ProcessStepsEditor.tsx          # Process steps
│
└── lib/
    └── admin-queries.ts                # Add service queries
```

---

## 🎨 Component Patterns

### ServicesTable (like OrdersTable)
```tsx
<Card borderRadius={20}>
  <DataGrid
    rows={services}
    columns={columns}
    // ... same pattern
  />
</Card>
```

### ServiceCreateDialog (like QuoteCreationCard)
```tsx
<Card borderRadius={20}>
  <Dialog>
    <ServiceForm onSubmit={handleCreate} />
  </Dialog>
</Card>
```

### ServiceForm Sections
```tsx
<Card borderRadius={20}>
  <Box sx={{ p: 3 }}>
    {/* Section 1: Basic Info */}
    <Grid container spacing={2}>
      <Grid xs={6}><TextField name="name_en" /></Grid>
      <Grid xs={6}><TextField name="name_ar" /></Grid>
    </Grid>
    
    {/* Section 2: Pricing */}
    <PricingEditor />
    
    {/* Section 3: Features */}
    <ArrayFieldEditor name="features" />
    
    {/* ... etc */}
  </Box>
</Card>
```

---

## 🔧 Technical Details

### Validation Schema (Zod)
```typescript
const serviceSchema = z.object({
  name_en: z.string().min(1),
  name_ar: z.string().min(1),
  slug: z.string().min(1),
  category_id: z.string().uuid(),
  pricing: z.object({
    type: z.enum(['fixed', 'quote', 'starting']),
    amount: z.number().positive().optional(),
    note_en: z.string().optional(),
    note_ar: z.string().optional(),
  }).optional(),
  features: z.array(z.string()).optional(),
  process_steps: z.array(z.object({
    number: z.number(),
    title_en: z.string(),
    title_ar: z.string(),
    description_en: z.string(),
    description_ar: z.string(),
  })).optional(),
  // ... etc
});
```

### Database Queries
- Use existing `supabase` client
- Handle JSONB fields (pricing, process_steps)
- Handle arrays (features, required_documents)
- Join with categories table

---

## ✅ Success Criteria

1. ✅ Can list all services in table
2. ✅ Can create new service with all fields
3. ✅ Can edit existing service
4. ✅ Can delete service
5. ✅ Multi-language fields work (EN/AR)
6. ✅ Pricing editor works (conditional fields)
7. ✅ Array fields work (add/remove)
8. ✅ Process steps work (complex array)
9. ✅ Form validation works
10. ✅ Success/error handling works

---

## 🚀 Ready to Start!

Let's begin with Phase 1: API Routes! 🎯


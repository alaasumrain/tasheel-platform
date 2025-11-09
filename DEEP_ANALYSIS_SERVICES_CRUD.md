# Deep Analysis: GitHub Repos → Our Services CRUD Needs

## 🎯 Our Specific Requirements

### 1. **Service Data Structure** (from `src/lib/types/service.ts`)

```typescript
interface Service {
  // Basic Info
  id: string
  category_id: string
  slug: string
  name: string
  name_en: string
  name_ar: string
  
  // Descriptions (Multi-language)
  short_description?: string
  short_description_en?: string
  short_description_ar?: string
  detailed_description?: string
  description_en?: string
  description_ar?: string
  
  // Pricing (Nested Object)
  pricing?: {
    type: 'fixed' | 'quote' | 'starting'
    amount?: number
    note_en?: string
    note_ar?: string
  }
  
  // Arrays
  required_documents?: string[]
  features?: string[]
  process_steps?: ProcessStep[]  // Complex array with nested objects
  
  // Process Steps Structure
  process_steps?: {
    number: number
    title_en: string
    title_ar: string
    description_en: string
    description_ar: string
  }[]
  
  // Media
  icon?: string
  image_light?: string
  image_dark?: string
  
  // Settings
  is_featured?: boolean
  is_active?: boolean
  sort_order?: number
  turnaround_days?: number
  turnaround_window?: string
}
```

---

## 📚 Patterns from Repos → Our Implementation

### 1. **List/Table Pattern**

**From:** `refine_dashboard/src/pages/company/list.tsx` + Our `OrdersTable.tsx`

**Our Pattern:**
- ✅ Already using MUI DataGrid (perfect!)
- ✅ Search/filter functionality
- ✅ Action buttons (Edit/Delete)
- ✅ Status chips
- ✅ Pagination

**What to Add:**
```tsx
// ServicesTable.tsx - Similar to OrdersTable
- Columns: Name, Category, Price, Status (Active/Inactive), Featured, Actions
- Search by name
- Filter by category
- Filter by status (active/inactive)
- Sort by name, date, sort_order
- Create button in header
- Edit/Delete buttons per row
```

---

### 2. **Create Form Pattern**

**From:** `refine_dashboard/src/pages/company/create.tsx` + Our `QuoteCreationCard.tsx`

**Our Pattern:**
- ✅ Using Dialog/Modal (like QuoteCreationCard)
- ✅ MUI TextField, Select, etc.
- ✅ Loading states
- ✅ Success/error handling
- ✅ Router refresh after success

**What We Need:**
```tsx
// ServiceCreateDialog.tsx
- Modal form (like QuoteCreationCard)
- All service fields
- Multi-language fields (EN/AR tabs or side-by-side)
- Pricing editor component
- Array fields for features/steps
- Category selector
- File uploads for images
```

---

### 3. **Edit Form Pattern**

**From:** `refine_dashboard/src/pages/company/edit.tsx` + Our `OrderDetailClient.tsx`

**Our Pattern:**
- ✅ Full page form (not modal)
- ✅ Pre-filled data
- ✅ Loading states
- ✅ Update handlers

**What We Need:**
```tsx
// ServiceEditPage.tsx
- Full page form
- Pre-fill all fields
- Same structure as create
- Delete button
- Save button
```

---

### 4. **Array Field Pattern**

**From:** `react-admin/packages/ra-ui-materialui/src/input/ArrayInput/ArrayInput.tsx`

**Key Pattern:**
- Uses `useFieldArray` from react-hook-form
- Add/Remove buttons
- Each item has fields
- Validation per item

**Our Implementation:**
```tsx
// ArrayFieldEditor.tsx - For features
- List of text inputs
- Add button
- Remove button per item
- Drag to reorder (optional)

// ProcessStepsEditor.tsx - For process steps
- List of step cards
- Each step has:
  - Number (auto-increment)
  - Title (EN/AR)
  - Description (EN/AR)
- Add step button
- Remove step button
- Reorder steps
```

---

### 5. **Multi-Language Fields Pattern**

**From:** Our codebase (no direct repo example, but we have the structure)

**Our Pattern:**
- Fields have `_en` and `_ar` suffixes
- Need to display both languages in form

**Implementation Options:**

**Option A: Tabs**
```tsx
<Tabs value={langTab}>
  <Tab label="English" />
  <Tab label="Arabic" />
</Tabs>
<TabPanel>
  <TextField name="name_en" />
  <TextField name="description_en" />
</TabPanel>
```

**Option B: Side-by-Side**
```tsx
<Grid container spacing={2}>
  <Grid xs={6}>
    <TextField label="Name (EN)" name="name_en" />
  </Grid>
  <Grid xs={6}>
    <TextField label="Name (AR)" name="name_ar" />
  </Grid>
</Grid>
```

**Option C: Accordion (like refine_dashboard tasks)**
```tsx
<Accordion>
  <AccordionSummary>English</AccordionSummary>
  <AccordionDetails>
    <TextField name="name_en" />
  </AccordionDetails>
</Accordion>
```

**Recommendation:** Option B (Side-by-Side) - Most efficient for admin

---

### 6. **Pricing Editor Pattern**

**From:** Our `QuoteCreationCard.tsx` + `InvoiceCreationCard.tsx`

**Our Pattern:**
- Conditional fields based on type
- Number input with validation
- Text fields for notes

**Implementation:**
```tsx
// PricingEditor.tsx
<FormControl>
  <InputLabel>Pricing Type</InputLabel>
  <Select value={pricing.type} onChange={...}>
    <MenuItem value="fixed">Fixed Price</MenuItem>
    <MenuItem value="starting">Starting From</MenuItem>
    <MenuItem value="quote">Quote Based</MenuItem>
  </Select>
</FormControl>

{pricing.type !== 'quote' && (
  <TextField
    type="number"
    label="Amount (ILS)"
    value={pricing.amount}
    inputProps={{ min: 0, step: 0.01 }}
  />
)}

<TextField label="Note (EN)" name="pricing.note_en" />
<TextField label="Note (AR)" name="pricing.note_ar" />
```

---

### 7. **Form Structure Pattern**

**From:** Our `QuoteCreationCard.tsx` + `InvoiceCreationCard.tsx`

**Our Pattern:**
- React Hook Form (implicit in our code)
- MUI components
- Validation
- Loading states
- Success/error alerts

**What We Need:**
```tsx
// ServiceForm.tsx - Main form component
- Use React Hook Form
- Zod validation schema
- All fields organized in sections:
  1. Basic Info
  2. Descriptions (EN/AR)
  3. Pricing
  4. Features (Array)
  5. Process Steps (Array)
  6. Media
  7. Settings
```

---

## 🔧 Component Breakdown

### 1. **ServicesTable.tsx**
**Based on:** `OrdersTable.tsx` + `refine_dashboard list.tsx`

```tsx
- MUI DataGrid
- Columns: Name, Category, Price, Status, Featured, Actions
- Search/filter
- Create button
- Edit/Delete actions
```

### 2. **ServiceForm.tsx**
**Based on:** Our form patterns + refine_dashboard forms

```tsx
- React Hook Form
- Zod validation
- Sections:
  - Basic Info (name_en, name_ar, slug, category)
  - Descriptions (short_en, short_ar, detailed_en, detailed_ar)
  - Pricing (PricingEditor component)
  - Features (ArrayFieldEditor component)
  - Process Steps (ProcessStepsEditor component)
  - Media (icon, images)
  - Settings (is_active, is_featured, sort_order, turnaround)
```

### 3. **PricingEditor.tsx**
**Based on:** `QuoteCreationCard.tsx` + conditional logic

```tsx
- Type selector
- Conditional amount field
- Notes (EN/AR)
```

### 4. **ArrayFieldEditor.tsx**
**Based on:** `react-admin ArrayInput` + our needs

```tsx
- List of items
- Add button
- Remove button per item
- For simple arrays (features, required_documents)
```

### 5. **ProcessStepsEditor.tsx**
**Based on:** `react-admin ArrayInput` + complex structure

```tsx
- List of step cards
- Each step: number, title_en, title_ar, description_en, description_ar
- Add/Remove/Reorder
```

### 6. **ServiceCreateDialog.tsx**
**Based on:** `QuoteCreationCard.tsx` (Dialog pattern)

```tsx
- Dialog wrapper
- ServiceForm inside
- Create handler
- Success/error handling
```

### 7. **ServiceEditPage.tsx**
**Based on:** `OrderDetailClient.tsx` (Full page pattern)

```tsx
- Full page layout
- ServiceForm with pre-filled data
- Update handler
- Delete button
```

---

## 📋 Form Sections Breakdown

### Section 1: Basic Information
```tsx
- Name (EN) - TextField
- Name (AR) - TextField
- Slug - TextField (auto-generated from name_en)
- Category - Select (from categories)
```

### Section 2: Descriptions
```tsx
- Short Description (EN) - TextField multiline
- Short Description (AR) - TextField multiline
- Detailed Description (EN) - TextField multiline
- Detailed Description (AR) - TextField multiline
```

### Section 3: Pricing
```tsx
- PricingEditor component
  - Type: Select
  - Amount: Number (conditional)
  - Note (EN): TextField
  - Note (AR): TextField
```

### Section 4: Features
```tsx
- ArrayFieldEditor component
  - List of TextFields
  - Add button
  - Remove button per item
```

### Section 5: Process Steps
```tsx
- ProcessStepsEditor component
  - List of step cards
  - Each step:
    - Number (auto)
    - Title (EN)
    - Title (AR)
    - Description (EN)
    - Description (AR)
  - Add step button
  - Remove step button
```

### Section 6: Required Documents
```tsx
- ArrayFieldEditor component (same as features)
  - List of TextFields
  - Add/Remove buttons
```

### Section 7: Media
```tsx
- Icon - TextField (or file upload)
- Image Light - TextField (or file upload)
- Image Dark - TextField (or file upload)
```

### Section 8: Settings
```tsx
- Is Active - Switch
- Is Featured - Switch
- Sort Order - Number
- Turnaround Days - Number
- Turnaround Window - TextField
```

---

## 🎨 UI/UX Patterns

### From Our Existing Code:
- ✅ Dialog for create (like QuoteCreationCard)
- ✅ Full page for edit (like OrderDetailClient)
- ✅ MUI DataGrid for tables (like OrdersTable)
- ✅ Card components for sections
- ✅ Alert for success/error
- ✅ Loading states
- ✅ Router refresh after success

### From Repos:
- ✅ Accordion for collapsible sections (refine_dashboard tasks)
- ✅ Array field add/remove pattern (react-admin)
- ✅ Conditional fields (pricing type)
- ✅ Form validation patterns

---

## 🔄 Data Flow

### Create Flow:
```
1. User clicks "Create Service"
2. Dialog opens with ServiceForm
3. User fills form
4. Submit → POST /api/admin/services
5. Success → Close dialog, refresh table
6. Error → Show error alert
```

### Edit Flow:
```
1. User clicks "Edit" on service row
2. Navigate to /admin/services/[id]/edit
3. Load service data
4. Pre-fill ServiceForm
5. User edits
6. Submit → PUT /api/admin/services/[id]
7. Success → Show success, refresh
8. Error → Show error alert
```

### Delete Flow:
```
1. User clicks "Delete"
2. Confirm dialog
3. DELETE /api/admin/services/[id]
4. Success → Refresh table
5. Error → Show error alert
```

---

## 📝 Validation Schema (Zod)

```typescript
const serviceSchema = z.object({
  name_en: z.string().min(1),
  name_ar: z.string().min(1),
  slug: z.string().min(1),
  category_id: z.string().uuid(),
  short_description_en: z.string().optional(),
  short_description_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
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
  required_documents: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().default(0),
  turnaround_days: z.number().optional(),
  turnaround_window: z.string().optional(),
});
```

---

## 🚀 Implementation Priority

1. **API Routes** (1 hour)
   - GET /api/admin/services
   - POST /api/admin/services
   - GET /api/admin/services/[id]
   - PUT /api/admin/services/[id]
   - DELETE /api/admin/services/[id]

2. **ServicesTable** (1 hour)
   - Based on OrdersTable
   - Add columns
   - Add actions

3. **ServiceForm** (2 hours)
   - Basic structure
   - All fields
   - Validation

4. **PricingEditor** (30 min)
   - Conditional fields
   - Type selector

5. **ArrayFieldEditor** (1 hour)
   - Simple array handling
   - Add/Remove

6. **ProcessStepsEditor** (1.5 hours)
   - Complex array
   - Multi-language fields per step

7. **Create Dialog** (30 min)
   - Wrap ServiceForm
   - Handle create

8. **Edit Page** (30 min)
   - Wrap ServiceForm
   - Pre-fill data
   - Handle update

**Total: ~7-8 hours**

---

## 💡 Key Insights

1. **We already have great patterns** - QuoteCreationCard, InvoiceCreationCard, OrdersTable
2. **Multi-language is unique** - Need side-by-side or tabs
3. **Array fields need custom components** - Features and Process Steps
4. **Pricing needs conditional logic** - Based on type
5. **Process Steps are complex** - Nested objects with multi-language fields

---

## 🎯 Final Component Structure

```
src/components/admin/
  - ServicesTable.tsx          (List view)
  - ServiceForm.tsx            (Main form)
  - PricingEditor.tsx          (Pricing section)
  - ArrayFieldEditor.tsx       (Simple arrays)
  - ProcessStepsEditor.tsx     (Complex array)
  - ServiceCreateDialog.tsx    (Create modal)

src/app/(admin-routes)/admin/services/
  - page.tsx                   (List page)
  - new/page.tsx               (Create - uses dialog)
  - [id]/edit/page.tsx         (Edit page)
```

This comprehensive mapping shows exactly how to build our Services CRUD! 🚀


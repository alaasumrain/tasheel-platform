# GitHub Repos Analysis - CRUD Patterns for Services Management

## 📚 Repos Cloned

1. **refine_dashboard** - React + Ant Design + Refine
2. **react-admin** - React Admin framework
3. **react_admin_dashboard** - React + MUI
4. **next-admin** - Next.js + Prisma admin generator
5. **materio-nextjs** - Next.js + MUI template
6. **nextjs-admin-dashboard** - Next.js admin dashboard

---

## 🎯 Key Patterns Found

### 1. **Create Form Pattern** (from refine_dashboard)

**File:** `temp/refine_dashboard/src/pages/company/create.tsx`

**Key Features:**
- Modal-based create form
- Uses `useModalForm` hook
- Form validation with rules
- Select dropdowns for relationships
- Redirect after success

**Code Pattern:**
```tsx
const { formProps, modalProps } = useModalForm({
  action: 'create',
  defaultVisible: true,
  resource: 'companies',
  redirect: false,
  mutationMode: 'pessimistic',
  onMutationSuccess: goToListPage,
})

<Modal {...modalProps} title="Create Company">
  <Form {...formProps} layout="vertical">
    <Form.Item label="Name" name="name" rules={[{required: true}]}>
      <Input />
    </Form.Item>
    <Form.Item label="Category" name="categoryId">
      <Select {...selectProps} />
    </Form.Item>
  </Form>
</Modal>
```

**What We Can Learn:**
- Modal approach for create (cleaner UX)
- Form validation patterns
- Relationship handling (select dropdowns)
- Success/error handling

---

### 2. **Edit Form Pattern** (from refine_dashboard)

**File:** `temp/refine_dashboard/src/pages/company/edit.tsx`

**Key Features:**
- Pre-filled form with existing data
- Uses `useForm` hook
- Two-column layout (form + related data)
- Save button props
- Loading states

**Code Pattern:**
```tsx
const { saveButtonProps, formProps, formLoading, queryResult } = useForm({
  redirect: false,
  meta: { gqlMutation: UPDATE_COMPANY_MUTATION }
})

<Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
  <Form {...formProps} layout='vertical'>
    <Form.Item label="Name" name="name">
      <Input />
    </Form.Item>
    <Form.Item label="Price" name="price">
      <InputNumber addonBefore='$' min={0} />
    </Form.Item>
  </Form>
</Edit>
```

**What We Can Learn:**
- Pre-filling form data
- Loading states
- Two-column layouts
- Number inputs with formatting

---

### 3. **List/Table Pattern** (from refine_dashboard)

**File:** `temp/refine_dashboard/src/pages/company/list.tsx`

**Key Features:**
- Table with columns
- Search/filter functionality
- Pagination
- Action buttons (Edit, Delete)
- Create button in header

**Code Pattern:**
```tsx
const { tableProps, filters } = useTable({
  resource: 'companies',
  onSearch: (values) => [{ field: 'name', operator: 'contains', value: values.name }],
  pagination: { pageSize: 12 },
  sorters: { initial: [{ field: 'createdAt', order: 'desc' }] }
})

<List headerButtons={() => <CreateButton />}>
  <Table {...tableProps}>
    <Table.Column dataIndex="name" title="Name" 
      filterDropdown={(props) => <FilterDropdown {...props}><Input /></FilterDropdown>} />
    <Table.Column dataIndex="id" title="Actions" 
      render={(value) => (
        <Space>
          <EditButton recordItemId={value} />
          <DeleteButton recordItemId={value} />
        </Space>
      )} />
  </Table>
</List>
```

**What We Can Learn:**
- Table structure
- Search implementation
- Action buttons pattern
- Filter dropdowns

---

### 4. **Next-Admin Form Pattern** (from next-admin)

**File:** `temp/next-admin/packages/next-admin/src/components/Form.tsx`

**Key Features:**
- JSON Schema-based forms
- Custom field types
- Array field support
- File upload handling
- Rich text editor

**What We Can Learn:**
- Array field management (for features/steps)
- File upload patterns
- Form validation
- Custom input components

---

## 🔧 Patterns We Should Use for Services CRUD

### 1. **Services List Page**
```tsx
// Similar to refine_dashboard list pattern
- Table with columns: Name, Category, Price, Status, Actions
- Search by name
- Filter by category
- Sort by name/date
- Pagination
- Create button → opens modal
- Edit/Delete buttons per row
```

### 2. **Create Service Modal**
```tsx
// Similar to refine_dashboard create pattern
- Modal form
- Basic info: Name (EN/AR), Slug, Category
- Descriptions: Short (EN/AR), Detailed (EN/AR)
- Pricing: Type dropdown, Amount, Notes (EN/AR)
- Features: Array field (add/remove)
- Process Steps: Array field with number/title/description
- Media: Icon, Images
- Settings: Active, Featured, Sort Order
```

### 3. **Edit Service Page**
```tsx
// Similar to refine_dashboard edit pattern
- Full page form (not modal)
- Pre-filled with existing data
- Same fields as create
- Save button
- Delete button
- Loading states
```

### 4. **Pricing Editor Component**
```tsx
// Custom component for pricing
- Type selector: Fixed / Starting From / Quote
- Conditional amount field (only if Fixed/Starting)
- Notes fields (EN/AR)
- Currency formatting
```

### 5. **Array Field Editor**
```tsx
// For features and process steps
- Add button
- List of items
- Each item: Remove button, Edit fields
- For steps: Number, Title (EN/AR), Description (EN/AR)
```

---

## 📝 Implementation Plan Based on Patterns

### Step 1: API Routes
```typescript
// src/app/api/admin/services/route.ts
GET    - List all services
POST   - Create service

// src/app/api/admin/services/[id]/route.ts
GET    - Get service by ID
PUT    - Update service
DELETE - Delete service
```

### Step 2: Services List Page
```typescript
// src/app/(admin-routes)/admin/services/page.tsx
- Use MUI DataGrid (like OrdersTable)
- Search, filter, sort
- Actions column
```

### Step 3: Service Form Component
```typescript
// src/components/admin/ServiceForm.tsx
- React Hook Form
- Zod validation
- All fields
- Submit handler
```

### Step 4: Create Modal
```typescript
// src/app/(admin-routes)/admin/services/new/page.tsx
- Modal with ServiceForm
- Success redirect
```

### Step 5: Edit Page
```typescript
// src/app/(admin-routes)/admin/services/[id]/edit/page.tsx
- Full page with ServiceForm
- Pre-fill data
- Update handler
```

---

## 🎨 UI Components We Need

1. **ServiceForm** - Main form component
2. **PricingEditor** - Pricing section
3. **ArrayFieldEditor** - For features/steps
4. **CategorySelector** - Dropdown for categories
5. **ServicesTable** - List view

---

## 💡 Key Takeaways

1. **Modal for Create** - Better UX than separate page
2. **Full Page for Edit** - More space for complex forms
3. **Array Fields** - Need custom component for features/steps
4. **Validation** - Use Zod with React Hook Form
5. **Loading States** - Show spinners during operations
6. **Success Messages** - Toast notifications
7. **Error Handling** - Display errors clearly

---

## 🚀 Next Steps

1. Create API routes
2. Build ServicesTable component
3. Build ServiceForm component
4. Build PricingEditor component
5. Build ArrayFieldEditor component
6. Create pages (list, create, edit)
7. Add to navigation

**Estimated Time:** 4-6 hours

---

## 📂 Files to Reference

- `temp/refine_dashboard/src/pages/company/create.tsx` - Create pattern
- `temp/refine_dashboard/src/pages/company/edit.tsx` - Edit pattern
- `temp/refine_dashboard/src/pages/company/list.tsx` - List pattern
- `temp/next-admin/packages/next-admin/src/components/Form.tsx` - Form patterns

These repos give us excellent patterns to follow! 🎯


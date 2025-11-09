# Detailed Implementation Plan: CRM & Workflow Systems

**Date:** January 2025  
**Status:** Ready for Implementation  
**Purpose:** Step-by-step implementation guide for completing CRM and workflow features

---

## Overview

This plan provides detailed, actionable steps to implement:
1. Customer Management in Admin Panel
2. Financial Dashboard
3. User Management CRUD
4. Task Management System (Phase 3)
5. SLA Tracking (Phase 3)
6. Workflow Pipelines (Phase 3)

---

## Phase 1: Complete CRM in Admin (HIGH PRIORITY)

### 1.1 Customer Management Page

#### Step 1: Create Database Queries
**File:** `src/lib/admin-queries.ts`

**Add these functions:**
```typescript
export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  language_preference: 'ar' | 'en';
  created_at: string;
  updated_at: string;
}

export interface CustomersFilter {
  search?: string;
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Get all customers with optional filters, sorting, and pagination
 */
export async function getCustomers(filters?: CustomersFilter): Promise<Customer[]>;
export async function getCustomers(filters?: CustomersFilter & { paginated?: false }): Promise<Customer[]>;
export async function getCustomers(filters?: CustomersFilter & { paginated: true }): Promise<PaginatedResult<Customer>>;
export async function getCustomers(filters?: CustomersFilter & { paginated?: boolean }): Promise<Customer[] | PaginatedResult<Customer>> {
  const supabaseClient = await createClient();
  
  let query = supabaseClient
    .from('customers')
    .select('*', { count: filters?.paginated ? 'exact' : undefined });

  const queryOptions: QueryOptions = {
    search: filters?.search,
    searchFields: ['email', 'name', 'phone'],
    sortColumn: filters?.sortColumn || 'created_at',
    sortDirection: filters?.sortDirection || 'desc',
    page: filters?.page,
    pageSize: filters?.pageSize,
  };

  const { query: builtQuery, skip, take } = buildQuery(query, queryOptions);

  if (filters?.paginated) {
    builtQuery.range(skip, skip + take - 1);
  }

  const { data, error, count } = await builtQuery;

  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }

  if (filters?.paginated) {
    const total = count || 0;
    const pageSize = filters.pageSize || 25;
    return {
      data: (data as Customer[]) || [],
      total,
      page: filters.page || 1,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  return (data as Customer[]) || [];
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string) {
  const supabaseClient = await createClient();
  const { data, error } = await supabaseClient
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }

  return data as Customer;
}

/**
 * Get all orders for a customer
 */
export async function getCustomerOrders(customerId: string) {
  const supabaseClient = await createClient();
  const { data, error } = await supabaseClient
    .from('applications')
    .select('*')
    .eq('customer_id', customerId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }

  return (data as Application[]) || [];
}
```

**Reference:** `src/lib/admin-queries.ts` - Follow same pattern as `getUsers()` and `getOrders()`

---

#### Step 2: Create Customers Table Component
**File:** `src/components/admin/CustomersTable.tsx`

**Reference:** 
- `src/components/admin/OrdersTable.tsx` - Table structure
- `temp/react-admin/examples/crm/src/contacts/ContactList.tsx` - Customer list patterns

**Features:**
- MUI DataGrid
- Search functionality
- Sorting and pagination
- Action buttons (View, Edit)
- Export to CSV

---

#### Step 3: Create Customers List Page
**File:** `src/app/(admin-routes)/admin/customers/page.tsx`

**Reference:**
- `src/app/(admin-routes)/admin/orders/page.tsx` - Page structure
- `temp/react-admin/examples/crm/src/contacts/ContactList.tsx` - List patterns

**Structure:**
```typescript
import { Box } from '@mui/material';
import { CustomersPageClient } from '@/components/admin/CustomersPageClient';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { getCustomers } from '@/lib/admin-queries';
import { getTranslations } from 'next-intl/server';
import { parseQueryParams } from '@/lib/utils/query-builder';
import { convertSearchParamsToURLSearchParams } from '@/lib/utils/search-params';

export const dynamic = 'force-dynamic';

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const t = await getTranslations('Admin.customers');
  const params = await searchParams;
  const searchParamsObj = convertSearchParamsToURLSearchParams(params);
  const queryOptions = parseQueryParams(searchParamsObj);
  
  const customers = await getCustomers({
    search: queryOptions.search,
    page: queryOptions.page,
    pageSize: queryOptions.pageSize,
    sortColumn: queryOptions.sortColumn,
    sortDirection: queryOptions.sortDirection,
  });

  return (
    <Box>
      <AdminBreadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Customers' },
        ]}
      />
      <CustomersPageClient customers={customers} />
    </Box>
  );
}
```

---

#### Step 4: Create Customer Detail Page
**File:** `src/app/(admin-routes)/admin/customers/[id]/page.tsx`

**Reference:**
- `src/app/(admin-routes)/admin/orders/[id]/page.tsx` - Detail page structure
- `temp/react-admin/examples/crm/src/contacts/ContactShow.tsx` - Customer detail patterns

**Features:**
- Customer information display
- Order history table
- Communication timeline
- Notes section
- Contact actions (email, WhatsApp, phone)

**Component:** `src/components/admin/CustomerDetailClient.tsx`

---

#### Step 5: Add Translations
**Files:** 
- `messages/en.json`
- `messages/ar.json`

**Add:**
```json
{
  "Admin": {
    "customers": {
      "title": "Customers",
      "description": "Manage customer accounts",
      "list": {
        "title": "All Customers",
        "search": "Search customers...",
        "noResults": "No customers found"
      },
      "detail": {
        "title": "Customer Details",
        "orders": "Order History",
        "communications": "Communication Log",
        "notes": "Notes"
      }
    }
  }
}
```

---

#### Step 6: Add Navigation Link
**File:** `src/components/admin/AdminLayout.tsx`

**Add to sidebar navigation:**
```typescript
{
  label: 'Customers',
  href: '/admin/customers',
  icon: PeopleIcon,
}
```

---

### 1.2 Financial Dashboard

#### Step 1: Create Financial Queries
**File:** `src/lib/admin-queries.ts`

**Add these functions:**
```typescript
export interface RevenueMetrics {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueAllTime: number;
  outstandingInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
}

export async function getRevenueMetrics(): Promise<RevenueMetrics> {
  const supabaseClient = await createClient();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const thisMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  
  // Get all paid invoices
  const { data: invoices } = await supabaseClient
    .from('invoices')
    .select('amount, status, paid_at, created_at')
    .eq('status', 'paid');
  
  // Calculate metrics
  const revenueToday = invoices
    ?.filter(inv => new Date(inv.paid_at) >= today)
    .reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  
  const revenueThisWeek = invoices
    ?.filter(inv => new Date(inv.paid_at) >= thisWeek)
    .reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  
  const revenueThisMonth = invoices
    ?.filter(inv => new Date(inv.paid_at) >= thisMonth)
    .reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  
  const revenueAllTime = invoices
    ?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  
  // Get invoice counts
  const { data: allInvoices } = await supabaseClient
    .from('invoices')
    .select('status');
  
  const outstandingInvoices = allInvoices?.filter(inv => inv.status === 'pending').length || 0;
  const paidInvoices = allInvoices?.filter(inv => inv.status === 'paid').length || 0;
  const pendingInvoices = allInvoices?.filter(inv => inv.status === 'pending').length || 0;
  
  return {
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    revenueAllTime,
    outstandingInvoices,
    paidInvoices,
    pendingInvoices,
  };
}

export async function getInvoices(filters?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabaseClient = await createClient();
  
  let query = supabaseClient
    .from('invoices')
    .select('*, applications(order_number, service_slug)', { count: filters?.page ? 'exact' : undefined });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.page && filters?.pageSize) {
    const skip = (filters.page - 1) * filters.pageSize;
    query = query.range(skip, skip + filters.pageSize - 1);
  }
  
  const { data, error, count } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
  
  return {
    data: data || [],
    total: count || 0,
  };
}
```

---

#### Step 2: Enhance Main Dashboard
**File:** `src/app/(admin-routes)/admin/page.tsx`

**Add revenue stats cards:**
```typescript
import { AttachMoney as RevenueIcon } from '@mui/icons-material';

// In the stats cards section:
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
  <StatsCard
    title={t('stats.revenueToday')}
    value={`${metrics.revenueToday.toFixed(2)} ILS`}
    icon={RevenueIcon}
    color="success"
  />
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
  <StatsCard
    title={t('stats.revenueThisMonth')}
    value={`${metrics.revenueThisMonth.toFixed(2)} ILS`}
    icon={RevenueIcon}
    color="success"
  />
</Grid>
```

**Update:** `getDashboardMetrics()` to include revenue metrics

---

#### Step 3: Create Financial Dashboard Page
**File:** `src/app/(admin-routes)/admin/financials/page.tsx`

**Reference:**
- `src/app/(admin-routes)/admin/page.tsx` - Dashboard structure

**Features:**
- Revenue metrics cards
- Revenue trends chart
- Invoice management table
- Payment history table
- Export functionality

**Components:**
- `src/components/admin/FinancialDashboard.tsx`
- `src/components/admin/InvoicesTable.tsx`
- `src/components/admin/PaymentsTable.tsx`
- `src/components/admin/RevenueChart.tsx`

---

### 1.3 User Management CRUD

#### Step 1: Create User API Endpoints
**File:** `src/app/api/admin/users/route.ts`

**Add POST endpoint:**
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function POST(request: Request) {
  await checkAdminAuth();
  
  const body = await request.json();
  const { email, name, role, password } = body;
  
  const supabaseClient = await createClient();
  
  // Create auth user first
  const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }
  
  // Create user record
  const { data: user, error: userError } = await supabaseClient
    .from('users')
    .insert({
      id: authUser.user.id,
      email,
      name,
      role: role || 'officer',
      is_active: true,
    })
    .select()
    .single();
  
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }
  
  return NextResponse.json(user);
}
```

**File:** `src/app/api/admin/users/[id]/route.ts`

**Add PUT and DELETE endpoints:**
```typescript
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await checkAdminAuth();
  const { id } = await params;
  const body = await request.json();
  
  const supabaseClient = await createClient();
  const { data, error } = await supabaseClient
    .from('users')
    .update(body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await checkAdminAuth();
  const { id } = await params;
  
  const supabaseClient = await createClient();
  
  // Deactivate instead of delete
  const { data, error } = await supabaseClient
    .from('users')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data);
}
```

---

#### Step 2: Create User Form Component
**File:** `src/components/admin/UserForm.tsx`

**Reference:**
- `temp/refine_dashboard/src/pages/company/create.tsx` - Form patterns
- `src/components/admin/ServiceForm.tsx` - Form structure

**Fields:**
- Email (required)
- Name (required)
- Password (required for create, optional for edit)
- Role (dropdown: admin, supervisor, officer, intake, auditor)
- Is Active (toggle)

---

#### Step 3: Create User Pages
**File:** `src/app/(admin-routes)/admin/users/new/page.tsx`

**Reference:**
- `temp/refine_dashboard/src/pages/company/create.tsx` - Create page pattern

**File:** `src/app/(admin-routes)/admin/users/[id]/edit/page.tsx`

**Reference:**
- `temp/refine_dashboard/src/pages/company/edit.tsx` - Edit page pattern

---

#### Step 4: Enable CRUD in Users Page
**File:** `src/components/admin/UsersPageClient.tsx`

**Enable buttons:**
- Add "Create User" button
- Enable Edit button
- Enable Delete button (with confirmation dialog)

---

## Phase 2: Workflow System (Phase 3 Features)

### 2.1 Task Management System

#### Step 1: Verify/Create Tasks Table Migration
**File:** `supabase/migrations/[timestamp]_create_tasks_table.sql`

**Reference:** `TECHNICAL_SPEC.md` - Tasks table schema

**Create migration:**
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'call', 'whatsapp', 'email', 'office_visit', 'ministry', 'qa'
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'done', 'cancelled'
  time_spent_minutes INTEGER,
  outcome_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_application_id ON tasks(application_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

#### Step 2: Create Task Queries
**File:** `src/lib/admin-queries.ts`

**Add task queries following same pattern as orders/users**

---

#### Step 3: Create Task Components
**Files:**
- `src/components/admin/TasksTable.tsx` - Task list table
- `src/components/admin/TaskForm.tsx` - Task creation/edit form
- `src/components/admin/KanbanBoard.tsx` - Kanban board (optional)

**Reference:**
- `temp/refine_dashboard/src/pages/tasks/list.tsx` - Kanban board implementation
- `temp/react-admin/examples/crm/src/tasks/` - Task patterns

---

#### Step 4: Create Task Pages
**Files:**
- `src/app/(admin-routes)/admin/tasks/page.tsx` - All tasks
- `src/app/(admin-routes)/admin/tasks/my-tasks/page.tsx` - My tasks
- `src/app/(admin-routes)/admin/tasks/new/page.tsx` - Create task

---

### 2.2 SLA Tracking System

#### Step 1: Verify/Create SLA Tables Migration
**File:** `supabase/migrations/[timestamp]_create_sla_tables.sql`

**Reference:** `TECHNICAL_SPEC.md` - SLA schema

---

#### Step 2: Create SLA Calculation Engine
**File:** `src/lib/sla.ts`

**Reference:** `TECHNICAL_SPEC.md` - SLA calculation logic

---

#### Step 3: Create SLA Components
**Files:**
- `src/components/admin/SLAConfig.tsx` - SLA configuration
- `src/components/admin/SLADashboard.tsx` - SLA dashboard
- `src/components/admin/SLABadge.tsx` - SLA visual indicator

---

#### Step 4: Create SLA Pages
**File:** `src/app/(admin-routes)/admin/sla/page.tsx`

---

### 2.3 Workflow Pipelines

#### Step 1: Create Pipeline Definitions
**File:** `src/lib/workflows.ts`

**Reference:** `TECHNICAL_SPEC.md` - Pipeline definitions

---

#### Step 2: Create Pipeline Components
**Files:**
- `src/components/admin/PipelineVisualization.tsx` - Pipeline progress bar
- `src/components/admin/PipelineSelector.tsx` - Pipeline selector

---

#### Step 3: Update Status Dropdowns
**Files:**
- `src/components/admin/OrderDetailClient.tsx` - Update status dropdown to show pipeline stages

---

## Implementation Checklist

### Phase 1: CRM (Weeks 1-2)
- [ ] Customer Management Page (`/admin/customers`)
  - [ ] Database queries
  - [ ] Customers table component
  - [ ] Customers list page
  - [ ] Customer detail page
  - [ ] Translations
  - [ ] Navigation link
- [ ] Financial Dashboard
  - [ ] Revenue queries
  - [ ] Enhance main dashboard
  - [ ] Financial dashboard page
  - [ ] Invoice management
  - [ ] Payment tracking
- [ ] User Management CRUD
  - [ ] API endpoints (POST, PUT, DELETE)
  - [ ] User form component
  - [ ] Create user page
  - [ ] Edit user page
  - [ ] Enable CRUD buttons

### Phase 2: Workflow (Weeks 3-5)
- [ ] Task Management
  - [ ] Database migration
  - [ ] Task queries
  - [ ] Task components
  - [ ] Task pages
  - [ ] Kanban board (optional)
- [ ] SLA Tracking
  - [ ] Database migration
  - [ ] SLA calculation engine
  - [ ] SLA components
  - [ ] SLA dashboard
- [ ] Workflow Pipelines
  - [ ] Pipeline definitions
  - [ ] Pipeline components
  - [ ] Update status dropdowns

---

## Key Files Reference

### Current Codebase Patterns:
- `src/app/(admin-routes)/admin/orders/` - Orders management (reference)
- `src/lib/admin-queries.ts` - Database queries
- `src/components/admin/OrdersTable.tsx` - Table component
- `src/components/admin/StatsCard.tsx` - Stats card

### Cloned Repo Patterns:
- `temp/react-admin/examples/crm/src/contacts/` - Customer management
- `temp/refine_dashboard/src/pages/company/` - CRUD patterns
- `temp/refine_dashboard/src/pages/tasks/list.tsx` - Kanban board
- `temp/react-admin/examples/crm/src/tasks/` - Task patterns

---

**Implementation Plan Complete** ✅  
**Ready to Start Coding** 🚀




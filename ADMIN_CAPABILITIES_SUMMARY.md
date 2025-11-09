# Admin Capabilities & Accounts Summary

**Date:** 2025-01-27  
**Project:** Tasheel Platform

---

## 🔐 Admin Login

**Login URL:** `/admin/login`

**Authentication:**
- Uses Supabase Auth (email + password)
- User must exist in both `auth.users` AND `public.users` table
- User must have `is_active = true` in `users` table
- User must have a valid `role` (admin, supervisor, officer, intake, auditor)

---

## 👥 Current Admin Accounts

**Status:** ⚠️ **NO ADMIN USERS EXIST**

The database query shows:
```sql
SELECT COUNT(*) FROM users;
-- Result: 0 users
```

**To create an admin user:**
```bash
npx tsx scripts/create-admin-user.ts admin@tasheel.ps YourPassword123 "Admin Name" admin
```

---

## 🎭 Available Roles

### 1. **Admin** (Full Access)
**Can:**
- ✅ View all orders/requests
- ✅ Edit any order
- ✅ Assign/reassign orders to any user
- ✅ Change any status
- ✅ View all financial data (revenue, payments, invoices)
- ✅ Create quotes
- ✅ Create invoices
- ✅ Upload completed files
- ✅ View dashboard metrics
- ✅ View all users
- ✅ Access all reports and charts

**Cannot:**
- ❌ Edit users (UI shows edit button but it's disabled - TODO)
- ❌ Delete users (UI shows delete button but it's disabled - TODO)
- ❌ Create new users (no UI implemented yet)

### 2. **Supervisor**
**Can:**
- ✅ View all orders within assigned team
- ✅ Edit orders within scope
- ✅ Assign/reassign orders within team
- ✅ View financial data (read-only)
- ✅ View SLA reports

**Cannot:**
- ❌ Delete orders
- ❌ Manage users
- ❌ Configure system settings

### 3. **Officer**
**Can:**
- ✅ View only assigned orders
- ✅ Update status of assigned orders
- ✅ Add internal notes to assigned orders
- ✅ Upload completed files for assigned orders
- ✅ View own performance metrics

**Cannot:**
- ❌ View other officers' orders
- ❌ View financial data
- ❌ Assign orders
- ❌ Edit unassigned orders

### 4. **Intake Specialist**
**Can:**
- ✅ View only new/unassigned orders
- ✅ Assign new orders to officers
- ✅ Add screening notes
- ✅ Verify document completeness
- ✅ Change status from "New" to "Screening" only

**Cannot:**
- ❌ View completed orders
- ❌ View financial data
- ❌ Progress beyond screening stage
- ❌ Edit assigned orders

### 5. **Auditor** (Read-Only)
**Can:**
- ✅ View all orders (read-only)
- ✅ View complete audit logs
- ✅ Export reports and data
- ✅ View financial data (read-only)

**Cannot:**
- ❌ Edit any data
- ❌ Change statuses
- ❌ Assign orders
- ❌ Create quotes/invoices

---

## 📋 What Admins CAN Do

### Dashboard (`/admin`)
- ✅ View stats: Total orders, Pending, In Progress, Completed today
- ✅ View orders timeline chart
- ✅ View status distribution chart
- ✅ View recent orders table

### Orders Management (`/admin/orders`)
- ✅ View all orders in DataGrid
- ✅ Search by order number, customer name, email, phone
- ✅ Filter by status, date range, service, assigned officer
- ✅ Sort by date, status, service
- ✅ Pagination (configurable)
- ✅ Click order to view details

### Order Detail (`/admin/orders/[id]`)
- ✅ View complete order information
- ✅ View customer details
- ✅ View service details
- ✅ View form submission data
- ✅ View uploaded files (download)
- ✅ **Update order status** (with notes)
- ✅ **Assign order to officer**
- ✅ **Create quote** (with amount and notes)
- ✅ **Create invoice** (with amount and due date)
- ✅ Upload completed files
- ✅ View order timeline/history
- ✅ Contact customer (email/WhatsApp links)

### User Management (`/admin/users`)
- ✅ View all users table
- ✅ See user name, email, role, status, created date
- ❌ **Edit users** (button exists but disabled - TODO)
- ❌ **Delete users** (button exists but disabled - TODO)
- ❌ **Create new users** (no UI implemented - TODO)

### Settings (`/admin/settings`)
- ✅ View admin info
- ✅ View email configuration status
- ✅ Quick links to documentation

---

## ❌ What Admins CANNOT Do (Currently)

### User Management
- ❌ **Create new admin users** (no UI, must use script)
- ❌ **Edit existing users** (buttons disabled)
- ❌ **Delete users** (buttons disabled)
- ❌ **Change user roles** (no UI)
- ❌ **Activate/deactivate users** (no UI)

### Services Management
- ❌ **Add new services** (no UI)
- ❌ **Edit services** (no UI)
- ❌ **Delete services** (no UI)
- ⚠️ **Seed services** (has separate page at `/admin/seed-services`)

### Orders
- ❌ **Delete orders** (no delete button)
- ❌ **Archive orders** (status exists but no bulk archive)
- ❌ **Bulk actions** (no multi-select)

### System Configuration
- ❌ **Edit email templates** (no UI)
- ❌ **Configure payment settings** (no UI)
- ❌ **Manage integrations** (no UI)

---

## 🔧 Implementation Status

### ✅ Fully Implemented
- Admin login/authentication
- Dashboard with stats and charts
- Orders list with search/filter/sort
- Order detail view
- Status updates
- Order assignment
- Quote creation
- Invoice creation
- File uploads/downloads
- User list view

### ⚠️ Partially Implemented
- User management (view only, edit/delete disabled)
- Order timeline/history (view only)

### ❌ Not Implemented
- User creation UI
- User edit UI
- User delete functionality
- Service management UI
- Bulk operations
- Email template editing
- System settings configuration

---

## 🚀 How to Create Admin Users

### Option 1: Using Script (Recommended)
```bash
# Make sure you have SUPABASE_SERVICE_ROLE_KEY in .env.local
npx tsx scripts/create-admin-user.ts admin@tasheel.ps SecurePassword123 "Admin Name" admin
```

### Option 2: Manual via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Copy the User ID (UUID)
5. Go to SQL Editor and run:
```sql
INSERT INTO users (id, email, name, role, is_active)
VALUES (
  'PASTE_USER_ID_HERE',
  'admin@tasheel.ps',
  'Admin User',
  'admin',
  true
);
```

### Option 3: Using Supabase MCP
Can create via MCP tools if available.

---

## 📝 Notes

1. **Permission System:** The permission system is defined in `TECHNICAL_SPEC.md` but not fully enforced in the UI yet. Currently, all authenticated admin users can access all features.

2. **Role-Based Access:** The UI doesn't yet restrict features based on roles. All admin users see the same interface regardless of role.

3. **User Management:** Edit/Delete buttons exist in the UI but are disabled. These need to be implemented.

4. **Service Management:** Services are managed via seed script, not through admin UI.

5. **Security:** Admin routes are protected by `checkAdminAuth()` which verifies:
   - User is authenticated (Supabase Auth)
   - User exists in `users` table
   - User has `is_active = true`

---

## 🔗 Related Files

- **Login:** `src/app/admin/login/page.tsx`
- **Auth:** `src/lib/admin-auth.ts`
- **Dashboard:** `src/app/(admin-routes)/admin/page.tsx`
- **Orders:** `src/app/(admin-routes)/admin/orders/page.tsx`
- **Order Detail:** `src/app/(admin-routes)/admin/orders/[id]/page.tsx`
- **Users:** `src/app/(admin-routes)/admin/users/page.tsx`
- **Create User Script:** `scripts/create-admin-user.ts`


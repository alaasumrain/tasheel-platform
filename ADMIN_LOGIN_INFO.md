# Admin User Creation Guide

## Admin Login URL
**`/admin/login`**

## Quick Create (Using Script)

If you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`:

```bash
npx tsx scripts/create-admin-user.ts admin@tasheel.ps YourPassword123 "Admin User" admin
```

## Manual Creation (Via Supabase Dashboard)

### Step 1: Create Auth User
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Enter:
   - Email: `admin@tasheel.ps` (or your preferred email)
   - Password: (choose a secure password)
   - Auto Confirm: ✅ (check this)
4. Click **"Create user"**
5. **Copy the User ID** (UUID) that appears

### Step 2: Link to Users Table
Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO users (id, email, name, role, is_active, password_hash)
VALUES (
  'PASTE_USER_ID_HERE',  -- The UUID from Step 1
  'admin@tasheel.ps',     -- Email
  'Admin User',           -- Name
  'admin',                -- Role: admin, supervisor, officer, intake, auditor
  true,                   -- is_active
  NULL                    -- password_hash (not needed with Supabase Auth)
);
```

## Available Roles
- `admin` - Full access to all features
- `supervisor` - Can view and manage all orders
- `officer` - Can only view assigned orders
- `intake` - Can assign orders to officers
- `auditor` - Read-only access to all data

## After Creation
1. Navigate to `/admin/login`
2. Enter your email and password
3. You'll be redirected to `/admin` dashboard


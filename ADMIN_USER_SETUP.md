# Creating Admin Users

After migrating to Supabase Auth, admin users need to be created in two steps:

1. **Create user in Supabase Auth** (via dashboard or API)
2. **Link to users table** (via SQL or script)

## Option 1: Using the Script (Recommended)

Make sure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`:

```bash
# Install tsx if needed
npm install -D tsx

# Create an admin user
npx tsx scripts/create-admin-user.ts admin@tasheel.ps YourSecurePassword123 "Admin Name" admin
```

## Option 2: Using Supabase Dashboard + SQL

### Step 1: Create Auth User
1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Copy the User ID (UUID) that gets created

### Step 2: Link to Users Table
Run this SQL in Supabase SQL Editor (replace the values):

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

## Option 3: Using Supabase MCP (If you have access)

You can use the Supabase MCP tools to execute SQL directly.

## Available Roles

- `admin` - Full access to all features
- `supervisor` - Can view and manage all orders
- `officer` - Can only view assigned orders
- `intake` - Can assign orders to officers
- `auditor` - Read-only access to all data

## Testing Login

After creating an admin user, test the login:

1. Navigate to `/admin/login`
2. Enter the email and password you created
3. You should be redirected to the admin dashboard

## Troubleshooting

**Error: "Access denied. User not authorized."**
- Make sure the user exists in the `users` table
- Check that `is_active = true`
- Verify the `id` in `users` table matches `auth.users.id`

**Error: "Invalid email or password"**
- Verify the user was created in Supabase Auth
- Check that email confirmation is enabled (or confirm the email)
- Try resetting the password in Supabase Dashboard


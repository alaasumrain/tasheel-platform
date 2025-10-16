# Admin Dashboard Documentation

## Overview

Professional admin dashboard for managing Tasheel customer orders and quote requests. Built with Next.js 15, MUI v7, TypeScript, and Supabase.

---

## Features

### ✅ Dashboard Analytics
- **Stats Cards**: Total orders, pending, in progress, completed today
- **Charts**: Orders timeline (7 days), status distribution
- **Real-time Data**: Automatically refreshes from Supabase

### ✅ Order Management
- **Orders Table**: View all orders with filtering and search
- **Order Details**: Complete customer information and order history
- **Status Updates**: Change order status with admin notes
- **Timeline**: Full history of order status changes

### ✅ Customer Communication
- **Email**: Direct email links to customers
- **Phone**: Click-to-call functionality
- **WhatsApp**: Direct WhatsApp messaging links
- **Automated Notifications**: Email sent on every status update

### ✅ Security
- **Password Protection**: Simple password-based authentication
- **Session Management**: Secure 24-hour sessions
- **Admin-Only Access**: Protected API routes

---

## Getting Started

### 1. Access the Admin Dashboard

Navigate to: **`http://localhost:3000/login`**

**Default Password**: `tasheel2024`

(Change this in `.env.local` → `ADMIN_PASSWORD`)

### 2. Dashboard Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard home with stats and charts |
| `/admin/orders` | Full list of all orders |
| `/admin/orders/[id]` | Order detail page |
| `/admin/settings` | Admin settings and configuration |
| `/login` | Login page |

---

## How to Use

### View Dashboard
1. Login at `/login`
2. See overview stats and charts
3. View recent orders at the bottom

### Manage Orders
1. Click "Orders" in sidebar
2. Browse all orders in the table
3. Click "View" on any order

### Update Order Status
1. Open order detail page
2. Select new status from dropdown
3. Add optional notes
4. Click "Update Status"
5. ✅ Customer receives email notification automatically!

### Contact Customers
From order detail page:
- Click "Email" to send email
- Click "Call" to dial phone
- Click "WhatsApp" to message on WhatsApp

---

## Environment Variables

Required in `.env.local`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change to your domain in production

# Admin Dashboard
ADMIN_PASSWORD=tasheel2024  # Change this to a secure password!

# Email Notifications
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=support@tasheel.com
CONTACT_NAME=Tasheel Support
```

---

## Order Statuses

| Status | Description | Customer Email Sent |
|--------|-------------|---------------------|
| **Submitted** | Order received, awaiting review | ✅ Yes |
| **Scoping** | Requirements being reviewed | ✅ Yes |
| **Quote Sent** | Quote ready for customer | ✅ Yes |
| **In Progress** | Order is being processed | ✅ Yes |
| **Review** | Order under quality review | ✅ Yes |
| **Completed** | Order ready for delivery | ✅ Yes |
| **Archived** | Order archived | ✅ Yes |
| **Rejected** | Order cannot be fulfilled | ✅ Yes |
| **Cancelled** | Order cancelled | ✅ Yes |

---

## Database Schema

### Applications Table
```sql
- id: UUID (primary key)
- order_number: TEXT (e.g., TS-12345)
- customer_name: TEXT
- customer_phone: TEXT
- applicant_email: TEXT
- service_slug: TEXT
- status: ENUM
- payload: JSONB
- submitted_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Application Events Table
```sql
- id: UUID (primary key)
- application_id: UUID (foreign key)
- event_type: TEXT
- notes: TEXT
- data: JSONB
- created_at: TIMESTAMP
- created_by: TEXT
```

---

## Email Notifications

When you update an order status, the system automatically:

1. ✅ Updates the database
2. ✅ Creates an event in the timeline
3. ✅ Sends a beautiful HTML email to the customer
4. ✅ Includes order number and tracking link

**Email Template Includes:**
- Order number
- Service name
- Current status
- Tracking link
- Contact information

---

## Customization

### Change Admin Password
Edit `.env.local`:
```bash
ADMIN_PASSWORD=your_new_secure_password
```

### Change Theme Colors
Edit `/src/theme.ts`:
```typescript
primary: {
  main: 'rgba(14, 33, 160, 1)', // Change this
},
```

### Add More Order Statuses
1. Update `ApplicationStatus` type in `/src/lib/admin-queries.ts`
2. Add status label in `statusLabels` object
3. Add status color in `statusColors` object
4. Add email message in `/src/lib/email-notifications.ts`

---

## Troubleshooting

### Cannot Login
- Check `ADMIN_PASSWORD` in `.env.local`
- Clear browser cookies
- Restart the dev server

### Orders Not Showing
- Check Supabase connection in `.env.local`
- Verify database has `applications` table
- Check browser console for errors

### Emails Not Sending
- Add `RESEND_API_KEY` to `.env.local`
- Add `CONTACT_EMAIL` to `.env.local`
- Check Resend dashboard for errors

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **UI**: MUI v7, Tasheel custom components
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Language**: TypeScript

---

## Files Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout with auth check
│   │   ├── page.tsx             # Dashboard home
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── orders/
│   │   │   ├── page.tsx         # Orders list
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Order detail
│   │   └── settings/
│   │       └── page.tsx         # Settings page
│   └── api/
│       └── admin/
│           ├── login/route.ts   # Login API
│           ├── logout/route.ts  # Logout API
│           └── orders/[id]/status/route.ts  # Status update API
├── components/
│   └── admin/
│       ├── AdminLayout.tsx              # Sidebar navigation
│       ├── StatsCard.tsx                # Stats card component
│       ├── OrdersTable.tsx              # Orders table
│       ├── OrderDetailClient.tsx        # Order detail view
│       ├── OrdersTimelineChart.tsx      # Line chart
│       └── StatusDistributionChart.tsx  # Bar chart
└── lib/
    ├── admin-auth.ts                    # Auth helper
    ├── admin-queries.ts                 # Supabase queries
    └── email-notifications.ts           # Email service
```

---

## Next Steps

### To Deploy to Production:

1. **Update environment variables**:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ADMIN_PASSWORD=strong_secure_password
   ```

2. **Add Resend API key** for email notifications

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Share admin login** with your client:
   - URL: `https://yourdomain.com/admin`
   - Password: (the one you set)

---

## Support

For issues or questions:
- Check this README
- Review the code comments
- Check browser console for errors
- Verify environment variables

---

**Built with ❤️ for Tasheel**

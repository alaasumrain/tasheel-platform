# Storage Buckets Setup Guide

## Quick Setup

The storage buckets need to be created in Supabase before file uploads will work. Run:

```bash
npm run setup:storage
```

This script will create all required storage buckets:
- `customer-uploads` - For customer-submitted files (private)
- `completed-work` - For team-uploaded deliverables (private)
- `invoices` - For generated PDF invoices (private)
- `team-avatars` - For staff profile photos (public)
- `service-images` - For service catalog images (public)

## Prerequisites

Make sure you have these environment variables in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** You need the **Service Role Key** (not the anon key) to create buckets. You can find it in:
- Supabase Dashboard → Project Settings → API → `service_role` key

⚠️ **Never commit the service role key to git!**

## Manual Setup (Alternative)

If the script doesn't work, you can create buckets manually:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** in the sidebar
4. Click **New bucket**
5. Create each bucket with these settings:

### customer-uploads
- Name: `customer-uploads`
- Public: **No** (private)
- File size limit: 10MB
- Allowed MIME types: `image/jpeg, image/png, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### completed-work
- Name: `completed-work`
- Public: **No** (private)
- File size limit: 50MB

### invoices
- Name: `invoices`
- Public: **No** (private)
- File size limit: 5MB
- Allowed MIME types: `application/pdf`

### team-avatars
- Name: `team-avatars`
- Public: **Yes** (public)
- File size limit: 2MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### service-images
- Name: `service-images`
- Public: **Yes** (public)
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

## After Creating Buckets

After creating the buckets, you need to set up RLS (Row Level Security) policies. See `TECHNICAL_SPEC.md` for example policies.

## Troubleshooting

### "Bucket not found" error
- Make sure you've run `npm run setup:storage` or created the buckets manually
- Check that the bucket names match exactly (case-sensitive)
- Verify your Supabase project URL is correct

### "Permission denied" error
- Check your RLS policies are set up correctly
- Make sure the user is authenticated
- Verify the bucket exists and is accessible

### Script fails with "Missing environment variables"
- Make sure `.env.local` exists and has the required variables
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set (not just the anon key)


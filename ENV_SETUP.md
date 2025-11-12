# Environment Variables Required

## Supabase Configuration

The following environment variables are required for the application to function properly:

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

### Important Notes

⚠️ **CRITICAL**: The `SUPABASE_SERVICE_ROLE_KEY` is required for:
- OTP code management (send-otp and verify-otp endpoints)
- Admin operations
- Secure server-side database operations

Without this key, phone/WhatsApp OTP authentication will fail with "Server configuration error".

### Setup Instructions

1. Get your Supabase credentials from your Supabase Dashboard:
   - Go to Project Settings → API
   - Copy the Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

2. Add to your `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to version control
4. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your deployment environment (Vercel, etc.)


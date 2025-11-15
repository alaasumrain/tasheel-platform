# Supabase Email Template Setup Guide

This guide explains how to configure the Tasheel-branded email confirmation template in your Supabase project.

## Template File

The email confirmation template is located at:
- `supabase/templates/confirmation.html`

## How to Configure in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/xfvwexnrxfrfqjgucchh
   - Or go to: Authentication → Email Templates

2. **Configure Confirmation Email**
   - Click on "Confirmation" template
   - **Subject:** `Confirm Your Signup`
   - **Body:** Copy the entire content from `supabase/templates/confirmation.html`
   - Paste it into the HTML editor in the dashboard

3. **Available Variables**
   The template uses these Supabase variables:
   - `{{ .ConfirmationURL }}` - The confirmation link that users click
   - `{{ .SiteURL }}` - Your site URL (if needed)
   - `{{ .Email }}` - User's email address (if needed)

4. **Save Changes**
   - Click "Save" in the Supabase dashboard
   - Changes take effect immediately

## Template Features

✅ **Tasheel Branding**
- Purple gradient header with Tasheel logo
- Bilingual support (English/Arabic)
- Professional design

✅ **User-Friendly**
- Clear call-to-action button
- Alternative text link if button doesn't work
- Mobile-responsive design

✅ **Security**
- Expiration notice (24 hours)
- Safety message for unsolicited emails

## Testing

After configuring:
1. Create a test account
2. Check your email inbox
3. Verify the template renders correctly
4. Test the confirmation link

## Other Email Templates

You can customize other templates similarly:
- **Invite:** `supabase/templates/invite.html`
- **Recovery:** `supabase/templates/recovery.html`
- **Magic Link:** `supabase/templates/magic_link.html`
- **Email Change:** `supabase/templates/email_change.html`

## Notes

- Email templates are configured in the Supabase dashboard, not in code
- The template file in this repo is for reference/documentation
- Always test email templates after making changes
- Consider creating templates for both English and Arabic if needed


# Production Readiness Checklist

## ✅ Completed

### Security
- [x] Payment webhook signature verification implemented
- [x] Test payment endpoint disabled in production
- [x] Dashboard security fixed (server-side filtering)
- [x] Admin authentication required for all admin routes
- [x] Centralized logging utility created

### Environment Variables
- [x] .env.example file created with all required variables
- [x] Environment variable validation utility exists

### Code Quality
- [x] Critical console.error statements replaced with logger
- [x] Payment webhook uses proper error logging
- [x] Admin routes use proper error logging

## 🔴 Critical - Must Fix Before Production

### 1. Environment Variable Validation at Startup
- [ ] Call `requireEnvVars()` in `src/app/layout.tsx` or `next.config.mjs`
- [ ] Ensure critical variables fail fast in production

### 2. Remove Development Code
- [ ] Review and remove any `console.log` statements in production code
- [ ] Ensure test endpoints are properly disabled
- [ ] Remove any debug code or TODOs

### 3. Error Boundary Integration
- [ ] Wrap root layout with ErrorBoundary
- [ ] Wrap critical components (Wizard, PaymentFlow)
- [ ] Add translations for error boundary messages

### 4. Database Security
- [ ] Fix `search_path` in Supabase functions (generate_order_number, set_order_number)
- [ ] Review RLS policies for all tables
- [ ] Ensure customer data is properly isolated

### 5. Rate Limiting
- [ ] Implement rate limiting on public API routes
- [ ] Add rate limiting to payment webhooks
- [ ] Add rate limiting to form submissions

## 🟠 High Priority - Should Fix Before Production

### 1. Content & Translations
- [ ] Replace Privacy page Lorem ipsum with actual content
- [ ] Replace Terms page Lorem ipsum with actual content
- [ ] Verify all hardcoded text uses translations

### 2. Email Configuration
- [ ] Verify RESEND_API_KEY is set in production
- [ ] Verify CONTACT_EMAIL is set in production
- [ ] Test email delivery in production environment

### 3. Payment Gateway
- [ ] Configure actual payment gateway (PalPay or PayTabs)
- [ ] Set PAYMENT_GATEWAY_WEBHOOK_SECRET
- [ ] Test webhook signature verification
- [ ] Remove placeholder payment mode

### 4. WhatsApp Integration
- [ ] Configure WhatsApp provider (Twilio or Meta)
- [ ] Remove TEST MODE code
- [ ] Set webhook verification
- [ ] Test WhatsApp notifications

### 5. Monitoring & Logging
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure production logging
- [ ] Set up uptime monitoring
- [ ] Configure alerting for critical errors

## 🟡 Medium Priority - Nice to Have

### 1. Performance
- [ ] Enable Next.js production optimizations
- [ ] Configure CDN for static assets
- [ ] Optimize images
- [ ] Add caching headers

### 2. SEO
- [ ] Add proper meta tags
- [ ] Configure sitemap.xml
- [ ] Add robots.txt
- [ ] Verify structured data

### 3. Analytics
- [ ] Configure Google Analytics
- [ ] Set up conversion tracking
- [ ] Configure error tracking

### 4. Documentation
- [ ] Create deployment guide
- [ ] Document environment variables
- [ ] Create runbook for common issues

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] All required environment variables set
- [ ] NODE_ENV=production
- [ ] NEXT_PUBLIC_SITE_URL set to production domain
- [ ] Database migrations applied
- [ ] Supabase RLS policies configured

### Security Review
- [ ] No secrets in code
- [ ] API keys rotated
- [ ] Admin passwords changed
- [ ] SSL certificates configured
- [ ] CORS configured correctly

### Testing
- [ ] Test quote submission flow
- [ ] Test payment flow
- [ ] Test email notifications
- [ ] Test admin dashboard
- [ ] Test customer dashboard
- [ ] Test mobile responsiveness

### Monitoring
- [ ] Error tracking configured
- [ ] Uptime monitoring set up
- [ ] Log aggregation configured
- [ ] Alerting rules set up

## 🚀 Deployment Steps

1. **Set Environment Variables**
   ```bash
   # Copy .env.example to production environment
   # Fill in all required values
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Run Database Migrations**
   ```bash
   # Apply all migrations in supabase/migrations/
   ```

4. **Verify Environment**
   ```bash
   # Check that requireEnvVars() passes
   ```

5. **Deploy**
   ```bash
   # Deploy to your hosting platform (Vercel, etc.)
   ```

6. **Post-Deployment**
   - Verify site loads
   - Test critical flows
   - Monitor error logs
   - Check email delivery

## 📝 Notes

- **Never commit .env files** - Use environment variable management in your hosting platform
- **Test in staging first** - Always test changes in a staging environment before production
- **Monitor closely** - Watch error logs and metrics for the first 24 hours after deployment
- **Have a rollback plan** - Know how to quickly rollback if issues occur


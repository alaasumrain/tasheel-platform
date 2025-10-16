# Tasheel Platform

Tasheel is a Palestinian government-services concierge built with Next.js, Material UI, and Tailwind CSS. The platform lets residents and businesses submit requests for licensing, translations, legalizations, and corporate filings entirely online while our operations team handles ministry visits and follow-up.

## Features

- Landing page tailored to Palestinian government workflows
- Dynamic services catalog with localized copy, pricing in ILS, and MOFAE-focused processes
- Quote request form with Supabase persistence and Resend-powered email notifications
- Responsive layouts using the MUI v7 design system and shared component library
- Dark/light theming, animations, and modular section components for rapid customization

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Update environment variables in `.env.local` for Supabase, Resend, and contact details.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start development server        |
| `npm run build`| Create production build         |
| `npm run start`| Serve the production build      |
| `npm run lint` | Run ESLint (TS + Next.js rules) |

## Project Structure

```
src/
  app/            # Next.js App Router pages & API routes
  components/     # MUI section blocks, forms, and shared UI
  data/services.ts# Service catalog content & categories
  lib/            # Supabase client, query helpers, utilities
  theme.ts        # Custom MUI theme and design tokens
```

## Customization Checklist

- Update assets in `public/` with your latest brand visuals
- Adjust services data in `src/data/services.ts` for new offerings or pricing
- Review email copy in `src/app/actions/submit-quote-request.ts`
- Configure environment variables for production deployments

## License

This project is provided for Tasheel internal use. Redistribution or resale of the codebase is not permitted without written approval.

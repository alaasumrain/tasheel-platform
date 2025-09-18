# Tasheel Platform

Tasheel is Palestine's digital gateway for government services. This Next.js 15 project powers the public-facing experience for citizens and businesses to discover services, submit applications, and track their status online.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` and start building.

## Available Scripts

- `npm run dev` — start the Next.js app with Turbopack
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` / `npm run lint:fix` — run ESLint across `src`
- `npm run prettier` — format source files

## Project Highlights

- **App Router & MUI v7** — opinionated component library with responsive design tokens, palettes, and typography overrides in `src/views/landings/ai/theme`.
- **Configurable branding** — core identity and metadata live in `src/branding.json`, `src/metadata.js`, and `src/path.js`.
- **Composable content blocks** — reusable UI blocks live under `src/blocks/**` and are assembled into pages via data objects in `src/views/landings/default/data`.
- **Lazy loading** — large sections are streamed in via `src/components/LazySection.jsx` to keep the landing experience snappy.
- **Context-driven theming** — `src/contexts/ConfigContext.jsx` and `src/components/ThemeProvider.jsx` persist the selected theme in local storage.

## Environment Variables

Set these before building or deploying:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_ANALYTICS_ID` | Google Analytics measurement ID (optional). |
| `NEXT_PUBLIC_METADATA_BASE` | Absolute base URL used when generating metadata. |
| `MAILERLITE_API_ENDPOINT` | MailerLite base URL for newsletter subscriptions. |
| `MAILERLITE_API_KEY` | API key for MailerLite integration. |
| `MAILERLITE_GROUP` | Comma-separated list of group IDs to subscribe new contacts to. |

Create a `.env.local` file in the project root to store these values for local development.

## Deployment Notes

- Run `npm run build` locally to catch linting or type issues before pushing.
- Verify the `/api/subscribe` route has access to the MailerLite variables on your hosting platform.
- Review `branding.json` to keep social links, support URLs, and logos current before each release.

## Contributing

1. Create a feature branch.
2. Keep PRs focused and well-tested.
3. Run lint and build commands prior to opening a pull request.

---

Need help evolving the experience? Open an issue or reach out to the Tasheel team.

# FormSG Setup for Tasheel

This note captures the initial steps for bringing up the FormSG fork locally and trimming it for Tasheel.

## 1. Clone and bootstrap

```bash
# clone the upstream repo (or your fork)
git clone https://github.com/opengovsg/FormSG tasheel-formsg
cd tasheel-formsg

# ensure the correct Node version
nvm install
nvm use

# install all packages (frontend, backend, serverless helpers)
npm install \
  && npm --prefix serverless/virus-scanner install \
  && npm --prefix serverless/pdf-gen-sparticuz install
```

> Tip: On macOS bump Docker resources to at least 4GB RAM before running the stack.

## 2. Remove Singapore-only modules

The project keeps optional Singapore integrations under `src/app/modules`. Delete or disable the following directories before building custom features:

- `src/app/modules/singpass`
- `src/app/modules/corppass`
- `src/app/modules/myinfo`
- `src/app/modules/sgid`

If you prefer to keep the code for reference, add build-time guards so the features do not surface in the UI.

## 3. Configure environment

Copy the default environment template and fill in required values (MongoDB URI, AWS credentials for file storage, Twilio config, etc.).

```bash
cp .env.example .env
# edit .env with your secrets
```

Key values to update early:

- `DB_URL`: point to your MongoDB instance (local ReplicaSet for testing).
- `AWS_*`: S3 bucket credentials for attachment storage.
- `TWILIO_*`: switch to a provider that supports Palestinian numbers if needed.
- `MAIL_*`: SMTP settings for transactional email.

## 4. Run the dev stack

FormSG ships with a Docker compose file. The default workflow builds the frontend once, then runs services.

```bash
# build the React client once
npm run build:frontend

# start backend + services via Docker
docker compose up

# in a second terminal, run the frontend in watch mode
npm run dev:frontend
```

Local ports:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- MailDev inbox: http://localhost:1080

## 5. Branding and localisation

- Update logos, colors, and copy under `frontend/src` to reflect Tasheel branding.
- Enable Arabic translations by extending the i18n configuration (`frontend/src/i18n`).
- Replace Singapore references in templates, emails, and landing pages.

## 6. Auth adjustments

FormSG uses email-based admin accounts stored in Mongo. Plan to seed Tasheel admin users by editing the `admin` resource via the admin interface or seeding documents in the `users` collection.

For citizen-facing auth (if needed), expose FormSG forms via your Next.js portal and defer complex login flows until Phase 2.

## 7. Next steps

Once the base stack runs:

1. Create a pilot form, test submission, and confirm encrypted data is stored.
2. Wire a webhook to your Tasheel Next.js app or Supabase (if adopted) to mirror minimal metadata.
3. Document deployment steps (Docker images, Mongo backups, S3 bucket policy) for staging.

Keep this file updated as the Tasheel fork diverges from upstream FormSG.

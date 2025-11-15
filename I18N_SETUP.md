# i18n Setup with @lobehub/i18n-cli

This project uses `@lobehub/i18n-cli` for automated translation management.

## Setup

1. **Install the package** (already added to devDependencies):
   ```bash
   npm install
   ```

2. **Set up OpenAI API Key**:
   ```bash
   export OPENAI_API_KEY="sk-xxxxxx...xxxxxx"
   ```
   
   Or create a `.env.local` file:
   ```
   OPENAI_API_KEY=sk-xxxxxx...xxxxxx
   ```

   **Optional**: If you need to use a proxy for OpenAI:
   ```bash
   export OPENAI_PROXY_URL="https://api.chatanywhere.cn/v1"
   ```

## Configuration

The configuration is in `.i18nrc.js`:

- **Entry file**: `messages/en.json` (English - source language)
- **Output locales**: `ar` (Arabic)
- **Model**: `gpt-4o-mini` (cost-effective, fast)
- **Temperature**: `0.3` (more deterministic translations)
- **Save immediately**: `true` (saves progress as it translates)

## Usage

### Translate Locale Files

To translate all new or updated keys from `en.json` to `ar.json`:

```bash
npm run i18n:translate
```

Or directly:
```bash
lobe-i18n
```

### Lint Translation Files

To check translation files for language correctness:

```bash
npm run i18n:lint
```

Or directly:
```bash
lobe-i18n lint
```

### Incremental Updates

The tool automatically detects new keys in `en.json` and only translates what's missing or changed in `ar.json`. This means:

- ✅ New keys added to `en.json` → automatically translated
- ✅ Updated values in `en.json` → automatically re-translated
- ✅ Existing translations in `ar.json` → preserved (unless the source changed)

## Translation Keys Structure

All translation keys are organized by feature/section:

```json
{
  "Header": {
    "home": "Home",
    "services": "Services",
    "skipToContent": "Skip to content"
  },
  "Common": {
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

## Adding New Translation Keys

1. Add the key to `messages/en.json`
2. Run `npm run i18n:translate`
3. The tool will automatically add the Arabic translation to `messages/ar.json`

## Reference Context

The configuration includes a reference context to help with accurate translations:

> "Tasheel is a government services concierge platform for Palestine. The translations should be professional, clear, and culturally appropriate for Arabic-speaking users in Palestine. Maintain consistency with government and business terminology."

This helps the AI understand the context and produce more accurate translations.

## Notes

- The tool uses GPT-4o-mini by default (cost-effective)
- You can change the model in `.i18nrc.js` if needed
- Translations are saved immediately (`saveImmediately: true`) so you can see progress in real-time
- Large files are automatically split to stay within token limits

## Troubleshooting

### Missing API Key
If you get an error about missing API key:
```bash
export OPENAI_API_KEY="your-key-here"
```

### Translation Quality
If translations need improvement:
1. Adjust `temperature` in `.i18nrc.js` (lower = more deterministic)
2. Update the `reference` field with more specific context
3. Manually review and edit translations in `messages/ar.json`

### Large Files
If you have very large translation files, the tool automatically splits them. You can adjust `splitToken` in `.i18nrc.js` if needed.


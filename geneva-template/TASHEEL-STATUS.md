# 📊 Tasheel Landing Page Status

**Last Updated:** 2025-10-15  
**Current State:** 95% ready – localized for Palestine, pending asset swaps

---

## ✅ Completed

- All landing sections rewritten for Palestinian services (hero, features, pricing, testimonials)
- Services catalog (`src/data/services.ts`) localized with MOFAE processes, West Bank logistics, & pricing in ILS
- Quote flow sends Tasheel-branded emails and directs customers to `tasheel.ps`
- Pricing cards use shekel currency and Palestinian feature sets
- ESLint now passes cleanly after copy updates

## ⚠️ Remaining

1. Swap placeholder partner logos in `public/global/partner-*.svg`
2. Replace demo video (`/global/video-poster.jpg`) with Tasheel screencast
3. Confirm production phone/WhatsApp numbers & admin URL in env variables
4. Hook up real order tracking logic on `/track`

---

## 🧭 Quick Reference

- Landing metadata: `src/app/layout.tsx`
- Services data: `src/data/services.ts`
- Pricing sections: `src/components/sections/pricing-plans*.tsx`
- Quote email copy: `src/app/actions/submit-quote-request.ts`

Use this checklist during QA before launch.

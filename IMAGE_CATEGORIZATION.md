# Image Categorization Guide - Tasheel Platform

**Total Images Available:** 199 PNG files in `public/dark/services/tasheel-gen/`
**Total Images Needed:** 38 (8 homepage + 30 service pages)

---

## 📊 Categories Identified (From Sample Review)

### 1. **Government Documents & Civil Services** (20+ images found)
- ID cards (civil IDs)
- Birth certificates (Arabic + English translations)
- Passports (renewal/issuance)
- Official certificates with stamps/seals
- Government service counters

### 2. **Translation Services** (15+ images found)
- Bilingual documents side-by-side
- Birth certificates translations
- Passport translations
- Legal document translations
- Professional presenting translated documents

### 3. **Business & Corporate** (25+ images found)
- Business meetings/consultations
- Team collaborations
- Company registration celebrations
- Professional office settings
- Entrepreneurs with documents

### 4. **Legal Services** (10+ images found)
- Contract reviews
- Legal consultations
- Court documents
- Power of attorney
- Lawyer-client meetings

### 5. **Professional Office Settings** (40+ images found)
- Modern offices with navy/gold branding
- Customer service counters
- Professional teams working
- City view offices
- Tech/computer workspaces

---

## ✅ Confirmed Mappings (High Confidence)

### **Homepage Images (8 needed)**

1. **`/dark/services-corporate.jpg`**
   - **Candidate:** creation_1922715403.png
   - **Description:** Team celebrating business success, diverse professionals, modern office, navy/gold accents
   - **Perfect Match:** ✅ Business team celebration with certificate

2. **`/dark/services-residents.jpg`**
   - **Candidate:** creation_1922714032.png
   - **Description:** Happy person at service counter receiving ID card
   - **Good Match:** ✅ Service representative helping resident

3. **`/dark/services-non-residents.jpg`**
   - **Candidate:** creation_1922247140.png
   - **Description:** Passport with translation stamp, professional setting
   - **Perfect Match:** ✅ Traveler with passport and certification

4. **`/dark/service-translation.jpg`**
   - **Candidate:** creation_1922248560.png
   - **Description:** Hands presenting birth certificates (Arabic + English)
   - **Perfect Match:** ✅ Professional translation service display

5. **`/dark/service-documents.jpg`**
   - **Candidate:** creation_1922248519.png
   - **Description:** Official documents with stamps/seals, professional at desk
   - **Perfect Match:** ✅ Government document processing

6. **`/dark/service-quotations.jpg`**
   - **Candidate:** creation_1922248547.png
   - **Description:** Client and consultant discussing documents in meeting
   - **Perfect Match:** ✅ Professional consultation

7. **`/dark/homepage-contact.jpg`**
   - **Candidate:** creation_1922162524.png (vertical composition)
   - **Description:** Professional woman at phone/desk, modern office
   - **Good Match:** ✅ Customer service setting

8. **`/dark/about.jpg`**
   - **Candidate:** creation_1922162846.png (team collaboration)
   - **Description:** Team working together, modern office, navy accents
   - **Perfect Match:** ✅ Team collaboration atmosphere

---

### **Translation Services (15 needed)**

9. **`translation-passport-translation-en-ar.jpg`**
   - **Candidate:** creation_1922247140.png
   - **Description:** Passport with translation certification stamp
   - **Perfect Match:** ✅

10. **`translation-id-card-translation-en-ar.jpg`**
    - **Candidate:** creation_1922714032.png
    - **Description:** Person holding ID card confidently
    - **Good Match:** ✅

11. **`translation-birth-certificate-translation-en-ar.jpg`**
    - **Candidate:** creation_1922248560.png
    - **Description:** Birth certificates (Arabic + English) presentation
    - **Perfect Match:** ✅

12. **`translation-academic-degree-translation-en-ar.jpg`**
    - **Candidate:** creation_1922714382.png
    - **Description:** Academic certificates on professional desk
    - **Good Match:** ✅

13. **`translation-legal-contract-translation-certified.jpg`**
    - **Candidate:** creation_1922248538.png
    - **Description:** "VERIFIED CONTRACT" legal document
    - **Perfect Match:** ✅

14. **`translation-legal-court-document-translation.jpg`**
    - **Candidate:** creation_1922248547.png
    - **Description:** Professionals reviewing legal documents
    - **Good Match:** ✅

15. **`translation-business-company-registration-documents-translation.jpg`**
    - **Candidate:** creation_1922715403.png
    - **Description:** Entrepreneur with registration documents, team celebrating
    - **Perfect Match:** ✅

---

### **Government Services (12 needed)**

16. **`government-interior-civil-id-card-renewal.jpg`**
    - **Candidate:** creation_1922714032.png (top half)
    - **Description:** Person holding renewed ID at service counter
    - **Perfect Match:** ✅

17. **`government-interior-civil-birth-certificate-issuance.jpg`**
    - **Candidate:** creation_1922248230.png
    - **Description:** Birth certificates in professional meeting setting
    - **Perfect Match:** ✅

18. **`government-interior-passport-passport-renewal.jpg`**
    - **Candidate:** creation_1922247140.png
    - **Description:** Passport with certification/translation
    - **Good Match:** ✅

19. **`government-economy-company-registration.jpg`**
    - **Candidate:** creation_1922715403.png
    - **Description:** Team celebrating business registration
    - **Perfect Match:** ✅

---

### **Business Services (3 needed)**

20. **`business-legal-legal-consultation-1-hour.jpg`**
    - **Candidate:** creation_1922248547.png
    - **Description:** Client and professional in consultation meeting
    - **Perfect Match:** ✅

21. **`business-legal-contract-review.jpg`**
    - **Candidate:** creation_1922715005.png
    - **Description:** Business partners reviewing contract with professional
    - **Perfect Match:** ✅

22. **`business-setup-company-formation-package.jpg`**
    - **Candidate:** creation_1922715403.png
    - **Description:** Entrepreneur with registration documents, team
    - **Perfect Match:** ✅

---

## 🔍 Images Still Needing Review

Based on the prompts in IMAGE_PROMPTS.md, we still need to find matches for:

### Translation Services (Missing 8)
- translation-driving-license-translation-en-ar.jpg
- translation-legal-power-of-attorney-translation.jpg
- translation-business-financial-statements-translation.jpg
- translation-other-website-localization.jpg
- translation-other-letter-translation.jpg
- translation-other-email-translation.jpg
- translation-other-manual-translation.jpg
- translation-other-app-localization.jpg

### Government Services (Missing 8)
- government-interior-civil-id-card-replacement-lost-damaged.jpg
- government-interior-civil-non-criminal-record-certificate.jpg
- government-interior-civil-civil-status-certificate.jpg
- government-interior-passport-passport-issuance-new.jpg
- government-interior-passport-passport-replacement-lost-stolen.jpg
- government-interior-police-police-clearance-certificate.jpg
- government-interior-police-vehicle-registration.jpg
- government-transport-driving-license-renewal.jpg

---

## 🎯 Next Steps

### Option A: Manual Review & Mapping
1. Open `public/dark/services/tasheel-gen/` folder
2. View images in batches of 10-20
3. Match to prompts in IMAGE_PROMPTS.md
4. Document matches in this file
5. Run batch rename script (I'll create this)

### Option B: Automated Sampling
I can create a script that:
- Displays random samples of 10 images at a time
- You tell me which category each belongs to
- I auto-generate the rename commands

### Option C: Quick Batch Strategy
Since you have 199 images but only need 38:
1. I'll sample 50 images evenly distributed
2. You quickly categorize them verbally
3. I map them to the required 38 names
4. Generate rename script

---

## 📝 Image Quality Checklist

When selecting images, ensure they have:
- ✅ Navy blue and gold color accents (brand colors)
- ✅ Professional, realistic photography style
- ✅ Warm, natural lighting
- ✅ Modern Middle Eastern/Palestinian context
- ✅ Clear subject matter matching the service
- ✅ Horizontal composition (for most)
- ✅ Professional attire/settings

---

**Which approach do you prefer?**
- Type "A" for manual review
- Type "B" for interactive sampling
- Type "C" for quick batch categorization
- Or tell me how many you want to review at once

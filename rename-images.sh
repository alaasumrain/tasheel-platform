#!/bin/bash

# Tasheel Platform - Image Mapping & Rename Script
# This script copies and renames images from tasheel-gen folder to proper locations

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Source and destination directories
SOURCE_DIR="public/dark/services/tasheel-gen"
DARK_DIR="public/dark"
SERVICES_DIR="$DARK_DIR/services"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Tasheel Platform - Image Mapping Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Create services directory if it doesn't exist
mkdir -p "$SERVICES_DIR"

# Counter for tracking
TOTAL=0
SUCCESS=0
FAILED=0

# Function to copy and rename image
copy_image() {
    local source="$SOURCE_DIR/$1"
    local dest="$2"
    local name="$3"

    TOTAL=$((TOTAL + 1))

    if [ -f "$source" ]; then
        # Copy PNG file and convert to JPG using sips (macOS)
        if sips -s format jpeg "$source" --out "$dest" > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} $name"
            SUCCESS=$((SUCCESS + 1))
        else
            echo -e "${YELLOW}⚠${NC} $name (conversion failed, copying as PNG)"
            cp "$source" "${dest%.jpg}.png"
            SUCCESS=$((SUCCESS + 1))
        fi
    else
        echo -e "${YELLOW}✗${NC} $name (source not found: $1)"
        FAILED=$((FAILED + 1))
    fi
}

echo -e "${BLUE}📸 HOMEPAGE IMAGES (8)${NC}\n"

copy_image "creation_1922715403.png" "$DARK_DIR/services-corporate.jpg" "services-corporate.jpg"
copy_image "creation_1922714032.png" "$DARK_DIR/services-residents.jpg" "services-residents.jpg"
copy_image "creation_1922247140.png" "$DARK_DIR/services-non-residents.jpg" "services-non-residents.jpg"
copy_image "creation_1922248560.png" "$DARK_DIR/service-translation.jpg" "service-translation.jpg"
copy_image "creation_1922248519.png" "$DARK_DIR/service-documents.jpg" "service-documents.jpg"
copy_image "creation_1922248547.png" "$DARK_DIR/service-quotations.jpg" "service-quotations.jpg"
copy_image "creation_1922162524.png" "$DARK_DIR/homepage-contact.jpg" "homepage-contact.jpg"
copy_image "creation_1922162846.png" "$DARK_DIR/about.jpg" "about.jpg"

echo -e "\n${BLUE}🌐 TRANSLATION SERVICES (15)${NC}\n"

copy_image "creation_1922247140.png" "$SERVICES_DIR/translation-passport-translation-en-ar.jpg" "translation-passport-translation-en-ar.jpg"
copy_image "creation_1922714032.png" "$SERVICES_DIR/translation-id-card-translation-en-ar.jpg" "translation-id-card-translation-en-ar.jpg"
copy_image "creation_1922700150.png" "$SERVICES_DIR/translation-birth-certificate-translation-en-ar.jpg" "translation-birth-certificate-translation-en-ar.jpg"
copy_image "creation_1922700444.png" "$SERVICES_DIR/translation-academic-degree-translation-en-ar.jpg" "translation-academic-degree-translation-en-ar.jpg"
copy_image "creation_1922713646.png" "$SERVICES_DIR/translation-driving-license-translation-en-ar.jpg" "translation-driving-license-translation-en-ar.jpg"
copy_image "creation_1922248538.png" "$SERVICES_DIR/translation-legal-contract-translation-certified.jpg" "translation-legal-contract-translation-certified.jpg"
copy_image "creation_1922701847.png" "$SERVICES_DIR/translation-legal-power-of-attorney-translation.jpg" "translation-legal-power-of-attorney-translation.jpg"
copy_image "creation_1922257328.png" "$SERVICES_DIR/translation-legal-court-document-translation.jpg" "translation-legal-court-document-translation.jpg"
copy_image "creation_1922703245.png" "$SERVICES_DIR/translation-business-company-registration-documents-translation.jpg" "translation-business-company-registration-documents-translation.jpg"
copy_image "creation_1922703519.png" "$SERVICES_DIR/translation-business-financial-statements-translation.jpg" "translation-business-financial-statements-translation.jpg"
copy_image "creation_1922703810.png" "$SERVICES_DIR/translation-other-website-localization.jpg" "translation-other-website-localization.jpg"
copy_image "creation_1922249314.png" "$SERVICES_DIR/translation-other-letter-translation.jpg" "translation-other-letter-translation.jpg"
copy_image "creation_1922704903.png" "$SERVICES_DIR/translation-other-email-translation.jpg" "translation-other-email-translation.jpg"
copy_image "creation_1922257573.png" "$SERVICES_DIR/translation-other-manual-translation.jpg" "translation-other-manual-translation.jpg"
copy_image "creation_1922258085.png" "$SERVICES_DIR/translation-other-app-localization.jpg" "translation-other-app-localization.jpg"

echo -e "\n${BLUE}🏛️ GOVERNMENT SERVICES (12)${NC}\n"

copy_image "creation_1922714032.png" "$SERVICES_DIR/government-interior-civil-id-card-renewal.jpg" "government-interior-civil-id-card-renewal.jpg"
copy_image "creation_1922700809.png" "$SERVICES_DIR/government-interior-civil-id-card-replacement-lost-damaged.jpg" "government-interior-civil-id-card-replacement-lost-damaged.jpg"
copy_image "creation_1922707893.png" "$SERVICES_DIR/government-interior-civil-birth-certificate-issuance.jpg" "government-interior-civil-birth-certificate-issuance.jpg"
copy_image "creation_1922256705.png" "$SERVICES_DIR/government-interior-civil-non-criminal-record-certificate.jpg" "government-interior-civil-non-criminal-record-certificate.jpg"
copy_image "creation_1922708945.png" "$SERVICES_DIR/government-interior-civil-civil-status-certificate.jpg" "government-interior-civil-civil-status-certificate.jpg"
copy_image "creation_1922247140.png" "$SERVICES_DIR/government-interior-passport-passport-renewal.jpg" "government-interior-passport-passport-renewal.jpg"
copy_image "creation_1922712584.png" "$SERVICES_DIR/government-interior-passport-passport-issuance-new.jpg" "government-interior-passport-passport-issuance-new.jpg"
copy_image "creation_1922249604.png" "$SERVICES_DIR/government-interior-passport-passport-replacement-lost-stolen.jpg" "government-interior-passport-passport-replacement-lost-stolen.jpg"
copy_image "creation_1922713374.png" "$SERVICES_DIR/government-interior-police-police-clearance-certificate.jpg" "government-interior-police-police-clearance-certificate.jpg"
copy_image "creation_1922713646.png" "$SERVICES_DIR/government-interior-police-vehicle-registration.jpg" "government-interior-police-vehicle-registration.jpg"
copy_image "creation_1922258085.png" "$SERVICES_DIR/government-transport-driving-license-renewal.jpg" "government-transport-driving-license-renewal.jpg"
copy_image "creation_1922715403.png" "$SERVICES_DIR/government-economy-company-registration.jpg" "government-economy-company-registration.jpg"

echo -e "\n${BLUE}💼 BUSINESS SERVICES (3)${NC}\n"

copy_image "creation_1922701847.png" "$SERVICES_DIR/business-legal-legal-consultation-1-hour.jpg" "business-legal-legal-consultation-1-hour.jpg"
copy_image "creation_1922715023.png" "$SERVICES_DIR/business-legal-contract-review.jpg" "business-legal-contract-review.jpg"
copy_image "creation_1922715403.png" "$SERVICES_DIR/business-setup-company-formation-package.jpg" "business-setup-company-formation-package.jpg"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "Total images processed: ${BLUE}$TOTAL${NC}"
echo -e "Successfully copied: ${GREEN}$SUCCESS${NC}"
echo -e "Failed: ${YELLOW}$FAILED${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All images mapped successfully!${NC}\n"
else
    echo -e "${YELLOW}⚠ Some images failed. Check the output above.${NC}\n"
fi

echo -e "${BLUE}Next steps:${NC}"
echo "1. Review images in public/dark/ and public/dark/services/"
echo "2. Optimize image sizes (target <200KB each)"
echo "3. Test in application"
echo ""

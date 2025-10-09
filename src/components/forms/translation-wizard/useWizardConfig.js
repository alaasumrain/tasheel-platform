import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { servicesCatalogue } from '@/data/services';
import { getWizardConfig } from '@/data/serviceWizardConfig';
import { getDocumentRequirements } from '@/data/serviceDocumentRequirements';

/**
 * Hook to get wizard configuration based on selected service
 * Returns config object that determines which sections to show
 */
export function useWizardConfig(control) {
  const selectedServiceSlug = useWatch({ control, name: 'meta.service' });

  const config = useMemo(() => {
    if (!selectedServiceSlug) {
      // No service selected yet - return default (show all translation fields)
      return {
        needsLanguagePair: true,
        needsDocumentUpload: true,
        needsEventDetails: false,
        needsMediaFiles: false,
        needsTranslationType: true,
        needsTurnaround: true,
        needsDeliveryMethod: true,
        selectedService: null,
        category: null
      };
    }

    // Find the selected service
    const service = servicesCatalogue.find((s) => s.slug === selectedServiceSlug);

    if (!service) {
      return {
        needsLanguagePair: true,
        needsDocumentUpload: true,
        needsEventDetails: false,
        needsMediaFiles: false,
        needsTranslationType: true,
        needsTurnaround: true,
        needsDeliveryMethod: true,
        selectedService: null,
        category: null
      };
    }

    // Get configuration for this service
    const wizardConfig = getWizardConfig(service.slug, service.category);

    // Get document requirements for this service
    const documentRequirements = getDocumentRequirements(service.slug);

    return {
      ...wizardConfig,
      selectedService: service,
      category: service.category,
      documentRequirements
    };
  }, [selectedServiceSlug]);

  return config;
}

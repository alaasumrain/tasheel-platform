/**
 * Wizard configuration for different service types
 * Defines which sections/fields appear based on the selected service category
 */

export const wizardConfigByCategory = {
  // Translation services: Need language pair, documents, translation options
  translation: {
    needsLanguagePair: true,
    needsDocumentUpload: true,
    needsEventDetails: false,
    needsMediaFiles: false,
    needsTranslationType: true, // certified, notarized, etc.
    needsTurnaround: true,
    needsDeliveryMethod: true
  },

  // Localization services: Similar to translation but project-focused
  localization: {
    needsLanguagePair: true,
    needsDocumentUpload: true,
    needsEventDetails: false,
    needsMediaFiles: false,
    needsTranslationType: false, // No certification for localization
    needsTurnaround: true,
    needsDeliveryMethod: true
  },

  // Interpreting services: Need event details, no documents
  interpreting: {
    needsLanguagePair: true,
    needsDocumentUpload: false, // Optional reference materials
    needsEventDetails: true, // Date, time, location/platform
    needsMediaFiles: false,
    needsTranslationType: false,
    needsTurnaround: false, // Use event date instead
    needsDeliveryMethod: false // Not applicable
  },

  // Audio-visual services: Need media files, vary by service
  'audio-visual': {
    needsLanguagePair: true, // Most A/V services need this
    needsDocumentUpload: false,
    needsEventDetails: false,
    needsMediaFiles: true, // Video/audio files
    needsTranslationType: false,
    needsTurnaround: true,
    needsDeliveryMethod: true
  },

  // Document processing services: Need specific documents, no language pair
  documents: {
    needsLanguagePair: false, // No translation
    needsDocumentUpload: true, // Specific required documents
    needsEventDetails: false,
    needsMediaFiles: false,
    needsTranslationType: false,
    needsTurnaround: true,
    needsDeliveryMethod: true,
    needsSpecificDocuments: true // Use service-specific document requirements
  }
};

// Service-specific overrides for edge cases
export const serviceSpecificConfig = {
  // Transcription might not always need target language
  transcription: {
    needsLanguagePair: false, // Only source language needed
    needsMediaFiles: true,
    needsDocumentUpload: false,
    needsEventDetails: false,
    needsTranslationType: false,
    needsTurnaround: true,
    needsDeliveryMethod: true
  },

  // DTP needs files but not necessarily media
  'dtp-layout': {
    needsLanguagePair: true,
    needsDocumentUpload: true, // InDesign/Photoshop files
    needsMediaFiles: false,
    needsEventDetails: false,
    needsTranslationType: false,
    needsTurnaround: true,
    needsDeliveryMethod: true
  },

  // Phone/VRI might have simplified flows
  'phone-interpreting': {
    needsLanguagePair: true,
    needsDocumentUpload: false,
    needsEventDetails: true, // When they need it
    needsMediaFiles: false,
    needsTranslationType: false,
    needsTurnaround: false,
    needsDeliveryMethod: false
  },

  'video-remote-interpreting': {
    needsLanguagePair: true,
    needsDocumentUpload: false,
    needsEventDetails: true,
    needsMediaFiles: false,
    needsTranslationType: false,
    needsTurnaround: false,
    needsDeliveryMethod: false
  }
};

/**
 * Get wizard configuration for a specific service
 * @param {string} serviceSlug - The service slug
 * @param {string} category - The service category
 * @returns {object} Configuration object
 */
export function getWizardConfig(serviceSlug, category) {
  // Check for service-specific config first
  if (serviceSpecificConfig[serviceSlug]) {
    return serviceSpecificConfig[serviceSlug];
  }

  // Fall back to category default
  return wizardConfigByCategory[category] || wizardConfigByCategory.translation;
}

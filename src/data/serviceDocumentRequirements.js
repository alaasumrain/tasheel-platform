/**
 * Document requirements configuration for services
 * Defines specific documents needed for each service with upload fields
 */

export const documentTypes = {
  PASSPORT: {
    id: 'passport',
    label: 'Passport Copy',
    description: 'Clear scan or photo of your passport',
    required: true,
    accept: 'image/*,application/pdf'
  },
  PALESTINIAN_LICENSE_FRONT: {
    id: 'palestinian-license-front',
    label: 'Palestinian License (Front)',
    description: 'Front side of your Palestinian driving license',
    required: true,
    accept: 'image/*,application/pdf'
  },
  PALESTINIAN_LICENSE_BACK: {
    id: 'palestinian-license-back',
    label: 'Palestinian License (Back)',
    description: 'Back side of your Palestinian driving license',
    required: true,
    accept: 'image/*,application/pdf'
  },
  PERSONAL_PHOTO: {
    id: 'personal-photo',
    label: 'Personal Photo',
    description: 'Recent passport-style photo',
    required: true,
    accept: 'image/*'
  },
  ID_CARD: {
    id: 'id-card',
    label: 'ID Card Copy',
    description: 'Clear copy of your Palestinian ID card',
    required: true,
    accept: 'image/*,application/pdf'
  },
  BLOOD_TYPE: {
    id: 'blood-type',
    label: 'Blood Type Documentation',
    description: 'Medical certificate or document showing your blood type',
    required: true,
    accept: 'image/*,application/pdf'
  },
  OLD_LICENSE: {
    id: 'old-license',
    label: 'Old License Copy',
    description: 'Copy of your expired or current license',
    required: true,
    accept: 'image/*,application/pdf'
  },
  SOURCE_DOCUMENT: {
    id: 'source-document',
    label: 'Source Document',
    description: 'Document to be translated',
    required: true,
    accept: 'image/*,application/pdf,.doc,.docx'
  },
  AUDIO_VIDEO: {
    id: 'audio-video',
    label: 'Audio/Video File',
    description: 'Media file for transcription, subtitling, or dubbing',
    required: true,
    accept: 'audio/*,video/*'
  },
  DESIGN_FILES: {
    id: 'design-files',
    label: 'Design Files',
    description: 'InDesign, Photoshop, or PowerPoint files',
    required: true,
    accept: '.indd,.psd,.ai,.ppt,.pptx'
  }
};

/**
 * Service-specific document requirements
 * Maps service slug to required document types
 */
export const serviceDocumentRequirements = {
  // Document Processing Services
  'international-drivers-license': [
    documentTypes.PASSPORT,
    documentTypes.PALESTINIAN_LICENSE_FRONT,
    documentTypes.PALESTINIAN_LICENSE_BACK,
    documentTypes.PERSONAL_PHOTO
  ],

  'license-renewal': [documentTypes.ID_CARD, documentTypes.PERSONAL_PHOTO, documentTypes.BLOOD_TYPE, documentTypes.OLD_LICENSE],

  // Translation services - generic document
  'document-translation': [documentTypes.SOURCE_DOCUMENT],
  'certified-translation': [documentTypes.SOURCE_DOCUMENT],
  'technical-translation': [documentTypes.SOURCE_DOCUMENT],
  'legal-translation': [documentTypes.SOURCE_DOCUMENT],
  'medical-translation': [documentTypes.SOURCE_DOCUMENT],
  'uscis-translation': [documentTypes.SOURCE_DOCUMENT],
  'patent-translation': [documentTypes.SOURCE_DOCUMENT],

  // Audio-visual services
  subtitling: [documentTypes.AUDIO_VIDEO],
  'voiceover-dubbing': [documentTypes.AUDIO_VIDEO],
  transcription: [documentTypes.AUDIO_VIDEO],
  'dtp-layout': [documentTypes.DESIGN_FILES]
};

/**
 * Get document requirements for a specific service
 * @param {string} serviceSlug - The service slug
 * @returns {Array} Array of document type objects
 */
export function getDocumentRequirements(serviceSlug) {
  return serviceDocumentRequirements[serviceSlug] || [];
}

/**
 * Check if a service needs specific document uploads
 * @param {string} serviceSlug - The service slug
 * @returns {boolean}
 */
export function serviceNeedsDocuments(serviceSlug) {
  const requirements = getDocumentRequirements(serviceSlug);
  return requirements.length > 0;
}

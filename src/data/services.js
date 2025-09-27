// Service categories and catalogue used across Tasheel properties.

export const serviceCategories = [
  { id: 'all', name: 'All Services', icon: 'tabler-apps' },
  { id: 'translation', name: 'Translation', icon: 'tabler-language' },
  { id: 'localization', name: 'Localization', icon: 'tabler-world' },
  { id: 'interpreting', name: 'Interpreting', icon: 'tabler-headphones' },
  { id: 'audio-visual', name: 'Audio & Visual', icon: 'tabler-video' }
];

export const servicesCatalogue = [
  {
    id: 1,
    title: 'Document Translation',
    slug: 'document-translation',
    category: 'translation',
    icon: 'tabler-file-text',
    description: 'Accurate human translation for business and personal documents in 120+ languages.',
    processingTime: '24–48 hours for standard files',
    fee: 'from $0.06 / word',
    requirements: ['Upload source file or scan', 'Specify language pair', 'Choose delivery format'],
    eligibility: 'Ideal for contracts, reports, certificates, and general paperwork'
  },
  {
    id: 2,
    title: 'Certified Translation',
    slug: 'certified-translation',
    category: 'translation',
    icon: 'tabler-certificate',
    description: 'Immigration and legal-grade translations issued with signed certification.',
    processingTime: '24–72 hours depending on volume',
    fee: 'from $0.09 / word',
    requirements: ['Government or legal document scans', 'Certification / notarization needs', 'Desired turnaround'],
    eligibility: 'USCIS filings, court submissions, academic credential evaluations'
  },
  {
    id: 3,
    title: 'Technical Translation',
    slug: 'technical-translation',
    category: 'translation',
    icon: 'tabler-cpu',
    description: 'Engineers and SMEs translate manuals, SOPs, and product specs with precision.',
    processingTime: '3–5 business days',
    fee: 'from $0.085 / word',
    requirements: ['Source documents with diagrams', 'Glossaries or term bases (optional)', 'Reference assets'],
    eligibility: 'Manufacturing, engineering, automotive, and industrial teams'
  },
  {
    id: 4,
    title: 'Legal Translation',
    slug: 'legal-translation',
    category: 'translation',
    icon: 'tabler-gavel',
    description: 'Confidential court-ready translations with terminology management.',
    processingTime: '2–4 business days',
    fee: 'from $0.095 / word',
    requirements: ['Contracts or filings', 'Jurisdiction requirements', 'Reference terminology (optional)'],
    eligibility: 'Law firms, in-house legal, arbitration and compliance teams'
  },
  {
    id: 5,
    title: 'Medical Translation',
    slug: 'medical-translation',
    category: 'translation',
    icon: 'tabler-stethoscope',
    description: 'Life-science specialists handle clinical, pharma, and healthcare content.',
    processingTime: '3–5 business days',
    fee: 'from $0.11 / word',
    requirements: ['Clinical docs or IFUs', 'Compliance notes (HIPAA, MDR, etc.)', 'Terminology lists'],
    eligibility: 'Hospitals, CROs, medical device makers, research teams'
  },
  {
    id: 6,
    title: 'USCIS Translation',
    slug: 'uscis-translation',
    category: 'translation',
    icon: 'tabler-stamp',
    description: 'Immigration-ready packs with certification and optional notarization.',
    processingTime: '24–48 hours for standard records',
    fee: 'from $75 flat per document',
    requirements: ['Birth / marriage / academic documents', 'Applicant details', 'Shipping preference for hard copies'],
    eligibility: 'Individuals and attorneys preparing U.S. immigration submissions'
  },
  {
    id: 7,
    title: 'Patent Translation',
    slug: 'patent-translation',
    category: 'translation',
    icon: 'tabler-atom',
    description: 'Cross-disciplinary linguists handle patents with technical and legal rigor.',
    processingTime: '5–7 business days',
    fee: 'custom — request quote',
    requirements: ['Patent specification', 'Claims and drawings', 'Target jurisdiction details'],
    eligibility: 'IP law firms, R&D labs, corporate innovation teams'
  },
  {
    id: 8,
    title: 'Website Localization',
    slug: 'website-localization',
    category: 'localization',
    icon: 'tabler-device-desktop',
    description: 'Localized copy, SEO keywords, and UX strings ready for global launches.',
    processingTime: 'Sprint-based delivery',
    fee: 'from $0.08 / word',
    requirements: ['URL or CMS export', 'Brand tone guidelines', 'Target markets & locales'],
    eligibility: 'Marketing teams launching or expanding international sites'
  },
  {
    id: 9,
    title: 'Software & App Localization',
    slug: 'software-localization',
    category: 'localization',
    icon: 'tabler-device-mobile',
    description: 'Continuous localization for web, mobile, and embedded products.',
    processingTime: 'Aligned to release cadence',
    fee: 'from $0.085 / word',
    requirements: ['Resource files or repo access', 'Screenshots for context', 'Release schedule'],
    eligibility: 'Product, UX, and engineering teams shipping multilingual apps'
  },
  {
    id: 10,
    title: 'Marketing Transcreation',
    slug: 'marketing-transcreation',
    category: 'localization',
    icon: 'tabler-bulb',
    description: 'Creative linguists adapt campaigns without losing intent or impact.',
    processingTime: '2–3 business days per asset',
    fee: 'project-based pricing',
    requirements: ['Original creative brief', 'Brand voice assets', 'Goals per market'],
    eligibility: 'Brand, growth, and agency teams running international campaigns'
  },
  {
    id: 11,
    title: 'Simultaneous Interpreting',
    slug: 'simultaneous-interpreting',
    category: 'interpreting',
    icon: 'tabler-broadcast',
    description: 'Conference interpreters deliver real-time language support on-site or remote.',
    processingTime: 'Book 7–10 days in advance',
    fee: 'day-rate starting at $950',
    requirements: ['Event agenda & run of show', 'Languages & audience size', 'Venue or platform details'],
    eligibility: 'Events, summits, shareholder meetings, international broadcasts'
  },
  {
    id: 12,
    title: 'Consecutive Interpreting',
    slug: 'consecutive-interpreting',
    category: 'interpreting',
    icon: 'tabler-users',
    description: 'Trusted interpreters for legal, medical, and business appointments.',
    processingTime: 'Book 48 hours in advance',
    fee: 'hourly from $120',
    requirements: ['Meeting agenda', 'Location or video link', 'Any reference materials'],
    eligibility: 'Depositions, medical consults, negotiations, field visits'
  },
  {
    id: 13,
    title: 'Video Remote Interpreting',
    slug: 'video-remote-interpreting',
    category: 'interpreting',
    icon: 'tabler-device-tv',
    description: 'On-demand VRI sessions with secure links and medical-grade privacy.',
    processingTime: 'On-demand in minutes',
    fee: 'per-minute usage',
    requirements: ['Request portal account', 'Preferred languages', 'Operating hours'],
    eligibility: 'Hospitals, courts, customer support, public services'
  },
  {
    id: 14,
    title: 'Phone Interpreting',
    slug: 'phone-interpreting',
    category: 'interpreting',
    icon: 'tabler-phone-call',
    description: '24/7 over-the-phone interpreting for call centres and hotlines.',
    processingTime: 'Connect instantly via hotline',
    fee: 'per-minute usage',
    requirements: ['Account setup', 'Access PIN or routing number', 'Priority language list'],
    eligibility: 'Contact centres, emergency services, travel & hospitality support'
  },
  {
    id: 15,
    title: 'Subtitling & Captioning',
    slug: 'subtitling',
    category: 'audio-visual',
    icon: 'tabler-message-language',
    description: 'Broadcast-quality subtitles with accessibility compliance.',
    processingTime: '3–5 business days',
    fee: 'from $8 / video minute',
    requirements: ['Video file or link', 'Style guide or caption template', 'Turnaround deadline'],
    eligibility: 'Media, e-learning studios, marketing teams, streaming platforms'
  },
  {
    id: 16,
    title: 'Voiceover & Dubbing',
    slug: 'voiceover-dubbing',
    category: 'audio-visual',
    icon: 'tabler-microphone',
    description: 'Native voice talent and studio production for commercials and training.',
    processingTime: '5–7 business days',
    fee: 'project-based pricing',
    requirements: ['Script and target languages', 'Tone & casting preferences', 'Reference timing or video'],
    eligibility: 'Marketing agencies, broadcasters, L&D and product teams'
  },
  {
    id: 17,
    title: 'Transcription Services',
    slug: 'transcription',
    category: 'audio-visual',
    icon: 'tabler-note',
    description: 'Verbatim or edited transcripts with timestamps and speaker tags.',
    processingTime: '24–72 hours depending on length',
    fee: 'from $1.75 / audio minute',
    requirements: ['Audio or video files', 'Preferred format (Word, SRT, VTT)', 'Security requirements'],
    eligibility: 'Legal teams, research firms, media houses, compliance teams'
  },
  {
    id: 18,
    title: 'Desktop Publishing (DTP)',
    slug: 'dtp-layout',
    category: 'audio-visual',
    icon: 'tabler-layout',
    description: 'Multilingual layout, typesetting, and artwork adaptation.',
    processingTime: '3–5 business days',
    fee: 'from $45 / page',
    requirements: ['InDesign / PowerPoint / Photoshop files', 'Fonts and brand assets', 'Output specs or printer notes'],
    eligibility: 'Design teams, training departments, documentation specialists'
  }
];

export const serviceCategoryLookup = serviceCategories.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {});

export const serviceCategoryCounts = servicesCatalogue.reduce(
  (acc, service) => ({
    ...acc,
    [service.category]: (acc[service.category] || 0) + 1
  }),
  { all: servicesCatalogue.length }
);

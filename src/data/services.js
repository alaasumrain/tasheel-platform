// Service categories and catalogue used across Tasheel properties.

export const serviceCategories = [
  { id: 'all', name: 'All Services', icon: 'tabler-apps' },
  { id: 'identity', name: 'Identity & Civil', icon: 'tabler-id' },
  { id: 'business', name: 'Business Services', icon: 'tabler-building' },
  { id: 'health', name: 'Health & Safety', icon: 'tabler-heart-plus' },
  { id: 'transport', name: 'Transportation', icon: 'tabler-car' },
  { id: 'property', name: 'Property & Land', icon: 'tabler-home' },
  { id: 'education', name: 'Education', icon: 'tabler-school' }
];

export const servicesCatalogue = [
  {
    id: 1,
    title: 'Birth Certificate',
    slug: 'birth-certificate',
    category: 'identity',
    icon: 'tabler-certificate',
    description: 'Issue official birth certificates for Palestinian citizens.',
    processingTime: '1-2 business days',
    fee: '25',
    requirements: ['Hospital birth notification', 'Parents national IDs', 'Marriage certificate'],
    eligibility: 'Parents of newborns or guardians'
  },
  {
    id: 2,
    title: 'National ID Card',
    slug: 'national-id',
    category: 'identity',
    icon: 'tabler-id-badge',
    description: 'Apply for new Palestinian national identity card or renewal.',
    processingTime: '3-5 business days',
    fee: '50',
    requirements: ['Birth certificate', 'Family registry', 'Two passport photos'],
    eligibility: 'Palestinian citizens aged 16 and above'
  },
  {
    id: 3,
    title: 'Family Registry Record',
    slug: 'family-registry',
    category: 'identity',
    icon: 'tabler-users',
    description: 'Update family registry with births, marriages, and address changes.',
    processingTime: '2-3 business days',
    fee: '30',
    requirements: ['Supporting documents', 'National ID', 'Proof of change'],
    eligibility: 'Family heads and authorized members'
  },
  {
    id: 4,
    title: 'Business License',
    slug: 'business-license',
    category: 'business',
    icon: 'tabler-building-store',
    description: 'Register new business or renew existing commercial license.',
    processingTime: '5-7 business days',
    fee: '200',
    requirements: ['Trade name reservation', 'Location permit', 'National ID'],
    eligibility: 'Palestinian residents and businesses'
  },
  {
    id: 5,
    title: 'Work Permit',
    slug: 'work-permit',
    category: 'business',
    icon: 'tabler-briefcase',
    description: 'Employment authorization for foreign workers in Palestine.',
    processingTime: '7-10 business days',
    fee: '300',
    requirements: ['Employment contract', 'Passport copy', 'Medical certificate'],
    eligibility: 'Foreign nationals with job offers'
  },
  {
    id: 6,
    title: 'Driving License',
    slug: 'driving-license',
    category: 'transport',
    icon: 'tabler-license',
    description: 'New driving license application or renewal service.',
    processingTime: '3-5 business days',
    fee: '120',
    requirements: ['Traffic test certificate', 'Medical fitness', 'National ID'],
    eligibility: 'Residents aged 18 and above'
  },
  {
    id: 7,
    title: 'Vehicle Registration',
    slug: 'vehicle-registration',
    category: 'transport',
    icon: 'tabler-car',
    description: 'Register new vehicles or transfer ownership.',
    processingTime: '2-3 business days',
    fee: '180',
    requirements: ['Purchase invoice', 'Insurance policy', 'Technical inspection'],
    eligibility: 'Vehicle owners with valid documents'
  },
  {
    id: 8,
    title: 'Health Insurance Registration',
    slug: 'health-insurance',
    category: 'health',
    icon: 'tabler-heart-plus',
    description: 'Enroll in Palestinian government health insurance program.',
    processingTime: '3-5 business days',
    fee: 'Free',
    requirements: ['National ID', 'Employment certificate', 'Residence proof'],
    eligibility: 'Palestinian citizens and residents'
  },
  {
    id: 9,
    title: 'Property Registration',
    slug: 'property-registration',
    category: 'property',
    icon: 'tabler-building-skyscraper',
    description: 'Register property ownership and land transfers.',
    processingTime: '10-15 business days',
    fee: '500',
    requirements: ['Title deed', 'Sale contract', 'Tax clearance certificate'],
    eligibility: 'Property owners and authorized agents'
  },
  {
    id: 10,
    title: 'Building Permit',
    slug: 'building-permit',
    category: 'property',
    icon: 'tabler-building',
    description: 'Construction permits for residential and commercial buildings.',
    processingTime: '15-20 business days',
    fee: '400',
    requirements: ['Architectural plans', 'Land ownership', 'Engineering report'],
    eligibility: 'Property owners and licensed contractors'
  },
  {
    id: 11,
    title: 'School Enrollment',
    slug: 'school-enrollment',
    category: 'education',
    icon: 'tabler-school',
    description: 'Enroll children in Palestinian public schools.',
    processingTime: '2-3 business days',
    fee: 'Free',
    requirements: ['Birth certificate', 'Vaccination record', 'Previous school certificate'],
    eligibility: 'Parents of school-age children'
  },
  {
    id: 12,
    title: 'University Transcript',
    slug: 'university-transcript',
    category: 'education',
    icon: 'tabler-certificate',
    description: 'Official academic transcripts from Palestinian universities.',
    processingTime: '3-5 business days',
    fee: '40',
    requirements: ['Student ID', 'Graduation certificate', 'Request form'],
    eligibility: 'University graduates and current students'
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

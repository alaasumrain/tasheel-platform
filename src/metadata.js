// @project
import branding from '@/branding.json';
import { PAGE_PATH, SECTION_PATH } from '@/path';

/***************************  SEO METADATA - MAIN LAYOUT  ***************************/

const title = `${branding.brandName} - Digital Government Services Platform`;
const description = `${branding.brandName} is Palestine's comprehensive digital platform for government services. Apply for permits, licenses, visas, and other government services online. Fast, secure, and available 24/7.`;

const ogCommonMetadata = {
  locale: 'en_US',
  type: 'website',
  siteName: `${branding.brandName}`,
  images: '/assets/images/metadata/og.png' // recommended dimensions of 1200x630
};

export const mainMetadata = {
  title: {
    template: `%s | ${branding.brandName}`,
    default: title // a default is required when creating a template
  },
  description,
  applicationName: title,
  keywords: [
    'Tasheel',
    'Government Services',
    'Palestine',
    'Digital Government',
    'Online Services',
    'Work Permits',
    'Business License',
    'Residence Visa',
    'Document Services',
    'E-Government',
    'Public Services'
  ],
  creator: `${branding.company.name}`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title,
    description,
    url: '/',
    ...ogCommonMetadata
  }
};

/***************************  SEO METADATA - SECTIONS  ***************************/

const sectionCommonMeta = {
  title: 'Services',
  description: `Browse all available government services on ${branding.brandName}. Apply for work permits, business licenses, residence visas, and more through our secure online platform.`
};

const aboutPageCommonMeta = {
  title: 'About',
  description: `Learn about ${branding.brandName}, Palestine's digital government services platform. Our mission is to simplify bureaucracy and make government services accessible to all citizens 24/7.`
};

const careerPageCommonMeta = {
  title: 'Career',
  description: `Join the ${branding.brandName} team and help transform government services in Palestine. Explore career opportunities in technology, customer service, and digital transformation.`
};

const faqPageCommonMeta = {
  title: 'FAQ',
  description: `Find answers to common questions about using ${branding.brandName} for government services. Learn about application processes, fees, documents required, and more.`
};

const pricingPageCommonMeta = {
  title: 'Service Fees',
  description: `View transparent pricing for all government services on ${branding.brandName}. All fees are standardized and clearly displayed before application submission.`
};

const comingSoonPageCommonMeta = { title: 'Coming soon', description: 'New services coming soon to Tasheel' };

const privacyPolicyCommonMeta = {
  title: 'Privacy Policy',
  description: `${branding.brandName} privacy policy outlines how we protect your personal information. We use advanced encryption and comply with international data protection standards.`
};

const contactUsCommonMeta = {
  title: 'Contact Us',
  description: `Get in touch with ${branding.brandName} support team. Available 24/7 to help with your government service applications. Contact us via phone, email, or live chat.`
};

const error404PageCommonMeta = { title: 'Page Not Found', description: 'The page you are looking for does not exist.' };
const error500PageCommonMeta = { title: 'Server Error', description: 'Something went wrong. Please try again later.' };

const underMaintenanceCommonMeta = {
  title: 'Under Maintenance',
  description: `${branding.brandName} is currently under maintenance. We'll be back shortly to serve you better.`
};

export const SEO_CONTENT = {
  section: { ...sectionCommonMeta, openGraph: { ...sectionCommonMeta, ...ogCommonMetadata, url: SECTION_PATH } },
  aboutPage: { ...aboutPageCommonMeta, openGraph: { ...aboutPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.aboutPage } },
  careerPage: { ...careerPageCommonMeta, openGraph: { ...careerPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.careerPage } },
  faqPage: { ...faqPageCommonMeta, openGraph: { ...faqPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.faqPage } },
  pricingPage: { ...pricingPageCommonMeta, openGraph: { ...pricingPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.pricingPage } },
  comingSoonPage: {
    ...comingSoonPageCommonMeta,
    openGraph: { ...comingSoonPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.comingSoon }
  },
  privacyPolicy: {
    ...privacyPolicyCommonMeta,
    openGraph: { ...privacyPolicyCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.privacyPolicyPage }
  },
  contactUs: { ...contactUsCommonMeta, openGraph: { ...contactUsCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.contactPage } },
  error404Page: { ...error404PageCommonMeta, openGraph: { ...error404PageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.error404 } },
  error500Page: { ...error500PageCommonMeta, openGraph: { ...error500PageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.error500 } },
  underMaintenance: {
    ...underMaintenanceCommonMeta,
    openGraph: { ...underMaintenanceCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.underMaintenance }
  },
  featurePage: {
    title: 'Features',
    description: 'Explore all features of Tasheel digital government services platform. Fast processing, secure documents, real-time tracking, and 24/7 support.'
  },
  blogPage: {
    title: 'News & Updates',
    description: 'Stay informed about new services, policy changes, and updates to the Tasheel platform'
  },
  collaboratePage: {
    title: 'Partners',
    description: 'Learn about partnerships and collaboration opportunities with Tasheel'
  },
  solutionPage: {
    title: 'Solutions',
    description:
      'Comprehensive digital solutions for all your government service needs. From permits to licenses, we have you covered.'
  },

  about: {
    title: 'About Tasheel',
    description: `Learn about ${branding.brandName}'s mission to transform government services through digital innovation.`
  },

  metrics: {
    title: 'Our Impact',
    description: `See how ${branding.brandName} is making government services faster, easier, and more accessible for everyone.`
  },

  forgotPassword: {
    title: 'Reset Password',
    description: `Reset your ${branding.brandName} account password securely.`
  },

  login: {
    title: 'Login',
    description: `Sign in to your ${branding.brandName} account to access government services and track applications.`
  },

  newPassword: {
    title: 'Create New Password',
    description: `Create a new secure password for your ${branding.brandName} account.`
  },

  otpVerification: {
    title: 'Verify Account',
    description: `Verify your ${branding.brandName} account with a one-time passcode for secure access.`
  },

  register: {
    title: 'Register',
    description: `Create your ${branding.brandName} account to start using digital government services.`
  },

  clientele: {
    title: 'Our Partners',
    description: `${branding.brandName} works with various government departments and agencies to deliver seamless services.`
  },

  blog: {
    title: 'News & Updates',
    description: `Stay updated with the latest news, service launches, and policy changes on ${branding.brandName}.`
  },

  color: {
    title: 'Brand Colors',
    description: `${branding.brandName} brand color palette and design guidelines.`
  },

  comingSoon: {
    title: 'Coming Soon',
    description: `New services and features coming soon to ${branding.brandName}. Stay tuned for updates!`
  },

  cookie: {
    title: 'Cookie Policy',
    description: `Learn about how ${branding.brandName} uses cookies to improve your experience and ensure service quality.`
  },

  cta: {
    title: 'Get Started',
    description: `Start using ${branding.brandName} for all your government service needs. Apply online, save time, track progress.`
  },

  earlyAccess: {
    title: 'Early Access',
    description: `Get early access to new ${branding.brandName} features and services. Be the first to try our latest updates.`
  },

  error404: {
    title: 'Page Not Found',
    description: `The page you're looking for doesn't exist. Return to ${branding.brandName} homepage.`
  },

  error500: {
    title: 'Server Error',
    description: `We're experiencing technical difficulties. Please try again later or contact ${branding.brandName} support.`
  },

  faq: {
    title: 'Frequently Asked Questions',
    description: `Find answers to common questions about using ${branding.brandName} for government services, fees, documents, and application processes.`
  },

  feature: {
    title: 'Platform Features',
    description: `Discover ${branding.brandName} features: online applications, document upload, secure payments, real-time tracking, and 24/7 support.`
  },

  footer: {
    title: 'Quick Links',
    description: `Access important ${branding.brandName} links, services, support, and contact information.`
  },

  gallery: {
    title: 'Service Gallery',
    description: `Browse visual guides and screenshots of ${branding.brandName} services and application processes.`
  },

  hero: {
    title: 'Welcome to Tasheel',
    description: `${branding.brandName} - Your gateway to digital government services in Palestine. Apply for permits, licenses, and more online.`
  },

  icon: {
    title: 'Icons',
    description: `Icon library used in ${branding.brandName} platform for intuitive navigation and user experience.`
  },

  integration: {
    title: 'System Integration',
    description: `${branding.brandName} integrates with various government systems to provide seamless service delivery.`
  },

  megaMenu: {
    title: 'Services Menu',
    description: `Navigate all ${branding.brandName} services organized by category for easy access.`
  },

  navbar: {
    title: 'Navigation',
    description: `Easy navigation through ${branding.brandName} platform to access all government services.`
  },

  onBoard: {
    title: 'Getting Started',
    description: `New to ${branding.brandName}? Learn how to create an account and start using government services online.`
  },

  other: {
    title: 'Additional Services',
    description: 'Explore additional government services available on Tasheel'
  },

  pricing: {
    title: 'Service Fees',
    description: `View transparent pricing for all government services on ${branding.brandName}. All fees clearly displayed upfront.`
  },

  process: {
    title: 'Application Process',
    description: `Step-by-step guide to applying for government services on ${branding.brandName}. Simple, fast, and secure.`
  },

  smallHero: {
    title: 'Service Pages',
    description: `Individual service pages on ${branding.brandName} for specific government applications.`
  },

  team: {
    title: 'Our Team',
    description: `Meet the ${branding.brandName} team working to transform government services through digital innovation.`
  },

  testimonial: {
    title: 'User Reviews',
    description: `Read what citizens and businesses say about their experience using ${branding.brandName} for government services.`
  },

  termsCondition: {
    title: 'Terms & Conditions',
    description: `${branding.brandName} terms and conditions for using our digital government services platform.`
  },

  topOffer: {
    title: 'Special Announcements',
    description: `Important announcements and updates about ${branding.brandName} services and new features.`
  },

  typography: {
    title: 'Typography',
    description: `Typography guidelines for ${branding.brandName} platform ensuring readability and consistency.`
  }
};
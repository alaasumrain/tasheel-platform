// @project
import branding from '@/branding.json';
import { IconType } from '@/enum';

export const feature20 = {
  heading: 'All Government Services in One Platform',
  caption: 'Streamline your government transactions with our comprehensive digital services platform',
  actionBtn: { children: 'Apply Now', href: '/services' },
  secondaryBtn: { children: 'Track Application', href: '/track' },
  features: [
    {
      icon: 'tabler-briefcase',
      title: 'Work Permits',
      content: 'Apply for work permits and employment authorizations online with ease.'
    },
    {
      icon: 'tabler-building',
      title: 'Business Licenses',
      content: 'Register your business and obtain necessary licenses through our portal.'
    },
    {
      icon: 'tabler-home',
      title: 'Residence Visas',
      content: 'Process residence visa applications and renewals digitally.'
    },
    {
      icon: 'tabler-car',
      title: 'Driving Licenses',
      content: 'Apply for new driving licenses or renew existing ones online.'
    },
    {
      icon: 'tabler-file-text',
      title: 'Document Services',
      content: 'Request official documents, certificates, and attestations digitally.'
    },
    {
      icon: 'tabler-clock',
      title: 'Fast Processing',
      content: 'Experience faster processing times with our streamlined digital workflows.'
    }
  ]
};

export const feature18 = {
  heading: 'Powerful Government Portal',
  caption: 'Manage citizen services, applications, and workflows with our comprehensive digital platform.',
  topics: [
    {
      icon: 'tabler-sparkles',
      title: 'Digital Services',
      title2: 'Complete Government Services Online',
      description: 'Access all government services through one unified digital platform',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Online Application Processing' },
        { primary: 'Document Management System' },
        { primary: 'Real-time Status Tracking' },
        { primary: 'Secure Payment Gateway' }
      ],
      actionBtn: { children: 'Apply Now', href: '/services' },
      actionBtn2: { children: 'Learn More', href: '/guide' }
    },
    {
      icon: 'tabler-palette',
      title: 'Multi-Department',
      title2: 'All Departments in One Place',
      description: 'Access services from multiple government departments seamlessly.',
      image: '/assets/images/graphics/default/admin-dashboard-2.png',
      list: [
        { primary: 'Ministry of Interior Services' },
        { primary: 'Ministry of Labor' },
        { primary: 'Ministry of Health' },
        { primary: 'Ministry of Education' }
      ],
      actionBtn: { children: 'Browse Services', href: '/services' },
      actionBtn2: { children: 'Department Guide', href: '/departments' }
    },
    {
      icon: 'tabler-rocket',
      title: 'Fast Processing',
      title2: 'Reduced Processing Times',
      description: 'Experience faster service delivery with digital transformation.',
      image: '/assets/images/graphics/default/admin-dashboard-3.png',
      list: [
        { primary: '70% Faster Processing' },
        { primary: 'Instant Application Submission' },
        { primary: 'Automated Verification' },
        { primary: 'Express Service Options' }
      ],
      actionBtn: { children: 'Start Application', href: '/apply' },
      actionBtn2: { children: 'Processing Times', href: '/times' }
    },
    {
      icon: 'tabler-scale',
      title: 'Secure Platform',
      title2: 'Bank-Level Security',
      description: 'Your data is protected with advanced encryption and security protocols.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'End-to-End Encryption' },
        { primary: 'Secure Document Storage' },
        { primary: 'Privacy Protection' },
        { primary: 'Regular Security Audits' }
      ],
      actionBtn: { children: 'View Security', href: '/security' },
      actionBtn2: { children: 'Privacy Policy', href: '/privacy' }
    }
  ]
};

export const feature21 = {
  heading: `Experience Digital Excellence with ${branding.brandName}`,
  caption: 'Access government services with our modern, user-friendly, and accessible digital platform.',
  image: '/assets/images/graphics/ai/desktop1-light.svg',
  primaryBtn: { children: 'Start Now', href: '/register' },
  secondaryBtn: {
    children: 'View Demo',
    href: '/demo'
  },
  features: [
    {
      animationDelay: 0.1,
      icon: 'tabler-components',
      title: 'All Services'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-moon',
      title: '24/7 Available'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brightness-auto',
      title: 'Smart Forms'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-accessible',
      title: 'Accessible'
    },
    {
      animationDelay: 0.1,
      icon: 'tabler-icons',
      title: 'Multi-Language'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-file-stack',
      title: 'Digital Docs'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brand-matrix',
      title: 'Secure Platform'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-click',
      title: 'Easy Navigation'
    }
  ]
};

// Additional feature sections for other pages
export const feature2 = {
  heading: 'Our Commitment to Excellence',
  caption: 'Dedicated to providing world-class government services',
  features: [
    {
      icon: { name: 'tabler-users', type: IconType.STROKE, color: 'primary.main', stroke: 1 },
      title: 'Citizen-Centric',
      content: 'We prioritize user experience to make government services accessible to all citizens.'
    },
    {
      icon: { name: 'tabler-star', type: IconType.STROKE, color: 'warning.main', stroke: 1 },
      title: 'Excellence',
      content: 'Committed to delivering high-quality services with complete transparency.'
    },
    {
      icon: { name: 'tabler-chart-histogram', type: IconType.STROKE, color: 'success.main', stroke: 1 },
      title: 'Innovation',
      content: 'Continuously improving our platform with the latest technology and user feedback.'
    }
  ]
};

export const feature5 = {
  heading: 'Support Services',
  caption: 'Additional resources to help you navigate our platform',
  features: [
    {
      icon: 'tabler-help-hexagon',
      title: 'Help Center',
      content: 'Comprehensive guides and FAQs to answer all your questions.'
    },
    {
      icon: 'tabler-book-2',
      title: 'Video Tutorials',
      content: 'Step-by-step video guides for complex application processes.'
    }
  ],
  features2: [
    {
      icon: 'tabler-message-circle',
      title: 'Live Chat',
      content: 'Instant support from our customer service team.'
    },
    {
      icon: 'tabler-calendar-event',
      title: 'Appointment Booking',
      content: 'Schedule in-person visits when physical presence is required.'
    }
  ]
};

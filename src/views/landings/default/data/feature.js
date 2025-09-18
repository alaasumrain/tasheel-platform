// @project
import branding from '@/branding.json';
import { IconType } from '@/enum';

export const feature20 = {
  heading: 'Everything you need to run public services end to end',
  caption: 'Tasheel keeps applicants, reviewers, and partner ministries aligned with guided workflows and live status updates.',
  actionBtn: { children: 'Start an Application', href: '/services' },
  secondaryBtn: { children: 'Talk to Tasheel', href: '/contact' },
  features: [
    {
      icon: 'tabler-layout-dashboard',
      title: 'Unified dashboard',
      content: 'Monitor every submission across agencies with clear ownership and next steps.'
    },
    {
      icon: 'tabler-checklist',
      title: 'Guided forms',
      content: 'Applicants see the exact documents, fees, and eligibility rules before they start.'
    },
    {
      icon: 'tabler-bell',
      title: 'Real-time alerts',
      content: 'Automated email and SMS notifications keep applicants and officers aligned.'
    },
    {
      icon: 'tabler-cloud-lock',
      title: 'Secure records',
      content: 'End-to-end encryption and audit trails protect sensitive information by default.'
    },
    {
      icon: 'tabler-users-group',
      title: 'Collaboration tools',
      content: 'Invite inspectors, legal teams, or external reviewers without losing context.'
    },
    {
      icon: 'tabler-rocket',
      title: 'Express handling',
      content: 'Fast-track complex cases with SLA monitoring and escalation playbooks.'
    }
  ]
};

export const feature18 = {
  heading: 'One platform for every department you work with',
  caption: 'Tasheel adapts to each agency’s policy while keeping a consistent experience for applicants.',
  topics: [
    {
      icon: 'tabler-sparkles',
      title: 'Digital services',
      title2: 'Launch new workflows fast',
      description: 'Use ready-made blueprints for intake, review, approvals, and fulfilment so teams focus on policy—not plumbing.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Reusable service templates' },
        { primary: 'Document validation rules' },
        { primary: 'Real-time status tracking' },
        { primary: 'Built-in payments & receipts' }
      ],
      actionBtn: { children: 'Start an application', href: '/services' },
      actionBtn2: { children: 'See service catalogue', href: '/services' }
    },
    {
      icon: 'tabler-palette',
      title: 'Multi-department',
      title2: 'Collaborate across ministries',
      description: 'Connect licensing, immigration, municipal, and inspection workflows inside a single shared case file.',
      image: '/assets/images/graphics/default/admin-dashboard-2.png',
      list: [
        { primary: 'Shared applicant profiles' },
        { primary: 'Role-based permissions' },
        { primary: 'Cross-agency task routing' },
        { primary: 'Unified notifications' }
      ],
      actionBtn: { children: 'Browse services', href: '/services' },
      actionBtn2: { children: 'Talk to Tasheel', href: '/contact' }
    },
    {
      icon: 'tabler-rocket',
      title: 'Fast processing',
      title2: 'Shorten turnaround times',
      description: 'Automations trigger document checks, approvals, and reminders the moment an application arrives.',
      image: '/assets/images/graphics/default/admin-dashboard-3.png',
      list: [
        { primary: 'Automated eligibility checks' },
        { primary: 'Instant routing to reviewers' },
        { primary: 'Deadline monitoring' },
        { primary: 'Express service configurations' }
      ],
      actionBtn: { children: 'Start an application', href: '/services' },
      actionBtn2: { children: 'Request express setup', href: '/contact' }
    },
    {
      icon: 'tabler-scale',
      title: 'Secure platform',
      title2: 'Protect sensitive decisions',
      description: 'Bank-grade encryption, Palestinian data residency, and detailed audit logs keep every action accountable.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'End-to-end encryption' },
        { primary: 'Granular audit trails' },
        { primary: 'Compliance-ready exports' },
        { primary: 'Routine penetration testing' }
      ],
      actionBtn: { children: 'View security approach', href: '/privacy-policy' },
      actionBtn2: { children: 'See privacy policy', href: '/privacy-policy' }
    }
  ]
};

export const feature21 = {
  heading: `Experience digital public services with ${branding.brandName}`,
  caption: 'Applicants stay informed, officers stay coordinated, and leadership gains the insight to improve every service.',
  image: '/assets/images/graphics/ai/desktop1-light.svg',
  primaryBtn: { children: 'Start with Tasheel', href: '/services' },
  secondaryBtn: {
    children: 'Talk to our team',
    href: '/contact'
  },
  features: [
    {
      animationDelay: 0.1,
      icon: 'tabler-components',
      title: 'Multi-agency workflows'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-moon',
      title: '24/7 availability'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brightness-auto',
      title: 'Smart forms & validation'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-accessible',
      title: 'WCAG-compliant UI'
    },
    {
      animationDelay: 0.1,
      icon: 'tabler-icons',
      title: 'Arabic & English'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-file-stack',
      title: 'Digital document vault'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brand-matrix',
      title: 'Secure infrastructure'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-click',
      title: 'Guided journeys'
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

// @project
import { PAGE_PATH, SECTION_PATH } from '@/path';

// @assets
const imagePrefix = '/assets/images/presentation';

// @project
import branding from '@/branding.json';

export const other = {
  heading: `${branding.brandName} Service Categories`,
  description: 'Explore our comprehensive range of digital government services organized by category for easy navigation.',
  primaryBtn: { children: 'Explore All Services', href: '/services' },
  sections: [
    {
      animationDelay: 0.2,
      title: 'Identity & Civil',
      subTitle: '12 Service Types',
      image: `${imagePrefix}/hero-light.svg`,
      link: '/services?category=identity'
    },
    {
      animationDelay: 0.3,
      title: 'Business Services',
      subTitle: '18 Service Types',
      image: `${imagePrefix}/cta-light.svg`,
      link: '/services?category=business'
    },
    {
      animationDelay: 0.4,
      title: 'Health & Safety',
      subTitle: '15 Service Types',
      image: `${imagePrefix}/feature-light.svg`,
      link: '/services?category=health'
    },
    {
      animationDelay: 0.2,
      title: 'Transportation',
      subTitle: '9 Service Types',
      image: `${imagePrefix}/metrics-light.svg`,
      link: '/services?category=transport'
    },
    {
      animationDelay: 0.3,
      title: 'Property & Land',
      subTitle: '11 Service Types',
      image: `${imagePrefix}/process-light.svg`,
      link: '/services?category=property'
    },
    {
      animationDelay: 0.4,
      title: 'Education',
      subTitle: '8 Service Types',
      image: `${imagePrefix}/integration-light.svg`,
      link: '/services?category=education'
    }
  ]
};

export const other3 = {
  heading: 'Recent Service Updates',
  caption: 'Stay informed about new services, improvements, and important announcements from Tasheel',
  other: [
    {
      title: 'New Online Birth Certificate Service',
      description: 'Apply for birth certificates online without visiting government offices. Available for all citizens.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'January 2025'
        },
        {
          icon: 'tabler-sparkles',
          name: 'New Service'
        }
      ],
      btn: { children: 'Learn More', href: '/services/birth-certificate' }
    },
    {
      title: 'Express Processing Now Available',
      description: 'Get your documents faster with our new express processing option for urgent requests.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'December 2024'
        },
        {
          icon: 'tabler-bolt',
          name: 'Enhancement'
        }
      ],
      btn: { children: 'View Details', href: '/express' }
    },
    {
      title: 'Mobile App Launch',
      description: 'Access all Tasheel services on your mobile device. Available for iOS and Android.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'November 2024'
        },
        {
          icon: 'tabler-device-mobile',
          name: 'Mobile'
        }
      ],
      btn: { children: 'Download App', href: '/mobile' }
    },
    {
      title: 'Business Portal Update',
      description: 'Enhanced business registration process with faster approval times and digital signatures.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'October 2024'
        },
        {
          icon: 'tabler-refresh',
          name: 'Update'
        }
      ],
      btn: { children: 'Explore', href: '/business' }
    }
  ]
};
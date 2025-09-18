// @project
import branding from '@/branding.json';

// @assets
const imagePrefix = '/assets/images/presentation';

export const other = {
  heading: `${branding.brandName} service categories`,
  description: 'Browse the service journeys already digitised on Tasheel and see what is coming next.',
  primaryBtn: { children: 'Explore all services', href: '/services' },
  sections: [
    {
      animationDelay: 0.2,
      title: 'Identity & Civil',
      subTitle: '11 service journeys live',
      image: `${imagePrefix}/hero-light.svg`,
      link: '/services?category=identity'
    },
    {
      animationDelay: 0.3,
      title: 'Business Services',
      subTitle: '14 service journeys live',
      image: `${imagePrefix}/cta-light.svg`,
      link: '/services?category=business'
    },
    {
      animationDelay: 0.4,
      title: 'Health & Safety',
      subTitle: '9 service journeys live',
      image: `${imagePrefix}/feature-light.svg`,
      link: '/services?category=health'
    },
    {
      animationDelay: 0.2,
      title: 'Transportation',
      subTitle: '8 service journeys live',
      image: `${imagePrefix}/metrics-light.svg`,
      link: '/services?category=transport'
    },
    {
      animationDelay: 0.3,
      title: 'Property & Land',
      subTitle: '6 service journeys live',
      image: `${imagePrefix}/process-light.svg`,
      link: '/services?category=property'
    },
    {
      animationDelay: 0.4,
      title: 'Education',
      subTitle: '5 service journeys live',
      image: `${imagePrefix}/integration-light.svg`,
      link: '/services?category=education'
    }
  ]
};

export const other3 = {
  heading: 'Recent platform updates',
  caption: 'New digital workflows, enhancements, and operations notes from the Tasheel team.',
  other: [
    {
      title: 'Identity records now fully digital',
      description: 'Birth certificate, family book, and ID renewals can now be submitted and paid for entirely on Tasheel.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'January 2025'
        },
        {
          icon: 'tabler-sparkles',
          name: 'New service'
        }
      ],
      btn: { children: 'Learn more', href: '/services?category=identity' }
    },
    {
      title: 'Accelerated processing pilot',
      description: 'Selected business licensing workflows now support express handling with concierge support.',
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
      btn: { children: 'View details', href: '/services?express=true' }
    },
    {
      title: 'Mobile experience in beta',
      description: 'Progress your existing applications from mobile devices with push notifications and document uploads.',
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
      btn: { children: 'Join the beta', href: '/contact' }
    },
    {
      title: 'Business portal refresh',
      description: 'Unified onboarding for trade, import/export, and SME support programmes with shared documentation.',
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
      btn: { children: 'Explore', href: '/services?category=business' }
    }
  ]
};

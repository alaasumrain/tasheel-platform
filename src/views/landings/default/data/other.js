'use client';
// @project
import branding from '@/branding.json';

// @assets
const imagePrefix = '/assets/images/presentation';

export const other = {
  heading: `${branding.brandName} service families`,
  description: 'Translation is live today. Tap a pillar to see what Tasheel already delivers and where we are investing next.',
  primaryBtn: { children: 'Explore all services', href: '/services' },
  sections: [
    {
      animationDelay: 0.2,
      title: 'Translation Services',
      subTitle: 'Certified documents, legal, technical, medical',
      image: `${imagePrefix}/hero-light.svg`,
      link: '/services?category=translation'
    },
    {
      animationDelay: 0.3,
      title: 'Localization Services',
      subTitle: 'Websites, software, product, and marketing',
      image: `${imagePrefix}/cta-light.svg`,
      link: '/services?category=localization'
    },
    {
      animationDelay: 0.4,
      title: 'Interpreting Services',
      subTitle: 'On-site, remote, and on-demand coverage',
      image: `${imagePrefix}/feature-light.svg`,
      link: '/services?category=interpreting'
    },
    {
      animationDelay: 0.2,
      title: 'Audio-Visual Services',
      subTitle: 'Subtitling, voiceover, transcription, DTP',
      image: `${imagePrefix}/metrics-light.svg`,
      link: '/services?category=audio-visual'
    },
    {
      animationDelay: 0.3,
      title: 'More Tasheel services',
      subTitle: 'Permits, logistics, advisory and beyond',
      image: `${imagePrefix}/integration-light.svg`,
      link: '/contact?intent=consult'
    }
  ]
};

export const other3 = {
  heading: 'Recent programme highlights',
  caption: 'Milestones from Tasheel language teams supporting enterprise, public sector, and high-growth organisations.',
  other: [
    {
      title: 'Global compliance portal launch',
      description:
        'Delivered 1,800 certified translations across 28 languages with notarisation and apostille coordination in under six weeks.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'March 2025'
        },
        {
          icon: 'tabler-certificate',
          name: 'Certified programme'
        }
      ],
      btn: { children: 'See document services', href: '/services?category=translation' }
    },
    {
      title: 'Product localisation playbook',
      description:
        'Integrated Tasheel localisation with a SaaS release cycle—two-week sprints translating UI, marketing, and support docs.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'February 2025'
        },
        {
          icon: 'tabler-world',
          name: 'Localization'
        }
      ],
      btn: { children: 'View localization services', href: '/services?category=localization' }
    },
    {
      title: 'On-demand interpreting desk',
      description: 'Stood up a 24/7 interpreting hotline for healthcare and government partners with sub-five-minute connection SLAs.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'January 2025'
        },
        {
          icon: 'tabler-headphones',
          name: 'Interpreting'
        }
      ],
      btn: { children: 'Talk to interpreting team', href: '/contact?category=interpreting&intent=consult' }
    },
    {
      title: 'AV localisation toolkit',
      description: 'Produced multilingual subtitles, voiceover, and DTP for a 14-course learning academy in three weeks.',
      chips: [
        {
          icon: 'tabler-calendar',
          name: 'December 2024'
        },
        {
          icon: 'tabler-microphone',
          name: 'Media'
        }
      ],
      btn: { children: 'View AV services', href: '/services?category=audio-visual' }
    }
  ]
};

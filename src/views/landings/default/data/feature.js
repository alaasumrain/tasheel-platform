'use client';
// @project
import { IconType } from '@/enum';

export const feature20 = {
  heading: 'Tasheel handles the legwork for every service request',
  caption: 'One dashboard, clear handoffs, and a responsive support team—today for translation, tomorrow for every service you need.',
  actionBtn: { children: 'Request a translation quote', href: '/quote' },
  secondaryBtn: { children: 'Talk to Tasheel', href: '/contact?intent=consult' },
  features: [
    {
      icon: 'tabler-user-star',
      title: 'Single Tasheel point of contact',
      content: 'One coordinator understands your goals, gathers requirements, and keeps progress transparent.'
    },
    {
      icon: 'tabler-language',
      title: 'Trusted specialist partners',
      content: 'Handpicked linguists with legal, medical, and technical backgrounds—not a generic marketplace.'
    },
    {
      icon: 'tabler-folders',
      title: 'Structured reviews',
      content: 'Checklists, terminology guidance, and second-eye reviews keep deliverables consistent.'
    },
    {
      icon: 'tabler-shield-lock',
      title: 'Secure handling',
      content: 'NDAs, encrypted storage, and role-based access for every file and participant.'
    },
    {
      icon: 'tabler-robot',
      title: 'Human-first, tech-assisted',
      content: 'We use tooling to cut admin and amplify experts—not to replace them.'
    },
    {
      icon: 'tabler-headset',
      title: 'Support when you need it',
      content: 'Quick responses via email, phone, or chat—before, during, and after delivery.'
    }
  ]
};

export const feature18 = {
  heading: 'Where Tasheel adds value today',
  caption: 'Our translation desk is the first of many Tasheel services—the same framework will power permits, logistics, and more.',
  topics: [
    {
      icon: 'tabler-file-description',
      title: 'Professional translation',
      title2: 'Certified accuracy when stakes are high',
      description: 'Certified, legal, and technical translation with notarisation support and tracked milestones.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Certified & notarised packs' },
        { primary: 'Two-step linguistic QA' },
        { primary: 'Terminology & glossary control' },
        { primary: 'Secure digital delivery & shipping' }
      ],
      actionBtn: { children: 'Get a translation quote', href: '/quote?service=certified-translation' },
      actionBtn2: { children: 'Browse translation services', href: '/services?category=translation' }
    },
    {
      icon: 'tabler-world-latitude',
      title: 'Localization & product content',
      title2: 'Keep launches on schedule',
      description: 'Adapt websites, support docs, and software strings with reviewers who understand brand and UX.',
      image: '/assets/images/graphics/default/admin-dashboard-2.png',
      list: [
        { primary: 'Continuous localization pipelines' },
        { primary: 'SEO + keyword adaptation' },
        { primary: 'Style guide & tone management' },
        { primary: 'In-market linguistic QA' }
      ],
      actionBtn: { children: 'Plan localization', href: '/contact?service=software-localization&intent=consult' },
      actionBtn2: { children: 'Browse localization services', href: '/services?category=localization' }
    },
    {
      icon: 'tabler-headphones',
      title: 'Interpreting',
      title2: 'Conversations without language barriers',
      description:
        'On-site, remote, and on-demand interpreting arranged through Tasheel—ideal for healthcare, legal, and government sessions.',
      image: '/assets/images/graphics/default/admin-dashboard-3.png',
      list: [
        { primary: 'Simultaneous & consecutive modes' },
        { primary: 'Equipment and booth coordination' },
        { primary: 'On-demand phone & video access' },
        { primary: 'SLA-backed scheduling support' }
      ],
      actionBtn: { children: 'Schedule interpreting', href: '/contact?service=simultaneous-interpreting&intent=consult' },
      actionBtn2: { children: 'Explore interpreting', href: '/services?category=interpreting' }
    },
    {
      icon: 'tabler-video',
      title: 'Media & AV support',
      title2: 'Courses, campaigns, and comms in any language',
      description: 'Subtitling, dubbing, transcription, and DTP—managed like a project, not a pile of files.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Subtitle authoring & QC' },
        { primary: 'Voiceover casting & direction' },
        { primary: 'DTP & artwork adaptation' },
        { primary: 'Multi-format exports (SRT, WebVTT, etc.)' }
      ],
      actionBtn: { children: 'Start media project', href: '/quote?service=subtitling' },
      actionBtn2: { children: 'View audio-visual services', href: '/services?category=audio-visual' }
    }
  ]
};

export const feature21 = {
  heading: `Experience Tasheel, starting with translation`,
  caption:
    'Submit once, track every milestone, and receive the deliverable you need. As Tasheel grows, the same experience will power every service.',
  image: '/assets/images/graphics/ai/desktop1-light.svg',
  primaryBtn: { children: 'Explore translation services', href: '/services' },
  secondaryBtn: {
    children: 'Book time with Tasheel',
    href: '/contact?intent=consult'
  },
  features: [
    {
      animationDelay: 0.1,
      icon: 'tabler-certificate',
      title: 'Certified & notarised delivery'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-language-hiragana',
      title: '25+ language pairs and growing'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-adjustments-dollar',
      title: 'Transparent pricing & SLAs'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-shield-lock',
      title: 'ISO-aligned security controls'
    },
    {
      animationDelay: 0.1,
      icon: 'tabler-archive',
      title: 'Secure client workspace'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-user-check',
      title: 'Humans review every job'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-traffic-lights',
      title: 'Status tracking & approvals'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-sparkles',
      title: 'Digital workflows that scale'
    }
  ]
};

// Additional feature sections for other pages
export const feature2 = {
  heading: 'Our Commitment to Linguistic Excellence',
  caption: 'We partner with clients to deliver accurate, secure, and culturally resonant language outcomes.',
  features: [
    {
      icon: { name: 'tabler-users', type: IconType.STROKE, color: 'primary.main', stroke: 1 },
      title: 'Client-first',
      content: 'Every programme includes a dedicated success manager, proactive updates, and transparent milestones.'
    },
    {
      icon: { name: 'tabler-star', type: IconType.STROKE, color: 'warning.main', stroke: 1 },
      title: 'Subject-matter expertise',
      content: 'We assign linguists with domain background—legal, medical, technical, or creative—to every engagement.'
    },
    {
      icon: { name: 'tabler-atom-2', type: IconType.STROKE, color: 'success.main', stroke: 1 },
      title: 'Innovation',
      content: 'AI-assisted tooling, translation memories, and QA automations keep quality high while reducing turnaround.'
    }
  ]
};

export const feature5 = {
  heading: 'Project enablement',
  caption: 'We plug into your workflow, platforms, and compliance needs to keep multilingual delivery effortless.',
  features: [
    {
      icon: 'tabler-notebook',
      title: 'Onboarding playbooks',
      content: 'Implementation specialists document stakeholders, file formats, and QA expectations from day one.'
    },
    {
      icon: 'tabler-plug-connected',
      title: 'Systems integration',
      content: 'Sync Tasheel Language with CMS, design, ticketing, and DevOps tools using APIs and connectors.'
    }
  ],
  features2: [
    {
      icon: 'tabler-headset',
      title: 'Always-on support',
      content: '24/7 project desk with linguists on standby for rush turnarounds and live updates.'
    },
    {
      icon: 'tabler-clipboard-check',
      title: 'Compliance alignment',
      content: 'ISO-style security practices, NDAs, and audit-friendly reporting for regulated industries.'
    }
  ]
};

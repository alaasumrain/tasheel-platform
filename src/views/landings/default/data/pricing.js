'use client';
// @project

export const pricing = {
  heading: 'Transparent language services pricing',
  caption: 'Per-word, per-minute, or program pricing with clear inclusions and SLA-backed delivery.',
  features: [
    { id: 1, label: 'Per-word pricing' },
    { id: 2, label: 'Certified delivery options' },
    { id: 3, label: 'Translation memory & glossary' },
    { id: 4, label: 'Dual linguist QA' },
    { id: 5, label: 'Rush turnaround upgrades' },
    { id: 6, label: 'Dedicated project manager' },
    { id: 7, label: 'Terminology management' },
    { id: 8, label: 'CMS & API connectors' },
    { id: 9, label: '24/7 support desk' },
    { id: 10, label: 'Volume discounts & reporting' }
  ],
  plans: [
    {
      title: 'Per-word translation',
      price: 'from $0.06 / word',
      active: true,
      featureTitle: 'Includes',
      content: 'Human translation, TM leverage, and standard QA.',
      contentLink: { children: 'Estimate project cost', href: '/quote' },
      exploreLink: { children: 'View translation services', href: '/services?category=translation' },
      featuresID: [1, 3, 4],
      description: 'Best for ongoing document, technical, legal, and marketing translation needs.'
    },
    {
      title: 'Enterprise localisation',
      active: false,
      price: 'custom program',
      featureTitle: 'Adds',
      content: 'Dedicated squads, integration support, and governance.',
      contentLink: { children: 'Schedule localisation consult', href: '/contact?service=software-localization&intent=consult' },
      exploreLink: { children: 'Localisation solutions', href: '/services?category=localization' },
      featuresID: [3, 6, 7, 8, 9, 10],
      description: 'Ideal for product, marketing, and support teams shipping in multiple markets every month.'
    },
    {
      title: 'Interpreting on-demand',
      active: false,
      price: 'from $1.75 / minute',
      featureTitle: 'Includes',
      content: 'Phone & video interpreting with SLA-backed response times.',
      contentLink: { children: 'Build interpreting plan', href: '/contact?category=interpreting&intent=consult' },
      exploreLink: { children: 'Interpreting services', href: '/services?category=interpreting' },
      featuresID: [5, 6, 9],
      description: 'Perfect for call centres, healthcare networks, courts, and public service agencies.'
    }
  ]
};

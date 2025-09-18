// @project

export const pricing = {
  heading: 'Transparent Service Fees',
  caption: 'Tasheel matches official tariffs and highlights any optional facilitation or courier costs up front.',
  features: [
    { id: 1, label: 'Online Application' },
    { id: 2, label: 'Document Upload' },
    { id: 3, label: 'Real-time Tracking' },
    { id: 4, label: 'SMS Notifications' },
    { id: 5, label: 'Email Updates' },
    { id: 6, label: 'Express Processing' },
    { id: 7, label: 'Digital Certificate' },
    { id: 8, label: 'Home Delivery' },
    { id: 9, label: 'Priority Support' },
    { id: 10, label: 'Bulk Applications' }
  ],
  plans: [
    {
      title: 'Standard processing',
      price: 'Official fees',
      active: false,
      featureTitle: 'Includes',
      content: 'Government tariff only',
      contentLink: { children: 'See fee breakdown', href: '/services' },
      exploreLink: { children: 'Browse services', href: '/services' },
      featuresID: [1, 2, 3, 4, 5],
      description: 'Most services completed within published ministry timelines.'
    },
    {
      title: 'Accelerated handling',
      active: true,
      price: 'Official + facilitation',
      featureTitle: 'Adds',
      content: 'Optional concierge and courier support',
      contentLink: { children: 'Request express quote', href: '/contact' },
      exploreLink: { children: 'Apply for express', href: '/services?express=true' },
      featuresID: [6, 7, 8, 9, 10],
      description: 'Ideal for time-sensitive permits and registrations that need tighter SLAs.'
    }
  ]
};

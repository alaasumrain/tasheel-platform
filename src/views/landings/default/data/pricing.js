// @project

export const pricing = {
  heading: 'Transparent Service Fees',
  caption: 'All government service fees are standardized and clearly displayed before application.',
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
      title: 'Standard Services',
      price: 'Varies',
      active: false,
      featureTitle: 'Includes',
      content: 'Regular processing times',
      contentLink: { children: 'View fee schedule', href: '/fees' },
      exploreLink: { children: 'Browse Services', href: '/services' },
      featuresID: [1, 2, 3, 4, 5],
      description: 'Most services processed within 5-10 business days'
    },
    {
      title: 'Express Services',
      active: true,
      price: '+50%',
      featureTitle: 'All Standard features plus',
      content: 'Expedited processing available',
      contentLink: { children: 'Learn more', href: '/express' },
      exploreLink: { children: 'Apply for Express', href: '/services?express=true' },
      featuresID: [6, 7, 8, 9, 10],
      description: 'Priority processing within 1-3 business days'
    }
  ]
};
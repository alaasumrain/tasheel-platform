// @next
import NextLink from 'next/link';

// @mui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const cta4 = {
  headLine: 'Why service teams partner with Tasheel',
  primaryBtn: {
    children: 'Start your application',
    href: '/services'
  },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Used by public agencies and service consultants across Palestine'
  },
  list: [
    { primary: 'Complete digital intake and assessment' },
    { primary: 'Transparent status tracking at every step' },
    { primary: 'Secure document vault & audit trails' },
    { primary: 'Arabic and English guidance' },
    { primary: 'Express handling for urgent cases' },
    { primary: 'Compliance-ready exports' }
  ],
  clientContent: 'Learn More'
};

function DescriptionLine() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Need help? Our support team is available 24/7.{' '}
      <Link component={NextLink} variant="caption2" color="primary" href="/contact" underline="hover">
        Contact support
      </Link>
    </Typography>
  );
}

export const cta5 = {
  label: 'Get started today',
  heading: 'Ready to simplify permits, licenses, and civic services?',
  caption: 'Tasheel removes the guesswork so you can focus on what matters—your residents, team, or business.',
  primaryBtn: {
    children: 'Browse services',
    href: '/services'
  },
  description: <DescriptionLine />,
  saleData: { count: 12, defaultUnit: 'k+', caption: 'Applications processed in beta' },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Teams report 70% faster turnaround times'
  }
};

export const cta10 = {
  heading: "Can't find the service you need?",
  caption: 'Tell us which workflow you want to digitise and our onboarding team will walk you through the next steps.',
  primaryBtn: { children: 'Contact support', href: '/contact' },
  secondaryBtn: { children: 'View all services', href: '/services' },
  image: '/assets/images/graphics/ai/graphics15-light.svg',
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Trusted by 50,000+ users'
  }
};

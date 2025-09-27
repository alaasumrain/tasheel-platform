'use client';
// @next
import NextLink from 'next/link';

// @mui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const cta4 = {
  headLine: 'Why organisations choose Tasheel for critical services',
  primaryBtn: {
    children: 'Start a conversation',
    href: '/contact?intent=consult'
  },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Trusted by teams handling compliance, growth, and public service delivery'
  },
  list: [
    { primary: 'Clear workflows from intake to delivery' },
    { primary: 'A Tasheel coordinator who knows your use case' },
    { primary: 'Certified translation with notarisation options' },
    { primary: 'Secure handling and confidentiality controls' },
    { primary: 'Responsive support across time zones' },
    { primary: 'Status dashboards you can share internally' }
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
  heading: 'Ready to experience Tasheel?',
  caption: 'Send your translation brief and we will show you how easy a complex service can feel.',
  primaryBtn: {
    children: 'Request a translation quote',
    href: '/quote'
  },
  description: <DescriptionLine />,
  saleData: { count: 250, defaultUnit: 'k+', caption: 'Words delivered with Tasheel oversight' },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Clients report faster turnarounds and clearer communication with Tasheel'
  }
};

export const cta10 = {
  heading: 'Need a different Tasheel service?',
  caption: 'Translation is just the beginning. Tell us what you want to simplify next and we will design the roadmap with you.',
  primaryBtn: { children: 'Talk to Tasheel', href: '/contact?intent=consult' },
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
    review: 'Partnering with teams who expect more from their service providers'
  }
};

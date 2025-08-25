// @next
import NextLink from 'next/link';

// @mui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const cta4 = {
  headLine: 'Why Choose Tasheel for Your Government Services?',
  primaryBtn: {
    children: 'Start Your Application',
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
    review: '50,000+ Satisfied Users (4.8 out of 5)'
  },
  list: [
    { primary: '100% Online Process' },
    { primary: '3-Day Average Processing' },
    { primary: 'Secure Document Handling' },
    { primary: '24/7 Support Available' },
    { primary: 'Real-time Tracking' },
    { primary: 'Government Approved' }
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
  label: 'Get Started Today',
  heading: 'Ready to Simplify Your Government Services?',
  caption: 'Join thousands of citizens who save time with our digital platform.',
  primaryBtn: {
    children: 'Browse Services',
    href: '/services'
  },
  description: <DescriptionLine />,
  saleData: { count: 50, defaultUnit: 'k+', caption: 'Applications processed monthly' },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '98% User Satisfaction Rate'
  }
};

export const cta10 = {
  heading: "Can't find the service you need?",
  caption: 'Let us know what government service you\'re looking for and we\'ll help you find the right solution.',
  primaryBtn: { children: 'Contact Support', href: '/contact' },
  secondaryBtn: { children: 'View All Services', href: '/services' },
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
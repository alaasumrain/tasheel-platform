// @project
import SvgIcon from '@/components/SvgIcon';

/***************************  DEFAULT - NAVBAR  ***************************/

export const navbar = {
  customization: false,
  logo: {
    text: 'Tasheel | تسهيل',
    sx: { fontSize: '1.5rem', fontWeight: 'bold', color: 'primary.main' }
  },
  secondaryBtn: {
    children: 'العربية',
    onClick: () => {
      // Language toggle functionality to be implemented
      console.log('Language toggle');
    },
    sx: { minWidth: 80 }
  },
  primaryBtn: { 
    children: 'Track Application', 
    href: '/track'
  },
  navItems: [
    { id: 'home', title: 'Home', link: '/' },
    { id: 'services', title: 'Services', link: '/services' },
    { id: 'guides', title: 'User Guides', link: '/guides' },
    { id: 'about', title: 'About', link: '/about' },
    { id: 'contact', title: 'Contact', link: '/contact' }
  ]
};
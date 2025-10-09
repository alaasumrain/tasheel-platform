'use client';
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
    sx: { minWidth: 96, fontWeight: 600 }
  },
  primaryBtn: {
    children: 'Client Portal',
    href: '/portal',
    sx: { px: 3.5 }
  },
  navItems: [
    { id: 'home', title: 'Home', link: '/' },
    { id: 'services', title: 'Services', link: '/services' },
    { id: 'guides', title: 'User Guides', link: '/sections' },
    { id: 'about', title: 'About', link: '/sections/about' },
    { id: 'contact', title: 'Contact', link: '/contact' }
  ]
};

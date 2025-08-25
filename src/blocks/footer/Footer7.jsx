'use client';

// @next
import NextLink from 'next/link';

// @mui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { motion } from 'framer-motion';

// @project
import branding from '@/branding.json';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import { Copyright, FollowUS, Sitemap } from '@/components/footer';
import LogoSection from '@/components/logo';
import SvgIcon from '@/components/SvgIcon';

import { CopyrightType } from '@/enum';
import { SECTION_COMMON_PY } from '@/utils/constant';

/***************************  FOOTER - 7 DATA  ***************************/

const data = [
  {
    id: 'services',
    grid: { size: { xs: 12, sm: 'auto' } },
    title: 'Services',
    menu: [
      {
        label: 'Work Permits',
        link: { href: '/services#work-permits' }
      },
      {
        label: 'Business Licenses',
        link: { href: '/services#business-licenses' }
      },
      {
        label: 'Residence Visas',
        link: { href: '/services#residence-visas' }
      },
      {
        label: 'Document Services',
        link: { href: '/services#documents' }
      }
    ]
  },
  {
    id: 'support',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'Support',
    menu: [
      {
        label: 'User Guides',
        link: { href: '/guides' }
      },
      {
        label: 'FAQs',
        link: { href: '/#faq' }
      },
      {
        label: 'Contact Support',
        link: { href: '/contact' }
      },
      {
        label: 'Track Application',
        link: { href: '/track' }
      },
      {
        label: 'Service Status',
        link: { href: '/status' }
      }
    ]
  },
  {
    id: 'about',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'About',
    menu: [
      {
        label: 'About Tasheel',
        link: { href: '/about' }
      },
      {
        label: 'Our Mission',
        link: { href: '/about#mission' }
      },
      {
        label: 'Terms & Conditions',
        link: { href: '/terms-condition' }
      },
      {
        label: 'Privacy Policy',
        link: { href: '/privacy-policy' }
      },
      {
        label: 'Security',
        link: { href: '/security' }
      }
    ]
  },
  {
    id: 'contact',
    grid: { size: { xs: 12, sm: 'auto' } },
    title: 'Contact',
    menu: [
      {
        label: 'Help Center',
        link: { href: '/help' }
      },
      {
        label: 'Email Support',
        link: { href: 'mailto:support@tasheel.gov' }
      },
      {
        label: 'Phone: 1800-TASHEEL',
        link: { href: 'tel:18008274335' }
      },
      {
        label: 'Office Locations',
        link: { href: '/locations' }
      }
    ]
  }
];

const socialLinks = {
  facebook: '#',
  twitter: '#',
  linkedin: '#',
  instagram: '#'
};

/***************************  COMPONENT - FOOTER 7  ***************************/

export default function Footer7() {
  return (
    <GraphicsCard sx={{ borderRadius: 0 }}>
      <Stack sx={{ py: SECTION_COMMON_PY }}>
        <ContainerWrapper>
          <Grid container spacing={{ xs: 4, sm: 6 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack sx={{ gap: { xs: 3, sm: 3.75 } }}>
                <Stack sx={{ gap: 1.5 }}>
                  <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Tasheel | تسهيل
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Your trusted gateway to digital government services. Simplifying bureaucracy, one click at a time.
                  </Typography>
                </Stack>
                <Stack sx={{ gap: 1.5 }}>
                  <Typography variant="subtitle2">Follow us on</Typography>
                  <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                    <Link
                      component={NextLink}
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      aria-label="facebook"
                    >
                      <SvgIcon name="tabler-brand-facebook" color="grey.700" />
                    </Link>
                    <Link
                      component={NextLink}
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      aria-label="twitter"
                    >
                      <SvgIcon name="tabler-brand-x" color="grey.700" />
                    </Link>
                    <Link
                      component={NextLink}
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      aria-label="linkedin"
                    >
                      <SvgIcon name="tabler-brand-linkedin" color="grey.700" />
                    </Link>
                    <Link
                      component={NextLink}
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      aria-label="instagram"
                    >
                      <SvgIcon name="tabler-brand-instagram" color="grey.700" />
                    </Link>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
            <Grid container size={{ xs: 12, md: 8 }} spacing={{ xs: 4, sm: 6 }}>
              <Sitemap list={data} />
            </Grid>
          </Grid>
        </ContainerWrapper>
      </Stack>
      <Copyright
        type={CopyrightType.TYPE1}
        brand="Tasheel Government Services"
        caption="All rights reserved. A project by the Government of Palestine."
        sx={{ '& .MuiTypography-root': { textAlign: { xs: 'center', sm: 'start' } } }}
      />
    </GraphicsCard>
  );
}
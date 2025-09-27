'use client';
// @mui
import TasheelButton from '@/components/TasheelButton';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import branding from '@/branding.json';
import { Themes } from '@/config';
import { MegaMenuType } from '@/enum';
import { ADMIN_PATH, BUY_NOW_URL, DOCS_URL, PAGE_PATH } from '@/path';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

/***************************  MEGAMENU 4 - FOOTER  ***************************/

function footerData() {
  return (
    <Stack direction={{ sm: 'row' }} sx={{ gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">More Tasheel service journeys are coming soon!</Typography>
          <Chip
            label={<Typography variant="caption">Coming Soon</Typography>}
            size="small"
            sx={{
              bgcolor: 'background.default',
              '& .MuiChip-label': { px: 1.5, py: 0.5 },
              display: { xs: 'none', sm: 'inline-flex' }
            }}
            icon={
              <CardMedia
                component="img"
                image="/assets/images/shared/celebration.svg"
                sx={{ width: 16, height: 16 }}
                alt="celebration"
                loading="lazy"
              />
            }
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Tasheel centralizes every step of applying for government services so citizens and businesses can move faster with total
          transparency.
        </Typography>
      </Stack>
      <TasheelButton
        variant="contained"
        sx={{ display: { xs: 'none', sm: 'inline-flex' }, minWidth: 100, px: { xs: 2 }, py: 1.25 }}
        href={BUY_NOW_URL}
      >
        Explore Services
      </TasheelButton>
    </Stack>
  );
}

/***************************  NAVBAR - MEGAMENU LANDINGS  ***************************/

export const landingMegamenu = {
  id: 'landings',
  title: 'Landings',
  megaMenu: {
    type: MegaMenuType.MEGAMENU4,
    popperOffsetX: 195,
    toggleBtn: { children: 'Landings' },
    menuItems: [
      {
        title: 'CRM',
        theme: Themes.THEME_CRM,
        image: '/assets/images/mega-menu/crm-light.svg',
        status: 'Coming Soon'
      },
      {
        title: 'AI',
        theme: Themes.THEME_AI,
        image: '/assets/images/mega-menu/ai-light.svg',
        status: 'Coming Soon'
      },
      {
        title: 'Crypto',
        theme: Themes.THEME_CRYPTO,
        image: '/assets/images/mega-menu/crypto-light.svg',
        status: 'Coming Soon'
      },
      {
        title: 'Hosting',
        theme: Themes.THEME_HOSTING,
        image: '/assets/images/mega-menu/hosting-light.svg',
        status: 'Coming Soon'
      },
      {
        title: 'PMS',
        theme: Themes.THEME_PMS,
        image: '/assets/images/mega-menu/pms-light.svg',
        status: 'Coming Soon'
      },
      {
        title: 'HRM',
        theme: Themes.THEME_HRM,
        image: '/assets/images/mega-menu/hrm-light.svg',
        status: 'Coming Soon'
      },
      {
        title: 'Plugin',
        theme: Themes.THEME_PLUGIN,
        image: '/assets/images/mega-menu/plugin-light.svg',
        status: 'Coming Soon'
      }
    ],
    footerData: footerData()
  }
};

/***************************  MEGAMENU 5 - BANNER  ***************************/

function bannerData() {
  return (
    <Stack sx={{ alignItems: 'flex-start', gap: 3, height: 1, justifyContent: 'center' }}>
      <Stack sx={{ gap: 1 }}>
        <Stack sx={{ alignItems: 'flex-start', gap: 1.5 }}>
          <Chip
            label={<Typography variant="subtitle2">Tasheel Admin Portal</Typography>}
            icon={
              <CardMedia
                component="img"
                image="/assets/images/shared/celebration.svg"
                sx={{ width: 16, height: 16 }}
                alt="celebration"
                loading="lazy"
              />
            }
            size="small"
            sx={{ bgcolor: 'background.default', '& .MuiChip-label': { px: 1.5, py: 0.5 }, '& .MuiChip-icon': { ml: 1.25 } }}
          />
          <Typography variant="h5">Exciting Dashboard on the Way!</Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Monitor submissions, approvals, and service level metrics from one secure dashboard built for public-sector workflows.
        </Typography>
      </Stack>
      <TasheelButton href={ADMIN_PATH} variant="contained" sx={{ minWidth: 92, px: { xs: 2 }, py: 1.25 }}>
        Track Applications
      </TasheelButton>
    </Stack>
  );
}

/***************************  NAVBAR - MEGAMENU PAGES  ***************************/

export const pagesMegamenu = {
  id: 'pages',
  title: 'Pages',
  megaMenu: {
    type: MegaMenuType.MEGAMENU5,
    toggleBtn: { children: 'Pages' },
    popperWidth: 860,
    menuItems: [
      {
        title: 'General',
        itemsList: [
          { title: 'About Tasheel', link: { href: PAGE_PATH.about } },
          { title: 'Service Catalogue', link: { href: BUY_NOW_URL } },
          { title: 'Privacy Policy', link: { href: PAGE_PATH.privacyPolicyPage } },
          { title: 'Contact Support', link: { href: PAGE_PATH.contactPage } },
          { title: 'FAQs', link: { href: PAGE_PATH.faq } },
          { title: 'Service Fees', link: { href: PAGE_PATH.pricing } }
        ]
      },
      {
        title: 'Maintenance',
        itemsList: [
          { title: 'Coming Soon', link: { href: PAGE_PATH.comingSoon } },
          { title: 'Error 404', link: { href: PAGE_PATH.error404 } },
          { title: 'Error 500', link: { href: PAGE_PATH.error500 } },
          { title: 'Planned Maintenance', link: { href: PAGE_PATH.underMaintenance } }
        ]
      },
      {
        title: 'External',
        itemsList: [
          { title: 'Help Center', link: { href: DOCS_URL } },
          { title: 'Support', link: { href: branding.company.socialLink.support } },
          {
            title: 'Discord',
            link: { href: branding.company.socialLink.discord, ...linkProps }
          },
          { title: 'Terms & Conditions', link: { href: PAGE_PATH.termsConditionPage } }
        ]
      }
    ],
    bannerData: bannerData()
  }
};

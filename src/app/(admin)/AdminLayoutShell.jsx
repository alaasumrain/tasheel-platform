'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { AdminTopNav } from './_components/admin-top-nav';
import { AdminSideNav } from './_components/admin-side-nav';
import { AdminMobileNav } from './_components/admin-mobile-nav';

const NAV_WIDTH = 224;
const APP_BAR_HEIGHT = 60;

export default function AdminLayoutShell({ user, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminTopNav
        user={user}
        onMenuClick={() => setMobileNavOpen(true)}
        onSignOut={handleSignOut}
        navWidth={NAV_WIDTH}
        appBarHeight={APP_BAR_HEIGHT}
      />

      <Box component="nav" sx={{ width: { md: NAV_WIDTH }, flexShrink: { md: 0 } }}>
        <AdminMobileNav user={user} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} navWidth={NAV_WIDTH} />
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: NAV_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              top: APP_BAR_HEIGHT,
              height: `calc(100% - ${APP_BAR_HEIGHT}px)`
            }
          }}
        >
          <AdminSideNav user={user} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2.5, md: 4 },
          pt: { xs: APP_BAR_HEIGHT + 24, md: APP_BAR_HEIGHT + 32 },
          pb: { xs: 5.5, md: 7 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

AdminLayoutShell.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node
};

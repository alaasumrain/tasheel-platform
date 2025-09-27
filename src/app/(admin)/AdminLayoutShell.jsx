'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { AdminTopNav } from './_components/admin-top-nav';
import { AdminSideNav } from './_components/admin-side-nav';
import { AdminMobileNav } from './_components/admin-mobile-nav';

const SIDEBAR_WIDTH = 280;

export default function AdminLayoutShell({ user, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminTopNav user={user} onMenuClick={() => setMobileNavOpen(true)} onSignOut={handleSignOut} />
      <AdminMobileNav user={user} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <Box
        component="nav"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexShrink: 0,
          width: SIDEBAR_WIDTH,
          borderRight: '1px solid',
          borderColor: 'divider'
        }}
      >
        <AdminSideNav user={user} />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 12, md: 10 },
          pb: { xs: 6, md: 8 },
          px: { xs: 3, md: 5, lg: 6 },
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` }
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { PortalTopNav } from './_components/portal-top-nav';
import { PortalSideNav } from './_components/portal-side-nav';
import { PortalMobileNav } from './_components/portal-mobile-nav';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const SIDEBAR_WIDTH = 280;

export default function PortalLayoutShell({ user, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [clientSession, setClientSession] = useState(null);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setClientSession(session ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setClientSession(session ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const resolvedUser = clientSession?.user || user || null;

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <PortalTopNav user={resolvedUser} onMenuClick={() => setMobileNavOpen(true)} onSignOut={handleSignOut} />
      <PortalMobileNav user={resolvedUser} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <Box
        component="nav"
        sx={{
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          width: SIDEBAR_WIDTH,
          borderRight: '1px solid',
          borderColor: 'divider'
        }}
      >
        <PortalSideNav user={resolvedUser} />
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

PortalLayoutShell.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node
};

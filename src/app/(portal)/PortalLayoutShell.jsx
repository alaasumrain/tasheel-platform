'use client';

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { PortalTopNav } from './_components/portal-top-nav';
import { PortalSideNav } from './_components/portal-side-nav';
import { PortalMobileNav } from './_components/portal-mobile-nav';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const NAV_WIDTH = 208;
const APP_BAR_HEIGHT = 60;

export default function PortalLayoutShell({ user, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [clientSession, setClientSession] = useState(null);

  // FIXED: Create Supabase client only once, outside component
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  console.log('🔷 PortalLayoutShell RENDER', {
    timestamp: new Date().toISOString(),
    hasUser: !!user,
    hasClientSession: !!clientSession,
    mobileNavOpen
  });

  useEffect(() => {
    let mounted = true;

    // FIXED: Only use onAuthStateChange, it handles initial session too
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log('🔶 PortalLayoutShell: Auth state changed', { event, hasSession: !!session });

      // FIXED: Only update state if session actually changed
      setClientSession((prev) => {
        if (prev?.access_token === session?.access_token) {
          console.log('⏭️ Session unchanged, skipping update');
          return prev;
        }
        return session ?? null;
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const resolvedUser = clientSession?.user || user || null;

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <PortalTopNav
        user={resolvedUser}
        onMenuClick={() => setMobileNavOpen(true)}
        onSignOut={handleSignOut}
        navWidth={NAV_WIDTH}
        appBarHeight={APP_BAR_HEIGHT}
      />

      <Box component="nav" sx={{ width: { md: NAV_WIDTH }, flexShrink: { md: 0 } }}>
        <PortalMobileNav user={resolvedUser} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} navWidth={NAV_WIDTH} />
        <Drawer
          variant="permanent"
          open
          onTransitionEnd={() => console.log('🎨 Drawer transition ended')}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: NAV_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              top: APP_BAR_HEIGHT,
              height: `calc(100% - ${APP_BAR_HEIGHT}px)`
            }
          }}
        >
          <PortalSideNav user={resolvedUser} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: `${APP_BAR_HEIGHT}px`
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

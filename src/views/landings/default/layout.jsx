'use client';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// @mui
import Box from '@mui/material/Box';

// @project
import { Footer7 } from '@/blocks/footer';
import { Navbar10 } from '@/blocks/navbar';
import { NavbarContent10 } from '@/blocks/navbar/navbar-content';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// @data
import { navbar } from './data';

/***************************  LAYOUT - MAIN  ***************************/

export default function MainLayout({ children }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data?.session ?? null);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, signedSession) => {
      setSession(signedSession ?? null);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  const navConfig = useMemo(() => {
    const base = { ...navbar };

    if (session) {
      base.primaryBtn = {
        ...navbar.primaryBtn,
        children: 'Dashboard',
        href: '/portal',
        sx: { color: 'common.white' }
      };
    } else {
      base.primaryBtn = {
        ...navbar.primaryBtn,
        children: 'Sign in',
        href: '/login',
        sx: { color: 'common.white' }
      };
    }

    return base;
  }, [session]);

  return (
    <>
      {/* header section */}
      <Box sx={{ bgcolor: 'grey.100' }}>
        <Navbar10>
          <NavbarContent10 {...navConfig} />
        </Navbar10>
      </Box>
      {/* app/(landing)/* */}
      {children}
      {/* footer section */}
      <Footer7 />
    </>
  );
}

MainLayout.propTypes = { children: PropTypes.any };

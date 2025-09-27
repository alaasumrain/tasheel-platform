'use client';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// @mui
import Box from '@mui/material/Box';

// @project
import { navbar } from '../landings/default/data';
import { Navbar10 } from '@/blocks/navbar';
import { NavbarContent10 } from '@/blocks/navbar/navbar-content';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

/***************************  LANDING - SECTIONS  ***************************/

export default function SectionsLayout({ children }) {
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
    if (!session) {
      return navbar;
    }
    return {
      ...navbar,
      primaryBtn: {
        ...navbar.primaryBtn,
        children: 'Dashboard',
        href: '/portal'
      }
    };
  }, [session]);

  return (
    <>
      <Box sx={{ bgcolor: 'grey.100' }}>
        <Navbar10>
          <NavbarContent10 {...navConfig} />
        </Navbar10>
      </Box>
      {children}
    </>
  );
}

SectionsLayout.propTypes = { children: PropTypes.any };

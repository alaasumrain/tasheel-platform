'use client';

/**
 * Portions of this layout are adapted from the Devias Material Kit React dashboard
 * (MIT License). https://github.com/devias-io/material-kit-react
 */

import PropTypes from 'prop-types';

// @mui
import Drawer from '@mui/material/Drawer';

import { PortalSideNav } from './portal-side-nav';

export function PortalMobileNav({ open, onClose, user }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { width: 280 }
      }}
    >
      <PortalSideNav user={user} onNavigate={onClose} />
    </Drawer>
  );
}

PortalMobileNav.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object
};

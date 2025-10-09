'use client';

/**
 * Portions adapted from Devias Material Kit React dashboard (MIT License).
 * https://github.com/devias-io/material-kit-react
 */

import PropTypes from 'prop-types';

// @mui
import Drawer from '@mui/material/Drawer';

import { AdminSideNav } from './admin-side-nav';

export function AdminMobileNav({ open, onClose, user, navWidth }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: navWidth || 260 } }}
    >
      <AdminSideNav user={user} onNavigate={onClose} />
    </Drawer>
  );
}

AdminMobileNav.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  navWidth: PropTypes.number
};

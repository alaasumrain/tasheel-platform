'use client';

/**
 * Portions of this layout are adapted from the Devias Material Kit React dashboard
 * (MIT License). https://github.com/devias-io/material-kit-react
 */

import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// @project
import SvgIcon from '@/components/SvgIcon';

const navItems = [
  { label: 'Overview', href: '/portal', icon: 'tabler-layout-dashboard' },
  { label: 'Start new request', href: '/quote', icon: 'tabler-file-plus' },
  { label: 'Invoices', href: '#', icon: 'tabler-receipt-2', disabled: true },
  { label: 'Account', href: '#', icon: 'tabler-user-cog', disabled: true }
];

export function PortalSideNav({ user, onNavigate }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3 }}>
        <Box>
          <Typography variant="subtitle2" color="primary" sx={{ letterSpacing: 1 }}>
            Tasheel
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Client Portal
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ p: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component="a"
            href={item.href}
            disabled={item.disabled}
            onClick={onNavigate}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              '&.Mui-disabled': { opacity: 0.5 }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SvgIcon name={item.icon} size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, flexDirection: 'column', alignSelf: 'flex-start' }}>
        {user?.email && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.email}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SvgIcon name="tabler-help-circle" size={20} color="primary.main" />
          <Typography variant="caption" color="text.secondary">
            support@tasheel.ps
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

PortalSideNav.propTypes = {
  user: PropTypes.object,
  onNavigate: PropTypes.func
};

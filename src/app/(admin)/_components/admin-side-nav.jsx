'use client';

/**
 * Portions adapted from Devias Material Kit React dashboard (MIT License).
 * https://github.com/devias-io/material-kit-react
 */

import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import SvgIcon from '@/components/SvgIcon';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'tabler-layout-dashboard' },
  { label: 'Requests', href: '/admin', icon: 'tabler-inbox' },
  { label: 'Services', href: '#', icon: 'tabler-briefcase', disabled: true },
  { label: 'Partners', href: '#', icon: 'tabler-users', disabled: true },
  { label: 'Settings', href: '#', icon: 'tabler-settings', disabled: true }
];

export function AdminSideNav({ user, onNavigate }) {
  const pathname = usePathname();

  console.log('🧭 AdminSideNav RENDER', {
    timestamp: new Date().toISOString(),
    pathname,
    hasUser: !!user,
    userEmail: user?.email
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" color="primary" sx={{ letterSpacing: 0.8 }}>
          Tasheel admin
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Internal operations
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {navItems.map((item) => {
          const isSelected = pathname === item.href;
          return (
            <ListItemButton
              key={item.label}
              component="a"
              href={item.href}
              disabled={item.disabled}
              onClick={onNavigate}
              sx={{
                borderRadius: 1.5,
                px: 1.15,
                py: 0.7,
                bgcolor: isSelected ? 'action.selected' : 'transparent',
                color: isSelected ? 'primary.main' : 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-disabled': { opacity: 0.45 }
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                <SvgIcon name={item.icon} size={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ variant: 'body2', fontWeight: isSelected ? 600 : 500, color: 'inherit' }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        {user?.email && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {user.email}
            </Typography>
          </Box>
        )}
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.5 }}>
          <SvgIcon name="tabler-help-circle" size={16} color="text.secondary" />
          <Typography variant="caption" color="text.secondary">
            Tasheel internal tools
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

AdminSideNav.propTypes = {
  user: PropTypes.object,
  onNavigate: PropTypes.func
};

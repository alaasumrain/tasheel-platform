'use client';

import { memo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import SvgIcon from '@/components/SvgIcon';

const navItems = [
  { label: 'Overview', href: '/portal', icon: 'tabler-layout-dashboard' },
  { label: 'Start new request', href: '/portal/quote', icon: 'tabler-file-plus' },
  { label: 'Invoices', href: '#', icon: 'tabler-receipt-2', disabled: true },
  { label: 'Account', href: '#', icon: 'tabler-user-cog', disabled: true }
];

function PortalSideNavComponent({ user, onNavigate }) {
  const pathname = usePathname();

  console.log('🧭 PortalSideNav RENDER', {
    timestamp: new Date().toISOString(),
    pathname,
    hasUser: !!user,
    userEmail: user?.email
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Header */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Tasheel
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Client portal
          </Typography>
        </Stack>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, px: 1.5, py: 0.75 }}>
        <Stack spacing={0.5}>
          {navItems.map((item) => {
            const isSelected = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));

            return (
              <ListItemButton
                key={item.label}
                component={item.disabled ? 'div' : Link}
                href={item.disabled ? undefined : item.href}
                disabled={item.disabled}
                selected={isSelected}
                onClick={onNavigate}
                sx={{
                  py: 0.5,
                  px: 1.25,
                  borderRadius: 1.25,
                  transition: 'all 0.18s ease',
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  minHeight: 'unset !important',
                  height: 'auto',
                  '&.MuiButtonBase-root': {
                    minHeight: 'unset'
                  },
                  '&:hover': {
                    bgcolor: 'action.hover'
                  },
                  '&.Mui-disabled': {
                    opacity: 0.45
                  }
                }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  color: 'inherit'
                }}
              >
                <SvgIcon name={item.icon} size={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ my: 0 }}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: {
                    fontWeight: isSelected ? 600 : 500,
                    color: 'inherit'
                  }
                }}
              />
            </ListItemButton>
            );
          })}
        </Stack>
      </List>

      {/* User Info Footer */}
      <Box sx={{ px: 2, py: 2, mt: 'auto' }}>
        {user?.email && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: 'background.default',
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
        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mt: 1.5 }}>
          <SvgIcon name="tabler-help-circle" size={16} color="text.secondary" />
          <Typography variant="caption" color="text.secondary">
            support@tasheel.ps
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

PortalSideNavComponent.propTypes = {
  user: PropTypes.object,
  onNavigate: PropTypes.func
};

// Memoize to prevent re-renders when user email hasn't changed
export const PortalSideNav = memo(PortalSideNavComponent, (prevProps, nextProps) => {
  // Only re-render if user email or pathname changed
  return prevProps.user?.email === nextProps.user?.email;
});

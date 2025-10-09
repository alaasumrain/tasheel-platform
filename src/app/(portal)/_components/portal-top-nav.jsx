'use client';

import PropTypes from 'prop-types';

// @mui
import { alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// @project
import SvgIcon from '@/components/SvgIcon';

export function PortalTopNav({ user, onMenuClick, onSignOut, navWidth, appBarHeight }) {
  const downMd = useMediaQuery((theme) => theme.breakpoints.down('md'));

  console.log('🔝 PortalTopNav RENDER', {
    timestamp: new Date().toISOString(),
    hasUser: !!user,
    userEmail: user?.email,
    downMd
  });

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar + 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
        width: { xs: '100%', md: `calc(100% - ${navWidth}px)` },
        ml: { md: navWidth },
        height: appBarHeight,
        justifyContent: 'center'
      }}
    >
      <Toolbar disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, minHeight: appBarHeight }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
          <IconButton
            onClick={onMenuClick}
            edge="start"
            aria-label="Open navigation"
            sx={{
              display: { md: 'none' },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              color: 'text.primary'
            }}
          >
            <SvgIcon name="tabler-menu-2" size={20} />
          </IconButton>

          {!downMd && (
            <Typography variant="subtitle2" color="text.secondary">
              Tasheel client portal
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary'
              }}
            >
              <Badge color="primary" variant="dot">
                <SvgIcon name="tabler-bell" size={18} />
              </Badge>
            </IconButton>
          </Tooltip>

          {!downMd && (
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.9rem' }}>
                {user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Stack spacing={0}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.email?.split('@')[0] || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'Signed in'}
                </Typography>
              </Stack>
            </Stack>
          )}

          <Tooltip title="Sign out">
            <IconButton
              onClick={onSignOut}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                color: 'error.main'
              }}
            >
              <SvgIcon name="tabler-logout" size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

PortalTopNav.propTypes = {
  user: PropTypes.object,
  onMenuClick: PropTypes.func,
  onSignOut: PropTypes.func,
  navWidth: PropTypes.number,
  appBarHeight: PropTypes.number
};

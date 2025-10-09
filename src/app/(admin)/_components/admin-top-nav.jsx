'use client';

/**
 * Portions adapted from Devias Material Kit React dashboard (MIT License).
 * https://github.com/devias-io/material-kit-react
 */

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

// @project
import SvgIcon from '@/components/SvgIcon';

export function AdminTopNav({ user, onMenuClick, onSignOut, navWidth, appBarHeight }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.85),
        width: { xs: '100%', md: `calc(100% - ${navWidth}px)` },
        ml: { md: navWidth },
        height: appBarHeight,
        zIndex: (theme) => theme.zIndex.appBar + 1
      }}
    >
      <Toolbar disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, minHeight: appBarHeight, gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
          <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' } }} aria-label="Open navigation">
            <SvgIcon name="tabler-menu-2" size={22} />
          </IconButton>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              Tasheel admin
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Translation operations
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Badge color="primary" variant="dot">
                <SvgIcon name="tabler-bell" size={18} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Quick actions">
            <IconButton
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <SvgIcon name="tabler-mood-plus" size={18} />
            </IconButton>
          </Tooltip>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.darker', width: 36, height: 36 }}>
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Stack spacing={0} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.email?.split('@')[0] || 'Administrator'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'admin@tasheel.ps'}
              </Typography>
            </Stack>
          </Stack>
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

AdminTopNav.propTypes = {
  user: PropTypes.object,
  onMenuClick: PropTypes.func,
  onSignOut: PropTypes.func,
  navWidth: PropTypes.number,
  appBarHeight: PropTypes.number
};

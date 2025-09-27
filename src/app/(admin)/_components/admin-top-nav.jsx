'use client';

/**
 * Portions adapted from Devias Material Kit React dashboard (MIT License).
 * https://github.com/devias-io/material-kit-react
 */

import PropTypes from 'prop-types';

// @mui
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// @project
import SvgIcon from '@/components/SvgIcon';

export function AdminTopNav({ user, onMenuClick, onSignOut }) {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(6px)' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' } }} aria-label="Open navigation">
            <SvgIcon name="tabler-menu-2" size={22} />
          </IconButton>
          <Box>
            <Typography variant="subtitle2" color="primary">
              Tasheel Admin
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Translation operations
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge color="error" variant="dot">
                <SvgIcon name="tabler-bell" size={20} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Quick actions">
            <IconButton>
              <SvgIcon name="tabler-mood-plus" size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={user?.email || 'Admin account'}>
            <Avatar sx={{ bgcolor: 'primary.darker', width: 40, height: 40 }}>
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={onSignOut}>
              <SvgIcon name="tabler-logout" size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

AdminTopNav.propTypes = {
  user: PropTypes.object,
  onMenuClick: PropTypes.func,
  onSignOut: PropTypes.func
};

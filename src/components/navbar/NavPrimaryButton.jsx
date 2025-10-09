'use client';
import PropTypes from 'prop-types';

// @next
import NextLink from 'next/link';

// @mui
import TasheelButton from '@/components/TasheelButton';

/***************************  NAVBAR - PRIMARY BUTTON  ***************************/

export default function NavPrimaryButton({ sx, children, ...rest }) {
  const extraSx = Array.isArray(sx) ? sx : sx ? [sx] : [];
  return (
    <TasheelButton
      variant="contained"
      size="small"
      sx={[
        {
          color: 'common.white',
          fontWeight: 700,
          px: { xs: 3, sm: 3.5 },
          height: 40,
          borderRadius: 999,
          letterSpacing: 0.3,
          boxShadow: '0 20px 48px rgba(15,46,83,0.24)',
          '&:hover': {
            color: 'common.white',
            boxShadow: '0 24px 56px rgba(15,46,83,0.28)'
          },
          '&:active': {
            color: 'common.white',
            transform: 'translateY(1px)'
          }
        },
        ...extraSx
      ]}
      {...rest}
      {...(rest?.href && { component: NextLink })}
      rel="noopener noreferrer"
      aria-label="nav-primary-btn"
    >
      {children || 'Primary Button'}
    </TasheelButton>
  );
}

NavPrimaryButton.propTypes = { sx: PropTypes.any, children: PropTypes.any, rest: PropTypes.any };

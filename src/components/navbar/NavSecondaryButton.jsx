'use client';
import PropTypes from 'prop-types';
// @next
import NextLink from 'next/link';

// @mui
import TasheelButton from '@/components/TasheelButton';

/***************************  NAVBAR - SECONDARY BUTTON  ***************************/

export default function NavSecondaryButton({ sx, children, ...rest }) {
  const extraSx = Array.isArray(sx) ? sx : sx ? [sx] : [];
  return (
    <TasheelButton
      variant="outlined"
      size="small"
      sx={[
        {
          borderColor: 'primary.light',
          color: 'primary.main',
          px: { xs: 2.5, sm: 2.75 },
          height: 40,
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: 0.2,
          bgcolor: 'rgba(15,46,83,0.05)',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.dark',
            bgcolor: 'rgba(15,46,83,0.1)'
          },
          '&:active': {
            transform: 'translateY(1px)'
          }
        },
        ...extraSx
      ]}
      {...rest}
      {...(rest?.href && { component: NextLink })}
      rel="noopener noreferrer"
      aria-label="nav-secondary-btn"
    >
      {children || 'Secondary Button'}
    </TasheelButton>
  );
}

NavSecondaryButton.propTypes = { sx: PropTypes.any, children: PropTypes.any, rest: PropTypes.any };

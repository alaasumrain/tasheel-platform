'use client';
import PropTypes from 'prop-types';
// @next
import NextLink from 'next/link';

// @mui
import TasheelButton from '@/components/TasheelButton';

/***************************  NAVBAR - SECONDARY BUTTON  ***************************/

export default function NavSecondaryButton({ sx, children, ...rest }) {
  return (
    <TasheelButton
      variant="outlined"
      size="small"
      sx={sx}
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

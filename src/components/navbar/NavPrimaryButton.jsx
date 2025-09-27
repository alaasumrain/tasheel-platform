'use client';
import PropTypes from 'prop-types';

// @next
import NextLink from 'next/link';

// @mui
import TasheelButton from '@/components/TasheelButton';

/***************************  NAVBAR - PRIMARY BUTTON  ***************************/

export default function NavPrimaryButton({ sx, children, ...rest }) {
  return (
    <TasheelButton
      variant="contained"
      size="small"
      sx={sx}
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

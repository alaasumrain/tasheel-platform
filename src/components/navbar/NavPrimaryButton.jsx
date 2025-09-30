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
      sx={[
        {
          color: 'common.white',
          px: { xs: 2.75, sm: 3 },
          height: 38,
          borderRadius: 999,
          '&:hover': {
            color: 'common.white'
          },
          '&:active': {
            color: 'common.white'
          }
        },
        sx
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

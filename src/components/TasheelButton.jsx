'use client';

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// @mui
import Button from '@mui/material/Button';

const baseStyles = {
  borderRadius: 999,
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 0.2
};

const variants = {
  contained: {
    color: 'common.white',
    boxShadow: '0 18px 46px rgba(15,46,83,0.20)',
    '&:hover': {
      color: 'common.white',
      boxShadow: '0 22px 52px rgba(15,46,83,0.24)'
    },
    '&:active': {
      boxShadow: '0 14px 36px rgba(15,46,83,0.22)'
    }
  },
  outlined: {
    borderWidth: 1.5,
    '&:hover': {
      borderWidth: 1.5
    }
  },
  text: {
    paddingInline: 0
  }
};

const TasheelButton = forwardRef(function TasheelButton(
  { variant = 'text', color = 'primary', size = 'medium', sx = {}, children, ...rest },
  ref
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      sx={{
        ...baseStyles,
        ...(variants[variant] || {}),
        ...sx
      }}
      {...rest}
    >
      {children}
    </Button>
  );
});

TasheelButton.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  sx: PropTypes.object,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained'])
};

export default TasheelButton;

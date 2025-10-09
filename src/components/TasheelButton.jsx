'use client';

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// @mui
import Button from '@mui/material/Button';

const baseStyles = {
  borderRadius: 999,
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 0.2,
  transition: 'all 0.2s ease-in-out'
};

const variants = {
  contained: {
    color: '#fff !important',
    backgroundColor: '#1E5CB8',
    backgroundImage: 'none',
    boxShadow: '0 12px 24px rgba(15,46,83,0.18)',
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      color: '#fff !important'
    },
    '&:hover': {
      color: '#fff !important',
      backgroundColor: '#184C99',
      backgroundImage: 'none',
      boxShadow: '0 18px 32px rgba(15,46,83,0.22)'
    },
    '&:active': {
      backgroundImage: 'none',
      boxShadow: '0 10px 20px rgba(15,46,83,0.18)',
      transform: 'translateY(1px)'
    },
    '&.Mui-disabled': {
      color: 'rgba(255,255,255,0.7) !important',
      backgroundColor: '#7FA5E0',
      backgroundImage: 'none',
      boxShadow: 'none',
      '& .MuiButton-startIcon, & .MuiButton-endIcon': {
        color: 'rgba(255,255,255,0.7) !important'
      }
    }
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: 'primary.main',
    color: 'primary.main',
    backgroundColor: 'rgba(15,46,83,0.04)',
    boxShadow: '0 10px 24px rgba(15,46,83,0.10)',
    '&:hover': {
      borderWidth: 1.5,
      borderColor: 'primary.dark',
      backgroundColor: 'rgba(15,46,83,0.08)'
    },
    '&:active': {
      transform: 'translateY(1px)'
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
      color={variant === 'contained' ? undefined : color}
      size={size}
      sx={{
        ...baseStyles,
        ...(typeof variants[variant] === 'function' ? variants[variant]() : variants[variant] || {}),
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

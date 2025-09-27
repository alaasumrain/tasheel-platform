'use client';

import { alpha } from '@mui/material/styles';

// Shared outline styling so every wizard input feels consistent.
export const outlinedInputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    transition: 'all 0.2s ease',
    backgroundColor: 'background.paper',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'primary.light' },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
  }
};

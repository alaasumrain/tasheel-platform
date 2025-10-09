'use client';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function InfoItem({ label, value, sx }) {
  return (
    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: 0.6, display: 'block' }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.4 }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node,
  sx: PropTypes.object
};

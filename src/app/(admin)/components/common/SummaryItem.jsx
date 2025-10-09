'use client';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SummaryItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

SummaryItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node
};

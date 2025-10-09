'use client';

import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TasheelButton from '@/components/TasheelButton';
import Typography from '@mui/material/Typography';

import SvgIcon from '@/components/SvgIcon';

export default function ActionsCard({ statusValue, onStatusChange, isPending }) {
  const actions = [
    { label: 'Mark as quote sent', icon: 'tabler-mail-forward', value: 'quote_sent' },
    { label: 'Move to in progress', icon: 'tabler-player-play', value: 'in_progress' },
    { label: 'Mark completed', icon: 'tabler-check', value: 'completed' }
  ];

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Actions
        </Typography>
        <Stack spacing={1.5}>
          {actions.map((action) => (
            <TasheelButton
              key={action.value}
              variant="outlined"
              size="small"
              startIcon={<SvgIcon name={action.icon} size={18} />}
              onClick={() => onStatusChange(action.value)}
              disabled={isPending || statusValue === action.value}
            >
              {action.label}
            </TasheelButton>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

ActionsCard.propTypes = {
  statusValue: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  isPending: PropTypes.bool
};

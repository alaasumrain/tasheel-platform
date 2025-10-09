'use client';

import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import SvgIcon from '@/components/SvgIcon';

export default function TimelineCard({ events }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Timeline
        </Typography>
        <Stack spacing={3}>
          {events.map((event, index) => (
            <TimelineEvent key={event.id} event={event} isLast={index === events.length - 1} />
          ))}
          {!events.length && (
            <Typography variant="body2" color="text.secondary">
              No events logged yet.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

TimelineCard.propTypes = {
  events: PropTypes.array
};

function TimelineEvent({ event, isLast }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SvgIcon name="tabler-clock" size={20} />
        {!isLast && <Box sx={{ width: 2, bgcolor: 'divider', flexGrow: 1, mt: 1 }} />}
      </Box>
      <Box sx={{ pb: isLast ? 0 : 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {event.eventType}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(event.createdAt)}
        </Typography>
        {event.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {event.notes}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

TimelineEvent.propTypes = {
  event: PropTypes.shape({
    eventType: PropTypes.string,
    createdAt: PropTypes.string,
    notes: PropTypes.string
  }),
  isLast: PropTypes.bool
};

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

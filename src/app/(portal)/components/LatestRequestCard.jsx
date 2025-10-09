'use client';

import PropTypes from 'prop-types';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import LinkButton from '@/components/LinkButton';
import InfoItem from './common/InfoItem';

export default function LatestRequestCard({ request, status, isSmDown, formatters }) {
  console.log('📊 LatestRequestCard RENDER', {
    timestamp: new Date().toISOString(),
    hasRequest: !!request,
    requestId: request?.id,
    status: status?.label
  });

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
              Latest request
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We'll notify you whenever there's progress.
            </Typography>
          </Box>
          {status && <Chip label={status.label} color={status.color} size="small" />}
        </Stack>

        {request ? (
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {request.serviceName || request.service}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 2, md: 2.5 },
                gridTemplateColumns: {
                  xs: 'repeat(1, minmax(0, 1fr))',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))'
                }
              }}
            >
              <InfoItem label="Reference" value={request.reference} />
              <InfoItem label="Language pair" value={formatters.language(request)} />
              <InfoItem label="Submitted" value={formatters.date(request.submittedAt)} />
              <InfoItem label="Turnaround" value={formatters.turnaround(request)} />
              <InfoItem label="Translation type" value={formatters.translationType(request)} />
              <InfoItem label="Delivery" value={formatters.delivery(request)} />
              <InfoItem label="Estimated total" value={formatters.estimatedTotal(request)} />
            </Box>
            <Divider flexItem sx={{ borderStyle: 'dashed' }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.25, sm: 1.5 }}
              sx={{ alignItems: { xs: 'stretch', sm: 'center' }, '& > *': { flexGrow: { xs: 1, sm: 0 } } }}
            >
              <LinkButton
                href={`/portal/requests/${request.id}`}
                variant="contained"
                size="medium"
                sx={{ borderRadius: 2 }}
              >
                View request
              </LinkButton>
              <LinkButton
                href="/portal/quote"
                variant="outlined"
                size="medium"
                fullWidth={isSmDown}
                sx={{ borderRadius: 2 }}
              >
                New request
              </LinkButton>
            </Stack>
          </Stack>
        ) : (
          <Alert severity="info">
            You haven't submitted any requests yet. Start your first translation project to see it here.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

LatestRequestCard.propTypes = {
  request: PropTypes.object,
  status: PropTypes.shape({ label: PropTypes.string, color: PropTypes.string }),
  isSmDown: PropTypes.bool,
  formatters: PropTypes.shape({
    language: PropTypes.func,
    date: PropTypes.func,
    turnaround: PropTypes.func,
    translationType: PropTypes.func,
    delivery: PropTypes.func,
    estimatedTotal: PropTypes.func
  }).isRequired
};

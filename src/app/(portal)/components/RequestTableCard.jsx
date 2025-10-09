'use client';

import PropTypes from 'prop-types';
import Link from 'next/link';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import SvgIcon from '@/components/SvgIcon';
import LinkButton from '@/components/LinkButton';
import QueueTable from '@/components/dashboard/QueueTable';
import InfoItem from './common/InfoItem';

export default function RequestTableCard({
  requests,
  isMdDown,
  formatters,
  desktopColumns
}) {
  const hasRequests = requests.length > 0;

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}
    >
      <Box sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={{ xs: 1, sm: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
              All translation requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Download deliverables, upload additional documents, or request changes.
            </Typography>
          </Box>
          <IconButton component={Link} href="/portal/quote" color="primary" size="small">
            <SvgIcon name="tabler-plus" size={20} />
          </IconButton>
        </Stack>
      </Box>
      <Divider />

      {hasRequests ? (
        isMdDown ? (
          <Stack spacing={2.5} sx={{ p: 2.5 }}>
            {requests.map((request) => {
              const status = formatters.status(request);
              return (
                <Card
                  key={request.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: 'divider',
                    boxShadow: '0 8px 24px rgba(15,46,83,0.08)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(15,46,83,0.12)',
                      borderColor: 'primary.light'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1}
                      sx={{ flexWrap: 'wrap', rowGap: 1.5 }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {request.serviceName || request.service}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ref: {request.reference || '—'}
                        </Typography>
                      </Box>
                      <Chip label={status.label} color={status.color} size="small" />
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                          xs: 'repeat(1, minmax(0, 1fr))',
                          sm: 'repeat(2, minmax(0, 1fr))'
                        }
                      }}
                    >
                      <InfoItem label="Language pair" value={formatters.language(request)} />
                      <InfoItem label="Submitted" value={formatters.date(request.submittedAt)} />
                      <InfoItem label="Turnaround" value={formatters.turnaround(request)} />
                      <InfoItem label="Translation type" value={formatters.translationType(request)} />
                      <InfoItem label="Delivery" value={formatters.delivery(request)} />
                      <InfoItem label="Estimated total" value={formatters.estimatedTotal(request)} />
                    </Box>
                    <LinkButton
                      href={`/portal/requests/${request.id}`}
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{ borderRadius: 1.5 }}
                    >
                      View details
                    </LinkButton>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Box sx={{ overflowX: 'auto' }}>
              <QueueTable rows={requests} columns={desktopColumns} tableProps={{ sx: { minWidth: 900 } }} />
            </Box>
          </Box>
        )
      ) : (
        <Box sx={{ py: 6, px: 2.5, textAlign: 'center' }}>
          <SvgIcon name="tabler-folder-plus" size={48} color="text.disabled" />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            You haven't submitted any requests yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mx: 'auto', maxWidth: 360 }}>
            Kick off your first translation project to see it appear here.
          </Typography>
          <LinkButton href="/portal/quote" variant="contained" sx={{ mt: 3 }} fullWidth={isMdDown}>
            New request
          </LinkButton>
        </Box>
      )}
    </Card>
  );
}

RequestTableCard.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMdDown: PropTypes.bool,
  formatters: PropTypes.shape({
    language: PropTypes.func,
    date: PropTypes.func,
    turnaround: PropTypes.func,
    translationType: PropTypes.func,
    delivery: PropTypes.func,
    estimatedTotal: PropTypes.func,
    status: PropTypes.func
  }).isRequired,
  desktopColumns: PropTypes.array.isRequired
};

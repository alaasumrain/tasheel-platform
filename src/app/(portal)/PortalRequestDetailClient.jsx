'use client';

import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TasheelButton from '@/components/TasheelButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import SvgIcon from '@/components/SvgIcon';
import AttachmentList from '@/components/dashboard/AttachmentList';
import {
  formatDateTime,
  formatDeliveryMethod,
  formatEstimatedTotal,
  formatLanguagePair,
  formatTranslationType,
  formatTurnaround,
  getStatusMeta
} from '@/utils/dashboard';
export default function PortalRequestDetailClient({ data }) {
  console.log('🟣 PortalRequestDetailClient RENDER', {
    timestamp: new Date().toISOString(),
    requestId: data?.id,
    reference: data?.reference
  });

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const statusMeta = getStatusMeta(data.status);

  return (
    <Container maxWidth="lg" disableGutters sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 5, md: 6 } }}>
      <Stack spacing={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit" component="a" href="/portal">
            Portal
          </Typography>
          <Typography color="text.primary">{data.reference}</Typography>
        </Breadcrumbs>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{
            gap: { xs: 1.75, md: 2 },
            '& > *': { width: { xs: '100%', md: 'auto' } }
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {data.serviceName || data.service || 'Translation request'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.reference} · {formatLanguagePair(data)}
            </Typography>
          </Box>
          <Chip
            label={statusMeta.label}
            color={statusMeta.color}
            size="medium"
            sx={{
              alignSelf: { xs: 'stretch', md: 'center' },
              height: 36,
              borderRadius: 999,
              justifyContent: 'center',
              fontWeight: 600
            }}
          />
        </Stack>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5}>
              <Card
                variant="outlined"
                sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}
              >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  Timeline
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 2 }}>
                  Project activity
                </Typography>
                <Stack spacing={3}>
                  {data.events.map((event, index) => (
                    <TimelineEvent key={event.id} event={event} isLast={index === data.events.length - 1} />
                  ))}
                  {!data.events.length && (
                    <Typography variant="body2" color="text.secondary">
                      No events yet. We’ll update this timeline when activity begins.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Card
                variant="outlined"
                sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}
              >
              <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                    Request summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    Key details for this translation brief.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2.5,
                    gridTemplateColumns: {
                      xs: 'repeat(1, minmax(0, 1fr))',
                      sm: 'repeat(2, minmax(0, 1fr))'
                    }
                  }}
                >
                  <SummaryItem label="Submitted" value={formatDateTime(data.submittedAt)} />
                  <SummaryItem label="Turnaround" value={formatTurnaround(data)} />
                  <SummaryItem label="Translation type" value={formatTranslationType(data)} />
                  <SummaryItem label="Delivery" value={formatDeliveryMethod(data)} />
                  <SummaryItem label="Estimated total" value={formatEstimatedTotal(data)} />
                  <SummaryItem label="Certification" value={data.options?.certification ? 'Yes' : 'No'} />
                  <SummaryItem label="Notarisation" value={data.options?.notarisation ? 'Yes' : 'No'} />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Special instructions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {data.options?.instructions || 'None provided.'}
                  </Typography>
                </Box>
              </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}
              >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  Uploaded documents
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Review files shared with Tasheel for this request.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <AttachmentList
                    files={data.attachments}
                    emptyPlaceholder={
                      <Typography variant="body2" color="text.secondary">
                        No documents uploaded yet.
                      </Typography>
                    }
                    fullWidthOnMobile={isSmDown}
                    getButtonProps={() => ({ variant: 'outlined', size: 'small' })}
                  />
                </Box>
              </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}
              >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  Need help?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Email support@tasheel.ps or call your Tasheel coordinator. You can request revisions once deliverables are ready.
                </Typography>
                <TasheelButton
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}
                  disabled
                >
                  Request revision (coming soon)
                </TasheelButton>
              </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

PortalRequestDetailClient.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    reference: PropTypes.string,
    service: PropTypes.string,
    serviceName: PropTypes.string,
    submittedAt: PropTypes.string,
    turnaround: PropTypes.string,
    status: PropTypes.string,
    options: PropTypes.object,
    events: PropTypes.array,
    attachments: PropTypes.array,
    sourceLanguage: PropTypes.string,
    targetLanguage: PropTypes.string
  })
};

function SummaryItem({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mt: 0.75, wordBreak: 'break-word', color: value ? 'text.primary' : 'text.disabled' }}
      >
        {value || '—'}
      </Typography>
    </Box>
  );
}

SummaryItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node
};

function TimelineEvent({ event, isLast }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.25 }}>
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

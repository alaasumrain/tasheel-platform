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
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import SvgIcon from '@/components/SvgIcon';

const statusConfig = {
  quote_sent: { label: 'Quote sent', color: 'warning' },
  in_progress: { label: 'In progress', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  scoping: { label: 'Scoping', color: 'info' },
  submitted: { label: 'Submitted', color: 'info' },
  review: { label: 'In review', color: 'warning' }
};

const TURNAROUND_LABELS = {
  rush: 'Rush (24 hours)',
  Rush: 'Rush (24 hours)',
  standard: 'Standard (2–3 business days)',
  Standard: 'Standard (2–3 business days)',
  'Rush (24 hours)': 'Rush (24 hours)',
  'Standard (2–3 business days)': 'Standard (2–3 business days)'
};

const TRANSLATION_TYPE_LABELS = {
  certified: 'Certified translation',
  translation_only: 'Professional translation only',
  notarized: 'Notarized translation'
};

const DELIVERY_LABELS = {
  digital: 'Digital delivery (PDF)',
  digital_physical: 'Digital + physical copies'
};
export default function PortalRequestDetailClient({ data }) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const statusMeta = statusConfig[data.status] || { label: data.status, color: 'default' };

  return (
    <Stack spacing={4}>
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
            {data.reference} · {formatLanguages(data)}
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

      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Request summary
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: { xs: 2, md: 2.5 },
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
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Special instructions</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                {data.options?.instructions || 'None provided.'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Timeline
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
        </Grid>

        <Grid xs={12} md={5}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Uploaded documents
              </Typography>
              <Stack spacing={2}>
                {data.attachments.map((file) => (
                  <FileItem key={file.id} file={file} isSmDown={isSmDown} />
                ))}
                {!data.attachments.length && (
                  <Typography variant="body2" color="text.secondary">
                    No documents uploaded yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Need help?
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
        </Grid>
      </Grid>
    </Stack>
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
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

SummaryItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node
};

function FileItem({ file, isSmDown }) {
  const formattedSize = file.fileSize
    ? `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
    : '';
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        <SvgIcon name="tabler-paperclip" size={20} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {file.fileName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedSize}
          </Typography>
        </Box>
      </Box>
      <TasheelButton
        variant="outlined"
        size="small"
        href={file.url || '#'}
        disabled={!file.url}
        sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
        fullWidth={isSmDown}
      >
        {file.url ? 'Download' : 'Pending'}
      </TasheelButton>
    </Box>
  );
}

FileItem.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    url: PropTypes.string
  }),
  isSmDown: PropTypes.bool
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

function formatLanguages(request) {
  if (request.sourceLanguage && request.targetLanguage) {
    return `${request.sourceLanguage} → ${request.targetLanguage}`;
  }
  return '—';
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function formatTurnaround(request) {
  const value = request.options?.turnaround || request.turnaround;
  if (!value) return '—';
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (TURNAROUND_LABELS[normalized]) {
      return TURNAROUND_LABELS[normalized];
    }
  }
  return TURNAROUND_LABELS[value] || value;
}

function formatTranslationType(request) {
  const value = request.options?.translationType;
  if (!value) return '—';
  return TRANSLATION_TYPE_LABELS[value] || value;
}

function formatDeliveryMethod(request) {
  const value = request.options?.deliveryMethod;
  if (!value) {
    if (request.options?.physicalCopies) {
      return 'Digital + physical copies';
    }
    return 'Digital delivery (PDF)';
  }
  return DELIVERY_LABELS[value] || value;
}

function formatEstimatedTotal(request) {
  const value = request.estimatedTotal ?? request.quoteAmount ?? request.options?.estimatedTotal;
  if (value || value === 0) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return `$${numeric.toFixed(2)}`;
    }
    return value;
  }
  return 'Pending quote — shared after Tasheel review';
}

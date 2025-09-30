'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import SvgIcon from '@/components/SvgIcon';
import TasheelButton from '@/components/TasheelButton';

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

export default function PortalDashboardClient({ requests }) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const latestRequest = useMemo(() => (requests.length ? requests[0] : null), [requests]);
  const hasRequests = requests.length > 0;

  const summaryCards = useMemo(() => {
    const active = requests.filter((item) => ['submitted', 'scoping', 'quote_sent', 'in_progress', 'review'].includes(item.status)).length;
    const completed = requests.filter((item) => item.status === 'completed').length;
    const rush = requests.filter((item) => {
      const value = item.options?.turnaround || item.turnaround;
      if (typeof value !== 'string') return false;
      return value.toLowerCase() === 'rush' || value === 'Rush (24 hours)';
    }).length;
    return [
      { title: 'Active requests', value: active, icon: 'tabler-mail-forward' },
      { title: 'Completed', value: completed, icon: 'tabler-check' },
      { title: 'Rush jobs', value: rush, icon: 'tabler-bolt' }
    ];
  }, [requests]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={4}>
        <Card
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            background: 'linear-gradient(135deg, rgba(15,46,83,0.12), rgba(15,46,83,0))',
            boxShadow: '0 32px 70px rgba(15,46,83,0.18)'
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 3, md: 4 }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <Box sx={{ maxWidth: 640 }}>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
                Tasheel client workspace
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Track requests, upload supporting documents, and download deliverables once they’re ready. We’ll email you at each milestone.
              </Typography>
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{
                width: { xs: '100%', md: 'auto' },
                alignItems: { xs: 'stretch', sm: 'center' },
                '& > *': { flexGrow: { xs: 1, sm: 0 } }
              }}
            >
              <TasheelButton component="a" href="/quote" variant="contained" fullWidth={isSmDown}>
                Start new request
              </TasheelButton>
              <TasheelButton component="a" href="mailto:support@tasheel.ps" variant="outlined" fullWidth={isSmDown}>
                Need help?
              </TasheelButton>
            </Stack>
          </Stack>
        </Card>

        <Grid container spacing={3}>
          {summaryCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 14px 32px rgba(15,46,83,0.12)', height: '100%' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2.5, md: 3 } }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SvgIcon name={card.icon} size={26} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 }, boxShadow: '0 16px 44px rgba(15,46,83,0.12)' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Latest request
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We’ll notify you whenever there’s progress.
              </Typography>
            </Box>
            {latestRequest && (
              <Chip label={statusConfig[latestRequest.status]?.label || latestRequest.status} color={statusConfig[latestRequest.status]?.color || 'default'} />
            )}
          </Stack>

          {latestRequest ? (
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {latestRequest.serviceName || latestRequest.service}
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
                <InfoItem label="Reference" value={latestRequest.reference} />
                <InfoItem label="Language pair" value={formatLanguages(latestRequest)} />
                <InfoItem label="Submitted" value={formatDate(latestRequest.submittedAt)} />
                <InfoItem label="Turnaround" value={formatTurnaround(latestRequest)} />
                <InfoItem label="Translation type" value={formatTranslationType(latestRequest)} />
                <InfoItem label="Delivery" value={formatDeliveryMethod(latestRequest)} />
                <InfoItem label="Estimated total" value={formatEstimatedTotal(latestRequest)} />
              </Box>
              <Divider flexItem sx={{ borderStyle: 'dashed', my: { xs: 1, sm: 0 } }} />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1.25, sm: 1.5 }}
                sx={{
                  alignItems: { xs: 'stretch', sm: 'center' },
                  '& > *': { flexGrow: { xs: 1, sm: 0 } }
                }}
              >
                <TasheelButton component="a" href={`/portal/requests/${latestRequest.id}`} variant="contained" size="medium">
                  View request
                </TasheelButton>
                <TasheelButton component="a" href="/quote" variant="outlined" size="medium" fullWidth={isSmDown}>
                  Start new request
                </TasheelButton>
              </Stack>
            </Stack>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              You haven’t submitted any requests yet. Start your first translation project to see it here.
            </Alert>
          )}
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 14px 36px rgba(15,46,83,0.12)' }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  All translation requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download deliverables, upload additional documents, or request changes.
                </Typography>
              </Box>
              <IconButton href="/quote" color="primary" sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}>
                <SvgIcon name="tabler-plus" size={22} />
              </IconButton>
            </Stack>

            {hasRequests ? (
              isMdDown ? (
                <Stack spacing={2.5} sx={{ mt: 2 }}>
                  {requests.map((request) => (
                    <Card
                      key={request.id}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 16px 36px rgba(15,46,83,0.12)'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                          <Chip
                            label={statusConfig[request.status]?.label || request.status}
                            color={statusConfig[request.status]?.color || 'default'}
                            size="small"
                          />
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
                          <InfoItem label="Language pair" value={formatLanguages(request)} />
                          <InfoItem label="Submitted" value={formatDate(request.submittedAt)} />
                          <InfoItem label="Turnaround" value={formatTurnaround(request)} />
                          <InfoItem label="Translation type" value={formatTranslationType(request)} />
                          <InfoItem label="Delivery" value={formatDeliveryMethod(request)} />
                          <InfoItem label="Estimated total" value={formatEstimatedTotal(request)} />
                        </Box>
                        <TasheelButton component="a" href={`/portal/requests/${request.id}`} variant="outlined" size="medium" fullWidth>
                          View details
                        </TasheelButton>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <TableContainer
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 12px 28px rgba(15,46,83,0.12)',
                    bgcolor: 'background.paper',
                    overflowX: 'auto'
                  }}
                >
                  <Table size="medium" sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Reference</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Language pair</TableCell>
                        <TableCell>Submitted</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Turnaround</TableCell>
                        <TableCell>Translation type</TableCell>
                        <TableCell>Delivery</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id} hover>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{request.reference}</TableCell>
                          <TableCell>{request.serviceName || request.service}</TableCell>
                          <TableCell>{formatLanguages(request)}</TableCell>
                          <TableCell>{formatDate(request.submittedAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig[request.status]?.label || request.status}
                              color={statusConfig[request.status]?.color || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatTurnaround(request)}</TableCell>
                          <TableCell>{formatTranslationType(request)}</TableCell>
                          <TableCell>{formatDeliveryMethod(request)}</TableCell>
                          <TableCell align="right">
                            <TasheelButton
                              component="a"
                              href={`/portal/requests/${request.id}`}
                              variant="outlined"
                              size="small"
                              sx={{ px: 2.5, py: 0.75 }}
                            >
                              View
                            </TasheelButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            ) : null}

            {!hasRequests && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <SvgIcon name="tabler-folder-plus" size={48} color="text.disabled" />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  You haven’t submitted any requests yet
                </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mx: 'auto', maxWidth: 360 }}>
                Kick off your first translation project to see it appear here.
              </Typography>
              <TasheelButton href="/quote" variant="contained" sx={{ mt: 3 }} fullWidth={isSmDown}>
                Create your first request
              </TasheelButton>
            </Box>
            )}
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}

PortalDashboardClient.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.object)
};

function InfoItem({ label, value, sx }) {
  return (
    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
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

function formatLanguages(request) {
  if (request.sourceLanguage && request.targetLanguage) {
    return `${request.sourceLanguage} → ${request.targetLanguage}`;
  }
  return '—';
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
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
  if (!request) return '—';
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

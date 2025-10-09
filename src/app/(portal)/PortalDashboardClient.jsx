'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import LinkButton from '@/components/LinkButton';
import Dot from '@/components/Dot';

import {
  derivePortalSummaryCards,
  formatDate,
  formatDeliveryMethod,
  formatEstimatedTotal,
  formatLanguagePair,
  formatTranslationType,
  formatTurnaround,
  getStatusMeta
} from '@/utils/dashboard';

import { SummaryCards, LatestRequestCard, RequestTableCard } from './components';

export default function PortalDashboardClient({ requests }) {
  console.log('🟢 PortalDashboardClient RENDER', {
    timestamp: new Date().toISOString(),
    requestCount: requests?.length || 0
  });

  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const latestRequest = useMemo(() => (requests.length ? requests[0] : null), [requests]);
  const latestStatus = latestRequest ? getStatusMeta(latestRequest.status) : null;

  const summaryCards = useMemo(() => derivePortalSummaryCards(requests), [requests]);

  const desktopColumns = useMemo(
    () => [
      { id: 'reference', label: 'Reference', cellSx: { whiteSpace: 'nowrap' } },
      {
        id: 'service',
        label: 'Service',
        render: (row) => row.serviceName || row.service
      },
      {
        id: 'languagePair',
        label: 'Language pair',
        render: (row) => formatLanguagePair(row)
      },
      {
        id: 'submittedAt',
        label: 'Submitted',
        render: (row) => formatDate(row.submittedAt)
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => {
          const status = getStatusMeta(row.status);
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Dot color={status.color} />
              <Typography variant="body2">{status.label}</Typography>
            </Stack>
          );
        }
      },
      {
        id: 'turnaround',
        label: 'Turnaround',
        render: (row) => formatTurnaround(row)
      },
      {
        id: 'translationType',
        label: 'Translation type',
        render: (row) => formatTranslationType(row)
      },
      {
        id: 'delivery',
        label: 'Delivery',
        render: (row) => formatDeliveryMethod(row)
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        render: (row) => (
          <LinkButton
            href={`/portal/requests/${row.id}`}
            variant="outlined"
            size="small"
            sx={{ px: 2.5, py: 0.75 }}
          >
            View
          </LinkButton>
        )
      }
    ],
    []
  );

  const formatters = useMemo(
    () => ({
      language: formatLanguagePair,
      date: formatDate,
      turnaround: formatTurnaround,
      translationType: formatTranslationType,
      delivery: formatDeliveryMethod,
      estimatedTotal: formatEstimatedTotal,
      status: getStatusMeta
    }),
    []
  );

  return (
    <Container maxWidth="lg" disableGutters sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 5, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
              Tasheel portal
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              Translation dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Welcome back! Track active requests, upload documents, and keep approvals moving.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <LinkButton href="/portal/quote" variant="contained" size="small" sx={{ borderRadius: 999, px: 3 }}>
              New request
            </LinkButton>
            <LinkButton href="mailto:support@tasheel.ps" variant="outlined" size="small" sx={{ borderRadius: 999, px: 3 }}>
              Help
            </LinkButton>
          </Stack>
        </Stack>

        <SummaryCards cards={summaryCards} />

        <LatestRequestCard
          request={latestRequest}
          status={latestStatus}
          isSmDown={isSmDown}
          formatters={formatters}
        />

        <RequestTableCard requests={requests} isMdDown={isMdDown} formatters={formatters} desktopColumns={desktopColumns} />
      </Stack>
    </Container>
  );
}

PortalDashboardClient.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.object)
};

'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Link from 'next/link';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SvgIcon from '@/components/SvgIcon';
import {
  deriveAdminMetrics,
  formatDateTime,
  formatLanguagePair,
  getStatusMeta
} from '@/utils/dashboard';
import QueueTable from '@/components/dashboard/QueueTable';

export default function AdminDashboardClient({ requests }) {
  const hasRequests = requests.length > 0;

  const metrics = useMemo(() => deriveAdminMetrics(requests), [requests]);

  const queueColumns = useMemo(
    () => [
      { id: 'reference', label: 'Reference' },
      { id: 'clientEmail', label: 'Client' },
      { id: 'service', label: 'Service' },
      {
        id: 'languagePair',
        label: 'Language pair',
        render: (row) => formatLanguagePair(row)
      },
      {
        id: 'submittedAt',
        label: 'Submitted',
        render: (row) => formatDateTime(row.submittedAt)
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => {
          const status = getStatusMeta(row.status);
          return <Chip label={status.label} color={status.color} size="small" />;
        }
      },
      { id: 'turnaround', label: 'Turnaround' },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        render: (row) => (
          <Chip
            component={Link}
            href={`/admin/requests/${row.id}`}
            clickable
            label="Review"
            variant="outlined"
            size="small"
            prefetch
          />
        )
      }
    ],
    []
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 }, px: { xs: 2.5, md: 4 } }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
              Tasheel operations
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.75 }}>
              Translation dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Monitor incoming work, assign linguists, and keep clients updated on deliverables and approvals.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2.5}>
          {metrics.map((metric) => (
            <Grid key={metric.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: 'divider',
                  height: '100%',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ maxWidth: '80%' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
                      {metric.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SvgIcon name={metric.icon} size={18} />
                  </Box>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {metric.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: '0 24px 60px rgba(15,46,83,0.08)' }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  Active queue
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Assign linguists, send quotes, and track turnaround SLAs.
                </Typography>
              </Box>
              <IconButton disabled sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <SvgIcon name="tabler-filter" size={18} />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 4 } }}>
            <QueueTable rows={requests} columns={queueColumns} tableProps={{ sx: { mt: 2 } }} />
            {!hasRequests && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <SvgIcon name="tabler-report-search" size={48} color="text.disabled" />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  No translation requests yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  As soon as a client submits a request, it will appear here for assignment.
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}

AdminDashboardClient.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.object)
};

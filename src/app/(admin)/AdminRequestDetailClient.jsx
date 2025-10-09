'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { getStatusMeta } from '@/utils/dashboard';
import AssignmentWorkflowCard from './components/AssignmentWorkflowCard';
import RequestDataCard from './components/RequestDataCard';
import TimelineCard from './components/TimelineCard';
import DocumentsCard from './components/DocumentsCard';
import ActionsCard from './components/ActionsCard';
import useAdminRequestStatus from './hooks/useAdminRequestStatus';

export default function AdminRequestDetailClient({ data }) {
  const {
    statusValue,
    handleStatusSelect,
    triggerStatusUpdate,
    isPending,
    snack,
    setSnack
  } = useAdminRequestStatus({ initialStatus: data.status, requestId: data.id });

  const status = useMemo(() => getStatusMeta(statusValue), [statusValue]);

  return (
    <Stack spacing={3}>
      <Breadcrumbs>
        <Typography color="inherit" component="a" href="/admin">
          Requests
        </Typography>
        <Typography color="text.primary">{data.reference}</Typography>
      </Breadcrumbs>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {data.service}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.reference} • {data.sourceLanguage && data.targetLanguage ? `${data.sourceLanguage} → ${data.targetLanguage}` : '—'}
          </Typography>
        </div>
        <Card variant="outlined" sx={{ borderRadius: 999, px: 2.5, py: 1, fontWeight: 600, bgcolor: `${status.color}.lighter`, color: `${status.color}.main` }}>
          {status.label}
        </Card>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2.5}>
            <AssignmentWorkflowCard status={status} />
            <RequestDataCard
              data={data}
              statusValue={statusValue}
              onStatusChange={handleStatusSelect}
              isPending={isPending}
            />
            <TimelineCard events={data.events} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2.5}>
            <DocumentsCard attachments={data.attachments} />
            <ActionsCard statusValue={statusValue} onStatusChange={triggerStatusUpdate} isPending={isPending} />
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack(null)} severity={snack?.type || 'info'} variant="filled" sx={{ width: '100%' }}>
          {snack?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

AdminRequestDetailClient.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    reference: PropTypes.string,
    service: PropTypes.string,
    submittedAt: PropTypes.string,
    turnaround: PropTypes.string,
    status: PropTypes.string,
    options: PropTypes.object,
    events: PropTypes.array,
    attachments: PropTypes.array,
    sourceLanguage: PropTypes.string,
    targetLanguage: PropTypes.string,
    contact: PropTypes.object
  })
};

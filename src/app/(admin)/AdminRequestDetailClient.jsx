'use client';

import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TasheelButton from '@/components/TasheelButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import SvgIcon from '@/components/SvgIcon';
import { ADMIN_STATUS_OPTIONS } from '@/lib/supabase/admin';

const statusMeta = {
  submitted: { label: 'Submitted', color: 'info' },
  scoping: { label: 'Scoping', color: 'default' },
  quote_sent: { label: 'Quote sent', color: 'warning' },
  in_progress: { label: 'In progress', color: 'primary' },
  review: { label: 'Review', color: 'secondary' },
  completed: { label: 'Completed', color: 'success' },
  archived: { label: 'Archived', color: 'default' },
  rejected: { label: 'Rejected', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'error' }
};

const assignees = ['Unassigned', 'Layla', 'Yazan', 'Rami'];

export default function AdminRequestDetailClient({ data }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusValue, setStatusValue] = useState(data.status);
  const [snack, setSnack] = useState(null);

  const status = statusMeta[statusValue] || { label: statusValue, color: 'default' };

  const triggerStatusUpdate = (nextStatus) => {
    setStatusValue(nextStatus);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/requests/${data.id}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Unable to update status');
        }

        setSnack({ type: 'success', message: 'Status updated' });
        router.refresh();
      } catch (error) {
        console.error('Status update failed', error);
        setSnack({ type: 'error', message: error.message || 'Status update failed' });
        setStatusValue(data.status);
      }
    });
  };

  const handleStatusSelect = (event) => {
    triggerStatusUpdate(event.target.value);
  };

  return (
    <Stack spacing={4}>
      <Breadcrumbs>
        <Typography color="inherit" component="a" href="/admin">
          Requests
        </Typography>
        <Typography color="text.primary">{data.reference}</Typography>
      </Breadcrumbs>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {data.service}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.reference} • {formatLanguages(data)}
          </Typography>
        </Box>
        <Chip label={status.label} color={status.color} size="medium" />
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Assignment & workflow
              </Typography>
              <Stack spacing={2}>
                <TextField select label="Assign to" value={assignees[0]} SelectProps={{ native: true }} disabled>
                  {assignees.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </TextField>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <ActionButton label="Send quote" icon="tabler-mail-forward" />
                  <ActionButton label="Start project" icon="tabler-player-play" />
                  <ActionButton label="Mark completed" icon="tabler-check" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Request data
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField
                    select
                    label="Status"
                    value={statusValue}
                    onChange={handleStatusSelect}
                    disabled={isPending}
                    fullWidth
                  >
                    {ADMIN_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={6}>
                  <SummaryItem label="Client email" value={data.contact?.email || '—'} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <SummaryItem label="Submitted" value={formatDateTime(data.submittedAt)} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <SummaryItem label="Turnaround" value={data.turnaround} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <SummaryItem label="Certification" value={data.options?.certification ? 'Yes' : 'No'} />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Instructions</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {data.options?.instructions || 'None provided.'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Timeline
              </Typography>
              <Stack spacing={3}>
                {data.events.map((event, index) => (
                  <TimelineEvent key={event.id} event={event} isLast={index === data.events.length - 1} />
                ))}
                {!data.events.length && (
                  <Typography variant="body2" color="text.secondary">
                    No events logged yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={5}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Uploaded documents
              </Typography>
              <Stack spacing={2}>
                {data.attachments.map((file) => (
                  <FileItem key={file.id} file={file} />
                ))}
                {!data.attachments.length && (
                  <Typography variant="body2" color="text.secondary">
                    No documents uploaded.
                  </Typography>
                )}
              </Stack>
              <TasheelButton variant="outlined" size="small" sx={{ mt: 2 }} disabled>
                Upload additional file
              </TasheelButton>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Actions
              </Typography>
              <Stack spacing={1.5}>
                <ActionButton
                  label="Mark as quote sent"
                  icon="tabler-mail-forward"
                  onClick={() => triggerStatusUpdate('quote_sent')}
                  disabled={isPending || statusValue === 'quote_sent'}
                />
                <ActionButton
                  label="Move to in progress"
                  icon="tabler-player-play"
                  onClick={() => triggerStatusUpdate('in_progress')}
                  disabled={isPending || statusValue === 'in_progress'}
                />
                <ActionButton
                  label="Mark completed"
                  icon="tabler-check"
                  onClick={() => triggerStatusUpdate('completed')}
                  disabled={isPending || statusValue === 'completed'}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack(null)}
          severity={snack?.type || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
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

function SummaryItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

SummaryItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};

function FileItem({ file }) {
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
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
      <TasheelButton variant="outlined" size="small" href={file.url || '#'} disabled={!file.url}>
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
  })
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

function ActionButton({ label, icon, onClick, disabled }) {
  return (
    <TasheelButton variant="outlined" size="small" startIcon={<SvgIcon name={icon} size={18} />} onClick={onClick} disabled={disabled}>
      {label}
    </TasheelButton>
  );
}

ActionButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
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

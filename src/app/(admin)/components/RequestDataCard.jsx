'use client';

import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { ADMIN_STATUS_OPTIONS } from '@/lib/admin/status-options';
import SummaryItem from './common/SummaryItem';

export default function RequestDataCard({
  data,
  statusValue,
  onStatusChange,
  isPending
}) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Request data
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Status"
              value={statusValue}
              onChange={onStatusChange}
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryItem label="Client email" value={data.contact?.email || '—'} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryItem label="Submitted" value={formatDateTime(data.submittedAt)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryItem label="Turnaround" value={data.turnaround} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
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
  );
}

RequestDataCard.propTypes = {
  data: PropTypes.object.isRequired,
  statusValue: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  isPending: PropTypes.bool
};

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

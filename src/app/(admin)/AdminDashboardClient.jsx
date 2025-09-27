'use client';

import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';
import TasheelButton from '@/components/TasheelButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import SvgIcon from '@/components/SvgIcon';

const statusMeta = {
  submitted: { label: 'Submitted', color: 'info' },
  scoping: { label: 'Scoping', color: 'default' },
  quote_sent: { label: 'Quote sent', color: 'warning' },
  in_progress: { label: 'In progress', color: 'primary' },
  review: { label: 'Review', color: 'secondary' },
  completed: { label: 'Completed', color: 'success' }
};

export default function AdminDashboardClient({ requests }) {
  const hasRequests = requests.length > 0;

  const metrics = [
    {
      label: 'New submissions',
      value: requests.filter((item) => item.status === 'submitted').length,
      icon: 'tabler-inbox'
    },
    {
      label: 'Rush jobs',
      value: requests.filter((item) => item.turnaround === 'Rush').length,
      icon: 'tabler-clock-bolt'
    },
    {
      label: 'Awaiting approval',
      value: requests.filter((item) => item.status === 'quote_sent').length,
      icon: 'tabler-mail-forward'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={4}>
        <Card
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            background: 'linear-gradient(135deg, rgba(15,46,83,0.1), rgba(15,46,83,0))',
            boxShadow: '0 28px 70px rgba(15,46,83,0.15)'
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
            <Box>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
                Tasheel operations
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                Translation dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Monitor incoming work, assign linguists, and keep clients updated on deliverables and approvals.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <TasheelButton variant="contained" color="primary" size="large" sx={{ borderRadius: 999 }} disabled>
                Create task
              </TasheelButton>
              <TasheelButton variant="outlined" size="large" sx={{ borderRadius: 999 }} disabled>
                Export queue
              </TasheelButton>
            </Stack>
          </Stack>
        </Card>

        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid xs={12} sm={6} md={4} key={metric.label}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 12px 28px rgba(15,46,83,0.14)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SvgIcon name={metric.icon} size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ borderRadius: 3, boxShadow: '0 20px 48px rgba(15, 46, 83, 0.12)' }}>
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Active queue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assign linguists, send quotes, and track turnaround SLAs.
              </Typography>
            </Box>
            <IconButton disabled color="primary">
              <SvgIcon name="tabler-filter" size={18} />
            </IconButton>
          </Stack>
          <Table size="medium" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Language pair</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Turnaround</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((row) => {
                const status = statusMeta[row.status] || { label: row.status, color: 'default' };
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.reference}</TableCell>
                    <TableCell>{row.clientEmail}</TableCell>
                    <TableCell>{row.service}</TableCell>
                    <TableCell>{formatLanguages(row)}</TableCell>
                    <TableCell>{formatDateTime(row.submittedAt)}</TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" />
                    </TableCell>
                    <TableCell>{row.turnaround}</TableCell>
                    <TableCell align="right">
                      <Chip component="a" href={`/admin/requests/${row.id}`} clickable label="Review" variant="outlined" size="small" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {!requests.length && (
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

function formatLanguages(row) {
  if (row.sourceLanguage && row.targetLanguage) {
    return `${row.sourceLanguage} → ${row.targetLanguage}`;
  }
  return '—';
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

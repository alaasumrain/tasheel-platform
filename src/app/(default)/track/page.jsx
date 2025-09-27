'use client';

import { useState } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TasheelButton from '@/components/TasheelButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @project
import SvgIcon from '@/components/SvgIcon';

/***************************  TRACK APPLICATION PAGE  ***************************/

// Mock tracking API
const GoverAPI = {
  trackApplication: async (referenceNumber) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response based on reference number
    if (referenceNumber === 'TSH2024001') {
      return {
        referenceNumber: 'TSH2024001',
        applicationType: 'Work Permit',
        status: 'processing',
        submittedDate: '2024-08-20',
        lastUpdate: '2024-08-22',
        estimatedCompletion: '2024-08-27',
        currentStep: 3,
        totalSteps: 5,
        details: {
          applicantName: 'John Doe',
          department: 'Immigration Services',
          assignedOfficer: 'Sarah Smith'
        }
      };
    } else if (referenceNumber === 'TSH2024002') {
      return {
        referenceNumber: 'TSH2024002',
        applicationType: 'Business License',
        status: 'approved',
        submittedDate: '2024-08-15',
        lastUpdate: '2024-08-23',
        completedDate: '2024-08-23',
        currentStep: 5,
        totalSteps: 5,
        details: {
          applicantName: 'ABC Company Ltd',
          department: 'Business Registration',
          licenseNumber: 'BL-2024-5678'
        }
      };
    }
    return null;
  }
};

export default function TrackPage() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!referenceNumber.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingResult(null);

    try {
      const result = await GoverAPI.trackApplication(referenceNumber);
      
      if (result) {
        setTrackingResult(result);
      } else {
        setError('Application not found. Please check your reference number.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      submitted: 'info',
      processing: 'warning',
      approved: 'success',
      rejected: 'error',
      completed: 'success',
      pending: 'default'
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: { xs: 4, sm: 5, md: 6 }, textAlign: 'center' }}>
          <Typography variant="h2" component="h1">
            Track Your Application
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Enter your reference number to check the status of your application
          </Typography>
        </Stack>

        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <form onSubmit={handleTrack}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  placeholder="e.g., TSH2024001"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  helperText="Enter your application reference number"
                  InputProps={{
                    startAdornment: (
                      <SvgIcon name="tabler-hash" size={20} sx={{ mr: 1, color: 'text.secondary' }} />
                    )
                  }}
                />

                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <TasheelButton
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SvgIcon name="tabler-search" size={20} />}
                >
                  {loading ? 'Tracking...' : 'Track Application'}
                </TasheelButton>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Example reference numbers: TSH2024001, TSH2024002
                  </Typography>
                </Box>
              </Stack>
            </form>

            {trackingResult && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Application Details
                </Typography>

                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {trackingResult.applicationType}
                      </Typography>
                      <Chip 
                        label={getStatusLabel(trackingResult.status)}
                        color={getStatusColor(trackingResult.status)}
                        size="medium"
                      />
                    </Box>

                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Step {trackingResult.currentStep} of {trackingResult.totalSteps}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'grey.200', 
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${(trackingResult.currentStep / trackingResult.totalSteps) * 100}%`,
                          height: '100%',
                          bgcolor: getStatusColor(trackingResult.status) === 'success' ? 'success.main' : 'primary.main',
                          transition: 'width 0.5s ease'
                        }} />
                      </Box>
                    </Box>

                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: 0, color: 'text.secondary' }}>
                            Reference Number
                          </TableCell>
                          <TableCell sx={{ border: 0, fontWeight: 'medium' }}>
                            {trackingResult.referenceNumber}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: 0, color: 'text.secondary' }}>
                            Submitted Date
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {trackingResult.submittedDate}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: 0, color: 'text.secondary' }}>
                            Last Update
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {trackingResult.lastUpdate}
                          </TableCell>
                        </TableRow>
                        {trackingResult.estimatedCompletion && (
                          <TableRow>
                            <TableCell sx={{ border: 0, color: 'text.secondary' }}>
                              Estimated Completion
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>
                              {trackingResult.estimatedCompletion}
                            </TableCell>
                          </TableRow>
                        )}
                        {trackingResult.completedDate && (
                          <TableRow>
                            <TableCell sx={{ border: 0, color: 'text.secondary' }}>
                              Completed Date
                            </TableCell>
                            <TableCell sx={{ border: 0, color: 'success.main', fontWeight: 'medium' }}>
                              {trackingResult.completedDate}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {trackingResult.details && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                          Additional Information
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            {Object.entries(trackingResult.details).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell sx={{ border: 0, color: 'text.secondary', textTransform: 'capitalize' }}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </TableCell>
                                <TableCell sx={{ border: 0 }}>
                                  {value}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </Stack>
                </Paper>

                <Stack direction="row" spacing={2}>
                  <TasheelButton 
                    variant="outlined" 
                    startIcon={<SvgIcon name="tabler-printer" size={18} />}
                    onClick={() => window.print()}
                  >
                    Print
                  </TasheelButton>
                  <TasheelButton 
                    variant="outlined"
                    startIcon={<SvgIcon name="tabler-refresh" size={18} />}
                    onClick={() => {
                      setReferenceNumber('');
                      setTrackingResult(null);
                    }}
                  >
                    Track Another
                  </TasheelButton>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
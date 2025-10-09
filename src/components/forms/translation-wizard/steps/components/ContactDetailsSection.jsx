'use client';

import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { outlinedInputSx } from '../../styles';

export default function ContactDetailsSection({ register, errors }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        px: { xs: 3, md: 4 },
        py: { xs: 3.25, md: 4 },
        boxShadow: '0 22px 64px rgba(15,46,83,0.12)'
      }}
    >
      <Grid container spacing={3.5} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 1, color: 'primary.main' }}>
                Step 2 • Contact details
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.75 }}>
                Who should we coordinate with?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                We’ll share quotes, timelines, and deliverables with this person. Add an optional phone number if we should reach out for urgent
                approvals.
              </Typography>
            </Box>
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              Mention additional stakeholders in the notes and we’ll add them to the Tasheel workspace.
            </Alert>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Full name *"
                fullWidth
                {...register('contact.fullName', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[^0-9!@#$%^&*()_+=\[\]{};:"\\|<>/?]+$/,
                    message: 'Use letters and punctuation only'
                  }
                })}
                error={Boolean(errors?.contact?.fullName)}
                helperText={errors?.contact?.fullName?.message || 'Person responsible for approvals'}
                sx={outlinedInputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email address *"
                type="email"
                fullWidth
                {...register('contact.email', {
                  required: 'Email is required',
                  pattern: {
                    value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                    message: 'Enter a valid email address'
                  }
                })}
                error={Boolean(errors?.contact?.email)}
                helperText={errors?.contact?.email?.message || 'Quotes and deliverables go here'}
                sx={outlinedInputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone number"
                placeholder="Include country code"
                fullWidth
                {...register('contact.phone', {
                  pattern: {
                    value: /^[0-9+()\-\s]{4,}$/,
                    message: 'Enter a valid phone number'
                  }
                })}
                error={Boolean(errors?.contact?.phone)}
                helperText={errors?.contact?.phone?.message || 'Optional — helps with urgent follow-up'}
                sx={outlinedInputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Organisation"
                placeholder="Company or team"
                fullWidth
                {...register('contact.organisation')}
                helperText="Optional"
                sx={outlinedInputSx}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Additional context"
                placeholder="Share project goals, delivery expectations, or any questions for Tasheel."
                multiline
                minRows={4}
                fullWidth
                {...register('contact.notes')}
                sx={outlinedInputSx}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

ContactDetailsSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object
};

'use client';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

// @project
import { useServices } from '@/hooks/useServices';
import { outlinedInputSx } from '../styles';

export default function ContactStep() {
  const {
    register,
    control,
    setValue,
    formState: { errors }
  } = useFormContext();

  const { services, loading } = useServices();

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.slug,
        label: service.name,
        category: service.service_categories?.name,
        description: service.short_description,
        price: service.starting_price_per_word ? `from $${service.starting_price_per_word}/word` : 'Custom pricing'
      })),
    [services]
  );

  return (
    <Grid container spacing={4}>
      <Grid xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Your details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tell us who we should send the quote to and which translation programme you need.
        </Typography>
      </Grid>

      {/* Service Selection - Most Important Section */}
      <Grid xs={12}>
        <Card sx={{ mb: 2, height: 'fit-content', minHeight: 200 }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.2em' }}>
                📋
              </Box>
              Service Selection
            </Typography>

            <Box sx={{ flex: 1 }}>
              {loading ? (
                <Skeleton variant="rectangular" height={56} />
              ) : (
                <Controller
                  name="meta.service"
                  control={control}
                  rules={{ required: 'Please select a service to continue' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      select
                      fullWidth
                      label="Choose your translation service"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        const selected = serviceOptions.find((option) => option.value === event.target.value);
                        setValue('meta.serviceName', selected?.label || 'Translation service');
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message || 'We offer 18 specialized translation and localization services'}
                      sx={{ ...outlinedInputSx, mb: 0 }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select the service that best fits your needs</em>
                      </MenuItem>
                      {serviceOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {option.description} • {option.price}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Contact Information Section */}
      <Grid xs={12}>
        <Card sx={{ height: 'fit-content', minHeight: 280 }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.2em' }}>
                👤
              </Box>
              Contact Information
            </Typography>

            <Box sx={{ flex: 1 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
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
                    helperText={errors?.contact?.fullName?.message}
                    sx={outlinedInputSx}
                  />
                </Grid>
                <Grid xs={12} md={6}>
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
                    helperText={errors?.contact?.email?.message}
                    sx={outlinedInputSx}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Phone number"
                    placeholder="Optional"
                    fullWidth
                    {...register('contact.phone', {
                      pattern: {
                        value: /^\+?[0-9\s().-]{7,20}$/,
                        message: 'Enter a valid phone number'
                      }
                    })}
                    error={Boolean(errors?.contact?.phone)}
                    helperText={errors?.contact?.phone?.message || 'Include country code if possible'}
                    sx={outlinedInputSx}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    label="Organisation"
                    placeholder="Company or team"
                    fullWidth
                    {...register('contact.organisation')}
                    sx={outlinedInputSx}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Additional Context Section */}
      <Grid xs={12}>
        <Card sx={{ height: 'fit-content', minHeight: 200 }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.2em' }}>
                💬
              </Box>
              Additional Context
            </Typography>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="How can Tasheel help?"
                placeholder="Share any specific requirements, deadline preferences, or questions about your translation project..."
                multiline
                minRows={4}
                fullWidth
                {...register('contact.notes')}
                sx={{ ...outlinedInputSx, '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Help Notice */}
      <Grid xs={12}>
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: 'primary.light',
            backgroundColor: 'primary.lighter',
            color: 'primary.darker'
          }}
        >
          <Typography variant="body2">
            <strong>Need to speak with a translator first?</strong> You can request a callback using the "Talk to Tasheel" button, or leave
            detailed notes in the context field above.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
}

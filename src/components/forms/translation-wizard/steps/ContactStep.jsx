'use client';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

  const serviceOptions = useMemo(() => {
    // Group services by category
    const grouped = services.reduce((acc, service) => {
      const categoryName = service.service_categories?.name || 'Other';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push({
        value: service.slug,
        label: service.name,
        category: categoryName,
        description: service.short_description,
        price: service.starting_price_per_word ? `${service.starting_price_per_word}/word` : 'Custom pricing'
      });
      return acc;
    }, {});
    return grouped;
  }, [services]);

  return (
    <Grid container spacing={3.5}>
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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.75, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        // Find selected service across all categories
                        let selectedService = null;
                        Object.values(serviceOptions).forEach((categoryServices) => {
                          const found = categoryServices.find((option) => option.value === event.target.value);
                          if (found) selectedService = found;
                        });
                        setValue('meta.serviceName', selectedService?.label || 'Translation service');
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message || 'Select from 18+ specialized services across 4 categories'}
                      sx={{ ...outlinedInputSx, mb: 0 }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              maxHeight: 480,
                              '& .MuiList-root': { py: 1 }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        Select the service that best fits your needs
                      </MenuItem>
                      {Object.entries(serviceOptions).map(([category, options]) => [
                        <MenuItem key={`header-${category}`} disabled sx={{ opacity: 1, py: 1.5, px: 2, mt: 1 }}>
                          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, color: 'primary.main' }}>
                            {category}
                          </Typography>
                        </MenuItem>,
                        ...options.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
                              py: 1.5,
                              px: 3,
                              alignItems: 'flex-start',
                              whiteSpace: 'normal',
                              '&:hover': { backgroundColor: 'action.hover' }
                            }}
                          >
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {option.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5, mb: 0.5 }}>
                                {option.description}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                from {option.price}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ])}
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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.75, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.2em' }}>
                👤
              </Box>
              Contact Information
            </Typography>

            <Box sx={{ flex: 1 }}>
              <Grid container spacing={3} rowSpacing={3.5}>
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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.75, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
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

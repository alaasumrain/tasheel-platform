'use client';

import { useCallback, useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SvgIcon from '@/components/SvgIcon';
import { ContactDetailsSection } from './components';
import { outlinedInputSx } from '../styles';
import { servicesCatalogue, serviceCategories } from '@/data/services';
import { useWizardConfig } from '../useWizardConfig';

const LANGUAGES = ['Arabic', 'English', 'French', 'German', 'Italian', 'Spanish', 'Turkish', 'Chinese', 'Japanese'];
const PURPOSES = ['Legal', 'Immigration', 'Medical', 'Technical', 'Marketing', 'Academic', 'Other'];

export default function ContactAndDetailsStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();

  const selectedCategory = watch('meta.serviceCategory');
  const selectedServiceName = watch('meta.serviceName');
  const wizardConfig = useWizardConfig(control);

  // Filter services based on selected category
  const filteredServices = selectedCategory && selectedCategory !== 'all'
    ? servicesCatalogue.filter((s) => s.category === selectedCategory)
    : servicesCatalogue;

  console.log('📝 ContactAndDetailsStep RENDER', {
    timestamp: new Date().toISOString(),
    selectedServiceName,
    hasErrors: Object.keys(errors).length > 0
  });

  // Language swap logic
  const selectedSource = useWatch({ control, name: 'details.sourceLanguage' });
  const selectedTarget = useWatch({ control, name: 'details.targetLanguage' });

  useEffect(() => {
    if (selectedTarget && selectedTarget === selectedSource) {
      setValue('details.targetLanguage', '', { shouldDirty: true, shouldValidate: true });
    }
  }, [selectedSource, selectedTarget, setValue]);

  const canSwapLanguages = Boolean(selectedSource && selectedTarget);

  const handleSwapLanguages = useCallback(() => {
    if (!canSwapLanguages) return;
    setValue('details.sourceLanguage', selectedTarget, { shouldDirty: true, shouldValidate: true });
    setValue('details.targetLanguage', selectedSource, { shouldDirty: true, shouldValidate: true });
  }, [canSwapLanguages, selectedSource, selectedTarget, setValue]);

  return (
    <Grid container spacing={4}>
      {/* Section 1: Service Selection */}
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Select your service
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose the service you need to get started.
        </Typography>
      </Grid>

      {/* Category Selector */}
      <Grid size={12}>
        <Controller
          name="meta.serviceCategory"
          control={control}
          defaultValue="all"
          render={({ field }) => (
            <Autocomplete
              options={serviceCategories}
              getOptionLabel={(option) => option.name}
              value={serviceCategories.find((c) => c.id === field.value) || serviceCategories[0]}
              onChange={(_event, category) => {
                field.onChange(category?.id || 'all');
                // Clear selected service when category changes
                setValue('meta.service', '', { shouldDirty: true });
                setValue('meta.serviceName', '', { shouldDirty: true });
              }}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service category"
                  placeholder="All services"
                  helperText="Filter services by category"
                  sx={outlinedInputSx}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <SvgIcon name={option.icon} size={20} color="primary.main" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.name}
                    </Typography>
                  </Stack>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
            />
          )}
        />
      </Grid>

      {/* Service Type Selector */}
      <Grid size={12}>
        <Controller
          name="meta.service"
          control={control}
          rules={{ required: 'Please select a service' }}
          render={({ field, fieldState }) => (
            <Autocomplete
              options={filteredServices}
              getOptionLabel={(option) => option.title}
              value={filteredServices.find((s) => s.slug === field.value) || null}
              onChange={(_event, service) => {
                field.onChange(service?.slug || '');
                setValue('meta.serviceName', service?.title || '', { shouldDirty: true });
              }}
              onBlur={field.onBlur}
              disabled={!selectedCategory}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service type"
                  placeholder={selectedCategory ? "Select a service..." : "Choose a category first"}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message || 'Choose the service that best fits your needs'}
                  sx={outlinedInputSx}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Stack spacing={0.5} sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {option.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Stack>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => option.slug === value?.slug}
            />
          )}
        />
      </Grid>

      {/* Section 2: Contact Details */}
      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Your contact details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tell us who we should send the quote to.
        </Typography>
      </Grid>

      <Grid size={12}>
        <ContactDetailsSection register={register} errors={errors} />
      </Grid>

      {/* Section 3: Language Pair - Only show if service needs it */}
      {wizardConfig.needsLanguagePair && (
        <>
          <Grid size={12} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Language pair & project details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tell us which languages you need and how the translation will be used.
            </Typography>
          </Grid>

          <Grid size={12}>
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3}>
              {/* Language pair with swap */}
              <Grid size={{ xs: 12, sm: 5 }}>
                <Controller
                  name="details.sourceLanguage"
                  control={control}
                  rules={{ required: 'Select a source language' }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={LANGUAGES}
                      value={field.value || null}
                      onChange={(_event, value) => field.onChange(value || '')}
                      onBlur={field.onBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Source language"
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message || 'Language your document is currently in'}
                          sx={outlinedInputSx}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option === value}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                  aria-label="Swap languages"
                  onClick={handleSwapLanguages}
                  disabled={!canSwapLanguages}
                  sx={{
                    border: '1px solid',
                    borderColor: canSwapLanguages ? 'primary.light' : 'divider',
                    borderRadius: 2,
                    width: 44,
                    height: 44,
                    bgcolor: canSwapLanguages ? 'primary.lighter' : 'grey.100'
                  }}
                >
                  <SvgIcon name="tabler-arrows-left-right" size={20} color={canSwapLanguages ? 'primary.main' : 'text.disabled'} />
                </IconButton>
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }}>
                <Controller
                  name="details.targetLanguage"
                  control={control}
                  rules={{ required: 'Select a target language' }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={LANGUAGES.filter((language) => language !== selectedSource)}
                      value={field.value || null}
                      onChange={(_event, value) => field.onChange(value || '')}
                      onBlur={field.onBlur}
                      disabled={!selectedSource}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Target language"
                          error={Boolean(fieldState.error)}
                          helperText={
                            fieldState.error?.message || (!selectedSource ? 'Choose a source language first' : 'Delivered translation language')
                          }
                          sx={outlinedInputSx}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option === value}
                    />
                  )}
                />
              </Grid>

              {/* Purpose */}
              <Grid size={12}>
                <Controller
                  name="details.purpose"
                  control={control}
                  rules={{ required: 'Tell us how the translation will be used' }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={PURPOSES}
                      value={field.value || null}
                      onChange={(_event, value) => field.onChange(value || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Project purpose"
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message || 'Helps us pick the right linguist and reviewer'}
                          sx={outlinedInputSx}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option === value}
                    />
                  )}
                />
              </Grid>

              {/* Optional fields */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="details.wordCount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Estimated word count"
                      placeholder="Optional"
                      type="number"
                      fullWidth
                      inputProps={{ min: 0 }}
                      value={field.value ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === '') {
                          field.onChange(null);
                          return;
                        }
                        const parsed = Number(value);
                        field.onChange(Number.isNaN(parsed) ? null : parsed);
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message || 'Helps us quote accurately if available'}
                      sx={outlinedInputSx}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Requested deadline"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  helperText="Optional — leave empty if flexible"
                  {...register('details.deadline')}
                  sx={outlinedInputSx}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

          <Grid size={12}>
            <Alert
              severity="info"
              variant="outlined"
              sx={{ borderRadius: 2, borderColor: 'primary.light', backgroundColor: 'primary.lighter', color: 'primary.darker' }}
            >
              <Typography variant="body2">
                <strong>Need multiple language pairs?</strong> Add your primary pair above. If you need additional pairs or dialect-specific reviewers,
                mention them in the notes on the next step.
              </Typography>
            </Alert>
          </Grid>
        </>
      )}
    </Grid>
  );
}

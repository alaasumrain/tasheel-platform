'use client';

import { useEffect, useCallback } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@/components/SvgIcon';

import { outlinedInputSx } from '../styles';
const LANGUAGES = ['Arabic', 'English', 'French', 'German', 'Italian', 'Spanish', 'Turkish', 'Chinese', 'Japanese'];

const PURPOSES = ['Legal', 'Immigration', 'Medical', 'Technical', 'Marketing', 'Academic', 'Other'];

export default function DetailsStep() {
  const {
    control,
    register,
    setValue,
    formState: { errors }
  } = useFormContext();

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
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Language pair & project details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Tell us which languages you need, roughly how large the project is, and how the translation will be used.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ borderRadius: 4, boxShadow: '0 22px 64px rgba(15,46,83,0.12)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={2.5} alignItems="center">
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2.5} sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 16px 48px rgba(15,46,83,0.1)' }}>
            <CardContent sx={{ p: { xs: 3, md: 3.25 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Need multiple pairs?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Add your primary language pair above. If you need additional pairs or dialect-specific reviewers, mention them in the notes—we’ll
                scope each combination in the quote.
              </Typography>
              <Box sx={{ mt: 2.5 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  You can also upload glossaries or reference files on the previous step to speed up onboarding.
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}

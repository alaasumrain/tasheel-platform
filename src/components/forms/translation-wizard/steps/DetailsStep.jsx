'use client';

import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

// @mui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Language pair & project details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Choose source and target languages, provide an estimated word count, and tell us how the translation will be used.
        </Typography>
      </Grid>
      <Grid xs={12}>
        <Controller
          name="details.sourceLanguage"
          control={control}
          rules={{ required: 'Select a source language' }}
          render={({ field }) => (
            <TextField
              select
              label="Source language"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(errors?.details?.sourceLanguage)}
              helperText={errors?.details?.sourceLanguage?.message}
              sx={outlinedInputSx}
            >
              <MenuItem value="" disabled>
                <em>Select source language</em>
              </MenuItem>
              {LANGUAGES.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid xs={12}>
        <Controller
          name="details.targetLanguage"
          control={control}
          rules={{ required: 'Select a target language' }}
          render={({ field }) => (
            <TextField
              select
              label="Target language"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={!selectedSource}
              error={Boolean(errors?.details?.targetLanguage)}
              helperText={errors?.details?.targetLanguage?.message || (!selectedSource ? 'Choose a source language first' : undefined)}
              sx={outlinedInputSx}
            >
              <MenuItem value="" disabled>
                <em>{selectedSource ? 'Select target language' : 'Choose source first'}</em>
              </MenuItem>
              {LANGUAGES.filter((language) => language !== selectedSource).map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Controller
          name="details.wordCount"
          control={control}
          render={({ field }) => (
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
              onBlur={field.onBlur}
              error={Boolean(errors?.details?.wordCount)}
              helperText={errors?.details?.wordCount?.message || 'Helps us quote accurately if available'}
              sx={outlinedInputSx}
            />
          )}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <TextField
          label="Requested deadline"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('details.deadline')}
          sx={outlinedInputSx}
        />
      </Grid>
      <Grid xs={12}>
        <Controller
          name="details.purpose"
          control={control}
          rules={{ required: 'Tell us how the translation will be used' }}
          render={({ field }) => (
            <TextField
              select
              label="Project purpose"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(errors?.details?.purpose)}
              helperText={errors?.details?.purpose?.message}
              sx={outlinedInputSx}
            >
              <MenuItem value="" disabled>
                <em>Select project purpose</em>
              </MenuItem>
              {PURPOSES.map((purpose) => (
                <MenuItem key={purpose} value={purpose}>
                  {purpose}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid xs={12}>
        <Typography variant="caption" color="text.secondary">
          Need multiple language pairs? List them in the notes field on the contacts step or mention here.
        </Typography>
      </Grid>
    </Grid>
  );
}

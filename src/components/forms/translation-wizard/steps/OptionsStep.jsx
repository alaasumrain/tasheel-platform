'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { outlinedInputSx } from '../styles';
import SvgIcon from '@/components/SvgIcon';

const TRANSLATION_TYPES = [
  {
    value: 'certified',
    title: 'Certified translation',
    badge: 'Included',
    description: 'USCIS-compliant cover sheet, stamp, and signature for official submissions.',
    flags: { certification: true, notarisation: false }
  },
  {
    value: 'translation_only',
    title: 'Professional translation only',
    badge: 'Included',
    description: 'Best for personal or internal documents that do not require certification.',
    flags: { certification: false, notarisation: false }
  },
  {
    value: 'notarized',
    title: 'Notarized translation',
    badge: '$29.50 / document',
    description: 'Includes certification plus notarisation—ideal for immigration and legal filings.',
    flags: { certification: true, notarisation: true }
  }
];

const TURNAROUND_OPTIONS = [
  {
    value: 'standard',
    title: 'Standard',
    badge: 'Included',
    description: '2–3 business days. Best price for most projects.'
  },
  {
    value: 'rush',
    title: 'Rush',
    badge: '30% rush fee',
    description: 'Delivery within 24 hours. Ideal for urgent filings.'
  }
];

const DELIVERY_OPTIONS = [
  {
    value: 'digital',
    title: 'Digital delivery',
    badge: 'Free',
    description: 'Secure PDF delivered via email the moment the translation is ready.',
    flags: { physicalCopies: false }
  },
  {
    value: 'digital_physical',
    title: 'Digital + physical copies',
    badge: '$12.95 shipping',
    description: 'Courier or postal delivery worldwide, plus digital PDF copy.',
    flags: { physicalCopies: true }
  }
];

function OptionCard({ title, badge, description, selected, onClick }) {
  return (
    <Card
      variant={selected ? 'outlined' : 'elevation'}
      sx={{
        height: '100%',
        borderRadius: 3,
        borderColor: selected ? 'primary.main' : 'divider',
        boxShadow: selected ? '0 18px 44px rgba(15,46,83,0.14)' : '0 8px 28px rgba(15,46,83,0.08)',
        transition: 'all 0.3s ease',
        backgroundColor: selected ? 'background.paper' : 'grey.50',
        position: 'relative',
        transform: selected ? 'translateY(-2px)' : 'none',
        '&:hover': {
          boxShadow: '0 22px 48px rgba(15,46,83,0.16)'
        }
      }}
    >
      <CardActionArea
        onClick={onClick}
        role="button"
        aria-pressed={selected}
        sx={{
          p: { xs: 2.75, md: 3.25 },
          alignItems: 'stretch',
          display: 'flex',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          },
          '&.MuiCardActionArea-focusVisible': {
            outline: '3px solid',
            outlineColor: 'primary.main',
            outlineOffset: 3
          }
        }}
      >
        <Stack spacing={1.5} alignItems="flex-start" sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" className="option-card-title" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {badge && (
              <Chip
                label={badge}
                size="small"
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'normal', lineHeight: 1.55 }}>
            {description}
          </Typography>
        </Stack>
      </CardActionArea>
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 24px rgba(15,46,83,0.20)'
          }}
        >
          <SvgIcon name="tabler-check" size={18} color="#fff" />
        </Box>
      )}
    </Card>
  );
}

export default function OptionsStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();

  useEffect(() => {
    register('options.translationType', { required: 'Select a translation type' });
    register('options.turnaround', { required: 'Select a turnaround option' });
    register('options.deliveryMethod', { required: 'Select a delivery method' });
  }, [register]);

  const selectedTranslationType = watch('options.translationType');
  const selectedTurnaround = watch('options.turnaround');
  const selectedDelivery = watch('options.deliveryMethod');

  const handleTranslationSelect = useCallback(
    (value) => {
      setValue('options.translationType', value, { shouldDirty: true, shouldValidate: true });
      const config = TRANSLATION_TYPES.find((item) => item.value === value);
      if (config) {
        setValue('options.certification', config.flags.certification, { shouldDirty: false });
        setValue('options.notarisation', config.flags.notarisation, { shouldDirty: false });
      }
    },
    [setValue]
  );

  const handleDeliverySelect = useCallback(
    (value) => {
      setValue('options.deliveryMethod', value, { shouldDirty: true, shouldValidate: true });
      const config = DELIVERY_OPTIONS.find((item) => item.value === value);
      if (config) {
        setValue('options.physicalCopies', config.flags.physicalCopies, { shouldDirty: false });
      }
    },
    [setValue]
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Translation and delivery options
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Choose the translation package, turnaround, and delivery method. These help the Tasheel desk scope pricing and staffing.
        </Typography>
      </Grid>

      <Grid xs={12}>
        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
          Translation type
        </Typography>
        <Stack spacing={2.5}>
          <Grid container spacing={2.25}>
            {TRANSLATION_TYPES.map((option) => (
              <Grid xs={12} md={6} key={option.value}>
                <OptionCard
                  title={option.title}
                  badge={option.badge}
                  description={option.description}
                  selected={selectedTranslationType === option.value}
                  onClick={() => handleTranslationSelect(option.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
        {errors?.options?.translationType && (
          <Typography variant="caption" color="error.main">
            {errors.options.translationType.message}
          </Typography>
        )}
      </Grid>

      <Grid xs={12}>
        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
          Turnaround time
        </Typography>
        <Stack spacing={2.5}>
          <Grid container spacing={2.25}>
            {TURNAROUND_OPTIONS.map((option) => (
              <Grid xs={12} md={6} key={option.value}>
                <OptionCard
                  title={option.title}
                  badge={option.badge}
                  description={option.description}
                  selected={selectedTurnaround === option.value}
                  onClick={() => setValue('options.turnaround', option.value, { shouldDirty: true, shouldValidate: true })}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
        {errors?.options?.turnaround && (
          <Typography variant="caption" color="error.main">
            {errors.options.turnaround.message}
          </Typography>
        )}
      </Grid>

      <Grid xs={12}>
        <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
          Delivery method
        </Typography>
        <Stack spacing={2.5}>
          <Grid container spacing={2.25}>
            {DELIVERY_OPTIONS.map((option) => (
              <Grid xs={12} md={6} key={option.value}>
                <OptionCard
                  title={option.title}
                  badge={option.badge}
                  description={option.description}
                  selected={selectedDelivery === option.value}
                  onClick={() => handleDeliverySelect(option.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
        {errors?.options?.deliveryMethod && (
          <Typography variant="caption" color="error.main">
            {errors.options.deliveryMethod.message}
          </Typography>
        )}
      </Grid>

      <Grid xs={12}>
        <TextField
          label="Special instructions"
          placeholder="Glossaries, formatting needs, delivery notes (optional)"
          multiline
          minRows={4}
          fullWidth
          inputProps={{ maxLength: 1000 }}
          {...register('options.instructions', {
            maxLength: { value: 1000, message: 'Keep instructions under 1000 characters' }
          })}
          error={Boolean(errors?.options?.instructions)}
          helperText={errors?.options?.instructions?.message}
          sx={outlinedInputSx}
        />
      </Grid>
    </Grid>
  );
}

OptionCard.propTypes = {
  title: PropTypes.string,
  badge: PropTypes.string,
  description: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

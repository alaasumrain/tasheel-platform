'use client';

import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

// @mui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { ServiceSelectionSection, ContactDetailsSection } from './components';

import { useServices } from '@/hooks/useServices';

export default function ContactStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();

  const selectedServiceValue = watch('meta.service');
  const { services, loading } = useServices();

  const serviceOptions = useMemo(() => {
    return services
      .map((service) => ({
        value: service.slug,
        label: service.name,
        category: service.service_categories?.name || 'Other services',
        description: service.short_description,
        price: service.starting_price_per_word ? `from ${service.starting_price_per_word}/word` : 'Custom pricing',
        keywords: [service.name, service.short_description, service.service_categories?.name].filter(Boolean).join(' ')
      }))
      .sort((a, b) => {
        if (a.category === b.category) {
          return a.label.localeCompare(b.label);
        }
        return a.category.localeCompare(b.category);
      });
  }, [services]);

  const quickPickOptions = useMemo(() => {
    const seenCategories = new Set();
    const picks = [];

    for (const option of serviceOptions) {
      if (!seenCategories.has(option.category)) {
        seenCategories.add(option.category);
        picks.push(option);
      }
      if (picks.length >= 4) break;
    }

    return picks;
  }, [serviceOptions]);

  const selectedService = useMemo(
    () => serviceOptions.find((option) => option.value === selectedServiceValue) || null,
    [serviceOptions, selectedServiceValue]
  );

  const clearServiceSelection = useCallback(() => {
    setValue('meta.service', '', { shouldDirty: true, shouldValidate: true });
    setValue('meta.serviceName', '');
  }, [setValue]);

  const handleServiceSelect = useCallback(
    (option) => {
      if (!option) {
        clearServiceSelection();
        return;
      }

      if (option.value === selectedServiceValue) {
        clearServiceSelection();
        return;
      }

      setValue('meta.service', option.value, { shouldDirty: true, shouldValidate: true });
      setValue('meta.serviceName', option.label);
    },
    [clearServiceSelection, selectedServiceValue, setValue]
  );

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Your details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tell us who we should send the quote to and which translation programme you need.
        </Typography>
      </Grid>

      <Grid size={12}>
        <ServiceSelectionSection
          control={control}
          loading={loading}
          serviceOptions={serviceOptions}
          quickPickOptions={quickPickOptions}
          selectedService={selectedService}
          onSelect={handleServiceSelect}
          onClear={clearServiceSelection}
        />
      </Grid>

      <Grid size={12}>
        <ContactDetailsSection register={register} errors={errors} />
      </Grid>

      <Grid size={12}>
        <Alert
          severity="info"
          variant="outlined"
          sx={{ borderRadius: 2, borderColor: 'primary.light', backgroundColor: 'primary.lighter', color: 'primary.darker' }}
        >
          <Typography variant="body2">
            <strong>Need to speak with a translator first?</strong> You can request a callback using the "Talk to Tasheel" button, or leave detailed
            notes in the context field above.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
}

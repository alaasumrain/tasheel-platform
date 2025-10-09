'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SvgIcon from '@/components/SvgIcon';
import { DocumentDropzonePanel, DocumentGuidancePanel, ServiceDocumentUploader, useDocumentsLogic } from './components';
import { outlinedInputSx } from '../styles';
import { useWizardConfig } from '../useWizardConfig';

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

function OptionTile({ title, badge, description, selected, onClick }) {
  return (
    <Card
      variant={selected ? 'outlined' : 'elevation'}
      sx={{
        height: '100%',
        borderRadius: 2.5,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        boxShadow: selected ? '0 8px 24px rgba(15,46,83,0.12)' : 'none',
        transition: 'all 0.2s ease',
        backgroundColor: selected ? 'background.paper' : 'grey.50',
        position: 'relative',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0 8px 24px rgba(15,46,83,0.08)'
        }
      }}
    >
      <CardActionArea
        onClick={onClick}
        role="button"
        aria-pressed={selected}
        sx={{
          p: 2.5,
          alignItems: 'stretch',
          display: 'flex',
          '&.MuiCardActionArea-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2
          }
        }}
      >
        <Stack spacing={1.5} alignItems="flex-start" sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
              {title}
            </Typography>
            {badge && (
              <Chip label={badge} size="small" color={selected ? 'primary' : 'default'} variant={selected ? 'filled' : 'outlined'} />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
            {description}
          </Typography>
        </Stack>
      </CardActionArea>
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SvgIcon name="tabler-check" size={14} color="#fff" />
        </Box>
      )}
    </Card>
  );
}

OptionTile.propTypes = {
  title: PropTypes.string,
  badge: PropTypes.string,
  description: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func
};

export default function DocumentsAndOptionsStep() {
  const methods = useFormContext();
  const { register, setValue, watch, control, formState: { errors } } = methods;

  // Get wizard configuration based on selected service
  const wizardConfig = useWizardConfig(control);

  // Documents logic
  const { files, link, deferUpload, uploadWarning, handleFilesChange, handleRemove, handleDeferToggle } = useDocumentsLogic(methods);

  // Options logic
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
    <Grid container spacing={4}>
      {/* Section 1: Documents */}
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {wizardConfig.documentRequirements?.length > 0 ? 'Required documents' : 'Upload documents'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {wizardConfig.documentRequirements?.length > 0
            ? 'Please upload all required documents for this service.'
            : 'Drag and drop files or paste a secure link. Scans and high-quality photos are welcome.'}
        </Typography>
      </Grid>

      {/* Service-specific document uploads */}
      {wizardConfig.documentRequirements?.length > 0 ? (
        <Grid size={12}>
          <ServiceDocumentUploader
            documentRequirements={wizardConfig.documentRequirements}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </Grid>
      ) : (
        <>
          {/* Generic document dropzone for translation services */}
          <Grid size={{ xs: 12, md: 7 }}>
            <DocumentDropzonePanel
              files={files}
              link={link}
              deferUpload={deferUpload}
              errors={errors}
              uploadWarning={uploadWarning}
              onFilesChange={handleFilesChange}
              onRemoveFile={handleRemove}
              onFocusLink={() => methods.setFocus('documents.link')}
              clearErrors={methods.clearErrors}
              setValue={setValue}
              watch={watch}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <DocumentGuidancePanel
              register={register}
              errors={errors}
              deferUpload={deferUpload}
              setValue={setValue}
              onDeferToggle={handleDeferToggle}
            />
          </Grid>
        </>
      )}

      {/* Section 2: Service Options */}
      {(wizardConfig.needsTranslationType || wizardConfig.needsTurnaround || wizardConfig.needsDeliveryMethod) && (
        <>
          <Grid size={12} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Service options
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Choose your preferences for turnaround time and delivery method.
            </Typography>
          </Grid>

          <Grid size={12}>
            <Stack spacing={3}>
              {/* Translation Type - Only for translation services */}
              {wizardConfig.needsTranslationType && (
                <Box>
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 2, fontSize: '0.75rem' }}>
                    Translation type
                  </Typography>
            <Grid container spacing={2}>
              {TRANSLATION_TYPES.map((option) => (
                <Grid key={option.value} size={{ xs: 12, sm: 4 }}>
                  <OptionTile
                    title={option.title}
                    badge={option.badge}
                    description={option.description}
                    selected={selectedTranslationType === option.value}
                    onClick={() => handleTranslationSelect(option.value)}
                  />
                </Grid>
              ))}
            </Grid>
                  {errors?.options?.translationType && (
                    <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1 }}>
                      {errors.options.translationType.message}
                    </Typography>
                  )}
                </Box>
              )}

              {wizardConfig.needsTranslationType && wizardConfig.needsTurnaround && (
                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
              )}

              {/* Turnaround */}
              {wizardConfig.needsTurnaround && (
                <Box>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 2, fontSize: '0.75rem' }}>
              Turnaround time
            </Typography>
            <Grid container spacing={2}>
              {TURNAROUND_OPTIONS.map((option) => (
                <Grid key={option.value} size={{ xs: 12, sm: 6 }}>
                  <OptionTile
                    title={option.title}
                    badge={option.badge}
                    description={option.description}
                    selected={selectedTurnaround === option.value}
                    onClick={() => setValue('options.turnaround', option.value, { shouldDirty: true, shouldValidate: true })}
                  />
                </Grid>
              ))}
            </Grid>
                  {errors?.options?.turnaround && (
                    <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1 }}>
                      {errors.options.turnaround.message}
                    </Typography>
                  )}
                </Box>
              )}

              {wizardConfig.needsTurnaround && wizardConfig.needsDeliveryMethod && (
                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
              )}

              {/* Delivery Method */}
              {wizardConfig.needsDeliveryMethod && (
                <Box>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 2, fontSize: '0.75rem' }}>
              Delivery method
            </Typography>
            <Grid container spacing={2}>
              {DELIVERY_OPTIONS.map((option) => (
                <Grid key={option.value} size={{ xs: 12, sm: 6 }}>
                  <OptionTile
                    title={option.title}
                    badge={option.badge}
                    description={option.description}
                    selected={selectedDelivery === option.value}
                    onClick={() => handleDeliverySelect(option.value)}
                  />
                </Grid>
              ))}
            </Grid>
                  {errors?.options?.deliveryMethod && (
                    <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1 }}>
                      {errors.options.deliveryMethod.message}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Special Instructions */}
              <TextField
            label="Special instructions"
            placeholder="Glossaries, formatting needs, delivery notes (optional)"
            multiline
            minRows={3}
            fullWidth
            inputProps={{ maxLength: 1000 }}
            {...register('options.instructions', {
              maxLength: { value: 1000, message: 'Keep instructions under 1000 characters' }
            })}
                error={Boolean(errors?.options?.instructions)}
                helperText={errors?.options?.instructions?.message}
                sx={outlinedInputSx}
              />
            </Stack>
          </Grid>

          <Grid size={12}>
            <Alert
              severity="info"
              variant="outlined"
              sx={{ borderRadius: 2, borderColor: 'primary.light', backgroundColor: 'primary.lighter', color: 'primary.darker' }}
            >
              <Typography variant="body2">
                <strong>Unsure which option to pick?</strong> Choose what seems closest—your Tasheel coordinator will confirm details before work begins.
              </Typography>
            </Alert>
          </Grid>
        </>
      )}
    </Grid>
  );
}

'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';

import { servicesCatalogue } from '@/data/services';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TasheelButton from '@/components/TasheelButton';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

// Steps
import ContactStep from './steps/ContactStep';
import DocumentsStep from './steps/DocumentsStep';
import DetailsStep from './steps/DetailsStep';
import OptionsStep from './steps/OptionsStep';
import ReviewStep from './steps/ReviewStep';

const steps = [
  { label: 'Contacts', component: ContactStep, fields: ['meta.service', 'contact.fullName', 'contact.email'] },
  { label: 'Documents', component: DocumentsStep, fields: ['documents.files'] },
  {
    label: 'Project details',
    component: DetailsStep,
    fields: ['details.sourceLanguage', 'details.targetLanguage', 'details.purpose']
  },
  {
    label: 'Options',
    component: OptionsStep,
    fields: ['options.translationType', 'options.turnaround', 'options.deliveryMethod']
  },
  { label: 'Review & submit', component: ReviewStep, fields: [] }
];

const serviceTitleLookup = Object.fromEntries(
  servicesCatalogue.map((svc) => [svc.slug, svc.title])
);

const translationTypeLookup = {
  certified: 'Certified translation',
  translation_only: 'Professional translation only',
  notarized: 'Notarized translation'
};

const deliveryMethodLookup = {
  digital: 'Digital delivery',
  digital_physical: 'Digital + physical copies'
};

const defaultValues = {
  meta: { service: '', serviceName: '', marketingChannel: '' },
  contact: {
    fullName: '',
    email: '',
    phone: '',
    organisation: '',
    notes: ''
  },
  documents: {
    documentType: '',
    link: '',
    files: []
  },
  details: {
    sourceLanguage: '',
    targetLanguage: '',
    wordCount: null,
    deadline: '',
    purpose: ''
  },
  options: {
    translationType: '',
    turnaround: '',
    certification: false,
    notarisation: false,
    physicalCopies: false,
    deliveryMethod: '',
    instructions: ''
  },
  consent: false
};

export default function TranslationWizard({ service }) {
  const theme = useTheme();
  const methods = useForm({ defaultValues, mode: 'onBlur' });
  const { handleSubmit, trigger, setValue, watch, reset } = methods;

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Prefill service slug if provided
  useEffect(() => {
    if (service) {
      setValue('meta.service', service);
      setValue('meta.serviceName', serviceTitleLookup[service] || 'Translation service');
    }
  }, [service, setValue]);

  const StepComponent = steps[activeStep].component;

  const goNext = async () => {
    const currentFields = steps[activeStep].fields;
    if (currentFields.length) {
      const valid = await trigger(currentFields);
      if (!valid) return;
    }

    if (activeStep === steps.length - 1) {
      handleSubmit(onSubmit)();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (formValues) => {
    try {
      setIsSubmitting(true);
      setSubmissionStatus(null);

      const formData = new FormData();
      formData.append('payload', JSON.stringify(formValues));

      (formValues.documents?.files || []).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/quote', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || 'Request failed');
      }

      setSubmissionStatus({ type: 'success', message: 'Thanks! Tasheel will reach out shortly with your quote.' });
      reset({
        ...defaultValues,
        meta: {
          service: formValues.meta.service ?? '',
          serviceName: serviceTitleLookup[formValues.meta.service] || ''
        }
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Quote submission failed', error);
      setSubmissionStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();

  const estimatedTotalLabel = 'Pending quote — shared after Tasheel review';

  const summaryItems = [
    {
      label: 'Service',
      value: formValues.meta?.serviceName || serviceTitleLookup[formValues.meta?.service] || 'Translation'
    },
    {
      label: 'Turnaround',
      value:
        formValues.options?.turnaround === 'rush'
          ? 'Rush (24 hours)'
          : formValues.options?.turnaround === 'standard'
          ? 'Standard (2–3 business days)'
          : 'Select turnaround'
    },
    {
      label: 'Translation type',
      value: translationTypeLookup[formValues.options?.translationType] || 'Select option'
    },
    {
      label: 'Delivery',
      value: deliveryMethodLookup[formValues.options?.deliveryMethod] || 'Digital delivery'
    },
    {
      label: 'Language pair',
      value:
        formValues.details?.sourceLanguage && formValues.details?.targetLanguage
          ? `${formValues.details.sourceLanguage} → ${formValues.details.targetLanguage}`
          : 'Select language pair'
    },
    {
      label: 'Estimated total',
      value: estimatedTotalLabel
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <FormProvider {...methods}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 1, fontWeight: 700 }}>
              Tasheel translation quote
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: 1.5 }}>
              Share your brief. We’ll handle the rest.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload your documents, pick turnaround options, and Tasheel will assign the right linguists with a detailed quote.
            </Typography>
          </Box>

          {submissionStatus && (
            <Alert severity={submissionStatus.type} onClose={() => setSubmissionStatus(null)}>
              {submissionStatus.message}
            </Alert>
          )}

          <Stack spacing={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.08),
                backgroundColor: 'background.paper',
                boxShadow: '0 30px 60px rgba(15,46,83,0.10)',
                px: { xs: 2, md: 4 },
                py: { xs: 2.5, md: 3 }
              }}
            >
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  '& .MuiStepConnector-line': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    borderTopWidth: 2
                  },
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    color: theme.palette.text.secondary
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    color: theme.palette.primary.main
                  },
                  '& .MuiStepLabel-label.Mui-completed': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            <Box display="grid" gridTemplateColumns={{ md: '2fr 1fr' }} gap={{ xs: 3, md: 4 }}>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.08),
                  boxShadow: '0 28px 64px rgba(15, 46, 83, 0.12)',
                  backgroundColor: 'background.paper'
                }}
              >
                <StepComponent />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
                  <TasheelButton onClick={goBack} disabled={activeStep === 0 || isSubmitting} size="large" sx={{ minWidth: 140 }}>
                    Back
                  </TasheelButton>
                  <TasheelButton
                    variant="contained"
                    size="large"
                    onClick={goNext}
                    disabled={isSubmitting}
                    sx={{ minWidth: 180, borderRadius: 999 }}
                  >
                    {activeStep === steps.length - 1 ? 'Submit request' : 'Next step'}
                  </TasheelButton>
                </Stack>
              </Paper>

              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  backgroundColor: 'common.white',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  boxShadow: '0 30px 60px rgba(15,46,83,0.10)'
                }}
              >
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="subtitle2" color="primary" sx={{ letterSpacing: 1 }}>
                      Tasheel essentials
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      What’s included
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      Certified linguists, secure storage, status alerts, and option to add notarisation or physical copies.
                    </Typography>
                  </Box>

                  <Divider sx={{ borderStyle: 'dashed' }} />
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Request summary
                  </Typography>
                  <Stack spacing={1.75}>
                    {summaryItems.map((item) => (
                      <Box key={item.label}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.value || '—'}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  {formValues.options?.turnaround !== 'rush' && formValues.options?.turnaround !== 'standard' && (
                    <Typography variant="caption" color="warning.main">
                      Choose a turnaround option on the next step to generate an accurate quote.
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </Stack>
      </FormProvider>
    </Container>
  );
}

TranslationWizard.propTypes = {
  service: PropTypes.string
};

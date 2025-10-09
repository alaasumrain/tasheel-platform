'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';

import { servicesCatalogue } from '@/data/services';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TasheelButton from '@/components/TasheelButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import SvgIcon from '@/components/SvgIcon';

// Steps
import ContactAndDetailsStep from './steps/ContactAndDetailsStep';
import DocumentsAndOptionsStep from './steps/DocumentsAndOptionsStep';
import ReviewStep from './steps/ReviewStep';
import WizardLayout from './layout/WizardLayout';

const steps = [
  {
    label: 'Service & details',
    component: ContactAndDetailsStep,
    fields: ['meta.service', 'contact.fullName', 'contact.email', 'details.sourceLanguage', 'details.targetLanguage', 'details.purpose']
  },
  {
    label: 'Documents & options',
    component: DocumentsAndOptionsStep,
    fields: ['documents.files', 'options.translationType', 'options.turnaround', 'options.deliveryMethod']
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
    files: [],
    deferUpload: false
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

function WizardStepIcon(props) {
  const { active, completed, icon } = props;

  return (
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: (theme) => (completed || active ? theme.palette.common.white : theme.palette.text.secondary),
        background: completed
          ? 'linear-gradient(135deg, rgba(15,46,83,1) 0%, rgba(24,73,133,1) 100%)'
          : active
          ? 'linear-gradient(135deg, rgba(24,73,133,1) 0%, rgba(40,96,168,1) 100%)'
          : (theme) => theme.palette.grey[200],
        boxShadow: completed || active ? '0 12px 30px rgba(15,46,83,0.25)' : 'none',
        transition: 'all 0.25s ease'
      }}
    >
      {completed ? <SvgIcon name="tabler-check" size={18} color="#fff" /> : icon}
    </Box>
  );
}

WizardStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default function TranslationWizard({ service, serviceName }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const methods = useForm({ defaultValues, mode: 'onBlur' });
  const { handleSubmit, trigger, setValue, watch, reset } = methods;

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const isDevMode = process.env.NEXT_PUBLIC_TASHEEL_DEV_MODE === 'true';

  console.log('🧙 TranslationWizard RENDER', {
    timestamp: new Date().toISOString(),
    service,
    serviceName,
    activeStep,
    isSubmitting,
    hasSubmissionStatus: !!submissionStatus
  });

  // Prefill service slug and name if provided
  useEffect(() => {
    console.log('🧙 TranslationWizard: Prefilling service', { service, serviceName });

    if (service) {
      setValue('meta.service', service);
      setValue('meta.serviceName', serviceName || serviceTitleLookup[service] || 'Service');
    }
  }, [service, serviceName, setValue]);

  const StepComponent = steps[activeStep]?.component || (() => null);

  const goNext = async () => {
    console.log('🧙 TranslationWizard: goNext', { activeStep, isSubmitting });
    if (isSubmitting) return;
    const currentFields = steps[activeStep].fields;
    if (!isDevMode && currentFields.length) {
      const valid = await trigger(currentFields);
      console.log('🧙 TranslationWizard: Validation result', { valid, fields: currentFields });
      if (!valid) return;
    }

    if (activeStep === steps.length - 1) {
      console.log('🧙 TranslationWizard: Submitting form');
      await handleSubmit(onSubmit)();
    } else {
      console.log('🧙 TranslationWizard: Moving to next step', { nextStep: activeStep + 1 });
      setActiveStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (isSubmitting) return;
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (formValues) => {
    console.log('🧙 TranslationWizard: onSubmit START', { formValues });
    try {
      setIsSubmitting(true);
      setSubmissionStatus(null);

      const formData = new FormData();
      formData.append('payload', JSON.stringify(formValues));

      (formValues.documents?.files || []).forEach((file) => {
        formData.append('files', file);
      });

      console.log('🧙 TranslationWizard: Sending form data');
      const response = await fetch('/api/quote', {
        method: 'POST',
        body: formData
      });

      console.log('🧙 TranslationWizard: Got response', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || 'Request failed');
      }

      console.log('🧙 TranslationWizard: onSubmit SUCCESS');
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
          : null,
      placeholder: 'Select turnaround'
    },
    {
      label: 'Translation type',
      value: translationTypeLookup[formValues.options?.translationType] || null,
      placeholder: 'Select option'
    },
    {
      label: 'Delivery',
      value: deliveryMethodLookup[formValues.options?.deliveryMethod] || null,
      placeholder: 'Digital delivery'
    },
    {
      label: 'Language pair',
      value:
        formValues.details?.sourceLanguage && formValues.details?.targetLanguage
          ? `${formValues.details.sourceLanguage} → ${formValues.details.targetLanguage}`
          : null,
      placeholder: 'Select language pair'
    },
    {
      label: 'Estimated total',
      value: estimatedTotalLabel
    }
  ];

  const statusProps = submissionStatus
    ? { type: submissionStatus.type, message: submissionStatus.message, onClose: () => setSubmissionStatus(null) }
    : null;

  const stepIndicator = (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Step {activeStep + 1} of {steps.length}
        </Typography>
        {isDevMode && <Chip color="warning" variant="filled" label="Dev mode" size="small" />}
      </Stack>

      <Stepper
        nonLinear
        activeStep={activeStep}
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderColor: 'divider',
            borderTopWidth: 2
          },
          '& .MuiStepLabel-label': {
            fontWeight: 500,
            fontSize: '0.875rem',
            mt: 1
          },
          '& .MuiStepLabel-label.Mui-active': {
            fontWeight: 600
          }
        }}
      >
        {steps.map((step, index) => {
          const isClickable = index <= activeStep || isDevMode;
          return (
            <Step key={step.label} completed={activeStep > index}>
              <StepButton
                color="inherit"
                onClick={() => isClickable && setActiveStep(index)}
                disabled={!isClickable}
              >
                <StepLabel StepIconComponent={WizardStepIcon}>{step.label}</StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );

  const summaryPanel = (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          Request summary
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Updates as you move through the steps
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={1.5}>
        {summaryItems.map(({ label, value, placeholder }) => (
          <Box key={label} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
              {label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mt: 0.5, fontSize: '0.875rem', color: value ? 'text.primary' : 'text.disabled', wordBreak: 'break-word' }}
            >
              {value || placeholder || '—'}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );

  const actionButtons = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent="flex-end"
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ mt: 4 }}
    >
      <TasheelButton
        onClick={goBack}
        disabled={activeStep === 0 || isSubmitting}
        size="large"
        variant="text"
        sx={{ order: { xs: 2, sm: 1 }, minWidth: { sm: 120 } }}
      >
        Back
      </TasheelButton>
      <TasheelButton
        variant="contained"
        size="large"
        onClick={goNext}
        disabled={isSubmitting}
        sx={{ order: { xs: 1, sm: 2 }, minWidth: { sm: 160 } }}
      >
        {activeStep === steps.length - 1 ? (isSubmitting ? 'Submitting…' : 'Submit request') : 'Continue'}
      </TasheelButton>
    </Stack>
  );

  const stepContent = (
    <Fade key={activeStep} in timeout={250}>
      <Box sx={{ minHeight: { md: 320 } }}>
        <StepComponent />
      </Box>
    </Fade>
  );

  return (
    <FormProvider {...methods}>
      <WizardLayout
        heading="Share your brief. We'll handle the rest."
        subheading="Upload your documents, pick turnaround options, and Tasheel will assign the right linguists with a detailed quote."
        status={statusProps}
        stepper={stepIndicator}
        summary={summaryPanel}
        actions={actionButtons}
        isDevMode={isDevMode}
      >
        {stepContent}
      </WizardLayout>
    </FormProvider>
  );
}

TranslationWizard.propTypes = {
  service: PropTypes.string,
  serviceName: PropTypes.string
};

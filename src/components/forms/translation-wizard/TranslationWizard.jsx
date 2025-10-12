'use client';

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { servicesCatalogue } from '@/data/services';

// @mui
import { useTheme } from '@mui/material/styles';
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
import { Wizard, useWizard } from 'react-use-wizard';

// Steps
import ContactAndDetailsStep from './steps/ContactAndDetailsStep';
import DocumentsAndOptionsStep from './steps/DocumentsAndOptionsStep';
import ReviewStep from './steps/ReviewStep';
import WizardLayout from './layout/WizardLayout';
import { useWizardConfig } from './useWizardConfig';

const steps = [
  {
    label: 'Service & details',
    component: ContactAndDetailsStep,
    fields: ['meta.service', 'contact.fullName', 'contact.email', 'details.sourceLanguage', 'details.targetLanguage', 'details.purpose']
  },
  {
    label: 'Documents & options',
    component: DocumentsAndOptionsStep,
    fields: ['options.translationType', 'options.turnaround', 'options.deliveryMethod'],
    getFields: ({ wizardConfig }) => {
      const baseFields = ['options.translationType', 'options.turnaround', 'options.deliveryMethod'];
      if (!wizardConfig.documentRequirements?.length) {
        baseFields.unshift('documents.files');
      }
      return baseFields;
    },
    validate: validateServiceDocumentsStep
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
  meta: { service: '', serviceName: '', serviceCategory: 'all', marketingChannel: '' },
  serviceDocuments: {},
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
  const methods = useForm({ defaultValues, mode: 'onBlur' });
  const { handleSubmit, trigger, setValue, watch, reset } = methods;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const isDevMode = process.env.NEXT_PUBLIC_TASHEEL_DEV_MODE === 'true';

  // Prefill service slug and name if provided
  useEffect(() => {
    if (service) {
      setValue('meta.service', service);
      setValue('meta.serviceName', serviceName || serviceTitleLookup[service] || 'Service');
    }
  }, [service, serviceName, setValue]);

  const onSubmit = async (formValues) => {
    try {
      setIsSubmitting(true);
      setSubmissionStatus(null);

      const formData = new FormData();
      formData.append('payload', JSON.stringify(formValues));

      (formValues.documents?.files || []).forEach((file) => {
        formData.append('files', file);
      });

      Object.values(formValues.serviceDocuments || {}).forEach((file) => {
        if (file) {
          formData.append('files', file);
        }
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
    } catch (error) {
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

  const layoutWrapper = useMemo(
    () => (
      <WizardLayoutWrapper
        heading="Share your brief. We'll handle the rest."
        subheading="Upload your documents, pick turnaround options, and Tasheel will assign the right linguists with a detailed quote."
        status={statusProps}
        stepper={<WizardStepper steps={steps} isDevMode={isDevMode} />}
        summary={summaryPanel}
        actions={<WizardActions isSubmitting={isSubmitting} />}
        isDevMode={isDevMode}
      />
    ),
    [isDevMode, isSubmitting, statusProps, summaryPanel]
  );

  return (
    <FormProvider {...methods}>
      <Wizard wrapper={layoutWrapper} startIndex={0}>
        {steps.map((step, index) => (
          <WizardStepGuard
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            step={step}
            stepIndex={index}
            isLastStep={index === steps.length - 1}
            isDevMode={isDevMode}
            onSubmit={onSubmit}
            setIsSubmitting={setIsSubmitting}
          />
        ))}
      </Wizard>
    </FormProvider>
  );
}

TranslationWizard.propTypes = {
  service: PropTypes.string,
  serviceName: PropTypes.string
};

function WizardLayoutWrapper({ children, heading, subheading, status, stepper, summary, actions, isDevMode }) {
  const { activeStep } = useWizard();

  return (
    <WizardLayout
      heading={heading}
      subheading={subheading}
      status={status}
      stepper={stepper}
      summary={summary}
      actions={actions}
      isDevMode={isDevMode}
    >
      <Fade key={activeStep} in timeout={250}>
        <Box sx={{ minHeight: { md: 320 } }}>{children}</Box>
      </Fade>
    </WizardLayout>
  );
}

WizardLayoutWrapper.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node,
  heading: PropTypes.node,
  isDevMode: PropTypes.bool,
  status: PropTypes.shape({ type: PropTypes.string, message: PropTypes.string, onClose: PropTypes.func }),
  stepper: PropTypes.node,
  subheading: PropTypes.node,
  summary: PropTypes.node
};

function WizardStepper({ steps, isDevMode }) {
  const { activeStep, goToStep, isLoading } = useWizard();

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
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
                onClick={() => isClickable && !isLoading && goToStep(index)}
                disabled={!isClickable || isLoading}
              >
                <StepLabel StepIconComponent={WizardStepIcon}>{step.label}</StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}

WizardStepper.propTypes = {
  isDevMode: PropTypes.bool,
  steps: PropTypes.array.isRequired
};

function WizardActions({ isSubmitting }) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { previousStep, nextStep, isFirstStep, isLastStep, isLoading } = useWizard();

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent="flex-end"
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ mt: 4 }}
    >
      <TasheelButton
        onClick={previousStep}
        disabled={isFirstStep || isLoading || isSubmitting}
        size="large"
        variant="text"
        sx={{ order: { xs: 2, sm: 1 }, minWidth: { sm: 120 } }}
      >
        Back
      </TasheelButton>
      <TasheelButton
        variant="contained"
        size="large"
        onClick={nextStep}
        disabled={isLoading || (isLastStep && isSubmitting)}
        sx={{ order: { xs: 1, sm: 2 }, minWidth: { sm: 160 } }}
        fullWidth={isSmDown}
      >
        {isLastStep ? (isSubmitting || isLoading ? 'Submitting…' : 'Submit request') : 'Continue'}
      </TasheelButton>
    </Stack>
  );
}

WizardActions.propTypes = {
  isSubmitting: PropTypes.bool
};

function WizardStepGuard({ step, stepIndex, isLastStep, isDevMode, onSubmit, setIsSubmitting }) {
  const { handleStep, goToStep } = useWizard();
  const { control, trigger, handleSubmit, setError, clearErrors, getValues } = useFormContext();
  const wizardConfig = useWizardConfig(control);

  const fieldsToValidate = useMemo(() => {
    if (typeof step.getFields === 'function') {
      return step.getFields({ wizardConfig }) || [];
    }
    return step.fields || [];
  }, [step, wizardConfig]);

  useEffect(() => {
    handleStep(async () => {
      if (!isDevMode && fieldsToValidate.length) {
        const valid = await trigger(fieldsToValidate);
        if (!valid) {
          throw new Error('Step validation failed');
        }
      }

      if (typeof step.validate === 'function') {
        await step.validate({ wizardConfig, getValues, setError, clearErrors, isDevMode });
      }

      if (isLastStep) {
        setIsSubmitting(true);
        try {
          await handleSubmit(onSubmit)();
          goToStep(0);
        } catch (error) {
          setIsSubmitting(false);
          throw error;
        } finally {
          // handleSubmit will resolve only after onSubmit completes.
        }
      }
    });
  }, [
    clearErrors,
    fieldsToValidate,
    getValues,
    goToStep,
    handleStep,
    handleSubmit,
    isDevMode,
    isLastStep,
    onSubmit,
    setError,
    setIsSubmitting,
    step.validate,
    trigger,
    wizardConfig
  ]);

  const StepComponent = step.component || (() => null);

  return <StepComponent stepIndex={stepIndex} />;
}

WizardStepGuard.propTypes = {
  isDevMode: PropTypes.bool,
  isLastStep: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  setIsSubmitting: PropTypes.func.isRequired,
  step: PropTypes.shape({
    component: PropTypes.elementType,
    fields: PropTypes.array,
    getFields: PropTypes.func,
    validate: PropTypes.func
  }).isRequired,
  stepIndex: PropTypes.number
};

async function validateServiceDocumentsStep({ wizardConfig, getValues, setError, clearErrors, isDevMode }) {
  if (isDevMode) return;
  if (!wizardConfig.documentRequirements?.length) return;

  const serviceDocuments = getValues('serviceDocuments') || {};
  let hasError = false;

  wizardConfig.documentRequirements.forEach((doc) => {
    if (!doc.required) {
      clearErrors(`serviceDocuments.${doc.id}`);
      return;
    }

    const file = serviceDocuments[doc.id];
    if (!file) {
      hasError = true;
      setError(`serviceDocuments.${doc.id}`, {
        type: 'manual',
        message: `Upload ${doc.label}`
      });
    } else {
      clearErrors(`serviceDocuments.${doc.id}`);
    }
  });

  if (hasError) {
    throw new Error('Missing required documents');
  }
}

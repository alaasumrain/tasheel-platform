'use client';

import { useRef, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Typography,
	Stepper,
	Step,
	StepLabel,
	Box,
	Alert,
	CircularProgress,
	LinearProgress,
	IconButton,
	Tooltip,
	CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconArrowLeft, IconArrowRight, IconCheck, IconRefresh, IconX } from '@tabler/icons-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { submitQuoteRequest } from '@/app/actions/submit-quote-request';
import { createDraftApplication, uploadFileImmediately, deleteUploadedFile } from '@/app/actions/file-upload';
import { getServiceFields, type FormField } from '@/lib/service-form-fields';
import type { Service } from '@/data/services';
import { FileUploadField } from './FileUploadField';
import { useRouter } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import FilePreview from './FilePreview';
import RequiredDocumentsChecklist from './RequiredDocumentsChecklist';
import PricingEstimate from './PricingEstimate';
import { useTranslations, useLocale } from 'next-intl';
import QuoteOrderSummary from './quote-order-summary';

interface ServiceQuoteWizardProps {
	service: Service;
}

interface FieldErrors {
	[key: string]: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface UploadedAttachment {
	id: string;
	storagePath: string;
	fileName: string;
	fileSize: number;
}

export default function ServiceQuoteWizard({ service }: ServiceQuoteWizardProps) {
	const router = useRouter();
	const t = useTranslations('Quote.wizard');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	const formRef = useRef<HTMLFormElement>(null);
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [restoredData, setRestoredData] = useState(false);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
	const [applicationId, setApplicationId] = useState<string | null>(null);
	const [uploadedAttachments, setUploadedAttachments] = useState<Record<string, UploadedAttachment>>({});
	const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

	const serviceFields = getServiceFields(service.slug);
	const storageKey = `quote_draft_${service.slug}`;

	const steps = [
		t('steps.step1'),
		t('steps.step2'),
		t('steps.step3'),
	];

	// Create draft application on mount
	useEffect(() => {
		let mounted = true;
		const createDraft = async () => {
			const result = await createDraftApplication(service.slug, locale);
			if (mounted && result.type === 'success' && result.applicationId) {
				setApplicationId(result.applicationId);
			} else if (mounted && result.type === 'error') {
				console.error('Failed to create draft application:', result.message);
				toast.error(t('toast.initFailed'));
			}
		};
		createDraft();
		return () => {
			mounted = false;
		};
	}, [service.slug, locale]);

	// Load saved data from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setFormData(parsed);
				setRestoredData(true);
				toast.success(t('toast.draftRestored'));
			} catch {
				// Invalid saved data, ignore
			}
		}
	}, [storageKey]);

	// Auto-save to localStorage whenever formData changes
	useEffect(() => {
		if (Object.keys(formData).length > 0) {
			localStorage.setItem(storageKey, JSON.stringify(formData));
		}
	}, [formData, storageKey]);

	const resetFormState = () => {
		localStorage.removeItem(storageKey);
		formRef.current?.reset();
		setFormData({});
		setActiveStep(0);
		setRestoredData(false);
		setErrors({});
		setUploadedFiles({});
	};

	const { mutate: send, isPending } = useMutation({
		mutationFn: submitQuoteRequest,
		onSuccess: (result) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
				return;
			}
			toast.success(result.message.toString());
			resetFormState();
			const orderNumber = result.orderNumber ?? null;
			const confirmationUrl = orderNumber
				? `/confirmation?order=${encodeURIComponent(orderNumber)}`
				: '/confirmation';
			router.push(confirmationUrl);
		},
		onError(error) {
			toast.error(error.message.toString());
		},
	});

	// Validation functions
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePhone = (phone: string): boolean => {
		if (!phone || phone.trim().length === 0) return false;
		
		const cleaned = phone.replace(/[^+\d]/g, '');
		if (cleaned.length < 9) return false;
		
		let digits = cleaned.replace(/^\+/, '');

		// Handle +970 prefix
		if (digits.startsWith('970')) {
			digits = digits.slice(3);
		}

		// Handle 0 prefix
		if (digits.startsWith('0')) {
			digits = digits.slice(1);
		}

		// Palestinian mobile numbers: 5[6-9]XXXXXXX (9 digits starting with 56-59)
		// More lenient: accept 9-10 digits starting with 5
		return /^5\d{8,9}$/.test(digits);
	};

	const validateStep = (step: number): boolean => {
		const newErrors: FieldErrors = {};

		if (step === 0) {
			// Step 1: Contact Information
			if (!formData.name || formData.name.trim().length < 2) {
				newErrors.name = t('validation.nameRequired');
			}
			if (!formData.email || !validateEmail(formData.email)) {
				newErrors.email = t('validation.emailRequired');
			}
			if (!formData.phone || !validatePhone(formData.phone)) {
				newErrors.phone = t('validation.phoneRequired');
			}
		} else if (step === 1) {
			// Step 2: Service Requirements
			// Validate service-specific required fields
			serviceFields.forEach((field) => {
				if (field.required) {
					if (field.type === 'file') {
						// For file fields, check if uploaded
						if (!uploadedAttachments[field.name]) {
							newErrors[field.name] = t('validation.fieldRequired', { field: field.label });
						}
					} else {
						// For other fields, check if value exists
						const value = formData[field.name];
						if (!value || (typeof value === 'string' && value.trim().length === 0)) {
							newErrors[field.name] = t('validation.fieldRequired', { field: field.label });
						}
						// Additional validation for specific field types
						if (field.type === 'email' && value && !validateEmail(value)) {
							newErrors[field.name] = t('validation.emailInvalid');
						}
						if (field.type === 'tel' && value && !validatePhone(value)) {
							newErrors[field.name] = t('validation.phoneInvalid');
						}
					}
				}
			});

			// Validate standard fields
			if (!formData.details || formData.details.trim().length < 10) {
				newErrors.details = t('validation.detailsRequired');
			}
		} else if (step === 2) {
			// Step 3: Review - Final validation
			// Re-validate critical fields
			if (!formData.name || formData.name.trim().length < 2) {
				newErrors.name = t('validation.nameRequired');
			}
			if (!formData.email || !validateEmail(formData.email)) {
				newErrors.email = t('validation.emailRequired');
			}
			if (!formData.phone || !validatePhone(formData.phone)) {
				newErrors.phone = t('validation.phoneRequired');
			}
			if (!formData.details || formData.details.trim().length < 10) {
				newErrors.details = t('validation.detailsRequired');
			}
			
			// Check required documents (warning only, not blocking)
			if (service.requiredDocuments && service.requiredDocuments.length > 0) {
				const uploadedFileNames = Object.values(uploadedAttachments).map(att => 
					att.fileName.toLowerCase()
				);
				
				const missingDocs = service.requiredDocuments.filter(doc => {
					const docKeywords = doc.toLowerCase().split(/\s+/);
					return !uploadedFileNames.some(fileName => 
						docKeywords.some(keyword => fileName.includes(keyword))
					);
				});

				// Only warn if critical documents are missing
				if (missingDocs.length > 0 && missingDocs.length === service.requiredDocuments.length) {
					newErrors.requiredDocuments = t('validation.documentsRequired', { 
						documents: missingDocs.join(', ') 
					});
				}
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep(activeStep)) {
			if (activeStep < steps.length - 1) {
				setActiveStep((prev) => prev + 1);
				setErrors({}); // Clear errors when moving to next step
			}
		} else {
			toast.error(t('validation.fixErrors'));
		}
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
		setErrors({}); // Clear errors when going back
	};

	const handleFieldChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error for this field when user starts typing
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleFileChange = async (fieldName: string, file: File | null) => {
		if (file) {
			// Validate file size
			if (file.size > MAX_FILE_SIZE) {
				setErrors((prev) => ({
					...prev,
					[fieldName]: t('fileUpload.fileSizeError', { 
						maxSize: (MAX_FILE_SIZE / 1024 / 1024).toFixed(0),
						currentSize: (file.size / 1024 / 1024).toFixed(2)
					}),
				}));
				return;
			}

			// Store file locally for preview
			setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
			setFormData((prev) => ({ ...prev, [fieldName]: file.name }));

			// Upload immediately if we have an application ID
			if (applicationId) {
				setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
				
				try {
					const result = await uploadFileImmediately(applicationId, fieldName, file, locale);
					
					if (result.type === 'success' && result.attachmentId && result.storagePath) {
						const attachment: UploadedAttachment = {
							id: result.attachmentId,
							storagePath: result.storagePath,
							fileName: file.name,
							fileSize: file.size,
						};
						setUploadedAttachments((prev) => ({
							...prev,
							[fieldName]: attachment,
						}));
						toast.success(t('toast.fileUploaded', { fileName: file.name }));
					} else {
						toast.error(result.message || t('toast.uploadFailed'));
						setErrors((prev) => ({
							...prev,
							[fieldName]: result.message || t('toast.uploadFailed'),
						}));
					}
				} catch (error) {
					console.error('Error uploading file:', error);
					toast.error(t('toast.uploadError'));
					setErrors((prev) => ({
						...prev,
						[fieldName]: t('toast.uploadError'),
					}));
				} finally {
					setUploadingFiles((prev) => {
						const newState = { ...prev };
						delete newState[fieldName];
						return newState;
					});
				}
			} else {
				// No application ID yet - wait for it
				toast.loading(t('toast.initializing'));
			}

			// Clear error
			if (errors[fieldName]) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[fieldName];
					return newErrors;
				});
			}
		}
	};

	const handleRemoveFile = async (fieldName: string) => {
		const attachment = uploadedAttachments[fieldName];
		
		// Delete from storage if already uploaded
		if (attachment) {
			try {
				const result = await deleteUploadedFile(attachment.id, attachment.storagePath, locale);
				if (result.type === 'error') {
					toast.error(t('toast.removeFailed'));
					return;
				}
			} catch (error) {
				console.error('Error deleting file:', error);
				toast.error(t('toast.removeError'));
				return;
			}
		}

		// Remove from state
		setUploadedAttachments((prev) => {
			const newState = { ...prev };
			delete newState[fieldName];
			return newState;
		});
		setUploadedFiles((prev) => {
			const newFiles = { ...prev };
			delete newFiles[fieldName];
			return newFiles;
		});
		setFormData((prev) => {
			const newData = { ...prev };
			delete newData[fieldName];
			return newData;
		});
	};

	const handleClearForm = () => {
		if (window.confirm(t('toast.clearConfirm'))) {
			resetFormState();
			toast.success(t('toast.formCleared'));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Final validation on all steps
		let isValid = true;
		for (let step = 0; step < steps.length; step++) {
			if (!validateStep(step)) {
				isValid = false;
				// Jump to first step with errors
				setActiveStep(step);
				break;
			}
		}

		if (!isValid) {
			toast.error(t('validation.fixErrorsSubmit'));
			return;
		}

		if (!applicationId) {
			toast.error(t('toast.formInitializing'));
			return;
		}

		const formElement = formRef.current;
		if (!formElement) return;

		const data = new FormData(formElement);

		// Add application ID for draft update
		data.set('applicationId', applicationId);
		
		// Add locale for server-side translations
		data.set('locale', locale);

		// Add all form fields (including service-specific ones)
		Object.keys(formData).forEach(key => {
			if (formData[key] && key !== 'applicationId') {
				data.set(key, formData[key]);
			}
		});

		// Files are already uploaded, so we don't need to add them to FormData
		// The server action will fetch attachments using applicationId

		send(data);
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<Step1Content
						formData={formData}
						onChange={handleFieldChange}
						errors={errors}
						validatePhone={validatePhone}
					/>
				);
			case 1:
				return (
					<Step2Content
						serviceFields={serviceFields}
						formData={formData}
						onChange={handleFieldChange}
						errors={errors}
						uploadedFiles={uploadedFiles}
						uploadedAttachments={uploadedAttachments}
						uploadingFiles={uploadingFiles}
						onFileChange={handleFileChange}
						onRemoveFile={handleRemoveFile}
					/>
				);
			case 2:
				return (
					<Step3Content
						service={service}
						serviceFields={serviceFields}
						formData={formData}
						uploadedFiles={uploadedFiles}
					/>
				);
			default:
				return null;
		}
	};

	const progress = Math.round(((activeStep + 1) / steps.length) * 100);
	const canContinue =
		activeStep === 0
			? Boolean(
					formData.name &&
					formData.name.trim().length >= 2 &&
					formData.email &&
					validateEmail(formData.email) &&
					formData.phone &&
					validatePhone(formData.phone)
				)
			: activeStep === 1
				? Boolean(
					formData.details && 
					formData.details.trim().length >= 10 &&
					// Check all required service fields
					serviceFields.every(field => {
						if (!field.required) return true;
						if (field.type === 'file') {
							return !!uploadedAttachments[field.name];
						}
						const value = formData[field.name];
						return value && (typeof value !== 'string' || value.trim().length > 0);
					})
				)
				: true;

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			{/* Hidden service field */}
			<input type="hidden" name="service" value={service.slug} />
			{applicationId && <input type="hidden" name="applicationId" value={applicationId} />}

			<Grid container spacing={4} alignItems="flex-start">
				{/* Form Column */}
				<Grid size={{ xs: 12, md: 8 }} sx={{ order: locale === 'ar' ? 2 : 1 }}>
					<Stack spacing={4}>
						{/* Restored Data Alert */}
						{restoredData && (
							<Alert
								severity="success"
								sx={{ borderRadius: 2 }}
								action={
									<Tooltip title="Clear saved draft">
										<IconButton size="small" onClick={handleClearForm}>
											<IconX size={18} />
										</IconButton>
									</Tooltip>
								}
							>
								{t('draftRestored')}
							</Alert>
						)}

						{/* Stepper */}
						<Box>
							<Stepper activeStep={activeStep} alternativeLabel>
								{steps.map((label, index) => (
									<Step key={label}>
										<StepLabel
											onClick={() => {
												// Allow going back to previous steps
												if (index < activeStep) {
													setActiveStep(index);
												}
											}}
											sx={{
												cursor: index < activeStep ? 'pointer' : 'default',
												'& .MuiStepLabel-label': {
													fontSize: { xs: '0.75rem', sm: '0.875rem' }
												}
											}}
										>
											{label}
										</StepLabel>
									</Step>
								))}
							</Stepper>
							<Box sx={{ mt: 2 }}>
								<LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
								<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
									{t('progress', { current: activeStep + 1, total: steps.length, percent: progress })}
								</Typography>
							</Box>
						</Box>

						{/* Step Content */}
						<Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

						{/* Navigation Buttons */}
						<Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
							{activeStep > 0 && (
								<Button
									variant="outlined"
									onClick={handleBack}
									startIcon={isRTL ? <IconArrowRight size={18} /> : <IconArrowLeft size={18} />}
									disabled={isPending}
								>
									{t('back')}
								</Button>
							)}
							<Button
								variant="text"
								color="error"
								onClick={handleClearForm}
								startIcon={<IconRefresh size={18} />}
								disabled={isPending}
								sx={{ display: { xs: 'none', sm: 'flex' } }}
							>
								{t('clearForm')}
							</Button>
							<Box sx={{ flexGrow: 1 }} />
							{activeStep < steps.length - 1 ? (
								<Button
									variant="contained"
									onClick={handleNext}
									endIcon={isRTL ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
									size="large"
									disabled={!canContinue}
								>
									{t('continue')}
								</Button>
							) : (
								<Button
									type="submit"
									variant="contained"
									disabled={isPending}
									startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <IconCheck size={18} />}
									size="large"
								>
									{isPending ? t('submitting') : t('submitRequest')}
								</Button>
							)}
						</Stack>
					</Stack>
				</Grid>

				{/* Order Summary Sidebar */}
				<Grid size={{ xs: 12, md: 4 }} sx={{ order: locale === 'ar' ? 1 : 2 }}>
					<QuoteOrderSummary
						service={service}
						activeStep={activeStep}
						totalSteps={steps.length}
						formData={formData}
						uploadedAttachments={uploadedAttachments}
						locale={locale}
					/>
				</Grid>
			</Grid>
		</form>
	);
}

// Step 1: Contact Information
function Step1Content({
	formData,
	onChange,
	errors,
	validatePhone,
}: {
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
	errors: FieldErrors;
	validatePhone: (phone: string) => boolean;
}) {
	const t = useTranslations('Quote.wizard');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	
	return (
		<Stack spacing={3}>
			<Typography variant="h5" fontWeight={600}>
				{t('step1Title')}
			</Typography>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<FormControl required fullWidth error={!!errors.name}>
					<FormLabel htmlFor="name" sx={{ position: 'relative', [isRTL ? 'pl' : 'pr']: 3 }}>
						{t('fullName')}
						{formData.name && formData.name.length > 2 && !errors.name && (
							<Box 
								component="span" 
								sx={{ 
									position: 'absolute',
									[isRTL ? 'left' : 'right']: 0,
									top: '50%',
									transform: 'translateY(-50%)',
									color: 'success.main',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconCheck size={16} />
							</Box>
						)}
					</FormLabel>
					<OutlinedInput
						id="name"
						name="name"
						value={formData.name || ''}
						onChange={(e) => onChange('name', e.target.value)}
						error={!!errors.name}
						autoComplete="name"
					/>
					{errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
				</FormControl>
			</Stack>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<FormControl required fullWidth error={!!errors.email}>
					<FormLabel htmlFor="email" sx={{ position: 'relative', [isRTL ? 'pl' : 'pr']: 3 }}>
						{t('emailAddress')}
						{formData.email && formData.email.includes('@') && !errors.email && (
							<Box 
								component="span" 
								sx={{ 
									position: 'absolute',
									[isRTL ? 'left' : 'right']: 0,
									top: '50%',
									transform: 'translateY(-50%)',
									color: 'success.main',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconCheck size={16} />
							</Box>
						)}
					</FormLabel>
					<OutlinedInput
						id="email"
						name="email"
						type="email"
						value={formData.email || ''}
						onChange={(e) => onChange('email', e.target.value)}
						error={!!errors.email}
						autoComplete="email"
					/>
					{errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
				</FormControl>

				<FormControl required fullWidth error={!!errors.phone}>
					<FormLabel htmlFor="phone" sx={{ position: 'relative', [isRTL ? 'pl' : 'pr']: 3 }}>
						{t('phoneNumber')}
						{formData.phone && validatePhone(formData.phone) && !errors.phone && (
							<Box 
								component="span" 
								sx={{ 
									position: 'absolute',
									[isRTL ? 'left' : 'right']: 0,
									top: '50%',
									transform: 'translateY(-50%)',
									color: 'success.main',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconCheck size={16} />
							</Box>
						)}
					</FormLabel>
					<OutlinedInput
						id="phone"
						name="phone"
						type="tel"
						placeholder={locale === 'ar' ? "+970 59X XXX XXX" : "+970 59X XXX XXX"}
						value={formData.phone || ''}
						onChange={(e) => onChange('phone', e.target.value)}
						error={!!errors.phone}
						autoComplete="tel"
						inputMode="tel"
					/>
					{errors.phone ? (
						<FormHelperText error>{errors.phone}</FormHelperText>
					) : (
						<FormHelperText>
							{locale === 'ar' 
								? 'مثال: +970 592 123 456 أو 0592123456'
								: 'Example: +970 592 123 456 or 0592123456'}
						</FormHelperText>
					)}
				</FormControl>
			</Stack>
		</Stack>
	);
}

// Step 2: Service-Specific Requirements
function Step2Content({
	serviceFields,
	formData,
	onChange,
	errors,
	uploadedFiles,
	uploadedAttachments,
	uploadingFiles,
	onFileChange,
	onRemoveFile,
}: {
	serviceFields: FormField[];
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
	errors: FieldErrors;
	uploadedFiles: Record<string, File>;
	uploadedAttachments: Record<string, UploadedAttachment>;
	uploadingFiles: Record<string, boolean>;
	onFileChange: (fieldName: string, file: File | null) => void;
	onRemoveFile: (fieldName: string) => void;
}) {
	const t = useTranslations('Quote.wizard');
	
	const renderField = (field: FormField) => {
		const commonProps = {
			id: field.name,
			name: field.name,
			required: field.required ?? false,
		};

		switch (field.type) {
			case 'select':
				return (
					<FormControl required={field.required} fullWidth key={field.name} error={!!errors[field.name]}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<Select
							{...commonProps}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
							error={!!errors[field.name]}
						>
							<MenuItem value="" disabled>
								{t('selectOption')}
							</MenuItem>
							{field.options?.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
						{errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
						{!errors[field.name] && field.helperText && (
							<FormHelperText>{field.helperText}</FormHelperText>
						)}
					</FormControl>
				);

			case 'textarea':
				return (
					<FormControl required={field.required} fullWidth key={field.name} error={!!errors[field.name]}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<OutlinedInput
							{...commonProps}
							multiline
							rows={3}
							placeholder={field.placeholder}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
							error={!!errors[field.name]}
						/>
						{errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
						{!errors[field.name] && field.helperText && (
							<FormHelperText>{field.helperText}</FormHelperText>
						)}
					</FormControl>
				);

			case 'file':
				const isUploading = uploadingFiles[field.name];
				const isUploaded = !!uploadedAttachments[field.name];
				return (
					<Box key={field.name}>
						<FileUploadField
							label={field.label}
							name={field.name}
							value={uploadedFiles[field.name] || null}
							onChange={(file) => onFileChange(field.name, file)}
							onRemove={() => onRemoveFile(field.name)}
							error={errors[field.name]}
							helperText={field.helperText}
							accept={field.helperText?.includes('PDF') ? '.pdf,.jpg,.jpeg,.png,.doc,.docx' : '.pdf,.jpg,.jpeg,.png,.doc,.docx'}
							maxSize={field.helperText?.includes('5MB') ? 5 * 1024 * 1024 : 10 * 1024 * 1024}
							required={field.required}
							disabled={isUploading}
						/>
						{isUploading && (
							<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<CircularProgress size={16} />
								<Typography variant="caption" color="text.secondary">
									{t('uploading')}
								</Typography>
							</Box>
						)}
						{isUploaded && !isUploading && (
							<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconCheck size={16} color="success" />
								<Typography variant="caption" color="success.main">
									{t('uploadedSuccessfully')}
								</Typography>
							</Box>
						)}
					</Box>
				);

			case 'date':
				return (
					<LocalizationProvider dateAdapter={AdapterDateFns} key={field.name}>
						<FormControl fullWidth required={field.required} error={!!errors[field.name]}>
							<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
							<DatePicker
								value={formData[field.name] ? new Date(formData[field.name]) : null}
								onChange={(newValue) => {
									if (newValue) {
										onChange(field.name, newValue.toISOString().split('T')[0]);
									} else {
										onChange(field.name, '');
									}
								}}
								slotProps={{
									textField: {
										error: !!errors[field.name],
										helperText: errors[field.name] || field.helperText,
									},
								}}
								sx={{ mt: 1 }}
							/>
						</FormControl>
					</LocalizationProvider>
				);

			default:
				return (
					<FormControl required={field.required} fullWidth key={field.name} error={!!errors[field.name]}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<OutlinedInput
							{...commonProps}
							type={field.type}
							placeholder={field.placeholder}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
							error={!!errors[field.name]}
						/>
						{errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
						{!errors[field.name] && field.helperText && (
							<FormHelperText>{field.helperText}</FormHelperText>
						)}
					</FormControl>
				);
		}
	};

	return (
		<Stack spacing={3}>
			<Typography variant="h5" fontWeight={600}>
				{t('step2Title')}
			</Typography>

			{serviceFields.map((field) => renderField(field))}

			{/* Standard urgency and details fields */}
			<FormControl required>
				<FormLabel htmlFor="urgency">{t('serviceUrgency')}</FormLabel>
				<Select
					id="urgency"
					name="urgency"
					defaultValue="standard"
					required
					value={formData.urgency || 'standard'}
					onChange={(e) => onChange('urgency', e.target.value)}
				>
					<MenuItem value="standard">{t('urgencyOptions.standard')}</MenuItem>
					<MenuItem value="express">{t('urgencyOptions.express')}</MenuItem>
					<MenuItem value="urgent">{t('urgencyOptions.urgent')}</MenuItem>
				</Select>
			</FormControl>

			<FormControl required error={!!errors.details}>
				<FormLabel htmlFor="details">{t('additionalDetails')}</FormLabel>
				<OutlinedInput
					id="details"
					name="details"
					multiline
					rows={3}
					placeholder={t('detailsPlaceholder')}
					value={formData.details || ''}
					onChange={(e) => onChange('details', e.target.value)}
					error={!!errors.details}
				/>
				{errors.details && <FormHelperText error>{errors.details}</FormHelperText>}
			</FormControl>

			<FormControl>
				<FormLabel htmlFor="message">{t('additionalNotes')}</FormLabel>
				<OutlinedInput
					id="message"
					name="message"
					multiline
					rows={2}
					placeholder={t('notesPlaceholder')}
					value={formData.message || ''}
					onChange={(e) => onChange('message', e.target.value)}
				/>
			</FormControl>
		</Stack>
	);
}

// Step 3: Review & Submit
function Step3Content({
	service,
	serviceFields,
	formData,
	uploadedFiles,
}: {
	service: Service;
	serviceFields: FormField[];
	formData: Record<string, string>;
	uploadedFiles: Record<string, File>;
}) {
	const t = useTranslations('Quote.wizard');
	const locale = useLocale();
	
	// Collect all uploaded files into an array
	const allUploadedFiles = Object.values(uploadedFiles).filter((file): file is File => file instanceof File);
	const urgency = (formData.urgency || 'standard') as 'standard' | 'express' | 'urgent';

	return (
		<Stack spacing={4}>
			<Box>
				<Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
					{t('step3Title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{t('reviewSubtitle')}
				</Typography>
			</Box>

			<Alert severity="info" sx={{ borderRadius: 2 }}>
				{t('reviewAlert')}
			</Alert>

			{/* Service & Pricing Estimate */}
			<Card>
				<CardContent sx={{ p: { xs: 3, md: 4 } }}>
					<Stack spacing={3}>
						<Box>
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
								{t('serviceRequested')}
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								{service.title}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
								{service.description}
							</Typography>
						</Box>

						{/* Pricing Estimate */}
						<PricingEstimate service={service} urgency={urgency} locale={locale === 'ar' ? 'ar' : 'en'} />
					</Stack>
				</CardContent>
			</Card>

			{/* Contact Information */}
			<Card>
				<CardContent sx={{ p: { xs: 3, md: 4 } }}>
					<Stack spacing={2}>
						<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
							{t('contactInfo')}
						</Typography>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 4 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('fullName')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{formData.name || 'N/A'}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, sm: 4 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('emailAddress')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{formData.email || 'N/A'}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, sm: 4 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('phoneNumber')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{formData.phone || 'N/A'}
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Stack>
				</CardContent>
			</Card>

			{/* Service Requirements */}
			{serviceFields.some(field => field.type !== 'file' && formData[field.name]) && (
				<Card>
					<CardContent sx={{ p: { xs: 3, md: 4 } }}>
						<Stack spacing={2}>
							<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
								{t('serviceInfo')}
							</Typography>
							<Stack spacing={1.5}>
								{serviceFields.map((field) => {
									if (field.type === 'file') return null;
									const value = formData[field.name];
									if (!value) return null;
									return (
										<Box
											key={field.name}
											sx={{
												p: 2,
												borderRadius: 1,
												backgroundColor: 'background.default',
											}}
										>
											<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
												{field.label}
											</Typography>
											<Typography variant="body2" fontWeight={500}>
												{value}
											</Typography>
										</Box>
									);
								})}
								{formData.urgency && (
									<Box
										sx={{
											p: 2,
											borderRadius: 1,
											backgroundColor: 'background.default',
										}}
									>
										<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
											Urgency Level
										</Typography>
										<Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
											{formData.urgency}
										</Typography>
									</Box>
								)}
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			)}

			{/* Uploaded Documents */}
			{allUploadedFiles.length > 0 && (
				<Card>
					<CardContent sx={{ p: { xs: 3, md: 4 } }}>
						<Stack spacing={3}>
							<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
								{t('uploadedDocuments', { count: allUploadedFiles.length })}
							</Typography>

							{/* File Previews Grid */}
							<Grid container spacing={2}>
								{allUploadedFiles.map((file, index) => (
									<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
										<FilePreview file={file} showRemove={false} />
									</Grid>
								))}
							</Grid>

							{/* Required Documents Checklist */}
							{service.requiredDocuments && service.requiredDocuments.length > 0 && (
								<Box sx={{ pt: 2 }}>
									<RequiredDocumentsChecklist
										requiredDocuments={service.requiredDocuments}
										uploadedFiles={allUploadedFiles}
										uploadedFileCount={allUploadedFiles.length}
									/>
								</Box>
							)}
						</Stack>
					</CardContent>
				</Card>
			)}

			{/* Additional Information */}
			{(formData.details || formData.message) && (
				<Card>
					<CardContent sx={{ p: { xs: 3, md: 4 } }}>
						<Stack spacing={2}>
							<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
								{t('additionalInformation')}
							</Typography>
							{formData.details && (
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
										{t('additionalDetails')}
									</Typography>
									<Typography variant="body2">{formData.details}</Typography>
								</Box>
							)}
							{formData.message && (
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
										{t('additionalNotes')}
									</Typography>
									<Typography variant="body2">{formData.message}</Typography>
								</Box>
							)}
						</Stack>
					</CardContent>
				</Card>
			)}
		</Stack>
	);
}

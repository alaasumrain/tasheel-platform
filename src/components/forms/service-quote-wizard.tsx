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
} from '@mui/material';
import { IconArrowLeft, IconArrowRight, IconCheck, IconRefresh, IconX } from '@tabler/icons-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { submitQuoteRequest } from '@/app/actions/submit-quote-request';
import { getServiceFields, type FormField } from '@/lib/service-form-fields';
import type { Service } from '@/data/services';
import { FileUploadField } from './FileUploadField';

interface ServiceQuoteWizardProps {
	service: Service;
}

interface FieldErrors {
	[key: string]: string;
}

const steps = ['Your Details', 'Service Requirements', 'Review & Submit'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export default function ServiceQuoteWizard({ service }: ServiceQuoteWizardProps) {
	const formRef = useRef<HTMLFormElement>(null);
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [restoredData, setRestoredData] = useState(false);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

	const serviceFields = getServiceFields(service.slug);
	const storageKey = `quote_draft_${service.slug}`;

	// Load saved data from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setFormData(parsed);
				setRestoredData(true);
				toast.success('Your previous draft has been restored');
			} catch (e) {
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

	const { mutate: send, isPending } = useMutation({
		mutationFn: submitQuoteRequest,
		onSuccess: (result) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
				return;
			}
			toast.success(result.message.toString());
			// Clear everything
			handleClearForm();
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
		// Palestinian phone number validation (simple)
		return phone.length >= 9;
	};

	const validateStep = (step: number): boolean => {
		const newErrors: FieldErrors = {};

		if (step === 0) {
			// Step 1: Contact Information
			if (!formData.name || formData.name.length < 2) {
				newErrors.name = 'Please enter your full name (at least 2 characters)';
			}
			if (!formData.email || !validateEmail(formData.email)) {
				newErrors.email = 'Please enter a valid email address';
			}
			if (!formData.phone || !validatePhone(formData.phone)) {
				newErrors.phone = 'Please enter a valid phone number (at least 9 digits)';
			}
		} else if (step === 1) {
			// Step 2: Service Requirements
			// Validate service-specific required fields
			serviceFields.forEach((field) => {
				if (field.required && !formData[field.name] && field.type !== 'file') {
					newErrors[field.name] = `${field.label} is required`;
				}
			});

			// Validate standard fields
			if (!formData.details || formData.details.length < 10) {
				newErrors.details = 'Please provide at least 10 characters of details';
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
			toast.error('Please fix the errors before continuing');
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

	const handleFileChange = (fieldName: string, file: File | null) => {
		if (file) {
			// Validate file size
			if (file.size > MAX_FILE_SIZE) {
				setErrors((prev) => ({
					...prev,
					[fieldName]: `File size must be less than 10MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
				}));
				return;
			}
			setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
			setFormData((prev) => ({ ...prev, [fieldName]: file.name }));
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

	const handleRemoveFile = (fieldName: string) => {
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
		if (window.confirm('Are you sure you want to clear the form? This will delete all your progress.')) {
			localStorage.removeItem(storageKey);
			formRef.current?.reset();
			setFormData({});
			setActiveStep(0);
			setRestoredData(false);
			setErrors({});
			setUploadedFiles({});
			toast.success('Form cleared successfully');
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Final validation
		if (!validateStep(activeStep)) {
			toast.error('Please fix the errors before submitting');
			return;
		}

		const formElement = formRef.current;
		if (!formElement) return;

		const data = new FormData(formElement);

		// Add uploaded files to FormData
		Object.entries(uploadedFiles).forEach(([fieldName, file]) => {
			data.set(fieldName, file);
		});

		send(data);
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return <Step1Content formData={formData} onChange={handleFieldChange} errors={errors} />;
			case 1:
				return (
					<Step2Content
						serviceFields={serviceFields}
						formData={formData}
						onChange={handleFieldChange}
						errors={errors}
						uploadedFiles={uploadedFiles}
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
	const canContinue = activeStep === 0 ? (formData.name && formData.email && formData.phone) : activeStep === 1 ? (formData.details) : true;

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			{/* Hidden service field */}
			<input type="hidden" name="service" value={service.slug} />

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
						Your previous draft has been restored. Continue where you left off!
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
							Step {activeStep + 1} of {steps.length} ({progress}% complete)
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
							startIcon={<IconArrowLeft size={18} />}
							disabled={isPending}
						>
							Back
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
						Clear Form
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					{activeStep < steps.length - 1 ? (
						<Button
							variant="contained"
							onClick={handleNext}
							endIcon={<IconArrowRight size={18} />}
							size="large"
							disabled={!canContinue}
						>
							Continue
						</Button>
					) : (
						<Button
							type="submit"
							variant="contained"
							disabled={isPending}
							startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <IconCheck size={18} />}
							size="large"
						>
							{isPending ? 'Submitting...' : 'Submit Request'}
						</Button>
					)}
				</Stack>
			</Stack>
		</form>
	);
}

// Step 1: Contact Information
function Step1Content({
	formData,
	onChange,
	errors,
}: {
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
	errors: FieldErrors;
}) {
	return (
		<Stack spacing={3}>
			<Typography variant="h5" fontWeight={600}>
				Let's start with your contact information
			</Typography>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<FormControl required fullWidth error={!!errors.name}>
					<FormLabel htmlFor="name">
						Full Name
						{formData.name && formData.name.length > 2 && !errors.name && (
							<Box component="span" sx={{ ml: 1, color: 'success.main' }}>
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
					/>
					{errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
				</FormControl>
			</Stack>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<FormControl required fullWidth error={!!errors.email}>
					<FormLabel htmlFor="email">
						Email Address
						{formData.email && formData.email.includes('@') && !errors.email && (
							<Box component="span" sx={{ ml: 1, color: 'success.main' }}>
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
					/>
					{errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
				</FormControl>

				<FormControl required fullWidth error={!!errors.phone}>
					<FormLabel htmlFor="phone">
						Phone Number
						{formData.phone && formData.phone.length > 8 && !errors.phone && (
							<Box component="span" sx={{ ml: 1, color: 'success.main' }}>
								<IconCheck size={16} />
							</Box>
						)}
					</FormLabel>
					<OutlinedInput
						id="phone"
						name="phone"
						type="tel"
						placeholder="+970 XX XXX XXXX"
						value={formData.phone || ''}
						onChange={(e) => onChange('phone', e.target.value)}
						error={!!errors.phone}
					/>
					{errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
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
	onFileChange,
	onRemoveFile,
}: {
	serviceFields: FormField[];
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
	errors: FieldErrors;
	uploadedFiles: Record<string, File>;
	onFileChange: (fieldName: string, file: File | null) => void;
	onRemoveFile: (fieldName: string) => void;
}) {
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
								Select an option
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
				return (
					<FileUploadField
						key={field.name}
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
					/>
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
				Service requirements
			</Typography>

			{serviceFields.map((field) => renderField(field))}

			{/* Standard urgency and details fields */}
			<FormControl required>
				<FormLabel htmlFor="urgency">Service Urgency</FormLabel>
				<Select
					id="urgency"
					name="urgency"
					defaultValue="standard"
					required
					value={formData.urgency || 'standard'}
					onChange={(e) => onChange('urgency', e.target.value)}
				>
					<MenuItem value="standard">Standard (Normal processing)</MenuItem>
					<MenuItem value="express">Express (Faster processing)</MenuItem>
					<MenuItem value="urgent">Urgent (Fastest possible, if available)</MenuItem>
				</Select>
			</FormControl>

			<FormControl required error={!!errors.details}>
				<FormLabel htmlFor="details">Additional Details</FormLabel>
				<OutlinedInput
					id="details"
					name="details"
					multiline
					rows={3}
					placeholder="Any specific requirements or questions..."
					value={formData.details || ''}
					onChange={(e) => onChange('details', e.target.value)}
					error={!!errors.details}
				/>
				{errors.details && <FormHelperText error>{errors.details}</FormHelperText>}
			</FormControl>

			<FormControl>
				<FormLabel htmlFor="message">Additional Notes (Optional)</FormLabel>
				<OutlinedInput
					id="message"
					name="message"
					multiline
					rows={2}
					placeholder="Any other information we should know..."
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
	return (
		<Stack spacing={3}>
			<Typography variant="h5" fontWeight={600}>
				Review your request
			</Typography>

			<Alert severity="info" sx={{ borderRadius: 2 }}>
				Please review your information before submitting. Our team will contact you within 2
				hours to confirm details and provide a detailed quote.
			</Alert>

			{/* Service */}
			<Box>
				<Typography variant="subtitle2" color="text.secondary">
					Service
				</Typography>
				<Typography variant="body1" fontWeight={600}>
					{service.title}
				</Typography>
			</Box>

			{/* Contact Info */}
			<Box>
				<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
					Contact Information
				</Typography>
				<Stack spacing={0.5}>
					<Typography variant="body2">
						<strong>Name:</strong> {formData.name || 'N/A'}
					</Typography>
					<Typography variant="body2">
						<strong>Email:</strong> {formData.email || 'N/A'}
					</Typography>
					<Typography variant="body2">
						<strong>Phone:</strong> {formData.phone || 'N/A'}
					</Typography>
				</Stack>
			</Box>

			{/* Service-Specific Fields */}
			{serviceFields.length > 0 && (
				<Box>
					<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
						Service Details
					</Typography>
					<Stack spacing={0.5}>
						{serviceFields.map((field) => {
							if (field.type === 'file') {
								const file = uploadedFiles[field.name];
								if (!file) return null;
								return (
									<Typography variant="body2" key={field.name}>
										<strong>{field.label}:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
									</Typography>
								);
							}
							const value = formData[field.name];
							if (!value) return null;
							return (
								<Typography variant="body2" key={field.name}>
									<strong>{field.label}:</strong> {value}
								</Typography>
							);
						})}
					</Stack>
				</Box>
			)}

			{/* Standard Fields */}
			<Box>
				<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
					Request Details
				</Typography>
				<Stack spacing={0.5}>
					<Typography variant="body2">
						<strong>Urgency:</strong> {formData.urgency || 'Standard'}
					</Typography>
					{formData.details && (
						<Typography variant="body2">
							<strong>Details:</strong> {formData.details}
						</Typography>
					)}
					{formData.message && (
						<Typography variant="body2">
							<strong>Additional Notes:</strong> {formData.message}
						</Typography>
					)}
				</Stack>
			</Box>
		</Stack>
	);
}

'use client';

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
	Button,
	FormControl,
	FormLabel,
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
} from '@mui/material';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';

import { submitQuoteRequest } from '@/app/actions/submit-quote-request';
import { getServiceFields, type FormField } from '@/lib/service-form-fields';
import type { Service } from '@/data/services';

interface ServiceQuoteWizardProps {
	service: Service;
}

const steps = ['Your Details', 'Service Requirements', 'Review & Submit'];

export default function ServiceQuoteWizard({ service }: ServiceQuoteWizardProps) {
	const formRef = useRef<HTMLFormElement>(null);
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState<Record<string, string>>({});

	const serviceFields = getServiceFields(service.slug);

	const { mutate: send, isPending } = useMutation({
		mutationFn: submitQuoteRequest,
		onSuccess: (result) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
				return;
			}
			toast.success(result.message.toString());
			// Reset form
			formRef.current?.reset();
			setFormData({});
			setActiveStep(0);
		},
		onError(error) {
			toast.error(error.message.toString());
		},
	});

	const handleNext = () => {
		if (activeStep < steps.length - 1) {
			setActiveStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const handleFieldChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formElement = formRef.current;
		if (!formElement) return;

		const data = new FormData(formElement);
		send(data);
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return <Step1Content formData={formData} onChange={handleFieldChange} />;
			case 1:
				return (
					<Step2Content
						serviceFields={serviceFields}
						formData={formData}
						onChange={handleFieldChange}
					/>
				);
			case 2:
				return (
					<Step3Content
						service={service}
						serviceFields={serviceFields}
						formData={formData}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			{/* Hidden service field */}
			<input type="hidden" name="service" value={service.slug} />

			<Stack spacing={4}>
				{/* Stepper */}
				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{/* Step Content */}
				<Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

				{/* Navigation Buttons */}
				<Stack direction="row" spacing={2}>
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
					<Box sx={{ flexGrow: 1 }} />
					{activeStep < steps.length - 1 ? (
						<Button
							variant="contained"
							onClick={handleNext}
							endIcon={<IconArrowRight size={18} />}
							size="large"
						>
							Continue
						</Button>
					) : (
						<Button
							type="submit"
							variant="contained"
							disabled={isPending}
							startIcon={<IconCheck size={18} />}
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
}: {
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
}) {
	return (
		<Stack spacing={3}>
			<Typography variant="h5" fontWeight={600}>
				Let's start with your contact information
			</Typography>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<FormControl required fullWidth>
					<FormLabel htmlFor="name">Full Name</FormLabel>
					<OutlinedInput
						id="name"
						name="name"
						value={formData.name || ''}
						onChange={(e) => onChange('name', e.target.value)}
						required
					/>
				</FormControl>
			</Stack>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<FormControl required fullWidth>
					<FormLabel htmlFor="email">Email Address</FormLabel>
					<OutlinedInput
						id="email"
						name="email"
						type="email"
						value={formData.email || ''}
						onChange={(e) => onChange('email', e.target.value)}
						required
					/>
				</FormControl>

				<FormControl required fullWidth>
					<FormLabel htmlFor="phone">Phone Number</FormLabel>
					<OutlinedInput
						id="phone"
						name="phone"
						type="tel"
						placeholder="+970 XX XXX XXXX"
						value={formData.phone || ''}
						onChange={(e) => onChange('phone', e.target.value)}
						required
					/>
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
}: {
	serviceFields: FormField[];
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
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
					<FormControl required={field.required} fullWidth key={field.name}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<Select
							{...commonProps}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
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
						{field.helperText && (
							<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
								{field.helperText}
							</Typography>
						)}
					</FormControl>
				);

			case 'textarea':
				return (
					<FormControl required={field.required} fullWidth key={field.name}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<OutlinedInput
							{...commonProps}
							multiline
							rows={3}
							placeholder={field.placeholder}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
						/>
						{field.helperText && (
							<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
								{field.helperText}
							</Typography>
						)}
					</FormControl>
				);

			case 'file':
				return (
					<FormControl fullWidth key={field.name}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<Button variant="outlined" component="label" sx={{ mt: 1 }}>
							Choose File
							<input type="file" name={field.name} hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
						</Button>
						{field.helperText && (
							<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
								{field.helperText}
							</Typography>
						)}
					</FormControl>
				);

			default:
				return (
					<FormControl required={field.required} fullWidth key={field.name}>
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
						<OutlinedInput
							{...commonProps}
							type={field.type}
							placeholder={field.placeholder}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
						/>
						{field.helperText && (
							<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
								{field.helperText}
							</Typography>
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

			<FormControl required>
				<FormLabel htmlFor="details">Additional Details</FormLabel>
				<OutlinedInput
					id="details"
					name="details"
					multiline
					rows={3}
					placeholder="Any specific requirements or questions..."
					value={formData.details || ''}
					onChange={(e) => onChange('details', e.target.value)}
					required
				/>
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
}: {
	service: Service;
	serviceFields: FormField[];
	formData: Record<string, string>;
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
							if (field.type === 'file') return null; // Skip file fields in review
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

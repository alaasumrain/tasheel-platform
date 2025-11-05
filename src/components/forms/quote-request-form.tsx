'use client';
import { useRef } from 'react';
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
} from '@mui/material';
import { IconArrowRight as IconSend } from '@tabler/icons-react';

import { submitQuoteRequest } from '@/app/actions/submit-quote-request';
import type { LegacyService } from '@/lib/types/service';

interface QuoteRequestFormProps {
	preSelectedService?: string;
	services?: LegacyService[];
}

export default function QuoteRequestForm({
	preSelectedService,
	services = [],
}: QuoteRequestFormProps) {
	const formRef = useRef<HTMLFormElement>(null);
	const { mutate: send, isPending } = useMutation({
		mutationFn: submitQuoteRequest,
		onSuccess: (result) => {
			if (result.type === 'error') {
				toast.error(result.message.toString());
				return;
			}
			toast.success(result.message.toString());
			formRef.current?.reset();
		},
		onError(error) {
			toast.error(error.message.toString());
		},
	});

	const handleSubmit = (formData: FormData) => {
		send(formData);
	};

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				{/* Name & Email */}
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="name">Name</FormLabel>
						<OutlinedInput id="name" name="name" required />
					</FormControl>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="email">Email</FormLabel>
						<OutlinedInput id="email" name="email" type="email" required />
					</FormControl>
				</Stack>

				{/* Phone & Service Selection */}
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="phone">Phone Number</FormLabel>
					<OutlinedInput
						id="phone"
						name="phone"
						type="tel"
						placeholder="+970 XX XXX XXXX"
						required
					/>
					</FormControl>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="service">Service Required</FormLabel>
						<Select
							id="service"
							name="service"
							defaultValue={preSelectedService || ''}
							required
						>
							<MenuItem value="" disabled>
								Select a service
							</MenuItem>
							{services.map((service) => (
								<MenuItem key={service.slug} value={service.slug}>
									{service.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>

				{/* Urgency */}
				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="urgency">Service Urgency</FormLabel>
					<Select id="urgency" name="urgency" defaultValue="standard" required>
						<MenuItem value="standard">Standard (Normal processing)</MenuItem>
						<MenuItem value="express">Express (Faster processing)</MenuItem>
						<MenuItem value="urgent">
							Urgent (Fastest possible, if available)
						</MenuItem>
					</Select>
				</FormControl>

				{/* Document/Service Details */}
				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="details">
						Document/Service Details
					</FormLabel>
					<OutlinedInput
						id="details"
						name="details"
						multiline
						rows={3}
						placeholder="E.g., Palestinian marriage certificate issued in Nablus (2020) needing MOFAE attestation for family reunification"
						required
					/>
					<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
						Please provide details about your document(s) or specific
						requirements
					</Typography>
				</FormControl>

				{/* Additional Message */}
				<FormControl disabled={isPending}>
					<FormLabel htmlFor="message">
						Additional Notes (Optional)
					</FormLabel>
					<OutlinedInput
						id="message"
						name="message"
						multiline
						rows={2}
						placeholder="Any other information we should know..."
					/>
				</FormControl>

				{/* File Upload Note */}
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{
						p: 2,
						backgroundColor: 'background.default',
						borderRadius: 1,
					}}
				>
					<strong>Note:</strong> After submitting this form, our team will
					contact you within 2 hours to confirm details and arrange document
					pickup (if required) or provide upload instructions.
				</Typography>

				{/* Submit Button */}
				<Button
					disabled={isPending}
					endIcon={<IconSend />}
					fullWidth
					loading={isPending}
					type="submit"
					size="large"
				>
					Request Quote
				</Button>
			</Stack>
		</form>
	);
}

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
import { useTranslations } from 'next-intl';

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
	const t = useTranslations('Quote');
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
						<FormLabel htmlFor="name">{t('wizard.fullName')}</FormLabel>
						<OutlinedInput id="name" name="name" required />
					</FormControl>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="email">{t('wizard.emailAddress')}</FormLabel>
						<OutlinedInput id="email" name="email" type="email" required />
					</FormControl>
				</Stack>

				{/* Phone & Service Selection */}
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="phone">{t('wizard.phoneNumber')}</FormLabel>
					<OutlinedInput
						id="phone"
						name="phone"
						type="tel"
						placeholder="+970 59X XXX XXX"
						required
					/>
					</FormControl>
					<FormControl disabled={isPending} required fullWidth>
						<FormLabel htmlFor="service">{t('wizard.serviceRequired')}</FormLabel>
						<Select
							id="service"
							name="service"
							defaultValue={preSelectedService || ''}
							required
						>
							<MenuItem value="" disabled>
								{t('wizard.selectOption')}
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
					<FormLabel htmlFor="urgency">{t('wizard.serviceUrgency')}</FormLabel>
					<Select id="urgency" name="urgency" defaultValue="standard" required>
						<MenuItem value="standard">{t('wizard.urgencyOptions.standard')}</MenuItem>
						<MenuItem value="express">{t('wizard.urgencyOptions.express')}</MenuItem>
						<MenuItem value="urgent">
							{t('wizard.urgencyOptions.urgent')}
						</MenuItem>
					</Select>
				</FormControl>

				{/* Document/Service Details */}
				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="details">
						{t('wizard.additionalDetails')}
					</FormLabel>
					<OutlinedInput
						id="details"
						name="details"
						multiline
						rows={3}
						placeholder={t('wizard.detailsPlaceholder')}
						required
					/>
					<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
						{t('wizard.detailsHelper')}
					</Typography>
				</FormControl>

				{/* Additional Message */}
				<FormControl disabled={isPending}>
					<FormLabel htmlFor="message">
						{t('wizard.additionalNotes')}
					</FormLabel>
					<OutlinedInput
						id="message"
						name="message"
						multiline
						rows={2}
						placeholder={t('wizard.notesPlaceholder')}
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
					<strong>{t('wizard.note')}:</strong> {t('wizard.submitNote')}
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
					{t('requestQuote')}
				</Button>
			</Stack>
		</form>
	);
}

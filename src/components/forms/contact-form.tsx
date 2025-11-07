'use client';
import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
	Button,
	FormControl,
	FormLabel,
	OutlinedInput,
	Stack,
} from '@mui/material';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

import { sendMessage } from '@/app/actions/resend-send-message';

export default function ContactForm() {
	const t = useTranslations('Quote.contact');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	const formRef = useRef<HTMLFormElement>(null);
	const { mutate: send, isPending } = useMutation({
		mutationFn: sendMessage,
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
		formData.set('locale', locale);
		send(formData);
	};

	return (
		<form ref={formRef} action={handleSubmit}>
			<Stack spacing={3}>
				<Stack spacing={1}>
					<FormControl disabled={isPending} required>
						<FormLabel htmlFor="name">{t('name')}</FormLabel>
						<OutlinedInput id="name" name="name" required />
					</FormControl>
				</Stack>
				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="email">{t('email')}</FormLabel>
					<OutlinedInput id="email" name="email" type="email" required />
				</FormControl>
				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="subject">{t('subject')}</FormLabel>
					<OutlinedInput id="subject" name="subject" type="text" required />
				</FormControl>
				<FormControl disabled={isPending} required>
					<FormLabel htmlFor="message">{t('message')}</FormLabel>
					<OutlinedInput
						id="message"
						multiline
						name="message"
						rows={3}
						type="text"
						required
					/>
				</FormControl>
				<Button
					disabled={isPending}
					endIcon={isRTL ? <IconArrowLeft /> : <IconArrowRight />}
					fullWidth
					loading={isPending}
					type="submit"
				>
					{t('sendMessage')}
				</Button>
			</Stack>
		</form>
	);
}

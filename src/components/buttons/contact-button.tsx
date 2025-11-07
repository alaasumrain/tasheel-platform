'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import { IconMail as IconMail } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function ContactButton({
	buttonLabel,
	fullWidth = false,
}: {
	buttonLabel?: string;
	fullWidth?: boolean;
}) {
	const t = useTranslations('Buttons');
	const label = buttonLabel || t('contactUs');
	
	return (
		<Button
			color="secondary"
			component={Link}
			fullWidth={fullWidth}
			href={'/contact'}
			startIcon={<IconMail />}
		>
			{label}
		</Button>
	);
}

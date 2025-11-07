'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import { IconArrowRight as IconRightArrow, IconArrowLeft as IconLeftArrow } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

const defaultHref = '/#pricing';
const defaultSize: 'small' | 'medium' | 'large' = 'medium';

export default function GetStarted({
	buttonLabel,
	fullWidth = false,
	href = defaultHref,
	size = defaultSize,
	sx,
}: {
	buttonLabel?: string;
	fullWidth?: boolean;
	href?: string;
	size?: 'small' | 'medium' | 'large';
	sx?: object;
}) {
	const t = useTranslations('Buttons');
	const locale = useLocale();
	const label = buttonLabel || t('getStarted');
	const isRTL = locale === 'ar';
	
	return (
		<Button
			component={Link}
			startIcon={isRTL ? undefined : <IconRightArrow />}
			endIcon={isRTL ? <IconLeftArrow /> : undefined}
			fullWidth={fullWidth}
			href={href}
			size={size}
			sx={{ borderRadius: 999, px: 3.5, whiteSpace: 'nowrap', ...sx }}
		>
			{label}
		</Button>
	);
}

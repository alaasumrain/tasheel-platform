'use client';

import { Button, Stack } from '@mui/material';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * Quick action buttons for dashboard
 * Simple component linking to services page
 */
export function QuickActions() {
	const locale = useLocale();
	const t = useTranslations('Dashboard.page');
	const isRTL = locale === 'ar';

	return (
		<Stack
			direction="row"
			spacing={2}
			sx={{
				direction: isRTL ? 'rtl' : 'ltr',
				justifyContent: 'center',
				flexWrap: 'wrap',
			}}
		>
			<Button
				component={Link}
				href="/services"
				variant="contained"
				size="large"
				endIcon={!isRTL ? <IconArrowRight size={20} /> : undefined}
				startIcon={isRTL ? <IconArrowLeft size={20} /> : undefined}
				sx={{
					fontWeight: 600,
					textTransform: 'none',
					borderRadius: 2,
					px: 4,
				}}
			>
				{t('browseAllServices')}
			</Button>
		</Stack>
	);
}


'use client';

import { Button } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface RegisterButtonProps {
	buttonLabel?: string;
	fullWidth?: boolean;
	href?: string;
	size?: 'small' | 'medium' | 'large';
	variant?: 'text' | 'outlined' | 'contained';
	color?: 'primary' | 'secondary' | 'inherit';
	sx?: object;
}

export default function RegisterButton({
	buttonLabel,
	fullWidth = false,
	href = '/register',
	size = 'medium',
	variant = 'contained',
	color = 'primary',
	sx,
}: RegisterButtonProps) {
	const t = useTranslations('Header');
	const label = buttonLabel || t('signUp');

	return (
		<Button
			color={color}
			component={Link}
			fullWidth={fullWidth}
			href={href}
			size={size}
			variant={variant}
			sx={{
				borderRadius: 999,
				px: 3.5,
				whiteSpace: 'nowrap',
				...sx,
			}}
		>
			{label}
		</Button>
	);
}


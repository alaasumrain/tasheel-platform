'use client';

import NextLink from 'next/link';
import { Button } from '@mui/material';

// Put Button label here
const label = 'Sign in';
const defaultHref = '/login';
const defaultSize: 'small' | 'medium' | 'large' = 'medium';
const defaultVariant: 'text' | 'outlined' | 'contained' = 'text';
const defaultColor: 'primary' | 'secondary' | 'inherit' = 'primary';

export default function LoginButton({
	buttonLabel = label,
	fullWidth = false,
	href = defaultHref,
	size = defaultSize,
	variant = defaultVariant,
	color = defaultColor,
	sx,
}: {
	buttonLabel?: string;
	fullWidth?: boolean;
	href?: string;
	size?: 'small' | 'medium' | 'large';
	variant?: 'text' | 'outlined' | 'contained';
	color?: 'primary' | 'secondary' | 'inherit';
	sx?: object;
}) {
	return (
		<Button
			color={color}
			component={NextLink}
			fullWidth={fullWidth}
			href={href}
			size={size}
			variant={variant}
			sx={{
				borderRadius: 999,
				px: 3,
				whiteSpace: 'nowrap',
				bgcolor: variant === 'contained' ? 'primary.main' : undefined,
				color: variant === 'contained' ? '#fff' : undefined,
				...sx,
			}}
		>
			{buttonLabel}
		</Button>
	);
}

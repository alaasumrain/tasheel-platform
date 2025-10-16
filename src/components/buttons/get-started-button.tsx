import Link from 'next/link';
import { Button } from '@mui/material';
import { IconArrowRight as IconRightArrow } from '@tabler/icons-react';

// Put Button label here
const label = 'Get Started';
const defaultHref = '/#pricing';
const defaultSize: 'small' | 'medium' | 'large' = 'medium';

export default function GetStarted({
	buttonLabel = label,
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
	return (
		<Button
			component={Link}
			endIcon={<IconRightArrow />}
			fullWidth={fullWidth}
			href={href}
			size={size}
			sx={{ borderRadius: 999, px: 3.5, whiteSpace: 'nowrap', ...sx }}
		>
			{buttonLabel}
		</Button>
	);
}

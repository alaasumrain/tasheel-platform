'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import { IconArrowRight as IconRightArrow } from '@tabler/icons-react';

// Put Button label here
const label = 'Get Started';
const defaultHref = '/#pricing';

export default function GetStarted({
	buttonLabel = label,
	fullWidth = false,
	href = defaultHref,
}: {
	buttonLabel?: string;
	fullWidth?: boolean;
	href?: string;
}) {
	return (
		<Button
			component={Link}
			endIcon={<IconRightArrow />}
			fullWidth={fullWidth}
			href={href}
		>
			{buttonLabel}
		</Button>
	);
}

'use client';

import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { IconChevronRight } from '@tabler/icons-react';
import type { ComponentPropsWithoutRef } from 'react';

import { Link } from '@/i18n/navigation';

interface BreadcrumbItem {
	label: string;
	href?: string;
}

type BreadcrumbsProps = {
	items: BreadcrumbItem[];
} & Omit<ComponentPropsWithoutRef<typeof MuiBreadcrumbs>, 'children'>;

export function PageBreadcrumbs({ items, ...props }: BreadcrumbsProps) {
	return (
		<MuiBreadcrumbs
			separator={<IconChevronRight size={16} />}
			aria-label="breadcrumb"
			sx={{
				'& .MuiBreadcrumbs-separator': {
					color: 'text.secondary',
				},
			}}
			{...props}
		>
			{items.map((item, index) =>
				item.href && index !== items.length - 1 ? (
					<MuiLink
						key={`${item.label}-${index}`}
						component={Link}
						href={item.href}
						color="text.secondary"
						underline="hover"
						sx={{ fontWeight: 500 }}
					>
						{item.label}
					</MuiLink>
				) : (
					<Typography
						key={`${item.label}-${index}`}
						color="text.primary"
						fontWeight={600}
					>
						{item.label}
					</Typography>
				),
			)}
		</MuiBreadcrumbs>
	);
}

'use client';

import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { useLocale } from 'next-intl';
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
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	return (
		<MuiBreadcrumbs
			separator={isRTL ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
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

'use client';

import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface AdminBreadcrumbsProps {
	items: BreadcrumbItem[];
}

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
	return (
		<Breadcrumbs sx={{ mb: 3, mt: 0 }}>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				if (isLast || !item.href) {
					return (
						<Typography key={index} color="text.primary" fontWeight={isLast ? 600 : 400}>
							{item.label}
						</Typography>
					);
				}

				return (
					<MuiLink
						key={index}
						component={Link}
						href={item.href}
						underline="hover"
						color="inherit"
						sx={{
							'&:hover': {
								color: 'primary.main',
							},
						}}
					>
						{item.label}
					</MuiLink>
				);
			})}
		</Breadcrumbs>
	);
}


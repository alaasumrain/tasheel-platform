/**
 * Enhanced Stats Card Component
 * Extracted pattern from materio-nextjs, adapted to use Geneva Card
 * 
 * Usage:
 * <StatsCard
 *   value={123}
 *   label="Total Requests"
 *   icon={<IconFileText />}
 *   trend={{ value: 12, isPositive: true }}
 * />
 */

'use client';

import { Box, Stack, Typography, CardContent } from '@mui/material';
import { Card } from '@/components/ui/card';
import type { ReactNode } from 'react';

export interface StatsCardProps {
	value: string | number;
	label: string;
	icon?: ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
		label?: string;
	};
	color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
	borderRadius?: number;
}

/**
 * Enhanced stats card with icon and trend indicator
 * Uses Geneva Card for consistent styling
 */
export default function StatsCard({
	value,
	label,
	icon,
	trend,
	color = 'primary',
	borderRadius = 16,
}: StatsCardProps) {
	return (
		<Card borderRadius={borderRadius}>
			<CardContent>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography variant="h3" fontWeight={700} gutterBottom>
							{value}
						</Typography>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{label}
						</Typography>
						{trend && (
							<Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
								<Typography
									variant="caption"
									color={trend.isPositive ? 'success.main' : 'error.main'}
									fontWeight={600}
								>
									{trend.isPositive ? '+' : ''}{trend.value}%
								</Typography>
								{trend.label && (
									<Typography variant="caption" color="text.secondary">
										{trend.label}
									</Typography>
								)}
							</Stack>
						)}
					</Box>
					{icon && (
						<Box
							sx={{
								color: `${color}.main`,
								opacity: 0.8,
								display: 'flex',
								alignItems: 'center',
							}}
						>
							{icon}
						</Box>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}


'use client';

import { Box, Typography } from '@mui/material';
import { Card } from '@/components/ui/card';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface StatsCardProps {
	title: string;
	value: string | number;
	icon: React.ComponentType<SvgIconProps>;
	color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const colorMap = {
	primary: { main: 'rgba(14, 33, 160, 0.1)', text: 'rgba(14, 33, 160, 1)' },
	success: { main: 'rgba(153, 255, 130, 0.2)', text: '#2e7d32' },
	warning: { main: 'rgba(255, 152, 0, 0.1)', text: '#ed6c02' },
	error: { main: 'rgba(211, 47, 47, 0.1)', text: '#d32f2f' },
	info: { main: 'rgba(2, 136, 209, 0.1)', text: '#0288d1' },
};

export function StatsCard({ title, value, icon: Icon, color = 'primary' }: StatsCardProps) {
	const colors = colorMap[color];

	return (
		<Card
			backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
			borderColor={{ light: '#e0e0e0', dark: '#333333' }}
			borderRadius={20}
		>
			<Box sx={{ p: 3 }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						mb: 2,
					}}
				>
					<Box>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{
								textTransform: 'uppercase',
								letterSpacing: 0.5,
								fontWeight: 600,
							}}
						>
							{title}
						</Typography>
						<Typography
							variant="h3"
							sx={{
								mt: 1,
								fontWeight: 700,
								color: 'text.primary',
							}}
						>
							{value}
						</Typography>
					</Box>
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: 2,
							bgcolor: colors.main,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Icon sx={{ fontSize: 24, color: colors.text }} />
					</Box>
				</Box>
			</Box>
		</Card>
	);
}

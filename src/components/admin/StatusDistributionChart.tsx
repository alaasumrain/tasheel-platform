'use client';

import { Box, Typography, useTheme } from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface StatusDistributionChartProps {
	data: { status: string; count: number }[];
}

const statusColors: Record<string, string> = {
	submitted: '#0288d1',
	scoping: 'rgba(14, 33, 160, 1)',
	quote_sent: '#ed6c02',
	in_progress: 'rgba(14, 33, 160, 1)',
	review: '#ed6c02',
	completed: '#2e7d32',
	archived: '#757575',
	rejected: '#d32f2f',
	cancelled: '#757575',
};

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
	const t = useTranslations('Admin.orders');
	const theme = useTheme();
	const formattedData = data.map((item) => ({
		...item,
		label: t(`statusLabels.${item.status}` as any, { defaultValue: item.status }),
	}));

	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={20}
		>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{t('statusDistribution')}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					{t('statusDistributionDescription')}
				</Typography>

				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={formattedData}>
						<CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
							stroke={theme.palette.text.secondary}
							angle={-45}
							textAnchor="end"
							height={80}
						/>
						<YAxis
							tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
							stroke={theme.palette.text.secondary}
							allowDecimals={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: theme.palette.background.paper,
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 8,
							}}
						/>
						<Bar dataKey="count" radius={[8, 8, 0, 0]}>
							{formattedData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={statusColors[entry.status] || theme.palette.accent.main}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Card>
	);
}

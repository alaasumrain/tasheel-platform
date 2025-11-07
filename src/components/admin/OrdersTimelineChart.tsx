'use client';

import { Box, Typography, useTheme } from '@mui/material';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface OrdersTimelineChartProps {
	data: { date: string; count: number }[];
}

export function OrdersTimelineChart({ data }: OrdersTimelineChartProps) {
	const t = useTranslations('Admin.orders');
	const theme = useTheme();
	const formattedData = data.map((item) => ({
		...item,
		date: new Date(item.date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		}),
	}));

	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={20}
		>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{t('ordersTimeline')}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					{t('ordersTimelineDescription')}
				</Typography>

				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={formattedData}>
						<CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
						<XAxis
							dataKey="date"
							tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
							stroke={theme.palette.text.secondary}
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
						<Line
							type="monotone"
							dataKey="count"
							stroke={theme.palette.accent.main}
							strokeWidth={2}
							dot={{ fill: theme.palette.accent.main, r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Card>
	);
}

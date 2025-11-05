'use client';

import { Box, Typography } from '@mui/material';
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
	const formattedData = data.map((item) => ({
		...item,
		date: new Date(item.date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		}),
	}));

	return (
		<Card
			backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
			borderColor={{ light: '#e0e0e0', dark: '#333333' }}
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
						<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
						<XAxis
							dataKey="date"
							tick={{ fontSize: 12 }}
							stroke="#666"
						/>
						<YAxis
							tick={{ fontSize: 12 }}
							stroke="#666"
							allowDecimals={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: '#fff',
								border: '1px solid #e0e0e0',
								borderRadius: 8,
							}}
						/>
						<Line
							type="monotone"
							dataKey="count"
							stroke="rgba(14, 33, 160, 1)"
							strokeWidth={2}
							dot={{ fill: 'rgba(14, 33, 160, 1)', r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Card>
	);
}

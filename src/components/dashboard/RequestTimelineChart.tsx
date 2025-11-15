'use client';

import { Card } from '@/components/ui/card';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useLocale } from 'next-intl';

interface RequestTimelineChartProps {
	data: Array<{ date: string; count: number }>;
}

/**
 * Request timeline chart showing requests over the last 7 days
 * Uses Recharts with MUI styling
 */
export function RequestTimelineChart({ data }: RequestTimelineChartProps) {
	const locale = useLocale();
	const isRTL = locale === 'ar';

	// Format dates for display
	const formattedData = data.map((item) => {
		const date = new Date(item.date);
		const dayName = date.toLocaleDateString(locale, { weekday: 'short' });
		const dayNumber = date.getDate();
		return {
			...item,
			label: `${dayName} ${dayNumber}`,
		};
	});

	return (
		<Card borderRadius={20}>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{isRTL ? 'طلبات آخر 7 أيام' : 'Requests Last 7 Days'}
				</Typography>
				<Box sx={{ mt: 3, direction: isRTL ? 'rtl' : 'ltr' }}>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
							<XAxis
								dataKey="label"
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								angle={-45}
								textAnchor="end"
								height={60}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								allowDecimals={false}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: 'rgba(255, 255, 255, 0.95)',
									border: '1px solid #e0e0e0',
									borderRadius: '8px',
									padding: '8px',
								}}
							/>
							<Bar
								dataKey="count"
								fill="currentColor"
								radius={[8, 8, 0, 0]}
								style={{ fill: 'var(--mui-palette-primary-main)' }}
							/>
						</BarChart>
					</ResponsiveContainer>
				</Box>
			</Box>
		</Card>
	);
}


'use client';

import { Box, Typography } from '@mui/material';
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

const statusLabels: Record<string, string> = {
	submitted: 'Submitted',
	scoping: 'Scoping',
	quote_sent: 'Quote Sent',
	in_progress: 'In Progress',
	review: 'Review',
	completed: 'Completed',
	archived: 'Archived',
	rejected: 'Rejected',
	cancelled: 'Cancelled',
};

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
	const formattedData = data.map((item) => ({
		...item,
		label: statusLabels[item.status] || item.status,
	}));

	return (
		<Card
			backgroundColor={{ light: '#ffffff', dark: '#1a1a1a' }}
			borderColor={{ light: '#e0e0e0', dark: '#333333' }}
			borderRadius={20}
		>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					Status Distribution
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Orders by current status
				</Typography>

				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={formattedData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 12 }}
							stroke="#666"
							angle={-45}
							textAnchor="end"
							height={80}
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
						<Bar dataKey="count" radius={[8, 8, 0, 0]}>
							{formattedData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={statusColors[entry.status] || 'rgba(14, 33, 160, 1)'}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Card>
	);
}

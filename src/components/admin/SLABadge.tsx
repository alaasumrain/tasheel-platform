'use client';

import { Chip, Tooltip, LinearProgress, Box } from '@mui/material';
import { SLAResult } from '@/lib/utils/business-hours';

interface SLABadgeProps {
	sla: SLAResult;
	showProgress?: boolean;
}

export function SLABadge({ sla, showProgress = false }: SLABadgeProps) {
	const color = sla.status === 'breached' ? 'error' :
		sla.status === 'at_risk' ? 'warning' :
		'success';

	const label = sla.status === 'breached'
		? `Overdue: ${Math.ceil(sla.hoursElapsed - sla.targetHours)}h`
		: sla.status === 'at_risk'
		? `${Math.ceil(sla.hoursRemaining)}h remaining`
		: `${Math.ceil(sla.hoursRemaining)}h remaining`;

	const tooltip = `Status: ${sla.status}\nElapsed: ${Math.ceil(sla.hoursElapsed)}h / ${sla.targetHours}h\nProgress: ${Math.round(sla.percentElapsed)}%`;

	return (
		<Box>
			<Tooltip title={tooltip}>
				<Chip
					label={label}
					color={color}
					size="small"
					sx={{ mb: showProgress ? 1 : 0 }}
				/>
			</Tooltip>
			{showProgress && (
				<LinearProgress
					variant="determinate"
					value={Math.min(100, sla.percentElapsed)}
					color={color}
					sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
				/>
			)}
		</Box>
	);
}


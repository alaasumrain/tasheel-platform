'use client';

import { Box, Stack, Typography, Divider, Alert } from '@mui/material';
import {
	IconCurrencyShekel,
	IconClock,
	IconInfoCircle,
} from '@tabler/icons-react';
import type { Service } from '@/data/services';

interface PricingEstimateProps {
	service: Service;
	urgency: 'standard' | 'express' | 'urgent';
	locale?: 'en' | 'ar';
}

// Urgency pricing multipliers
const URGENCY_MULTIPLIERS = {
	standard: { multiplier: 1.0, label: 'Standard Processing', description: 'Normal turnaround time' },
	express: { multiplier: 1.3, label: 'Express Processing', description: '+30% for faster delivery' },
	urgent: { multiplier: 1.5, label: 'Urgent Processing', description: '+50% for priority handling' },
};

export default function PricingEstimate({
	service,
	urgency,
	locale = 'en',
}: PricingEstimateProps) {
	const urgencyInfo = URGENCY_MULTIPLIERS[urgency];

	// Format currency
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
			style: 'currency',
			currency: 'ILS',
			currencyDisplay: 'narrowSymbol',
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// Calculate pricing
	const hasFixedPrice = service.pricing.type === 'fixed' || service.pricing.type === 'starting';
	const baseAmount = service.pricing.amount || 0;
	const urgencyFee = hasFixedPrice && baseAmount > 0
		? baseAmount * (urgencyInfo.multiplier - 1)
		: 0;
	const estimatedTotal = hasFixedPrice && baseAmount > 0
		? baseAmount * urgencyInfo.multiplier
		: 0;

	return (
		<Stack spacing={2}>
			{/* Pricing breakdown */}
			{hasFixedPrice && baseAmount > 0 ? (
				<Box
					sx={{
						p: 3,
						borderRadius: 2,
						backgroundColor: 'background.default',
						border: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Stack spacing={2}>
						{/* Base price */}
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack direction="row" spacing={1} alignItems="center">
								<IconCurrencyShekel size={20} opacity={0.7} />
								<Typography variant="body2" color="text.secondary">
									Base Service Price
								</Typography>
							</Stack>
							<Typography variant="body1" fontWeight={600}>
								{formatCurrency(baseAmount)}
							</Typography>
						</Stack>

						{/* Urgency fee (if applicable) */}
						{urgency !== 'standard' && urgencyFee > 0 && (
							<>
								<Divider />
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Stack direction="row" spacing={1} alignItems="center">
										<IconClock size={20} opacity={0.7} />
										<Stack>
											<Typography variant="body2" color="text.secondary">
												{urgencyInfo.label}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{urgencyInfo.description}
											</Typography>
										</Stack>
									</Stack>
									<Typography variant="body1" fontWeight={600} color="accent.main">
										+{formatCurrency(urgencyFee)}
									</Typography>
								</Stack>
							</>
						)}

						{/* Total estimate */}
						<Divider />
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography variant="body1" fontWeight={600}>
								Estimated Total
							</Typography>
							<Typography variant="h6" color="primary.main">
								{formatCurrency(estimatedTotal)}
							</Typography>
						</Stack>

						{/* Note about pricing type */}
						{service.pricing.type === 'starting' && (
							<Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
								* Starting from this price - final cost may vary based on requirements
							</Typography>
						)}

						{/* Additional pricing note */}
						{service.pricing.note && (
							<Alert
								severity="info"
								icon={<IconInfoCircle size={18} />}
								sx={{
									py: 0.5,
									'& .MuiAlert-message': { fontSize: '0.875rem' }
								}}
							>
								{service.pricing.note}
							</Alert>
						)}
					</Stack>
				</Box>
			) : (
				// For quote-based services
				<Alert
					severity="info"
					icon={<IconInfoCircle size={20} />}
				>
					<Stack spacing={1}>
						<Typography variant="body2" fontWeight={600}>
							Custom Quote Required
						</Typography>
						<Typography variant="body2">
							The pricing for this service varies based on your specific requirements.
							We'll provide a detailed quote within 24 hours of reviewing your request.
						</Typography>
						{service.pricing.note && (
							<Typography variant="caption" color="text.secondary">
								Note: {service.pricing.note}
							</Typography>
						)}
					</Stack>
				</Alert>
			)}

			{/* Urgency info for quote-based services */}
			{!hasFixedPrice && urgency !== 'standard' && (
				<Box
					sx={{
						p: 2,
						borderRadius: 2,
						backgroundColor: 'background.default',
						border: '1px dashed',
						borderColor: 'accent.main',
					}}
				>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<IconClock size={20} />
						<Stack>
							<Typography variant="body2" fontWeight={600}>
								{urgencyInfo.label}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Your quote will reflect {urgencyInfo.description.toLowerCase()}
							</Typography>
						</Stack>
					</Stack>
				</Box>
			)}
		</Stack>
	);
}

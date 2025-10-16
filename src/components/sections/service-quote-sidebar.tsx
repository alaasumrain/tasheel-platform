import {
	Box,
	Button,
	CardContent,
	Stack,
	Typography,
} from '@mui/material';
import {
	IconClock,
	IconCurrencyShekel,
	IconCheck,
	IconBrandWhatsapp,
} from '@tabler/icons-react';

import { Card } from '@/components/ui/card';
import type { Service } from '@/data/services';

interface ServiceQuoteSidebarProps {
	service: Service;
}

export default function ServiceQuoteSidebar({ service }: ServiceQuoteSidebarProps) {
	const formatPrice = () => {
		if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
			return `₪${service.pricing.amount}`;
		}

		if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
			return `From ₪${service.pricing.amount}`;
		}

		return 'Request Quote';
	};

	const whatsappMessage = encodeURIComponent(
		`Hi! I'd like to get a quote for: ${service.title}`
	);
	const whatsappUrl = `https://wa.me/970590000000?text=${whatsappMessage}`;

	return (
		<Box sx={{ position: 'sticky', top: 100 }}>
			<Card
				backgroundColor={{ light: '#0E21A0', dark: '#0E21A0' }}
				borderColor={{ light: '#3949B1', dark: '#3949B1' }}
				gradientColor={{ light: '#3949B1', dark: '#3949B1' }}
				gradientOpacity={0.6}
				borderRadius={24}
			>
			<CardContent sx={{ p: { xs: 3, md: 4 } }}>
				<Stack spacing={3}>
					{/* Service Title */}
					<Box>
						<Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
							Service
						</Typography>
						<Typography variant="h5" color="#fff" fontWeight={700}>
							{service.title}
						</Typography>
					</Box>

					{/* Pricing & Time */}
					<Stack spacing={2}>
						<Stack direction="row" spacing={1.5} alignItems="center">
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: '12px',
									backgroundColor: 'rgba(255,255,255,0.15)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<IconCurrencyShekel size={20} color="#fff" />
							</Box>
							<Box>
								<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
									Pricing
								</Typography>
								<Typography variant="body1" color="#fff" fontWeight={600}>
									{formatPrice()}
								</Typography>
							</Box>
						</Stack>

						<Stack direction="row" spacing={1.5} alignItems="center">
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: '12px',
									backgroundColor: 'rgba(255,255,255,0.15)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<IconClock size={20} color="#fff" />
							</Box>
							<Box>
								<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
									Turnaround
								</Typography>
								<Typography variant="body1" color="#fff" fontWeight={600}>
									{service.turnaroundTime}
								</Typography>
							</Box>
						</Stack>
					</Stack>

					{/* What's Included */}
					<Box>
						<Typography variant="h6" color="#fff" sx={{ mb: 2 }}>
							What's Included
						</Typography>
						<Stack spacing={1.5}>
							{service.features.slice(0, 4).map((feature, index) => (
								<Stack direction="row" spacing={1.5} alignItems="flex-start" key={index}>
									<Box sx={{ color: '#fff', pt: 0.25 }}>
										<IconCheck size={20} />
									</Box>
									<Typography variant="body2" color="#fff">
										{feature}
									</Typography>
								</Stack>
							))}
						</Stack>
					</Box>

					{/* Divider */}
					<Box sx={{ borderTop: 1, borderColor: 'rgba(255,255,255,0.2)', pt: 3 }}>
						<Stack spacing={2}>
							<Typography variant="body2" color="rgba(255,255,255,0.9)">
								Need a faster quote? Chat with us on WhatsApp
							</Typography>
							<Button
								variant="outlined"
								size="large"
								startIcon={<IconBrandWhatsapp size={20} />}
								component="a"
								href={whatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									borderColor: 'rgba(255,255,255,0.5)',
									color: '#fff',
									'&:hover': {
										borderColor: '#fff',
										backgroundColor: 'rgba(255,255,255,0.1)',
									},
								}}
							>
								Quick WhatsApp Quote
							</Button>
						</Stack>
					</Box>

					{/* Note */}
					{service.pricing.note && (
						<Box
							sx={{
								p: 2,
								backgroundColor: 'rgba(255,255,255,0.1)',
								borderRadius: 2,
							}}
						>
							<Typography variant="caption" color="rgba(255,255,255,0.9)">
								<strong>Note:</strong> {service.pricing.note}
							</Typography>
						</Box>
					)}
				</Stack>
			</CardContent>
		</Card>
		</Box>
	);
}

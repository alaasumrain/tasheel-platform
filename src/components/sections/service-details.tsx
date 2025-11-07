'use client';

import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

interface ServiceDetail {
	key: string;
	image: string;
}

export default function ServiceDetails() {
	const t = useTranslations('Homepage.serviceDetails');
	
	const services: ServiceDetail[] = [
		{
			key: 'translation',
			image: '/dark/service-translation.jpg',
		},
		{
			key: 'documents',
			image: '/dark/service-documents.jpg',
		},
		{
			key: 'quotations',
			image: '/dark/service-quotations.jpg',
		},
	];
	
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Grid container spacing={{ xs: 3, md: 4 }}>
				{services.map((service, index) => (
					<Grid key={service.key} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
						<RevealSection delay={0.1 + index * 0.1} direction="up">
							<Box sx={{ width: '100%' }}>
								<Card
									borderRadius={24}
									backgroundColor={{ light: 'rgba(255,255,255,0.8)', dark: '#1F1F2B' }}
									borderColor={{ light: '#fff', dark: '#2F2F3B' }}
								>
									<Box sx={{ position: 'relative', width: '100%', height: { xs: 250, md: 320 }, overflow: 'hidden' }}>
										<Image
											src={service.image}
											alt={t(`${service.key}.imageAlt`)}
											fill
											style={{ objectFit: 'cover' }}
										/>
									</Box>
									<Box sx={{ p: 4, textAlign: 'center' }}>
										<Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
											{t(`${service.key}.title`)}
										</Typography>
										<Typography color="text.secondary" variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
											{t(`${service.key}.description`)}
										</Typography>
										{service.key === 'quotations' && (
											<Typography
												variant="subtitle2"
												sx={{
													mt: 2,
													color: 'accent.main',
													fontWeight: 600,
													textTransform: 'uppercase',
												}}
											>
												{t(`${service.key}.label`)}
											</Typography>
										)}
									</Box>
								</Card>
							</Box>
						</RevealSection>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}


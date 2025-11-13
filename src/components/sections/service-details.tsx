'use client';

import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { Theme } from '@mui/material/styles';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

interface ServiceDetail {
	key: string;
	image: string;
	category?: string;
}

export default function ServiceDetails() {
	const t = useTranslations('Homepage.serviceDetails');
	
	const services: ServiceDetail[] = [
		{
			key: 'translation',
			image: '/dark/service-translation.jpg',
			category: 'translation',
		},
		{
			key: 'documents',
			image: '/dark/service-documents.jpg',
			category: 'government',
		},
		{
			key: 'quotations',
			image: '/dark/service-quotations.jpg',
			category: 'corporate',
		},
	];
	
	return (
		<Container sx={{ py: { xs: 4.5, md: 8 }, pt: { xs: 0, md: 0 } }}>
			<Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'stretch' }}>
				{services.map((service, index) => (
					<Grid key={service.key} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
						<RevealSection delay={0.1 + index * 0.1} direction="up">
							<I18nLink
								href={service.category ? `/services?category=${service.category}` : '/services'}
								style={{ textDecoration: 'none', width: '100%', display: 'flex' }}
							>
								<Box
									sx={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										cursor: 'pointer',
										transition: 'transform 0.3s ease, box-shadow 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? '0px 16px 32px rgba(0,0,0,0.5)'
													: '0px 16px 32px rgba(0,0,0,0.2)',
										},
									}}
								>
									<Card
										borderRadius={24}
										backgroundColor={{ light: 'rgba(255,255,255,0.8)', dark: '#1F1F2B' }}
										borderColor={{ light: '#fff', dark: '#2F2F3B' }}
										fullHeight
									>
										<Box sx={{ position: 'relative', width: '100%', height: { xs: 250, md: 320 }, overflow: 'hidden', flexShrink: 0 }}>
											<Image
												src={service.image}
												alt={t(`${service.key}.imageAlt`)}
												fill
												style={{ objectFit: 'cover' }}
											/>
										</Box>
										<Box sx={{ 
											p: 4, 
											textAlign: 'center', 
											flexGrow: 1, 
											display: 'flex', 
											flexDirection: 'column',
											minHeight: { xs: 200, md: 220 },
											justifyContent: 'space-between'
										}}>
											<Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
												{t(`${service.key}.title`)}
											</Typography>
											<Typography color="text.secondary" variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t(`${service.key}.description`)}
											</Typography>
										</Box>
									</Card>
								</Box>
							</I18nLink>
						</RevealSection>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}


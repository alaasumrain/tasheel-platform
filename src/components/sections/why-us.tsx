'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslations, useLocale } from 'next-intl';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

export default function WhyUs() {
	const t = useTranslations('Homepage.whyUs');
	const locale = useLocale() as 'en' | 'ar';
	
	return (
		<Box sx={{ position: 'relative', zIndex: 1, backgroundColor: 'background.default' }}>
			<Container sx={{ py: { xs: 3, md: 6 } }}>
				<RevealSection delay={0} direction="up" duration={0.4}>
				<Grid
					container
					spacing={{ xs: 3, md: 4, lg: 8 }}
					sx={{
						flexDirection: { xs: 'column', md: 'row' },
						alignItems: { md: 'stretch' }
					}}
				>
					<Grid 
						size={{ xs: 12, md: 6 }} 
						sx={{ 
							order: { xs: 2, md: locale === 'ar' ? 2 : 1 },
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<RevealSection delay={0.1} direction="left" duration={0.4}>
							<Card
								borderColor={{
									light: 'rgba(255, 255, 255, 0.5)',
									dark: 'rgba(255, 255, 255, 0.5)',
								}}
								borderRadius={36}
								fullHeight
							>
								<Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: { xs: 350, md: 450 } }}>
									<Box
										component="img"
										src="/dark/about.jpg"
										alt={t('imageAlt')}
										sx={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											display: 'block',
										}}
									/>
								</Box>
							</Card>
						</RevealSection>
					</Grid>
					<Grid 
						size={{ xs: 12, md: 6 }} 
						sx={{ 
							order: { xs: 1, md: locale === 'ar' ? 1 : 2 },
							display: 'flex', 
							justifyContent: 'center', 
							alignItems: 'center'
						}}
					>
						<RevealSection delay={0.15} direction="right" duration={0.4}>
							<Stack spacing={{ xs: 1.5, md: 2.5 }} sx={{ py: { xs: 0, md: 2.5 }, width: '100%', maxWidth: { md: '100%' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<Stack spacing={1} sx={{ alignItems: 'center', width: '100%', textAlign: 'center' }}>
									<Typography
										color="accent"
										variant="h5"
										sx={{ fontWeight: 600, textAlign: 'center', width: '100%', display: 'block' }}
									>
										{t('tagline')}
									</Typography>
									<Typography
										variant="h2"
										sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' }, textAlign: 'center', width: '100%', display: 'block' }}
									>
										{t('headline')}
									</Typography>
									<Typography color="text.secondary" variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.7, textAlign: 'center', width: '100%', display: 'block' }}>
										{t('description')}
									</Typography>
								</Stack>
							</Stack>
						</RevealSection>
					</Grid>
				</Grid>
				</RevealSection>
			</Container>
		</Box>
	);
}


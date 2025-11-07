'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

export default function WhyUs() {
	const t = useTranslations('Homepage.whyUs');
	
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Grid
					alignItems={{ md: 'stretch' }}
					container
					direction={{ xs: 'column-reverse', md: 'row' }}
					spacing={{ xs: 0, md: 4, lg: 8 }}
				>
					<RevealSection delay={0.3} direction="left">
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={{ xs: 2.5, md: 5 }} sx={{ py: { xs: 0, md: 5 } }}>
								<Stack spacing={1.5}>
									<Typography
										color="accent"
										sx={{ maxWidth: { xs: '100%', md: '80%' } }}
										variant="h5"
									>
										{t('tagline')}
									</Typography>
									<Typography
										variant="h2"
										sx={{ maxWidth: { xs: '100%', md: '80%' } }}
									>
										{t('headline')}
									</Typography>
									<Typography color="text.secondary" variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
										{t('description')}
									</Typography>
								</Stack>
							</Stack>
						</Grid>
					</RevealSection>
					<RevealSection delay={0.5} direction="right">
						<Grid size={{ md: 'grow' }} sx={{ flexGrow: { md: 1 } }}>
							<Card
								borderColor={{
									light: 'rgba(255, 255, 255, 0.5)',
									dark: 'rgba(255, 255, 255, 0.5)',
								}}
								borderRadius={36}
								fullHeight
							>
								<Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: { xs: 350, md: 450 } }}>
									<Image
										src="/dark/about.jpg"
										alt={t('imageAlt')}
										fill
										style={{ objectFit: 'cover' }}
										priority
										unoptimized
									/>
								</Box>
							</Card>
						</Grid>
					</RevealSection>
				</Grid>
			</RevealSection>
		</Container>
	);
}


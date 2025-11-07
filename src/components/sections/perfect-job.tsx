'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import RevealSection from '@/components/ui/reveal-section';

export default function PerfectJob() {
	const t = useTranslations('Homepage.perfectJob');
	
	return (
		<Box
			sx={{
				bgcolor: 'accent.main',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Container sx={{ py: { xs: 8, md: 12 } }}>
				<RevealSection delay={0.1}>
					<Stack spacing={6} sx={{ textAlign: 'center', alignItems: 'center' }}>
						<Stack spacing={2} sx={{ maxWidth: { md: 800 } }}>
							<Typography
								variant="h2"
								sx={{
									color: 'common.white',
									fontWeight: 700,
									fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
								}}
							>
								{t('headline')}
							</Typography>
							{t('description') && (
								<Typography
									variant="h6"
									sx={{
										color: 'rgba(255, 255, 255, 0.9)',
										fontSize: { xs: '1.125rem', md: '1.375rem' },
									}}
								>
									{t('description')}
								</Typography>
							)}
						</Stack>
						
						{t('image') && (
							<RevealSection delay={0.3}>
								<Box
									sx={{
										position: 'relative',
										width: '100%',
										maxWidth: { md: 1000 },
										height: { xs: 250, md: 400 },
										borderRadius: 3,
										overflow: 'hidden',
									}}
								>
									<Image
										src="/dark/perfect-job.jpg"
										alt={t('imageAlt')}
										fill
										style={{ objectFit: 'cover' }}
									/>
								</Box>
							</RevealSection>
						)}
					</Stack>
				</RevealSection>
			</Container>
		</Box>
	);
}


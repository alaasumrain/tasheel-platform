'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

export default function HomepageContact() {
	const t = useTranslations('Homepage.contact');
	
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Grid
					alignItems={{ md: 'stretch' }}
					container
					spacing={{ xs: 4, md: 6, lg: 8 }}
				>
					<RevealSection delay={0.3} direction="left">
						<Grid size={{ xs: 12, md: 6 }}>
							<Box sx={{ height: { xs: 350, md: '100%' } }}>
								<Card
									borderRadius={36}
									fullHeight
								>
									<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
										<Image
											src="/dark/homepage-contact.jpg"
											alt={t('imageAlt')}
											fill
											style={{ objectFit: 'cover' }}
										/>
									</Box>
								</Card>
							</Box>
						</Grid>
					</RevealSection>
					<RevealSection delay={0.5} direction="right">
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack spacing={{ xs: 3, md: 4 }} sx={{ py: { xs: 0, md: 4 }, height: '100%', justifyContent: 'center' }}>
								<Stack spacing={2}>
									<Typography variant="h2" fontWeight={700}>
										{t('headline')}
									</Typography>
									{t('description') && (
										<Typography color="text.secondary" variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
											{t('description')}
										</Typography>
									)}
								</Stack>
								
								<Stack spacing={2.5}>
									{t('phone') && (
										<Stack direction="row" spacing={2} alignItems="center">
											<Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t('phoneLabel')}:
											</Typography>
											<Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t('phone')}
											</Typography>
										</Stack>
									)}
									{t('email') && (
										<Stack direction="row" spacing={2} alignItems="center">
											<Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t('emailLabel')}:
											</Typography>
											<Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t('email')}
											</Typography>
										</Stack>
									)}
									{t('address') && (
										<Stack direction="row" spacing={2} alignItems="flex-start">
											<Typography variant="body1" fontWeight={600} sx={{ minWidth: 80, fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t('addressLabel')}:
											</Typography>
											<Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
												{t('address')}
											</Typography>
										</Stack>
									)}
								</Stack>
								
								<Box sx={{ mt: { xs: 2, md: 4 } }}>
									<Button
										component={Link}
										href="/contact"
										size="large"
										variant="contained"
										color="accent"
										fullWidth
										sx={{
											px: 4,
											py: 1.5,
											fontWeight: 600,
											textTransform: 'uppercase',
										}}
									>
										{t('cta')}
									</Button>
								</Box>
							</Stack>
						</Grid>
					</RevealSection>
				</Grid>
			</RevealSection>
		</Container>
	);
}


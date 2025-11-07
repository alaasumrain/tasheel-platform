'use client';

import { Box, Button, CardContent, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

export default function HomepageContact() {
	const t = useTranslations('Homepage.contact');
	
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Card
					backgroundColor={{
						light: '#ffffff',
						dark: 'rgba(34, 34, 34, 1)',
					}}
					borderColor={{ light: 'accent.main', dark: 'rgba(68, 68, 68, 1)' }}
					borderRadius={36}
				>
					<CardContent
						sx={{
							p: { xs: 4, md: 6 },
							paddingBottom: { xs: '40px !important', md: '48px !important' },
						}}
					>
						<Stack 
							spacing={{ xs: 3, md: 4 }} 
							sx={{ 
								width: '100%',
							}}
						>
							<Stack spacing={1.5}>
								<Typography variant="h2" fontWeight={700}>
									{t('headline')}
								</Typography>
								{t('description') && (
									<Typography 
										color="text.secondary" 
										variant="h6" 
										sx={{ 
											fontSize: { xs: '1rem', md: '1.25rem' },
										}}
									>
										{t('description')}
									</Typography>
								)}
							</Stack>
							
							<Grid container spacing={{ xs: 2, md: 3 }}>
								{t('phone') && (
									<Grid size={{ xs: 12, sm: 4 }}>
										<Stack spacing={0.5}>
											<Typography 
												variant="body2" 
												color="text.secondary" 
												sx={{ 
													fontSize: { xs: '0.875rem', md: '0.9375rem' },
													textTransform: 'uppercase',
													letterSpacing: '0.5px',
												}}
											>
												{t('phoneLabel')}
											</Typography>
											<Typography 
												variant="body1" 
												fontWeight={600} 
												sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
											>
												{t('phone')}
											</Typography>
										</Stack>
									</Grid>
								)}
								{t('email') && (
									<Grid size={{ xs: 12, sm: 4 }}>
										<Stack spacing={0.5}>
											<Typography 
												variant="body2" 
												color="text.secondary" 
												sx={{ 
													fontSize: { xs: '0.875rem', md: '0.9375rem' },
													textTransform: 'uppercase',
													letterSpacing: '0.5px',
												}}
											>
												{t('emailLabel')}
											</Typography>
											<Typography 
												variant="body1" 
												fontWeight={600} 
												sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
											>
												{t('email')}
											</Typography>
										</Stack>
									</Grid>
								)}
								{t('address') && (
									<Grid size={{ xs: 12, sm: 4 }}>
										<Stack spacing={0.5}>
											<Typography 
												variant="body2" 
												color="text.secondary" 
												sx={{ 
													fontSize: { xs: '0.875rem', md: '0.9375rem' },
													textTransform: 'uppercase',
													letterSpacing: '0.5px',
												}}
											>
												{t('addressLabel')}
											</Typography>
											<Typography 
												variant="body1" 
												fontWeight={600} 
												sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
											>
												{t('address')}
											</Typography>
										</Stack>
									</Grid>
								)}
							</Grid>
							
							<Box sx={{ width: '100%', pt: 1 }}>
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
										borderRadius: 2,
									}}
								>
									{t('cta')}
								</Button>
							</Box>
						</Stack>
					</CardContent>
				</Card>
			</RevealSection>
		</Container>
	);
}


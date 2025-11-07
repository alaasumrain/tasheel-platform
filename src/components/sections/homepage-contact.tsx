'use client';

import { Box, Button, CardContent, Container, Stack, Typography } from '@mui/material';
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
							<Card
								backgroundColor={{
									light: 'rgba(255, 255, 255, 0.5)',
									dark: 'rgba(34, 34, 34, 1)',
								}}
								borderColor={{ light: '#ffffff', dark: 'rgba(68, 68, 68, 1)' }}
								borderRadius={36}
								sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
							>
								<CardContent
									sx={{
										p: { xs: 4, md: 6 },
										paddingBottom: { xs: '40px !important', md: '48px !important' },
										flexGrow: 1,
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
									}}
								>
									<Stack 
										spacing={{ xs: 4, md: 5 }} 
										sx={{ 
											textAlign: 'center',
											alignItems: 'center',
											maxWidth: { md: 500 },
											mx: 'auto',
										}}
									>
										<Stack spacing={2} sx={{ alignItems: 'center' }}>
											<Typography variant="h2" fontWeight={700}>
												{t('headline')}
											</Typography>
											{t('description') && (
												<Typography 
													color="text.secondary" 
													variant="h6" 
													sx={{ 
														fontSize: { xs: '1rem', md: '1.25rem' },
														maxWidth: { md: 400 },
													}}
												>
													{t('description')}
												</Typography>
											)}
										</Stack>
										
										<Stack 
											spacing={3} 
											sx={{ 
												width: '100%',
												alignItems: 'center',
											}}
										>
											{t('phone') && (
												<Stack 
													direction="column" 
													spacing={0.5} 
													alignItems="center"
													sx={{ width: '100%' }}
												>
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
											)}
											{t('email') && (
												<Stack 
													direction="column" 
													spacing={0.5} 
													alignItems="center"
													sx={{ width: '100%' }}
												>
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
											)}
											{t('address') && (
												<Stack 
													direction="column" 
													spacing={0.5} 
													alignItems="center"
													sx={{ width: '100%' }}
												>
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
											)}
										</Stack>
										
										<Box sx={{ width: '100%', pt: 2 }}>
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
						</Grid>
					</RevealSection>
				</Grid>
			</RevealSection>
		</Container>
	);
}


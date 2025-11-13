'use client';

import {
	Box,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import Image from '@/components/ui/image';
import GetStarted from '@/components/buttons/get-started-button';
import RevealSection from '@/components/ui/reveal-section';

interface Feature {
	headline: string;
	description: string;
}

export default function FeaturesGrid() {
	const t = useTranslations('Homepage.features');
	const tAlt = useTranslations('FeaturesGrid');
	
	const features: Feature[] = [
		{
			headline: t('feature1Headline'),
			description: t('feature1Description'),
		},
		{
			headline: t('feature2Headline'),
			description: t('feature2Description'),
		},
		{
			headline: t('feature3Headline'),
			description: t('feature3Description'),
		},
	];
	
	return (
		<Container sx={{ py: { xs: 4.5, md: 8 } }}>
			<Grid container spacing={4.5}>
				<Grid size={12}>
					<RevealSection delay={0.1}>
						<Card>
							<CardContent>
								<Box>
									<Grid
										container
										direction={{ xs: 'column-reverse', md: 'row' }}
										spacing={4}
										sx={{
											flexWrap: {
												xs: 'wrap',
												md: 'nowrap',
											},
										}}
									>
										<Grid size={{ xs: 12, lg: 'grow' }}>
											<Stack spacing={3.75} sx={{ pt: 1 }}>
												<Stack spacing={1.5}>
													<Typography variant="h4">
														{features[0]?.headline || ''}
													</Typography>
													<Typography
														color="text.secondary"
														component={'p'}
														variant="h6"
													>
														{features[0]?.description || ''}
													</Typography>
												</Stack>
												<Box>
													<GetStarted
														buttonLabel={t('exploreServices')}
														href="/services"
													/>
												</Box>
											</Stack>
										</Grid>
										<Grid
											size={{
												xs: 12,
												lg: 'auto',
											}}
										>
											<Box>
												<Image
													aspectRatio="694/520"
													darkImage="/dark/features-grid-01.png"
													lightImage="/light/features-grid-01.png"
													alt={tAlt('image1Alt')}
												/>
											</Box>
										</Grid>
									</Grid>
								</Box>
							</CardContent>
						</Card>
					</RevealSection>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<RevealSection delay={0.3} direction="left">
						<Card
							backgroundColor={{ light: '#0E21A0', dark: '#0E21A0' }}
							borderColor={{ light: '#3949B1', dark: '#3949B1' }}
							gradientColor={{ light: '#3949B1', dark: '#3949B1' }}
							gradientOpacity={0.6}
						>
							<CardContent>
								<Box>
									<Grid
										container
										spacing={5}
										direction={{ xs: 'column-reverse', md: 'row' }}
									>
										<Grid size={{ xs: 12 }}>
											<Stack spacing={1.5}>
												<Typography color="#ffffff" variant="h4">
													{features[1]?.headline || ''}
												</Typography>
												<Typography
													color="rgba(197, 202, 232, 1)"
													component={'p'}
													variant="h6"
												>
													{features[1]?.description || ''}
												</Typography>
											</Stack>
										</Grid>
										<Grid
											size={{
												xs: 12,
											}}
										>
											<Box>
												<Image
													aspectRatio="578/336"
													darkImage="/dark/features-grid-02.png"
													lightImage="/light/features-grid-02.png"
													alt={tAlt('image2Alt')}
												/>
											</Box>
										</Grid>
									</Grid>
								</Box>
							</CardContent>
						</Card>
					</RevealSection>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<RevealSection delay={0.5} direction="right">
						<Card
							backgroundColor={{ light: '#10101E', dark: '#DDDDDD' }}
							borderColor={{ light: '#4B4B65', dark: '#FFFFFF' }}
							gradientColor={{ light: '#4B4B65', dark: '#FFFFFF' }}
							gradientOpacity={0.5}
						>
							<CardContent>
								<Box>
									<Grid
										container
										spacing={5}
										direction={{ xs: 'column-reverse', md: 'row' }}
									>
										<Grid size={{ xs: 12 }}>
											<Stack spacing={1.5}>
												<Typography
													sx={[
														{ color: '#ffffff' },
														(theme) =>
															theme.applyStyles('dark', {
																color: '#000000',
															}),
													]}
													variant="h4"
												>
													{features[2]?.headline || ''}
												</Typography>
												<Typography
													component={'p'}
													sx={[
														{ color: '#CBC9C7' },
														(theme) =>
															theme.applyStyles('dark', {
																color: '#4B4B65',
															}),
													]}
													variant="h6"
												>
													{features[2]?.description || ''}
												</Typography>
											</Stack>
										</Grid>
										<Grid
											size={{
												xs: 12,
											}}
										>
											<Box>
												<Image
													aspectRatio="578/336"
													darkImage="/dark/features-grid-03.png"
													lightImage="/light/features-grid-03.png"
													alt={tAlt('image3Alt')}
												/>
											</Box>
										</Grid>
									</Grid>
								</Box>
							</CardContent>
						</Card>
					</RevealSection>
				</Grid>
			</Grid>
		</Container>
	);
}

'use client';

import {
	Box,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { Theme } from '@mui/material/styles';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';
import { Link as I18nLink } from '@/i18n/navigation';

interface CategoryCard {
	slug: string;
	image: string;
	imageAlt: string;
}

export default function ServicesCatalog() {
	const t = useTranslations('Homepage.serviceCategories');
	
	const categories: CategoryCard[] = [
		{
			slug: 'corporate',
			image: '/dark/services-corporate.jpg',
			imageAlt: t('corporate.imageAlt'),
		},
		{
			slug: 'residents',
			image: '/dark/services-residents.jpg',
			imageAlt: t('residents.imageAlt'),
		},
		{
			slug: 'non-residents',
			image: '/dark/services-non-residents.jpg',
			imageAlt: t('nonResidents.imageAlt'),
		},
	];
	
	return (
		<Container id="services" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack spacing={{ xs: 3, md: 4 }} sx={{ textAlign: 'center', mb: 6 }}>
				<Typography color="accent" variant="subtitle1">
					{t('subtitle')}
				</Typography>
				<Typography variant="h2">
					{t('title')}
				</Typography>
				<Typography color="text.secondary" variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
					{t('description')}
				</Typography>
			</Stack>
			<Grid container spacing={{ xs: 3, md: 4 }}>
				{categories.map((category, index) => (
					<Grid key={category.slug} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
						<RevealSection delay={0.1 + index * 0.1} direction="up">
							<I18nLink
								href={`/services?category=${category.slug}`}
								style={{ textDecoration: 'none', width: '100%' }}
							>
								<Box
									sx={{
										height: '100%',
										cursor: 'pointer',
										transition: 'transform 0.2s ease, box-shadow 0.2s ease',
										'&:hover': {
											transform: 'translateY(-4px)',
											boxShadow: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? '0px 12px 24px rgba(0,0,0,0.4)'
													: '0px 12px 24px rgba(0,0,0,0.15)',
										},
									}}
								>
									<Card
										borderRadius={24}
										backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
										borderColor={{ light: 'divider', dark: 'divider' }}
									>
										<Box sx={{ position: 'relative', width: '100%', height: 240, overflow: 'hidden' }}>
											<Image
												src={category.image}
												alt={category.imageAlt}
												fill
												style={{ objectFit: 'cover' }}
											/>
										</Box>
										<CardContent sx={{ p: 3 }}>
											<Stack spacing={1.5}>
												<Typography variant="h4" fontWeight={700}>
													{category.slug === 'non-residents' 
														? t('nonResidents.title')
														: t(`${category.slug}.title`)}
												</Typography>
												<Typography color="text.secondary" variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
													{category.slug === 'non-residents'
														? t('nonResidents.description')
														: t(`${category.slug}.description`)}
										</Typography>
									</Stack>
								</CardContent>
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

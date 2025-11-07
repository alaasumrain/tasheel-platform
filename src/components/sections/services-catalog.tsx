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
		<Container id="services" sx={{ py: { xs: 6.25, md: 12.5 }, pb: { xs: 3, md: 6 } }}>
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
			<Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'stretch' }}>
				{categories.map((category, index) => (
					<Grid key={category.slug} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
						<RevealSection delay={0.1 + index * 0.1} direction="up">
							<I18nLink
								href={`/services?category=${category.slug}`}
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
										backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
										borderColor={{ light: 'divider', dark: 'divider' }}
										sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
									>
										<Box sx={{ position: 'relative', width: '100%', height: 240, overflow: 'hidden', flexShrink: 0 }}>
											<Image
												src={category.image}
												alt={category.imageAlt}
												fill
												style={{ objectFit: 'cover' }}
											/>
										</Box>
										<CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
											<Stack spacing={1.5} sx={{ flexGrow: 1 }}>
												<Typography variant="h4" fontWeight={700}>
													{category.slug === 'non-residents' 
														? t('nonResidents.title')
														: t(`${category.slug}.title`)}
												</Typography>
												<Typography color="text.secondary" variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, flexGrow: 1 }}>
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

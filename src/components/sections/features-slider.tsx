'use client';

import { useCallback, useEffect, useState } from 'react';

import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Container,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import {
	IconChevronLeft as IconPrev,
	IconChevronRight as IconNext,
} from '@tabler/icons-react';
import { EmblaCarouselType } from 'embla-carousel';
import { useTranslations, useLocale } from 'next-intl';

import useEmblaCarousel from 'embla-carousel-react';
import RevealSection from '@/components/ui/reveal-section';

interface Feature {
	image: string;
	title: string;
	description: string;
}

export default function FeaturesSlider() {
	const t = useTranslations('FeaturesSlider');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' });

	const [canPrev, setCanPrev] = useState(true);
	const [canNext, setCanNext] = useState(true);

	const features: Feature[] = [
		{
			image: '/global/feature-slider-01.jpg',
			title: t('feature1Title'),
			description: t('feature1Description'),
		},
		{
			image: '/global/feature-slider-02.jpg',
			title: t('feature2Title'),
			description: t('feature2Description'),
		},
		{
			image: '/global/feature-slider-03.jpg',
			title: t('feature3Title'),
			description: t('feature3Description'),
		},
		{
			image: '/global/feature-slider-04.jpg',
			title: t('feature4Title'),
			description: t('feature4Description'),
		},
	];

	const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
		setCanPrev(emblaApi.canScrollPrev());
		setCanNext(emblaApi.canScrollNext());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onSelect(emblaApi);
		emblaApi.on('reInit', onSelect).on('select', onSelect);
	}, [emblaApi, onSelect]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	return (
		<Stack alignItems={{ lg: 'center' }} id="resources">
			<Stack spacing={{ xs: 2, md: 8 }}>
				<RevealSection delay={0.1} direction="up">
					<Container>
						<Box sx={{ px: { xs: 0, md: 7.5 } }}>
							<Grid alignItems="end" container spacing={{ xs: 3.75, md: 5 }}>
								<Grid size={{ xs: 12, md: 'grow' }}>
									<Stack
										spacing={{ xs: 1.5, md: 1.5 }}
										sx={{
											alignItems: { xs: 'center', md: 'flex-start' },
											px: { xs: 2, md: 0 },
											textAlign: { xs: 'center', md: isRTL ? 'right' : 'left' },
										}}
									>
										<Typography color="accent" variant="subtitle1">
											{t('subHeadline')}
										</Typography>
										<Typography
											component="div"
											sx={{ whiteSpace: 'pre-line' }}
											variant="h2"
										>
											{t('headline')}
										</Typography>
									</Stack>
								</Grid>
								<Grid size={{ md: "auto" }}>
									<Stack
										direction="row"
										spacing={{ md: 5 }}
										sx={{ display: { xs: 'none', md: 'flex' } }}
									>
										<IconButton
											disabled={!canPrev}
											disableRipple
											onClick={scrollPrev}
											sx={{
												opacity: 0.5,
												p: 0,
												transition: 'opacity 0.2s ease-in-out',
												'&:hover': { opacity: 1 },
											}}
										>
											{isRTL ? <IconNext size={48} /> : <IconPrev size={48} />}
										</IconButton>
										<IconButton
											disabled={!canNext}
											disableRipple
											onClick={scrollNext}
											sx={{
												opacity: 0.5,
												p: 0,
												transition: 'opacity 0.2s ease-in-out',
												'&:hover': { opacity: 1 },
											}}
										>
											{isRTL ? <IconPrev size={48} /> : <IconNext size={48} />}
										</IconButton>
									</Stack>
								</Grid>
							</Grid>
						</Box>
					</Container>
				</RevealSection>
				<RevealSection delay={0.3} direction="up">
					<Box
						sx={[
							() => ({
								position: 'relative',
								'&:after': {
									background: `linear-gradient(to ${isRTL ? 'right' : 'left'}, rgba(231, 233, 246, 1), rgba(231, 233, 246, 0))`,
									content: '""',
									display: canNext ? 'block' : 'none',
									height: '100%',
									right: 0,
									pointerEvents: 'none',
									position: 'absolute',
									top: 0,
									width: '10%',
									zIndex: 1,
								},
								'&:before': {
									background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, rgba(231, 233, 246, 1), rgba(231, 233, 246, 0))`,
									content: '""',
									display: canPrev ? 'block' : 'none',
									height: '100%',
									left: 0,
									pointerEvents: 'none',
									position: 'absolute',
									top: 0,
									width: '10%',
									zIndex: 1,
								},
							}),
							(theme) =>
								theme.applyStyles('dark', {
									'&:before': {
										background: `linear-gradient(to ${isRTL ? 'right' : 'left'}, rgba(17, 17, 17, 0) 0%,rgba(17, 17, 17, 1) 100%)`,
									},
									'&:after': {
										background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, rgba(17, 17, 17, 0) 0%,rgba(17, 17, 17, 1) 100%)`,
									},
								}),
						]}
					>
						<Box className="embla" ref={emblaRef}>
							<Box
								className="embla__container"
								sx={{
									maxWidth: { lg: 1332 },
									pb: { xs: 8, md: 8 },
									px: { xs: 2, md: 3, lg: 4 },
								}}
							>
								{features.map((feature, index) => (
									<Card
										key={index}
										className="embla__slide"
										sx={[
											() => ({
												backgroundColor: 'accent.main',
												borderRadius: { xs: '24px', md: '32px' },
												boxShadow: (theme) => theme.palette.mode === 'dark' 
													? '0px 24px 40px 0px rgba(0, 0, 0, 0.4)' 
													: '0px 24px 40px 0px rgba(0, 0, 0, 0.12)',
												position: 'relative',
												'&:after': {
													borderTopColor: 'rgba(255, 255, 255, 0.5)',
													borderTopWidth: 2,
													background: 'transparent',
													borderTopLeftRadius: {
														xs: `24px !important`,
														md: `32px !important`,
													},
													borderTopRightRadius: {
														xs: `24px !important`,
														md: `32px !important`,
													},
													content: "''",
													left: 0,
													position: 'absolute',
													right: 0,
													height: {
														xs: `24px !important`,
														md: `32px !important`,
													},
													top: 0,
													zIndex: 1,
												},
											}),
										]}
									>
										<CardMedia
											component="img"
											height="270"
											image={feature.image}
											alt={feature.title}
										/>
										<CardContent
											sx={{
												p: { xs: 3, md: 3.5 },
												paddingBottom: {
													xs: '24px !important',
													md: '36px !important',
												},
												position: 'relative',
												zIndex: 2,
											}}
										>
											<Stack spacing={1.5}>
												<Typography color="accent.contrastText" variant="h5">
													{feature.title}
												</Typography>
												<Typography color="accent.contrastText">
													{feature.description}
												</Typography>
											</Stack>
										</CardContent>
									</Card>
								))}
							</Box>
						</Box>
					</Box>
				</RevealSection>
			</Stack>
		</Stack>
	);
}

'use client';

import { useCallback, useEffect, useState } from 'react';

import {
	Box,
	Card,
	CardContent,
	Container,
	IconButton,
	Rating,
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

interface Review {
	stars: number;
	author: string;
	content: string;
}

export default function Reviews() {
	const t = useTranslations('Reviews');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' });

	const [canPrev, setCanPrev] = useState(true);
	const [canNext, setCanNext] = useState(true);

	const reviews: Review[] = [
		{
			stars: 5,
			author: t('review1Author'),
			content: t('review1Content'),
		},
		{
			stars: 5,
			author: t('review2Author'),
			content: t('review2Content'),
		},
		{
			stars: 5,
			author: t('review3Author'),
			content: t('review3Content'),
		},
		{
			stars: 5,
			author: t('review4Author'),
			content: t('review4Content'),
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
		<Stack
			alignItems={{ lg: 'center' }}
			sx={{ py: { xs: 6.25, md: 12.5 } }}
		>
			<Stack spacing={{ xs: 4, md: 8 }}>
				<RevealSection delay={0.1} direction="up">
					<Container>
						<Box sx={{ px: { xs: 2, md: 7.5 } }}>
							<Grid alignItems="end" container spacing={{ xs: 2.5, md: 5 }}>
								<Grid size={{ xs: 12, md: 'grow' }}>
									<Stack
										spacing={1.5}
										sx={{
											alignItems: { xs: 'center', md: 'flex-start' },
											textAlign: { xs: 'center', md: isRTL ? 'right' : 'left' },
										}}
									>
										<Typography color="accent" variant="subtitle1">
											{t('headline')}
										</Typography>
										<Typography
											component="div"
											sx={{
												textAlign: { xs: 'center', md: isRTL ? 'right' : 'left' },
												whiteSpace: 'pre-line',
											}}
											variant="h2"
										>
											{t('subHeadline')}
										</Typography>
									</Stack>
								</Grid>
								<Grid size={{ xs: 0, md: "auto" }}>
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
						sx={{
							position: 'relative',
						}}
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
								{reviews.map((review, index) => (
									<Card
										key={index}
										className="embla__slide"
										sx={[
											() => ({
												borderRadius: { xs: '24px', md: '32px' },
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
											(theme) =>
												theme.applyStyles('dark', {
													backgroundColor: 'background.paper',
													'&:after': {
														borderTopColor: 'divider',
													},
												}),
										]}
									>
										<CardContent
											sx={{
												borderRadius: { xs: '12px', md: '24px' },
												p: { xs: 3, md: 3.5 },
												paddingBottom: '36px !important',
											}}
										>
											<Stack spacing={5}>
												<Rating
													color="accent"
													readOnly
													size="large"
													value={review.stars}
												/>
												<Stack spacing={1.5}>
													<Typography variant="subtitle1">
														{`"${review.content}"`}
													</Typography>
													<Typography fontWeight="bold" variant="body2">
														{review.author}
													</Typography>
												</Stack>
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

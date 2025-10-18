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

import useEmblaCarousel from 'embla-carousel-react';
import RevealSection from '@/components/ui/reveal-section';

// Put Section Headline here
const headline = `Residents and teams trust Tasheel`;

// Put Section SubHeadline here
const subHeadline = `Validated by residents, HR teams, and corporate admins across Palestine`;

// Put Reviews items here
const reviews: Review[] = [
	{
		stars: 5,
		author: `Fatima A., Ramallah resident`,
		content: `I renewed my Palestinian ID card and driver&apos;s license without leaving home. Tasheel coordinated every ministry visit and delivered the approvals to my door.`,
	},
	{
		stars: 5,
		author: `Omar R., HR Manager`,
		content: `Tasheel turns employee residency renewals into a tracked workflow. We upload, they process, and our staff stay compliant with Palestinian regulations.`,
	},
	{
		stars: 5,
		author: `Nadia L., Legal Consultant`,
		content: `Embassy attestations used to take weeks. Tasheel worked with the Palestinian MOFAE and secured stamped documents in four days.`,
	},
	{
		stars: 5,
		author: `James P., Operations Director`,
		content: `The live status dashboard means I always know where our permits stand across the West Bank. No more chasing government offices for updates.`,
	},
];

interface Review {
	stars: number;
	author: string;
	content: string;
}

export default function Reviews() {
	const [emblaRef, emblaApi] = useEmblaCarousel();

	const [canPrev, setCanPrev] = useState(true);
	const [canNext, setCanNext] = useState(true);

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
			sx={{ pt: { xs: 6.25, md: 12.5 }, pb: { xs: 2.25, md: 4.5 } }}
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
											textAlign: { xs: 'center', md: 'left' },
										}}
									>
										<Typography color="accent" variant="subtitle1">
											{headline}
										</Typography>
										<Typography
											component="div"
											sx={{
												textAlign: { xs: 'center', md: 'left' },
												whiteSpace: 'pre-line',
											}}
											variant="h2"
										>
											{subHeadline}
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
											<IconPrev size={48} />
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
											<IconNext size={48} />
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
									background: `linear-gradient(to left, rgba(231, 233, 246, 1), rgba(231, 233, 246, 0))`,
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
									background: `linear-gradient(to right, rgba(231, 233, 246, 1), rgba(231, 233, 246, 0))`,
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
										background: `linear-gradient(to left, rgba(17, 17, 17, 0) 0%,rgba(17, 17, 17, 1) 100%)`,
									},
									'&:after': {
										background: `linear-gradient(to right, rgba(17, 17, 17, 0) 0%,rgba(17, 17, 17, 1) 100%)`,
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
													backgroundColor: '#222222',
													'&:after': {
														borderTopColor: '#555555',
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

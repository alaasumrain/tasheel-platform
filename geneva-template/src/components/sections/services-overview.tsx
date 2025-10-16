import {
	Box,
	Button,
	CardContent,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import {
	IconArrowRight,
	IconClock,
	IconCurrencyShekel,
} from '@tabler/icons-react';
import Link from 'next/link';

import { services, serviceCategories } from '@/data/services';
import { Card } from '@/components/ui/card';
import Image from '@/components/ui/image';
import RevealSection from '@/components/ui/reveal-section';

export default function ServicesOverview() {
	return (
		<Box>
			{/* Hero Section */}
			<Container sx={{ pt: { xs: 3, md: 6 }, pb: { xs: 6.25, md: 12.5 } }}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={3} alignItems="center" textAlign="center">
						<Typography color="accent" variant="subtitle1">
							Our Services
						</Typography>
						<Typography variant="h1" maxWidth={800}>
							Complete government services, all in one place
						</Typography>
					<Typography
						color="text.secondary"
						variant="h6"
						component="p"
						maxWidth={720}
					>
						From driver&apos;s license renewals to document attestation—submit
						online, track progress, and receive completed services without
						office visits.
					</Typography>
					</Stack>
				</RevealSection>
			</Container>

			{/* Service Categories */}
			{serviceCategories.map((category, categoryIndex) => {
				const categoryServices = services.filter(
					(s) => s.category === category.slug
				);

				return (
					<Box
						key={category.slug}
						sx={{
							backgroundColor:
								categoryIndex % 2 === 0
									? 'background.default'
									: 'background.paper',
							py: { xs: 6.25, md: 12.5 },
						}}
					>
						<Container>
							<RevealSection
								delay={0.1 + categoryIndex * 0.1}
								direction="up"
							>
								<Stack spacing={5}>
									{/* Category Header */}
									<Stack spacing={2} maxWidth={720}>
										<Typography color="accent" variant="subtitle1">
											{category.name}
										</Typography>
										<Typography variant="h2">{category.description}</Typography>
									</Stack>

									{/* Service Cards */}
									<Grid container spacing={4}>
				{categoryServices.map((service) => (
											<Grid
												size={{ xs: 12, md: 6, lg: 4 }}
												key={service.slug}
											>
												<Card fullHeight>
													<CardContent
														sx={{
															p: 0,
															display: 'flex',
															flexDirection: 'column',
															height: '100%',
														}}
													>
														{/* Service Image */}
														<Box
															sx={{
																position: 'relative',
																width: '100%',
																aspectRatio: '16/10',
																overflow: 'hidden',
															}}
														>
															<Image
																darkImage={service.image.dark}
																lightImage={service.image.light}
																alt={service.title}
															/>
														</Box>

														{/* Service Content */}
														<Stack
															spacing={2.5}
															sx={{
																p: { xs: 3, md: 4 },
																flexGrow: 1,
																display: 'flex',
																flexDirection: 'column',
															}}
														>
															<Stack spacing={1.5} flexGrow={1}>
																<Typography variant="h5">
																	{service.title}
																</Typography>
																<Typography
																	color="text.secondary"
																	variant="body2"
																>
																	{service.shortDescription}
																</Typography>
															</Stack>

															{/* Quick Info */}
															<Stack spacing={1}>
																<Stack
																	direction="row"
																	spacing={1}
																	alignItems="center"
																>
																	<IconClock size={18} />
																	<Typography variant="caption">
																		{service.turnaroundTime}
																	</Typography>
																</Stack>
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
								>
									<IconCurrencyShekel size={18} />
									<Typography variant="caption">
										{service.pricing.type === 'fixed'
											? `₪${service.pricing.amount}`
											: service.pricing.type === 'starting'
												? `From ₪${service.pricing.amount}`
												: 'Request Quote'}
									</Typography>
								</Stack>
															</Stack>

															{/* CTA Button */}
															<Button
																component={Link}
																href={`/services/${service.slug}`}
																variant="outlined"
																endIcon={<IconArrowRight size={18} />}
																fullWidth
															>
																View Details
															</Button>
														</Stack>
													</CardContent>
												</Card>
											</Grid>
										))}
									</Grid>
								</Stack>
							</RevealSection>
						</Container>
					</Box>
				);
			})}

			{/* CTA Section */}
			<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
				<RevealSection delay={0.4} direction="up">
					<Card
						backgroundColor={{ light: '#0E21A0', dark: '#0E21A0' }}
						borderColor={{ light: '#3949B1', dark: '#3949B1' }}
						gradientColor={{ light: '#3949B1', dark: '#3949B1' }}
						gradientOpacity={0.6}
					>
						<CardContent
							sx={{
								p: { xs: 4, md: 6 },
								textAlign: 'center',
							}}
						>
							<Stack spacing={4} alignItems="center">
								<Stack spacing={2} alignItems="center" maxWidth={720}>
								<Typography variant="h3" color="#ffffff">
									Can&apos;t find what you&apos;re looking for?
								</Typography>
									<Typography variant="h6" color="rgba(255, 255, 255, 0.9)">
										We handle a wide range of government services. Contact us to
										discuss your specific requirements.
									</Typography>
								</Stack>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
									justifyContent="center"
								>
									<Button
										component={Link}
										href="/contact"
										variant="contained"
										size="large"
										sx={{
											backgroundColor: '#ffffff',
											color: '#0E21A0',
											'&:hover': {
												backgroundColor: '#f5f5f5',
											},
										}}
									>
										Contact Us
									</Button>
									<Button
										component={Link}
										href="/track"
										variant="outlined"
										size="large"
										sx={{
											borderColor: '#ffffff',
											color: '#ffffff',
											'&:hover': {
												borderColor: '#f5f5f5',
												backgroundColor: 'rgba(255, 255, 255, 0.1)',
											},
										}}
									>
										Track Your Order
									</Button>
								</Stack>
							</Stack>
						</CardContent>
					</Card>
				</RevealSection>
			</Container>
		</Box>
	);
}

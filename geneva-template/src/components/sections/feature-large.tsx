import {
	Box,
	CardContent,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { IconCheck } from '@tabler/icons-react';

import { Card } from '@/components/ui/card';
import Image from '@/components/ui/image';

import GetStarted from '@/components/buttons/get-started-button';
import VideoButton from '@/components/buttons/video-button';
import RevealSection from '@/components/ui/reveal-section';

// Put Section Headline here
const headline = `Build resilient language access programs`;

// Put Video url here
const videoUrl = 'https://www.youtube.com/watch?v=LXb3EKWsInQ';

// Put Section items here
const features: string[] = [
	`Centralize interpreter onboarding, credentialing, and renewals.`,
	`Keep agencies informed with automated notifications and reminders.`,
	`Monitor SLAs, performance metrics, and service quality in real-time.`,
	`Hand off billing, compliance, and reporting to Tasheel’s workflows.`,
];

const primaryCta = {
	label: 'Launch your program',
	href: '/contact',
};

export default function FeatureLarge() {
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Card>
					<CardContent
						sx={{
							pt: { xs: 5, md: 10 },
							paddingBottom: { xs: '50px !important', md: '100px !important' },
						}}
					>
						<Box>
							<Grid
								alignItems={'center'}
								container
								spacing={5}
								sx={{
									flexWrap: {
										xs: 'wrap',
										md: 'nowrap',
									},
								}}
							>
								<Grid
									size={{
										xs: 12,
										md: 6,
										lg: 'auto',
									}}
								>
									<RevealSection delay={0.3} direction="left">
										<Box
											className="aspect-660/660"
											sx={{
												position: 'relative',
												width: '100%',
											}}
										>
											<Image
												darkImage="/dark/feature-large.png"
												lightImage="/light/feature-large.png"
												alt=""
											/>
										</Box>
									</RevealSection>
								</Grid>
								<Grid size={{ xs: 12, md: 'grow' }}>
									<RevealSection delay={0.5} direction="right">
										<Stack spacing={5} sx={{ pt: { md: 1 } }}>
											<Typography variant="h2">{headline}</Typography>
											<Stack spacing={1.5}>
												{features.map((feature, index) => (
													<Stack direction="row" spacing={1.125} key={index}>
														<Box sx={{ color: 'accent.main', pt: 0.5 }}>
															<IconCheck size={24} />
														</Box>
														<Typography
															color="textSecondary"
															variant="subtitle2"
														>
															{feature}
														</Typography>
													</Stack>
												))}
											</Stack>
											<Stack
												direction={{ xs: 'column', lg: 'row' }}
												spacing={2.5}
											>
												<GetStarted
													buttonLabel={primaryCta.label}
													href={primaryCta.href}
												/>
												<VideoButton url={videoUrl} />
											</Stack>
										</Stack>
									</RevealSection>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</RevealSection>
		</Container>
	);
}

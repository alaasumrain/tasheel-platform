import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import Mockup from '@/components/ui/mockup';
import RevealSection from '@/components/ui/reveal-section';

// Put headline here
const headline = `Built for individuals and businesses`;

// Put subheadline here
const subHeadline = `Whether you're renewing a license or managing corporate documents, Tasheel provides the tools you need.`;

// Put features items here
const features = [
	{
		title: `Complete request management`,
		content: `Submit multiple service requests, upload documents, and manage everything from a single dashboard with full audit trail.`,
		darkImage: '/dark/screenshot-01.jpg',
		lightImage: '/light/screenshot-01.jpg',
	},
	{
		title: `Mobile-first experience`,
		content: `Check status, receive notifications, and download completed documents from any device—desktop, mobile, or tablet.`,
		darkImage: '/dark/screenshot-02.jpg',
		lightImage: '/light/screenshot-02.jpg',
	},
	{
		title: `Insights and analytics`,
		content: `Track processing times, success rates, and spending across all your requests to optimize your document workflow.`,
		darkImage: '/dark/screenshot-03.jpg',
		lightImage: '/light/screenshot-03.jpg',
	},
];

export default function FeaturesList() {
	return (
		<Container id="industries" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack alignItems="center" spacing={{ xs: 4, md: 8 }}>
				<RevealSection delay={0.1} direction="up">
					<Container disableGutters sx={{ maxWidth: '720px !important' }}>
						<Stack spacing={2.5}>
							<Typography
								color="accent"
								textAlign={'center'}
								variant="subtitle1"
							>
								{headline}
							</Typography>
							<Typography textAlign={'center'} variant="h2">
								{subHeadline}
							</Typography>
						</Stack>
					</Container>
				</RevealSection>
				<Stack spacing={{ xs: 6.25, md: 12.5 }}>
					{features.map((feature, index) => (
						<RevealSection
							key={`reveal-${index}`}
							delay={0.3 + index * 0.2}
							direction={index % 2 === 0 ? 'left' : 'right'}
						>
							<FeatureItem
								key={index}
								{...feature}
								order={index % 2 === 0 ? 'image-first' : 'image-last'}
							/>
						</RevealSection>
					))}
				</Stack>
			</Stack>
		</Container>
	);
}

function FeatureItem({
	title,
	content,
	darkImage,
	lightImage,
	order,
}: {
	title: string;
	content: string;
	darkImage: string;
	lightImage: string;
	order: 'image-first' | 'image-last';
}) {
	return (
		<Box sx={{ px: { xs: 2.5, md: 0 }, width: '100%' }}>
			<Grid alignItems="center" container spacing={{ xs: 3.75, md: 7.5 }}>
				<Grid
					size={{ xs: 12, md: 5 }}
					order={{ xs: 2, md: order === 'image-first' ? 2 : 1 }}
				>
					<Stack
						spacing={1}
						sx={{
							alignItems: { xs: 'center', md: 'flex-start' },
							textAlign: { xs: 'center', md: 'left' },
						}}
					>
						<Typography variant="h3">{title}</Typography>
						<Typography color="text.secondary" variant="subtitle2">
							{content}
						</Typography>
					</Stack>
				</Grid>
				<Grid
					size={{ xs: 12, md: 7 }}
					order={{ xs: 1, md: order === 'image-first' ? 1 : 2 }}
				>
					<Box sx={{ mx: { xs: 'auto', md: 0 }, width: '100%' }}>
						<Mockup
							darkImage={darkImage}
							lightImage={lightImage}
							aspectRatio="680/440"
							borderRadius={24}
						/>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

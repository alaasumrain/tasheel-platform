import { Box, Container, Grid, Stack, Typography } from '@mui/material';

import Mockup from '@/components/ui/mockup';
import RevealSection from '@/components/ui/reveal-section';

// Put headline here
const headline = `Language services for every industry`;

// Put subheadline here
const subHeadline = `Equip government, healthcare, legal, and enterprise partners with tailored interpreter workflows.`;

// Put features items here
const features = [
	{
		title: `360° request visibility`,
		content: `Track every interpreter engagement, update, and SLA across stakeholders with audit-ready logs.`,
		darkImage: '/dark/screenshot-01.jpg',
		lightImage: '/light/screenshot-01.jpg',
	},
	{
		title: `Field-ready mobile tools`,
		content: `Let interpreters manage assignments, submit documentation, and confirm arrivals from any device.`,
		darkImage: '/dark/screenshot-02.jpg',
		lightImage: '/light/screenshot-02.jpg',
	},
	{
		title: `Analytics that drive policy`,
		content: `Surface service demand, fulfillment rates, and language coverage to inform resource planning.`,
		darkImage: '/dark/screenshot-03.jpg',
		lightImage: '/light/screenshot-03.jpg',
	},
];

export default function FeaturesList() {
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
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
		<Grid alignItems="center" container spacing={{ xs: 3.75, md: 7.5 }}>
			<Grid
				size={{ xs: 12, md: 5 }}
				order={{ xs: 2, md: order === 'image-first' ? 2 : 1 }}
			>
				<Stack spacing={1}>
					<Typography variant="h3">{title}</Typography>
					<Typography color="textSecondary" variant="subtitle2">
						{content}
					</Typography>
				</Stack>
			</Grid>
			<Grid
				size={{ xs: 12, md: 7 }}
				order={{ xs: 1, md: order === 'image-first' ? 1 : 2 }}
			>
				<Box sx={{ width: '100%' }}>
					<Mockup
						darkImage={darkImage}
						lightImage={lightImage}
						aspectRatio="680/440"
						borderRadius={24}
					/>
				</Box>
			</Grid>
		</Grid>
	);
}

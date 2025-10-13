import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material';

import GetStarted from '@/components/buttons/get-started-button';
import Mockup from '@/components/ui/mockup';
import RevealSection from '@/components/ui/reveal-section';

// Put Section Headline here
const headline = `One platform for language services`;

// Put Section Description here
const description = `Overcome language barriers with AI-orchestrated scheduling, on-demand interpreting, and compliant translation workflows.`;

// Put Section TrustedBy here
const trustedBy = `Trusted by ministries, hospitals, and enterprises across the region`;

// Put primary CTA here
const primaryCta = {
	label: 'Book a demo',
	href: '/contact',
};

const secondaryCta = {
	label: 'Learn more',
	href: '/services',
};

// Put Section AvatarGroup here
const avatars: Avatar[] = [
	{
		alt: 'Interpreter spotlight',
		src: '/global/person-01.jpg',
	},
	{
		alt: 'Agency coordinator',
		src: '/global/person-02.jpg',
	},
	{
		alt: 'Remote interpreter',
		src: '/global/person-03.jpg',
	},
	{
		alt: 'Operations lead',
		src: '/global/person-04.jpg',
	},
];

interface Avatar {
	alt: string;
	src: string;
}

export default function Hero() {
	return (
		<Container sx={{ pt: { xs: 6, md: 10 }, pb: { md: 0 } }}>
			<Grid
				alignItems="center"
				container
				spacing={{ xs: 6, md: 8 }}
				sx={{ px: { xs: 3.75, md: 7.5 } }}
			>
				<Grid size={{ xs: 12, md: 6 }}>
					<Stack spacing={4}>
						<RevealSection delay={0.1}>
							<Stack spacing={2} sx={{ maxWidth: 640 }}>
								<Typography variant="h1">{headline}</Typography>
								<Typography color="text.secondary" variant="h6">
									{description}
								</Typography>
							</Stack>
						</RevealSection>
						<RevealSection delay={0.3}>
							<Stack spacing={3}>
								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
									<GetStarted
										buttonLabel={primaryCta.label}
										href={primaryCta.href}
									/>
									<Button
										component="a"
										href={secondaryCta.href}
										variant="outlined"
										color="secondary"
									>
										{secondaryCta.label}
									</Button>
								</Stack>
								<Stack
									alignItems={{ xs: 'flex-start', sm: 'center' }}
									direction={{ xs: 'column', sm: 'row' }}
									spacing={1.5}
								>
									<AvatarGroup
										max={4}
										sx={{ '& .MuiAvatar-root': { borderWidth: 4 } }}
									>
										{avatars.map((avatar, index) => (
											<Avatar alt={avatar.alt} src={avatar.src} key={index} />
										))}
									</AvatarGroup>
									<Typography color="text.secondary" variant="body1">
										{trustedBy}
									</Typography>
								</Stack>
							</Stack>
						</RevealSection>
					</Stack>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<RevealSection delay={0.4} direction="up" distance={60}>
						<Box sx={{ mx: { md: 'auto' }, maxWidth: 540, width: '100%' }}>
							<Mockup
								darkImage="/dark/hero.jpg"
								lightImage="/light/hero.jpg"
								aspectRatio="1271/831"
							/>
						</Box>
					</RevealSection>
				</Grid>
			</Grid>
		</Container>
	);
}

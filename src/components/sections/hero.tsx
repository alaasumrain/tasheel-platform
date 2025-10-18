'use client';

import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { Theme } from '@mui/material/styles';

import GetStarted from '@/components/buttons/get-started-button';
import Mockup from '@/components/ui/mockup';
import RevealSection from '@/components/ui/reveal-section';

// Put Section Headline here
const headline = `Your government services, simplified`;

// Put Section Description here
const description = `From driver's license renewals to document legalization—submit online, track progress, and receive completed services. No office visits required.`;

// Put Section TrustedBy here
const trustedBy = `Trusted by 5,000+ residents and 200+ businesses`;

// Put primary CTA here
const primaryCta = {
	label: 'Start a request',
	href: '/contact',
};

const secondaryCta = {
	label: 'Track my order',
	href: '/track',
};

// Put Section AvatarGroup here
const avatars: Avatar[] = [
	{
		alt: 'Tasheel government services specialist',
		src: '/global/person-01.jpg',
	},
	{
		alt: 'Document processing coordinator',
		src: '/global/person-02.jpg',
	},
	{
		alt: 'Client success manager',
		src: '/global/person-03.jpg',
	},
	{
		alt: 'Compliance and approvals lead',
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
						<RevealSection delay={0}>
							<Stack
								spacing={2}
								sx={{
									alignItems: { xs: 'center', md: 'flex-start' },
									maxWidth: 640,
									textAlign: { xs: 'center', md: 'left' },
								}}
							>
								<Typography variant="h1">{headline}</Typography>
								<Typography color="text.secondary" variant="h6">
									{description}
								</Typography>
							</Stack>
						</RevealSection>
						<RevealSection delay={0.15}>
							<Stack spacing={3}>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2.5}
									sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
								>
									<GetStarted
										buttonLabel={primaryCta.label}
										href={primaryCta.href}
										size="large"
										sx={{
											width: { xs: '100%', sm: 'auto' },
											boxShadow: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? '0px 18px 32px rgba(0,0,0,0.45)'
													: '0px 18px 36px rgba(31, 48, 146, 0.25)',
											fontWeight: 600,
										}}
									/>
									<Button
										component="a"
										href={secondaryCta.href}
										size="large"
										variant="contained"
										color="inherit"
										sx={{
											borderRadius: 999,
											px: 3.5,
											py: 1.25,
											width: { xs: '100%', sm: 'auto' },
											fontWeight: 600,
											boxShadow: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? '0px 16px 28px rgba(0,0,0,0.45)'
													: '0px 20px 32px rgba(15,25,55,0.12)',
											bgcolor: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? 'rgba(255,255,255,0.08)'
													: 'rgba(255,255,255,0.92)',
											color: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? theme.palette.common.white
													: theme.palette.text.primary,
											border: (theme: Theme) =>
												theme.palette.mode === 'dark'
													? '1px solid rgba(255,255,255,0.18)'
													: '1px solid rgba(15,25,55,0.08)',
											backdropFilter: 'blur(6px)',
											'&:hover': {
												bgcolor: (theme: Theme) =>
													theme.palette.mode === 'dark'
														? 'rgba(255,255,255,0.14)'
														: 'rgba(255,255,255,1)',
											},
										}}
									>
										{secondaryCta.label}
									</Button>
								</Stack>
								<Stack
									alignItems={{ xs: 'center', sm: 'center' }}
									direction={{ xs: 'column', sm: 'row' }}
									sx={{ textAlign: { xs: 'center', sm: 'left' } }}
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
					<RevealSection delay={0.2} direction="up" distance={60}>
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

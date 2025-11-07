'use client';

import {
	Box,
	Button,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import GetStarted from '@/components/buttons/get-started-button';
import RevealSection from '@/components/ui/reveal-section';

export default function Hero() {
	const t = useTranslations('Homepage.hero');
	
	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: { xs: '70vh', md: '85vh' },
				display: 'flex',
				alignItems: 'center',
				overflow: 'hidden',
			}}
		>
			{/* Background Image */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 0,
				}}
			>
				<Box
					component="img"
					src="/dark/hero.jpg"
					alt="Tasheel customer service team"
					sx={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						display: 'block',
					}}
				/>
			</Box>
			
			{/* Dark Overlay */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
					bgcolor: 'rgba(0, 0, 0, 0.55)',
				}}
			/>
			
			{/* Content */}
			<Container
				maxWidth="lg"
				sx={{
					position: 'relative',
					zIndex: 2,
					py: { xs: 8, md: 12 },
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
						<RevealSection delay={0}>
							<Stack
						spacing={4}
						sx={{
							alignItems: 'center',
							textAlign: 'center',
							maxWidth: { md: 800 },
							width: '100%',
						}}
					>
						<Stack spacing={2.5}>
							<Typography
								variant="h1"
								sx={{
									color: 'common.white',
									fontWeight: 700,
									fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
									lineHeight: 1.2,
								}}
							>
								{t('headline')}
							</Typography>
							<Typography
								variant="h6"
								sx={{
									color: 'rgba(255, 255, 255, 0.9)',
									fontSize: { xs: '1.25rem', md: '1.5rem' },
									fontWeight: 400,
								}}
							>
									{t('description')}
								</Typography>
							</Stack>
						
						<RevealSection delay={0.15}>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={{ xs: 3, sm: 6 }}
										sx={{
									alignItems: 'center',
									justifyContent: 'center',
										}}
							>
									<Button
									component={Link}
										href="/track"
										size="large"
									variant="outlined"
										sx={{
										borderRadius: 2,
										px: 4,
										py: 1.5,
										borderColor: 'common.white',
										color: 'common.white',
											fontWeight: 600,
										fontSize: '1rem',
											'&:hover': {
											borderColor: 'common.white',
											bgcolor: 'rgba(255, 255, 255, 0.1)',
											},
										}}
									>
										{t('secondaryCta')}
									</Button>
								<GetStarted
									buttonLabel={t('primaryCta')}
									href="/services"
									size="large"
									sx={{
										px: 4,
										py: 1.5,
										fontSize: '1rem',
										fontWeight: 600,
										boxShadow: (theme: Theme) =>
											theme.palette.mode === 'dark'
												? '0px 18px 32px rgba(0,0,0,0.45)'
												: '0px 18px 36px rgba(31, 48, 146, 0.25)',
									}}
								/>
							</Stack>
						</RevealSection>
					</Stack>
					</RevealSection>
		</Container>
		</Box>
	);
}

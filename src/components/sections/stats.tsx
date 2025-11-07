'use client';

import {
	Box,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

interface Stat {
	headline: string;
	description: string;
	color: boolean;
}

export default function Stats() {
	const t = useTranslations('Homepage.stats');
	const locale = useLocale();
	const isRTL = locale === 'ar';
	
	const statsRow1: Stat[] = [
		{
			headline: t('stat1'),
			description: t('stat1Desc'),
			color: true,
		},
		{
			headline: t('stat2'),
			description: t('stat2Desc'),
			color: false,
		},
		{
			headline: t('stat3'),
			description: t('stat3Desc'),
			color: false,
		},
	];
	const statsRow2: Stat[] = [
		{
			headline: t('stat4'),
			description: t('stat4Desc'),
			color: false,
		},
		{
			headline: t('stat5'),
			description: t('stat5Desc'),
			color: true,
		},
		{
			headline: t('stat6'),
			description: t('stat6Desc'),
			color: false,
		},
	];
	
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack spacing={{ xs: 4, md: 8 }}>
				<RevealSection delay={0.1} direction="up">
					<Box sx={{ px: { xs: 3.75, md: 7.5 } }}>
						<Grid container spacing={{ xs: 2, lg: 7.5 }}>
							<Grid size={{ xs: 12, lg: 6 }}>
								<Typography
									sx={{
										textAlign: { xs: 'center', lg: isRTL ? 'right' : 'left' },
										whiteSpace: 'pre-line',
									}}
									variant="h2"
								>
									{t('headline')}
								</Typography>
							</Grid>
							<Grid size={{ xs: 12, lg: 6 }}>
								<Stack
									spacing={3}
									sx={{ textAlign: { xs: 'center', lg: isRTL ? 'right' : 'left' } }}
								>
									<Typography
										color="text.secondary"
										component={'p'}
										variant="h6"
									>
										{t('description')}
									</Typography>
								</Stack>
							</Grid>
						</Grid>
					</Box>
				</RevealSection>
				<RevealSection delay={0.3} direction="up">
					<Stack spacing={{ xs: 2, md: 3 }}>
						<Box>
							<Grid container spacing={{ xs: 2, md: 3 }}>
								{statsRow1.map((stat, index) => (
									<Grid
										key={index}
										size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
										sx={{ height: '100%' }}
									>
										<StatItem stat={stat} />
									</Grid>
								))}
							</Grid>
						</Box>
						<Box>
							<Grid container spacing={{ xs: 2, md: 3 }}>
								{statsRow2.map((stat, index) => (
									<Grid
										key={index}
										size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
										sx={{ height: '100%' }}
									>
										<StatItem stat={stat} />
									</Grid>
								))}
							</Grid>
						</Box>
					</Stack>
				</RevealSection>
			</Stack>
		</Container>
	);
}

function StatItem({ stat }: { stat: Stat }) {
	return (
		<Stack
			sx={{
				height: '100%',
				transition: 'transform 0.3s ease-in-out',
				'&:hover': { transform: { md: 'scale(1.05)' } },
			}}
		>
			<Card
				backgroundColor={{
					light: stat.color ? 'accent.main' : 'background.paper',
					dark: stat.color ? 'success.main' : 'background.paper',
				}}
				borderColor={{
					light: stat.color ? 'accent.light' : 'divider',
					dark: stat.color ? 'success.main' : 'divider',
				}}
				borderRadius={24}
				gradientOpacity={stat.color ? 0.1 : undefined}
				gradientColor={{ light: 'divider', dark: 'divider' }}
				fullHeight
			>
				<CardContent
					sx={{
						height: '100%',
						p: { xs: 3, md: 4 },
						paddingBottom: { xs: '24px !important', md: '32px !important' },
					}}
				>
					<Stack spacing={1.5}>
						<Typography
							sx={[
								() => ({ color: stat.color ? 'accent.contrastText' : 'primary.main' }),
								(theme) =>
									theme.applyStyles('dark', {
										color: stat.color ? 'text.primary' : 'primary.main',
									}),
							]}
							variant="h3"
						>
							{stat.headline}
						</Typography>
						<Typography
							sx={[
								() => ({ color: stat.color ? 'accent.contrastText' : 'primary.main' }),
								(theme) =>
									theme.applyStyles('dark', {
										color: stat.color ? 'text.secondary' : 'primary.main',
									}),
							]}
							variant="subtitle1"
						>
							{stat.description}
						</Typography>
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}

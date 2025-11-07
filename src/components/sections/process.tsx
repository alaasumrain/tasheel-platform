'use client';

import {
	Box,
	CardContent,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

interface Item {
	title: string;
	content: string;
	number: number;
}

export default function Process() {
	const t = useTranslations('Homepage.process');
	
	const items: Item[] = [
		{
			number: 1,
			title: t('step1Title'),
			content: t('step1Content'),
		},
		{
			number: 2,
			title: t('step2Title'),
			content: t('step2Content'),
		},
		{
			number: 3,
			title: t('step3Title'),
			content: t('step3Content'),
		},
		{
			number: 4,
			title: t('step4Title'),
			content: t('step4Content'),
		},
	];
	
	return (
		<Container sx={{ py: { xs: 6.25, md: 12.5 }, pt: { xs: 10, md: 16 } }}>
			<RevealSection delay={0.1} direction="up">
				<Card
				backgroundColor={{ light: 'accent.main', dark: 'accent.main' }}
				gradientColor={{ light: 'accent.light', dark: 'accent.light' }}
				borderColor={{ light: 'accent.light', dark: 'accent.light' }}
				gradientOpacity={0.6}
			>
				<CardContent
					sx={{
						p: { xs: 6.25, md: 12.5 },
						paddingBottom: { xs: '50px !important', md: '100px !important' },
					}}
				>
					<Stack spacing={2}>
						<RevealSection delay={0.3} direction="up">
							<Typography color="accent.contrastText" variant="h3" textAlign="center">
								{t('headline')}
							</Typography>
						</RevealSection>
						<RevealSection delay={0.5} direction="up">
							<Box>
								<Grid container spacing={{ xs: 2.5, md: 5 }}>
								{items.map((item, index) => (
									<ProcessItem key={index} {...item} />
								))}
							</Grid>
							</Box>
						</RevealSection>
					</Stack>
				</CardContent>
			</Card>
			</RevealSection>
		</Container>
	);
}

function ProcessItem({ title, content, number }: Item) {
	return (
		<Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
			<Stack alignItems="center" sx={{ px: { xs: 2, md: 0 } }}>
				<Box sx={{ mb: { xs: -4, md: -10 } }}>
					<Typography
						component="span"
						textAlign="center"
						sx={(theme) => ({
							background: `linear-gradient(180deg, ${theme.palette.accent.light} 28%, ${theme.palette.accent.light}00 72%)`,
							backgroundClip: 'text',
							fontSize: { xs: '6rem', md: '11.25rem' },
							fontWeight: 'bold',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						})}
					>
						{number}
					</Typography>
				</Box>
				<Stack spacing={1.5}>
					<Typography color="accent.contrastText" textAlign="center" variant="h5">
						{title}
					</Typography>
					<Typography color="accent.contrastText" textAlign="center">
						{content}
					</Typography>
				</Stack>
			</Stack>
		</Grid>
	);
}

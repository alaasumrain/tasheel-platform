'use client';

import { useState } from 'react';
import {
	Button,
	CardContent,
	Collapse,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import { IconPlus as IconExpand } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

interface Item {
	question: string;
	answer: string;
}

export default function Faq() {
	const t = useTranslations('Homepage.faq');
	
	const items: Item[] = [
		{
			question: t('question1'),
			answer: t('answer1'),
		},
		{
			question: t('question2'),
			answer: t('answer2'),
		},
		{
			question: t('question3'),
			answer: t('answer3'),
		},
		{
			question: t('question4'),
			answer: t('answer4'),
		},
		{
			question: t('question5'),
			answer: t('answer5'),
		},
		{
			question: t('question6'),
			answer: t('answer6'),
		},
		{
			question: t('question7'),
			answer: t('answer7'),
		},
	];
	
	return (
		<Container id="faq" maxWidth="md" sx={{ py: { xs: 5, md: 12.5 } }}>
			<RevealSection delay={0.1} direction="up">
				<Stack spacing={{ xs: 4, md: 8 }}>
				<Stack spacing={1.5}>
					<Typography
						color="accent"
						textAlign="center"
						sx={{ whiteSpace: 'pre-line' }}
						variant="subtitle1"
					>
						{t('headline')}
					</Typography>
					<Typography textAlign="center" variant="h2">
						{t('subHeadline')}
					</Typography>
				</Stack>
				<Stack spacing={2}>
					{items.map((item) => (
						<FaqItem
							key={item.question}
							question={item.question}
							answer={item.answer}
						/>
					))}
				</Stack>
				</Stack>
			</RevealSection>
		</Container>
	);
}

function FaqItem({ question, answer }: Item) {
	const [open, setOpen] = useState(false);
	return (
		<Card
			backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
			borderColor={{ light: 'divider', dark: 'divider' }}
			borderRadius={24}
			gradientColor={{ light: 'divider', dark: 'divider' }}
			gradientOpacity={0.1}
			gradientSize={200}
		>
			<CardContent
				sx={{
					px: { xs: 3, md: 4 },
					py: { xs: 2, md: 3 },
					paddingBottom: { xs: '16px !important', md: '24px !important' },
				}}
			>
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					spacing={2}
				>
					<Typography variant="h5">{question}</Typography>
					<Button
						color="secondary"
						onClick={() => setOpen(!open)}
						sx={{
							px: 2,
							minWidth: 'auto',
							transform: open ? 'rotate(225deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease-in-out',
						}}
					>
						<IconExpand size={24} />
					</Button>
				</Stack>
				<Collapse in={open} timeout="auto">
					<Typography color="textSecondary" sx={{ mt: 2 }} variant="subtitle1">
						{answer}
					</Typography>
				</Collapse>
			</CardContent>
		</Card>
	);
}

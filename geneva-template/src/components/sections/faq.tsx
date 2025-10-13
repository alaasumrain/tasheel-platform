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
import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

// Put Section Headline here
const headline = `Frequently asked`;

// Put Section SubHeadline here
const subHeadline = `Everything you need to know about Tasheel’s language access suite`;

// Put Section Items here
const items: Item[] = [
	{
		question: 'Does Tasheel support on-demand and scheduled services?',
		answer: `Yes. Tasheel routes on-demand requests to available interpreters while managing scheduled appointments with calendar integrations.`,
	},
	{
		question: 'Can we integrate Tasheel with our HR and finance systems?',
		answer: `Tasheel integrates with major HRIS, payroll, and accounting platforms. Enterprise plans include custom connectors.`,
	},
	{
		question: 'How long does implementation take?',
		answer: `Pilot agencies can be live in under four weeks. Larger networks typically deploy within 60-90 days.`,
	},
	{
		question: 'Is interpreter onboarding handled in the platform?',
		answer: `Tasheel manages credential uploads, approvals, renewals, and reminders so coordinators always know who is eligible to work.`,
	},
	{
		question: 'What support is included?',
		answer: `All plans include help center access and live chat. Growth and Enterprise tiers add dedicated success resources.`,
	},
];

interface Item {
	question: string;
	answer: string;
}

export default function Faq() {
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
						{headline}
					</Typography>
					<Typography textAlign="center" variant="h2">
						{subHeadline}
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
			backgroundColor={{ light: 'rgba(255, 255, 255, 0.5)', dark: '#282828' }}
			borderColor={{ light: '#fff', dark: '#555' }}
			borderRadius={24}
			gradientColor={{ light: '#eee', dark: '#555' }}
			gradientOpacity={0.2}
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

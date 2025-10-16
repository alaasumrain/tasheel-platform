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
const subHeadline = `Everything you need to know about Tasheel's government services`;

// Put Section Items here
const items: Item[] = [
	{
		question: 'How long does document attestation take?',
		answer: `Processing time varies by service and country. Palestinian Ministry of Foreign Affairs and Expatriates (MOFAE) attestation typically takes 5-7 business days. Foreign document attestation (home country + Palestinian embassy + MOFAE) takes 10-20 business days depending on the country. Express service is available for urgent requests.`,
	},
	{
		question: 'Do you offer free pickup and delivery?',
		answer: `Yes! We offer free document pickup and delivery within Ramallah and Bethlehem. For other West Bank cities or Gaza, we can arrange insured courier service at a nominal fee. After you submit a quote request, our team will coordinate pickup at your convenience.`,
	},
	{
		question: 'Can I track my order status online?',
		answer: `Absolutely. Once your order is confirmed, you&apos;ll receive a tracking number. Visit our Track Status page or use the link in your confirmation email to see real-time updates. You&apos;ll also receive SMS and email notifications at every stage of processing.`,
	},
	{
		question: 'What documents do I need for driver\'s license renewal?',
		answer: `You&apos;ll need: copy of your existing driver&apos;s license, Palestinian ID card, passport copy, and a recent vision test certificate (we can arrange this for you). If you&apos;re employed, you may also need a no objection letter from your sponsor. Our team will verify all requirements when you submit your request.`,
	},
	{
		question: 'What payment methods do you accept?',
		answer: `We accept cash, credit/debit cards, bank transfers, and online payments. Payment is typically required after we provide you with a detailed quote and before we begin processing. For corporate clients, we offer invoice-based billing with NET 30 terms.`,
	},
	{
		question: 'Is express service available for urgent requests?',
		answer: `Yes, express processing is available for most services. Priority attestation can be completed in 2-3 business days, and same-day service is available for specific Ramallah-based ministries. Express fees vary by service type—request a quote for exact pricing and turnaround times.`,
	},
	{
		question: 'How secure is my personal information and documents?',
		answer: `We take security seriously. All documents are handled by verified staff, stored in secure facilities, and transported via insured courier. Your digital information is encrypted and stored on secure servers. We never share your personal data with third parties without your explicit consent.`,
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

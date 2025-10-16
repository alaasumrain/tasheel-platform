import Link from 'next/link';
import {
	Box,
	Button,
	CardContent,
	Container,
	Grid,
	Stack,
	Typography,
} from '@mui/material';

import { Card } from '@/components/ui/card';
import RevealSection from '@/components/ui/reveal-section';

interface Service {
	title: string;
	description: string;
	href?: string;
}

const services: Service[] = [
	{
		title: 'Legal Translation',
		description:
			'Specialized translation of contracts, affidavits, and court filings with legal-grade accuracy.',
	},
	{
		title: 'Certified Translation',
		description:
			'Official translations packaged with certification statements for government and academic submissions.',
	},
	{
		title: 'Professional Translation',
		description:
			'High-quality localization for business, marketing, and technical content without certification requirements.',
	},
	{
		title: 'Notarized Translation',
		description:
			'Notary-verified translations that meet legal authenticity standards for cross-border use.',
	},
	{
		title: 'Document Attestation & Legalization',
		description:
			'Coordinate ministry, embassy, and consular authentication to make documents valid internationally.',
	},
	{
		title: 'Embassy Services',
		description:
			'Application support, appointment scheduling, and document preparation for embassy interactions.',
	},
	{
		title: 'Ministries Services',
		description:
			'Liaise with government ministries to expedite permits, certificates, and official records.',
	},
	{
		title: 'Municipality Services',
		description:
			'City and municipal paperwork assistance, from registrations to service requests.',
	},
	{
		title: 'Corporate Services',
		description:
			'Corporate filings, HR documentation, and compliance support for growing businesses.',
	},
	{
		title: 'Apostille Service',
		description:
			'Authenticate public documents under Hague Convention requirements for international recognition.',
	},
	{
		title: 'Police Certificate & Good Conduct',
		description:
			'End-to-end handling of police clearance certificates and non-conviction reports.',
	},
	{
		title: 'Driving License (Local & International)',
		description:
			'Process local renewals and secure international driving permits without leaving the office.',
	},
];

export default function ServicesCatalog() {
	return (
		<Container id="services" sx={{ py: { xs: 6.25, md: 12.5 } }}>
			<Stack spacing={{ xs: 3, md: 4 }} sx={{ textAlign: 'center', mb: 6 }}>
				<Typography color="accent" variant="subtitle1">
					Tasheel services
				</Typography>
				<Typography variant="h2">
					A complete partner for legalization, translation, and government workflows
				</Typography>
				<Typography color="text.secondary" variant="h6">
					Choose the service you need and our team will handle the rest—from paperwork to final delivery.
				</Typography>
			</Stack>
			<Grid container spacing={{ xs: 2.5, md: 3.5 }}>
				{services.map((service, index) => (
					<Grid key={service.title} xs={12} sm={12} lg={4}>
						<RevealSection delay={0.1 + index * 0.05} direction="up">
							<Card
								borderRadius={24}
								backgroundColor={{ light: 'rgba(255,255,255,0.8)', dark: '#1F1F2B' }}
								borderColor={{ light: '#fff', dark: '#2F2F3B' }}
							>
								<CardContent
									sx={{
										display: 'flex',
										flexDirection: 'column',
										height: '100%',
										gap: 2,
									}}
								>
									<Stack spacing={1.5} sx={{ flexGrow: 1 }}>
										<Typography variant="h5">{service.title}</Typography>
										<Typography color="text.secondary" variant="body1">
											{service.description}
										</Typography>
									</Stack>
									<Box>
										<Button
											component={Link}
											href={service.href ?? '/contact'}
											size="large"
										>
											Get started
										</Button>
									</Box>
								</CardContent>
							</Card>
							</RevealSection>
						</Grid>
					))}
			</Grid>
		</Container>
	);
}

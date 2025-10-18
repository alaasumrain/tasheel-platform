import { notFound } from 'next/navigation';
import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

import { getServiceBySlug } from '@/data/services';
import { Card } from '@/components/ui/card';
import ServiceQuoteWizard from '@/components/forms/service-quote-wizard';
import ServiceQuoteSidebar from '@/components/sections/service-quote-sidebar';
import RevealSection from '@/components/ui/reveal-section';


interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const service = getServiceBySlug(slug);

	if (!service) {
		return {
			title: 'Service Not Found',
		};
	}

	return {
		title: `Request Quote - ${service.title} | Tasheel`,
		description: `Get a personalized quote for ${service.title}. ${service.shortDescription}`,
	};
}

export default async function QuotePage({ params }: PageProps) {
	const { slug } = await params;
	const service = getServiceBySlug(slug);

	if (!service) {
		notFound();
	}

	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
			<Container sx={{ pt: { xs: 3, md: 6 }, pb: { xs: 6.25, md: 12.5 } }}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4}>
						{/* Back Button */}
						<Link
							href={`/services/${service.slug}`}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								textDecoration: 'none',
								color: 'inherit',
								width: 'fit-content',
							}}
						>
							<IconArrowLeft size={20} />
							<Typography variant="body2">Back to {service.title}</Typography>
						</Link>

						{/* Header */}
						<Stack spacing={2}>
							<Typography
								variant="overline"
								color="accent"
								sx={{ textTransform: 'uppercase' }}
							>
								Request a Quote
							</Typography>
							<Typography variant="h2">Get your personalized quote</Typography>
							<Typography variant="h6" color="text.secondary" maxWidth={720}>
								Fill out the form below and our team will get back to you within 2
								hours with a detailed quote and next steps.
							</Typography>
						</Stack>

						{/* Main Content */}
						<Grid container spacing={{ xs: 4, md: 6 }}>
							{/* Form */}
							<Grid size={{ xs: 12, md: 7 }}>
								<Card borderRadius={24}>
									<Box sx={{ p: { xs: 3, md: 4 } }}>
										<ServiceQuoteWizard service={service} />
									</Box>
								</Card>
							</Grid>

							{/* Sidebar */}
							<Grid size={{ xs: 12, md: 5 }}>
								<ServiceQuoteSidebar service={service} />
							</Grid>
						</Grid>

						{/* Footer Note */}
						<Box
							sx={{
								p: 3,
								backgroundColor: 'background.paper',
								borderRadius: 3,
								border: 1,
								borderColor: 'divider',
							}}
						>
							<Stack spacing={1}>
								<Typography variant="subtitle2" fontWeight={600}>
									What happens next?
								</Typography>
								<Typography variant="body2" color="text.secondary">
									1. Our team reviews your request within 2 hours
									<br />
									2. We contact you via phone or email with a detailed quote
									<br />
									3. Once approved, we begin processing your order
									<br />
									4. Track your order status anytime at tasheel.ps/track
								</Typography>
							</Stack>
						</Box>
					</Stack>
				</RevealSection>
			</Container>
		</Box>
	);
}

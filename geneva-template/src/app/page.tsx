import { Container, Stack, Typography } from '@mui/material';

import Faq from '@/components/sections/faq';
import FeaturesAccordion from '@/components/sections/features-accordion';
import FeaturesGrid from '@/components/sections/features-grid';
import FeaturesSlider from '@/components/sections/features-slider';
import FeaturesGridRemote from '@/components/sections/features-grid-remote';
import FeatureLarge from '@/components/sections/feature-large';
import FeaturesList from '@/components/sections/features-list';
import Hero from '@/components/sections/hero';
import Partners from '@/components/sections/partners';
import PricingPlans from '@/components/sections/pricing-plans-stripe';
import Process from '@/components/sections/process';
import Reviews from '@/components/sections/reviews';
import ServicesCatalog from '@/components/sections/services-catalog';
import Stats from '@/components/sections/stats';
import Testimonials from '@/components/sections/testimonials';
import Video from '@/components/sections/video';

export default function Page() {
	return (
		<>
			<Hero />
			<Partners />
			<Container sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
				<Stack spacing={2}>
					<Typography color="accent" variant="subtitle1">
						Language Interpreter Services &amp; Management System
					</Typography>
					<Typography variant="h2">
						Everything agencies need to deliver language access at scale
					</Typography>
					<Typography color="text.secondary" variant="h6">
						Centralize scheduling, interpreter onboarding, billing, and compliance while giving customers a seamless request experience.
					</Typography>
				</Stack>
			</Container>
			<FeaturesGrid />
			<FeaturesGridRemote />
			<ServicesCatalog />
			<Reviews />
			<Video />
			<FeatureLarge />
			<Stats />
			<Process />
			<FeaturesList />
			<FeaturesSlider />
			<FeaturesAccordion />
			<Testimonials />
			<PricingPlans />
			<Faq />
		</>
	);
}

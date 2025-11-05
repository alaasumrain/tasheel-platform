import { setRequestLocale, getTranslations } from 'next-intl/server';
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
import RevealSection from '@/components/ui/reveal-section';

export default async function Page() {
	setRequestLocale('en');
	const t = await getTranslations('Homepage.intro');
	return (
		<>
			<Hero />
			<Partners />
			<Container sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
				<RevealSection delay={0.1}>
					<Stack spacing={2}>
						<Typography color="accent" variant="subtitle1">
							{t('subtitle')}
						</Typography>
						<Typography variant="h2">
							{t('title')}
						</Typography>
						<Typography color="text.secondary" variant="h6">
							{t('description')}
						</Typography>
					</Stack>
				</RevealSection>
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

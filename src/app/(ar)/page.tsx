import { setRequestLocale } from 'next-intl/server';

import Hero from '@/components/sections/hero';
import WhyUs from '@/components/sections/why-us';
import Stats from '@/components/sections/stats';
import ServicesCatalog from '@/components/sections/services-catalog';
import Process from '@/components/sections/process';
import ServiceDetails from '@/components/sections/service-details';
import Reviews from '@/components/sections/reviews';
import Faq from '@/components/sections/faq';
import HomepageContact from '@/components/sections/homepage-contact';

export default async function Page() {
	setRequestLocale('ar');
	return (
		<>
			<Hero />
			<WhyUs />
			<Stats />
			<ServicesCatalog />
			<Process />
			<ServiceDetails />
			<Reviews />
			<Faq />
			<HomepageContact />
		</>
	);
}

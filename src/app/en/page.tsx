import { setRequestLocale } from 'next-intl/server';

import Hero from '@/components/sections/hero';
import WhyUs from '@/components/sections/why-us';
import ServicesCatalog from '@/components/sections/services-catalog';
import ServiceDetails from '@/components/sections/service-details';
import Process from '@/components/sections/process';
import Stats from '@/components/sections/stats';
import Reviews from '@/components/sections/reviews';
import Faq from '@/components/sections/faq';
import HomepageContact from '@/components/sections/homepage-contact';

export default async function Page() {
	setRequestLocale('en');
	return (
		<>
			<Hero />
			<WhyUs />
			<ServicesCatalog />
			<ServiceDetails />
			<Process />
			<Stats />
			<Reviews />
			<Faq />
			<HomepageContact />
		</>
	);
}

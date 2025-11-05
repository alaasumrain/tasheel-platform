import { setRequestLocale } from 'next-intl/server';
import ServicesOverview from '@/components/sections/services-overview';


export const metadata = {
	title: 'Our Services | Tasheel Government Services',
	description:
		'Complete government services including driver\'s license renewal, document attestation, translation, legalization, and business registration. Submit online and track progress.',
	keywords:
		'government services Palestine, Ramallah, driver license renewal, document attestation, translation services, MOFAE attestation, embassy legalization, business registration',
};

export default async function Page() {
	setRequestLocale('ar');
	return <ServicesOverview />;
}

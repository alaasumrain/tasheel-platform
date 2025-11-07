import { setRequestLocale, getTranslations } from 'next-intl/server';
import ServicesOverview from '@/components/sections/services-overview';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
	const t = await getTranslations('Metadata.home');
	return {
		title: t('title'),
		description: t('description'),
	keywords:
		'government services Palestine, Ramallah, driver license renewal, document attestation, translation services, MOFAE attestation, embassy legalization, business registration',
};
}

export default async function Page() {
	setRequestLocale('en');
	return <ServicesOverview />;
}

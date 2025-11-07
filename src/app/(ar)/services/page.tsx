import { setRequestLocale, getTranslations } from 'next-intl/server';
import ServicesOverview from '@/components/sections/services-overview';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
	const t = await getTranslations('Metadata.home');
	return {
		title: t('title'),
		description: t('description'),
	keywords:
			'خدمات حكومية فلسطين، رام الله، تجديد رخصة قيادة، تصديق وثائق، خدمات ترجمة، تصديق الخارجية، تصديق سفارة، تسجيل أعمال',
};
}

export default async function Page() {
	setRequestLocale('ar');
	return <ServicesOverview />;
}

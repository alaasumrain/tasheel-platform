import { getLocale, getTranslations } from 'next-intl/server';

import { getAllServices, getServiceCategories } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import type { Service as DBService } from '@/lib/types/service';
import ServicesCatalogWithSearch from './services-catalog-with-search';

export default async function ServicesOverview() {
	const locale = (await getLocale()) as 'en' | 'ar';
	const tServices = await getTranslations('Services');
	const servicesFromDB = await getAllServices();
	const categoriesFromDB = await getServiceCategories();

	// Convert DB services to legacy format for component compatibility
	const services = servicesFromDB.map((s) => convertToLegacyFormat(s, locale));

	// Map categories to expected format with locale support
	const serviceCategories = categoriesFromDB.map((cat) => ({
		slug: cat.slug,
		name: locale === 'ar' ? (cat.name_ar || cat.name) : cat.name,
		description: locale === 'ar'
			? (cat.description_ar || cat.headline_ar || cat.description || cat.headline || '')
			: (cat.description || cat.headline || ''),
	}));

	return (
		<ServicesCatalogWithSearch
			services={services}
			originalServices={servicesFromDB}
			categories={serviceCategories}
			locale={locale}
		/>
	);
}

import { notFound } from 'next/navigation';
import { getServiceBySlug as getServiceFromDB } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import ServiceDetail from '@/components/sections/service-detail';

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Generate static params for all services
export async function generateStaticParams() {
	const { getAllServices } = await import('@/lib/service-queries');
	const services = await getAllServices();
	return services.map((service) => ({
		slug: service.slug,
	}));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
	const { setRequestLocale, getTranslations } = await import('next-intl/server');
	setRequestLocale('ar');
	const t = await getTranslations('Services');
	const resolvedParams = await params;
	const service = await getServiceFromDB(resolvedParams.slug);

	if (!service) {
		return {
			title: t('notFound'),
		};
	}

	const legacyService = convertToLegacyFormat(service, 'ar');

	return {
		title: `${legacyService.title} | ${t('title')}`,
		description: legacyService.shortDescription,
		keywords: [
			legacyService.title,
			legacyService.category,
			'فلسطين',
			'رام الله',
			'خدمات حكومية',
			'معالجة وثائق',
		].join(', '),
	};
}

export default async function Page({ params }: PageProps) {
	const { setRequestLocale } = await import('next-intl/server');
	setRequestLocale('ar');
	
	const resolvedParams = await params;
	const service = await getServiceFromDB(resolvedParams.slug);

	if (!service) {
		notFound();
	}

	const legacyService = convertToLegacyFormat(service, 'ar');
	return <ServiceDetail service={legacyService} />;
}

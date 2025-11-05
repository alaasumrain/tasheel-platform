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
	const { setRequestLocale } = await import('next-intl/server');
	setRequestLocale('en');
	const resolvedParams = await params;
	const service = await getServiceFromDB(resolvedParams.slug);

	if (!service) {
		const { getTranslations } = await import('next-intl/server');
		const t = await getTranslations('Services');
		return {
			title: t('notFound'),
		};
	}

	const legacyService = convertToLegacyFormat(service, 'en');

	return {
		title: `${legacyService.title} | Tasheel Government Services`,
		description: legacyService.shortDescription,
		keywords: [
			legacyService.title,
			legacyService.category,
			'Palestine',
			'Ramallah',
			'government services',
			'document processing',
		].join(', '),
	};
}

export default async function Page({ params }: PageProps) {
	const { setRequestLocale } = await import('next-intl/server');
	setRequestLocale('en');
	
	const resolvedParams = await params;
	const service = await getServiceFromDB(resolvedParams.slug);

	if (!service) {
		notFound();
	}

	const legacyService = convertToLegacyFormat(service, 'en');
	return <ServiceDetail service={legacyService} />;
}

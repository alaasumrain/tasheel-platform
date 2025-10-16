import { notFound } from 'next/navigation';
import { getServiceBySlug, services } from '@/data/services';
import ServiceDetail from '@/components/sections/service-detail';


interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Generate static params for all services
export async function generateStaticParams() {
	return services.map((service) => ({
		slug: service.slug,
	}));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
	const resolvedParams = await params;
	const service = getServiceBySlug(resolvedParams.slug);

	if (!service) {
		return {
			title: 'Service Not Found',
		};
	}

	return {
		title: `${service.title} | Tasheel Government Services`,
		description: service.shortDescription,
		keywords: [
			service.title,
			service.category,
			'Palestine',
			'Ramallah',
			'government services',
			'document processing',
		].join(', '),
	};
}

export default async function Page({ params }: PageProps) {
	const resolvedParams = await params;
	const service = getServiceBySlug(resolvedParams.slug);

	if (!service) {
		notFound();
	}

	return <ServiceDetail service={service} />;
}

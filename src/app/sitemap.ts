import { MetadataRoute } from 'next';
import { getAllServices } from '@/lib/service-queries';

/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml with all public pages
 * Includes both Arabic and English versions of all pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tasheel.ps';

	// Fetch all services from database
	let services: any[] = [];
	try {
		services = await getAllServices();
	} catch (error) {
		console.error('Error fetching services for sitemap:', error);
	}

	// Static routes - Arabic (default locale)
	const arabicRoutes = [
		'',
		'/about',
		'/contact',
		'/services',
		'/pricing',
		'/track',
		'/news',
		'/statistics',
		'/privacy',
		'/terms',
		'/cookies',
		'/accessibility',
		'/security',
		'/service-channels',
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: route === '' ? 'daily' : 'weekly' as const,
		priority: route === '' ? 1.0 : 0.8,
		alternates: {
			languages: {
				ar: `${baseUrl}${route}`,
				en: `${baseUrl}/en${route}`,
			},
		},
	}));

	// Static routes - English
	const englishRoutes = [
		'/en',
		'/en/about',
		'/en/contact',
		'/en/services',
		'/en/pricing',
		'/en/track',
		'/en/news',
		'/en/statistics',
		'/en/privacy',
		'/en/terms',
		'/en/cookies',
		'/en/accessibility',
		'/en/security',
		'/en/service-channels',
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: route === '/en' ? 1.0 : 0.8,
	}));

	// Service pages - Arabic
	const arabicServiceRoutes = services.map((service) => ({
		url: `${baseUrl}/services/${service.slug}`,
		lastModified: new Date(service.updated_at || service.created_at),
		changeFrequency: 'monthly' as const,
		priority: 0.7,
		alternates: {
			languages: {
				ar: `${baseUrl}/services/${service.slug}`,
				en: `${baseUrl}/en/services/${service.slug}`,
			},
		},
	}));

	// Service pages - English
	const englishServiceRoutes = services.map((service) => ({
		url: `${baseUrl}/en/services/${service.slug}`,
		lastModified: new Date(service.updated_at || service.created_at),
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}));

	// Combine all routes
	return [
		...arabicRoutes,
		...englishRoutes,
		...arabicServiceRoutes,
		...englishServiceRoutes,
	];
}

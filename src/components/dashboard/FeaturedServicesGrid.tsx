'use client';

import { Grid2, Typography, Box } from '@mui/material';
import { useLocale } from 'next-intl';
import { useCurrency } from '@/contexts/currency-context';
import ServiceCard from '@/components/sections/service-card';
import type { Service } from '@/data/services';
import type { Service as DBService } from '@/lib/types/service';

interface FeaturedServicesGridProps {
	services: Service[];
	originalServices: DBService[];
	categories: Array<{ slug: string; name: string; description: string }>;
	locale: 'en' | 'ar';
	maxItems?: number;
}

/**
 * Client component that renders featured services in a grid
 * Uses ServiceCard component with currency formatter
 */
export function FeaturedServicesGrid({
	services,
	originalServices,
	categories,
	locale,
	maxItems = 8,
}: FeaturedServicesGridProps) {
	const { currency } = useCurrency();
	const currentLocale = useLocale() as 'en' | 'ar';

	// Create currency formatter
	const currencyFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
		style: 'currency',
		currency: currency === 'ILS' ? 'ILS' : currency === 'USD' ? 'USD' : 'EUR',
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: 0,
	});

	// Create map of original services by slug
	const originalServicesMap = new Map(originalServices.map(s => [s.slug, s]));

	// Limit services
	const displayServices = services.slice(0, maxItems);

	if (displayServices.length === 0) {
		return null;
	}

	return (
		<Grid2 container spacing={3} sx={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
			{displayServices.map((service) => {
				const originalService = originalServicesMap.get(service.slug);
				const category = categories.find(cat => cat.slug === service.category);
				const categoryLabel = category?.name || service.category;

				return (
					<Grid2 key={service.slug} size={{ xs: 12, sm: 6, md: 4 }}>
						<ServiceCard
							service={service}
							locale={locale}
							currencyFormatter={currencyFormatter}
							viewMode="grid"
							categoryLabel={categoryLabel}
							categories={categories}
							originalService={originalService}
						/>
					</Grid2>
				);
			})}
		</Grid2>
	);
}


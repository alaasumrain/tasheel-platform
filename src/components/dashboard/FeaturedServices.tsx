import { Box, Typography, Stack } from '@mui/material';
import { getFeaturedServices, getServiceCategories } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import type { Service as DBService } from '@/lib/types/service';
import { getLocale, getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { FeaturedServicesGrid } from './FeaturedServicesGrid';
import RevealSection from '@/components/ui/reveal-section';

interface FeaturedServicesProps {
	maxItems?: number;
	showTitle?: boolean;
}

/**
 * Server component that fetches and displays featured services
 * Reuses existing ServiceCard component
 */
export async function FeaturedServices({ maxItems = 8, showTitle = true }: FeaturedServicesProps) {
	const locale = (await getLocale()) as 'en' | 'ar';
	const t = await getTranslations('Dashboard.page');

	// Fetch featured services and categories
	const [featuredServicesFromDB, categoriesFromDB] = await Promise.all([
		getFeaturedServices(),
		getServiceCategories(),
	]);

	// Convert DB services to legacy format for ServiceCard compatibility
	const services = featuredServicesFromDB.map((s) => convertToLegacyFormat(s, locale));

	// Map categories to expected format with locale support
	const categories = categoriesFromDB.map((cat) => ({
		slug: cat.slug,
		name: locale === 'ar' ? (cat.name_ar || cat.name) : cat.name,
		description: locale === 'ar'
			? (cat.description_ar || cat.headline_ar || cat.description || cat.headline || '')
			: (cat.description || cat.headline || ''),
	}));

	if (services.length === 0) {
		return null;
	}

	return (
		<RevealSection delay={0.4} direction="up">
			<Stack spacing={3}>
				{showTitle && (
					<Typography variant="h5" fontWeight={700} sx={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
						{t('featuredServices')}
					</Typography>
				)}
				<FeaturedServicesGrid
					services={services}
					originalServices={featuredServicesFromDB}
					categories={categories}
					locale={locale}
					maxItems={maxItems}
				/>
			</Stack>
		</RevealSection>
	);
}


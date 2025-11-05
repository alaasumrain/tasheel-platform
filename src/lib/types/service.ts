// Service types matching database schema
export interface ProcessStep {
	number: number;
	title_en: string;
	title_ar: string;
	description_en: string;
	description_ar: string;
}

export interface Pricing {
	type: 'fixed' | 'quote' | 'starting';
	amount?: number;
	note_en?: string;
	note_ar?: string;
}

export interface Service {
	id: string;
	category_id: string;
	slug: string;
	name: string;
	name_en: string;
	name_ar: string;
	short_description?: string;
	short_description_en?: string;
	short_description_ar?: string;
	detailed_description?: string;
	description_en?: string;
	description_ar?: string;
	turnaround_window?: string;
	turnaround_days?: number;
	icon?: string;
	image_light?: string;
	image_dark?: string;
	required_documents?: string[];
	process_steps?: ProcessStep[];
	pricing?: Pricing;
	features?: string[];
	is_featured?: boolean;
	is_active?: boolean;
	sort_order?: number;
	created_at?: string;
	updated_at?: string;
}

// Legacy service type for backward compatibility during migration
export interface LegacyService {
	slug: string;
	title: string;
	category: 'government' | 'translation' | 'legalization' | 'business';
	shortDescription: string;
	description: string;
	icon: string;
	image: {
		light: string;
		dark: string;
	};
	processSteps: {
		number: number;
		title: string;
		description: string;
	}[];
	requiredDocuments: string[];
	pricing: {
		type: 'fixed' | 'quote' | 'starting';
		amount?: number;
		note?: string;
	};
	turnaroundTime: string;
	features: string[];
}

// Helper function to convert database service to legacy format
export function convertToLegacyFormat(service: Service, locale: 'en' | 'ar' = 'en'): LegacyService {
	const isArabic = locale === 'ar';
	
	return {
		slug: service.slug,
		title: isArabic ? service.name_ar : service.name_en,
		category: getCategorySlug(service.category_id),
		shortDescription: isArabic ? service.short_description_ar || '' : service.short_description_en || '',
		description: isArabic ? service.description_ar || '' : service.description_en || '',
		icon: service.icon || '',
		image: {
			light: service.image_light || '',
			dark: service.image_dark || '',
		},
		processSteps: (service.process_steps || []).map((step) => ({
			number: step.number,
			title: isArabic ? step.title_ar : step.title_en,
			description: isArabic ? step.description_ar : step.description_en,
		})),
		requiredDocuments: service.required_documents || [],
		pricing: {
			type: service.pricing?.type || 'quote',
			amount: service.pricing?.amount,
			note: isArabic ? service.pricing?.note_ar : service.pricing?.note_en,
		},
		turnaroundTime: service.turnaround_window || '',
		features: service.features || [],
	};
}

// Helper to get category slug from category_id
// Note: This uses a static map for now. In production, you might want to fetch from DB cache
function getCategorySlug(categoryId: string): 'government' | 'translation' | 'legalization' | 'business' {
	// Category ID to slug mapping (from database)
	const categoryMap: Record<string, 'government' | 'translation' | 'legalization' | 'business'> = {
		'172ca066-d4b5-4e3e-9758-e6c783128064': 'government',
		'20c51882-f009-4f38-abd6-bdb11f367f13': 'translation',
		'062a48a0-4146-41a7-bee1-49f4fb6d69d5': 'legalization',
		'9e6660b2-3111-434b-b11d-bf2e53ba1fc9': 'business',
	};
	return categoryMap[categoryId] || 'government';
}


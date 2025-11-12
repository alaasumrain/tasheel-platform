/**
 * Shipping rate calculation based on location and delivery type
 */

export type ShippingLocation = 'west_bank' | 'jerusalem' | 'area_48' | 'international';
export type DeliveryType = 'single' | 'multiple';

export interface ShippingRateConfig {
	location: ShippingLocation;
	deliveryType: DeliveryType;
	deliveryCount?: number; // For multiple deliveries, number of deliveries
}

/**
 * Shipping rate table:
 * - West Bank: 20 NIS (single), 15 NIS/delivery (multiple)
 * - Jerusalem: 30 NIS (single), 50 NIS/delivery (multiple)
 * - 48 Area: 70 NIS (single), 65 NIS/delivery (multiple)
 * - International: 200 NIS (flat rate)
 */
const SHIPPING_RATES: Record<ShippingLocation, { single: number; perDelivery: number }> = {
	west_bank: { single: 20, perDelivery: 15 },
	jerusalem: { single: 30, perDelivery: 50 },
	area_48: { single: 70, perDelivery: 65 },
	international: { single: 200, perDelivery: 200 }, // Flat rate for international
};

/**
 * Calculate shipping cost based on location and delivery type
 */
export function calculateShippingRate(config: ShippingRateConfig): number {
	const { location, deliveryType, deliveryCount = 1 } = config;
	const rates = SHIPPING_RATES[location];

	if (!rates) {
		return 0;
	}

	if (deliveryType === 'single') {
		return rates.single;
	}

	// For multiple deliveries, multiply per-delivery rate by delivery count
	// Minimum 2 deliveries for multiple type
	const count = Math.max(2, deliveryCount);
	return rates.perDelivery * count;
}

/**
 * Get shipping rate label for display
 */
export function getShippingLocationLabel(location: ShippingLocation, locale: 'en' | 'ar' = 'en'): string {
	const labels: Record<ShippingLocation, { en: string; ar: string }> = {
		west_bank: { en: 'West Bank', ar: 'الضفة الغربية' },
		jerusalem: { en: 'Jerusalem', ar: 'القدس' },
		area_48: { en: '48 Area', ar: 'المناطق المحتلة عام 48' },
		international: { en: 'International', ar: 'دولي' },
	};

	return labels[location]?.[locale] || location;
}

/**
 * Get delivery type label for display
 */
export function getDeliveryTypeLabel(deliveryType: DeliveryType, locale: 'en' | 'ar' = 'en'): string {
	if (locale === 'ar') {
		return deliveryType === 'single' ? 'تسليم واحد' : 'تسليمات متعددة';
	}
	return deliveryType === 'single' ? 'Single Delivery' : 'Multiple Deliveries';
}


'use server';

import { getOrderByNumber, getOrderEvents } from '@/lib/admin-queries';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { getTranslations } from 'next-intl/server';

export async function trackOrder(orderNumber: string, locale: string = 'en') {
	try {
		const t = await getTranslations({ locale, namespace: 'Homepage.track' });
		
		// Fetch order from Supabase
		const order = await getOrderByNumber(orderNumber);

		if (!order) {
			return {
				type: 'error' as const,
				message: t('orderNotFound'),
			};
		}

		// Fetch order events
		const events = await getOrderEvents(order.id);

		// Get service details from database
		const serviceFromDB = order.service_slug
			? await getServiceBySlug(order.service_slug)
			: null;

		const legacyService = serviceFromDB
			? convertToLegacyFormat(serviceFromDB, locale)
			: null;

		return {
			type: 'success' as const,
			data: {
				order,
				events,
				service: legacyService
					? {
							title: legacyService.title,
							category: legacyService.category,
						}
					: null,
			},
		};
	} catch (error) {
		console.error('Error tracking order:', error);
		const t = await getTranslations({ locale, namespace: 'Homepage.track' });
		return {
			type: 'error' as const,
			message: t('trackingError'),
		};
	}
}

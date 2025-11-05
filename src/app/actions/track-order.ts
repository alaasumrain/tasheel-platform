'use server';

import { getOrderByNumber, getOrderEvents } from '@/lib/admin-queries';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';

export async function trackOrder(orderNumber: string) {
	try {
		// Fetch order from Supabase
		const order = await getOrderByNumber(orderNumber);

		if (!order) {
			return {
				type: 'error' as const,
				message: 'Order not found. Please check your order number and try again.',
			};
		}

		// Fetch order events
		const events = await getOrderEvents(order.id);

		// Get service details from database
		const serviceFromDB = order.service_slug
			? await getServiceBySlug(order.service_slug)
			: null;

		const legacyService = serviceFromDB
			? convertToLegacyFormat(serviceFromDB, 'en')
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
		return {
			type: 'error' as const,
			message: 'An error occurred while tracking your order. Please try again.',
		};
	}
}

'use server';

import { getOrderByNumber, getOrderEvents } from '@/lib/admin-queries';
import { services } from '@/data/services';

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

		// Get service details
		const service = services.find((s) => s.slug === order.service_slug);

		return {
			type: 'success' as const,
			data: {
				order,
				events,
				service: service
					? {
							title: service.title,
							category: service.category,
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

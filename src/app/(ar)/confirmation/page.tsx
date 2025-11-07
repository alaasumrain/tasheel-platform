import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { OrderConfirmation } from '@/components/sections/order-confirmation';
import { getOrderByNumber } from '@/lib/admin-queries';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';

type PageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('Confirmation');
	return {
		title: t('title'),
		description: t('description'),
};
}

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: PageProps) {
	setRequestLocale('ar');
	const resolvedSearchParams = await searchParams;
	const orderParam = resolvedSearchParams?.order;
	const orderNumber = Array.isArray(orderParam) ? orderParam[0] : orderParam ?? null;

	if (!orderNumber) {
		return <OrderConfirmation locale="ar" orderFound={false} orderNumber={null} />;
	}

	try {
		const order = await getOrderByNumber(orderNumber);

		if (!order) {
			return <OrderConfirmation locale="ar" orderFound={false} orderNumber={orderNumber} />;
		}

		const serviceRecord = order.service_slug ? await getServiceBySlug(order.service_slug) : null;
		const service = serviceRecord
			? convertToLegacyFormat(serviceRecord, 'ar')
			: null;

		return (
			<OrderConfirmation
				locale="ar"
				orderFound
				orderNumber={orderNumber}
				customerName={order.customer_name}
				customerEmail={order.applicant_email}
				customerPhone={order.customer_phone}
				status={order.status}
				submittedAt={order.submitted_at}
				service={
					service
						? {
								slug: service.slug,
								title: service.title,
								category: service.category,
								pricingType: service.pricing.type,
								pricingAmount: service.pricing.amount,
								pricingNote: service.pricing.note,
								turnaroundTime: service.turnaroundTime,
							}
						: null
				}
			/>
		);
	} catch (error) {
		console.error('Failed to render confirmation page (ar):', error);
		return <OrderConfirmation locale="ar" orderFound={false} orderNumber={orderNumber} />;
	}
}

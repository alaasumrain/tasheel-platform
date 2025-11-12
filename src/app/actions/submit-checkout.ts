'use server';

import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { getServiceFields } from '@/lib/service-form-fields';
import { getServiceBySlug } from '@/lib/service-queries';
import { calculateShippingRate, type ShippingLocation, type DeliveryType } from '@/lib/shipping-rates';

export async function submitCheckout(formData: FormData): Promise<{
	type: 'success' | 'error';
	message: string;
	applicationId?: string;
	invoiceId?: string;
	orderNumber?: string;
}> {
	const locale = (formData.get('locale') as string) || 'en';
	
	try {
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const serviceSlug = formData.get('service') as string;
		const applicationId = formData.get('applicationId') as string;
		const urgency = formData.get('urgency') as string;
		const details = formData.get('details') as string;
		const additionalNotes = formData.get('message') as string;

		// Extract shipping fields
		const shippingLocation = formData.get('shipping_location') as ShippingLocation | null;
		const deliveryType = formData.get('delivery_type') as DeliveryType | null;
		const deliveryCountStr = formData.get('delivery_count') as string | null;
		const deliveryCount = deliveryCountStr ? parseInt(deliveryCountStr, 10) : 1;

		// Validate
		if (!name || !email || !phone || !serviceSlug || !urgency || !details) {
			return { type: 'error', message: t('fillAllFields') };
		}

		// Validate shipping fields for checkout flow
		if (!shippingLocation || !deliveryType) {
			return { type: 'error', message: t('shippingFieldsRequired') || 'Shipping location and delivery type are required' };
		}

		// Get service to get price
		const serviceFromDB = await getServiceBySlug(serviceSlug);
		if (!serviceFromDB || !serviceFromDB.pricing?.amount) {
			return { type: 'error', message: t('serviceNotFound') };
		}

		const serviceAmount = serviceFromDB.pricing.amount;

		// Calculate shipping amount
		const shippingAmount = calculateShippingRate({
			location: shippingLocation,
			deliveryType: deliveryType,
			deliveryCount: deliveryType === 'multiple' ? Math.max(2, deliveryCount) : 1,
		});

		// Total amount includes service fee + shipping
		const totalAmount = serviceAmount + shippingAmount;

		// Get uploaded attachments
		const { data: attachments } = await supabase
			.from('application_attachments')
			.select('id, file_name, storage_path, file_size, content_type')
			.eq('application_id', applicationId);

		// Get service-specific fields
		const serviceFields = getServiceFields(serviceSlug);
		const allFormFields: Record<string, string> = {};
		for (const [key, value] of formData.entries()) {
			if (!(value instanceof File) && key !== 'applicationId') {
				allFormFields[key] = value as string;
			}
		}
		const serviceSpecificData: Record<string, string> = {};
		serviceFields.forEach(field => {
			if (allFormFields[field.name]) {
				serviceSpecificData[field.name] = allFormFields[field.name];
			}
		});

		// Update application to submitted
		const { data: application, error: updateError } = await supabase
			.from('applications')
			.update({
				applicant_email: email,
				customer_name: name,
				customer_phone: phone,
				status: 'submitted',
				urgency: urgency,
				shipping_location: shippingLocation,
				delivery_type: deliveryType,
				delivery_count: deliveryType === 'multiple' ? Math.max(2, deliveryCount) : 1,
				shipping_amount: shippingAmount,
				payload: {
					urgency,
					details,
					additional_notes: additionalNotes,
					service_specific: serviceSpecificData,
					shipping: {
						location: shippingLocation,
						delivery_type: deliveryType,
						delivery_count: deliveryType === 'multiple' ? Math.max(2, deliveryCount) : 1,
						amount: shippingAmount,
					},
					attachments: attachments?.map(att => ({
						id: att.id,
						file_name: att.file_name,
						storage_path: att.storage_path,
						file_size: att.file_size,
						content_type: att.content_type,
					})) || [],
					checkout_flow: true,
				},
				submitted_at: new Date().toISOString(),
			})
			.eq('id', applicationId)
			.select()
			.single();

		if (updateError || !application) {
			return { type: 'error', message: t('submitFailed') };
		}

		const orderNumber = application.order_number || 'Pending';

		// Auto-create invoice
		const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
		const { count } = await supabase
			.from('invoices')
			.select('*', { count: 'exact', head: true })
			.gte('invoice_number', `INV-${today}-`)
			.lt('invoice_number', `INV-${today}-999`);

		const sequence = String((count || 0) + 1).padStart(3, '0');
		const invoiceNumber = `INV-${today}-${sequence}`;

		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.insert({
				application_id: applicationId,
				invoice_number: invoiceNumber,
				amount: totalAmount, // Include shipping in invoice amount
				currency: 'ILS',
				status: 'pending',
				due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			})
			.select()
			.single();

		if (invoiceError || !invoice) {
			return { type: 'error', message: t('invoiceCreationFailed') || 'Failed to create invoice' };
		}

		// Create event
		await supabase.from('application_events').insert({
			application_id: applicationId,
			event_type: 'checkout_submitted',
			notes: `Checkout submitted: ${orderNumber} - Invoice: ${invoiceNumber} - Shipping: ${shippingAmount} NIS`,
			data: { invoice_id: invoice.id, service_amount: serviceAmount, shipping_amount: shippingAmount, total_amount: totalAmount },
		});

		return {
			type: 'success',
			message: t('checkoutCreated', { orderNumber }) || `Checkout created: ${orderNumber}`,
			applicationId,
			invoiceId: invoice.id,
			orderNumber,
		};
	} catch (error) {
		console.error('Error:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return { type: 'error', message: t('unexpectedError') };
	}
}


'use server';

import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser, getCustomerProfile, createCustomerFromUser } from '@/lib/supabase/auth-helpers';
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
		const urgency = (formData.get('urgency') as string) || 'standard'; // Default to 'standard' if not provided
		const details = formData.get('details') as string;
		const additionalNotes = formData.get('message') as string;

		// Extract shipping fields
		const shippingLocation = formData.get('shipping_location') as ShippingLocation | null;
		const deliveryType = formData.get('delivery_type') as DeliveryType | null;
		const deliveryCountStr = formData.get('delivery_count') as string | null;
		const deliveryCount = deliveryCountStr ? parseInt(deliveryCountStr, 10) : 1;

		// Validate - details is optional for some services
		if (!name || !email || !phone || !serviceSlug || !urgency) {
			console.error('[SubmitCheckout] Missing required fields:', {
				hasName: !!name,
				hasEmail: !!email,
				hasPhone: !!phone,
				hasServiceSlug: !!serviceSlug,
				hasUrgency: !!urgency,
			});
			return { type: 'error', message: t('fillAllFields') };
		}

		// Validate shipping fields for checkout flow
		if (!shippingLocation || !deliveryType) {
			console.error('[SubmitCheckout] Missing shipping fields:', {
				hasShippingLocation: !!shippingLocation,
				hasDeliveryType: !!deliveryType,
			});
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

		// Use server client with auth context
		const supabase = await createClient();
		const user = await getCurrentUser();
		
		if (!user) {
			return { type: 'error', message: t('authRequired') };
		}

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
		console.log('[Checkout Server] Updating application:', {
			applicationId,
			userId: user.id,
			hasAttachments: !!attachments,
			attachmentCount: attachments?.length || 0,
		});
		
		// Store shipping info in payload JSONB (columns don't exist in table)
		const { data: application, error: updateError } = await supabase
			.from('applications')
			.update({
				applicant_email: email,
				customer_name: name,
				customer_phone: phone,
				status: 'submitted',
				urgency: urgency,
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
					attachments: attachments?.map((att: any) => ({
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

		if (updateError) {
			console.error('[Checkout Server] Application update error:', {
				error: updateError,
				code: updateError.code,
				message: updateError.message,
				details: updateError.details,
				hint: updateError.hint,
				applicationId,
				userId: user.id,
			});
			return { 
				type: 'error', 
				message: updateError.message === 'new row violates row-level security policy' 
					? t('authRequired')
					: t('submitFailed') 
			};
		}
		
		if (!application) {
			console.error('[Checkout Server] Application update returned no data');
			return { type: 'error', message: t('submitFailed') };
		}
		
		console.log('[Checkout Server] Application updated successfully:', {
			applicationId: application.id,
			status: application.status,
			orderNumber: application.order_number,
		});

		const orderNumber = application.order_number || 'Pending';

		// Auto-create invoice
		console.log('[Checkout Server] Creating invoice for application:', applicationId);
		const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
		const { count } = await supabase
			.from('invoices')
			.select('*', { count: 'exact', head: true })
			.gte('invoice_number', `INV-${today}-`)
			.lt('invoice_number', `INV-${today}-999`);

		const sequence = String((count || 0) + 1).padStart(3, '0');
		const invoiceNumber = `INV-${today}-${sequence}`;
		console.log('[Checkout Server] Generated invoice number:', invoiceNumber, 'Sequence:', sequence);

		const invoiceData = {
			application_id: applicationId,
			invoice_number: invoiceNumber,
			amount: totalAmount, // Include shipping in invoice amount
			currency: 'ILS',
			status: 'pending',
			// Note: due_date column doesn't exist in invoices table
		};
		console.log('[Checkout Server] Inserting invoice with data:', invoiceData);

		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.insert(invoiceData)
			.select()
			.single();

		if (invoiceError) {
			console.error('[Checkout Server] Invoice creation error:', invoiceError);
			return { type: 'error', message: t('invoiceCreationFailed') || 'Failed to create invoice' };
		}

		if (!invoice) {
			console.error('[Checkout Server] Invoice creation returned no data');
			return { type: 'error', message: t('invoiceCreationFailed') || 'Failed to create invoice' };
		}

		console.log('[Checkout Server] Invoice created successfully:', {
			invoiceId: invoice.id,
			invoiceNumber: invoice.invoice_number,
			amount: invoice.amount,
		});

		// Create event
		const eventData = {
			application_id: applicationId,
			event_type: 'checkout_submitted',
			notes: `Checkout submitted: ${orderNumber} - Invoice: ${invoiceNumber} - Shipping: ${shippingAmount} NIS`,
			data: { invoice_id: invoice.id, service_amount: serviceAmount, shipping_amount: shippingAmount, total_amount: totalAmount },
		};
		console.log('[Checkout Server] Creating checkout event:', eventData);
		await supabase.from('application_events').insert(eventData);

		const result = {
			type: 'success' as const,
			message: t('checkoutCreated', { orderNumber }) || `Checkout created: ${orderNumber}`,
			applicationId,
			invoiceId: invoice.id,
			orderNumber,
		};
		
		console.log('[Checkout Server] Returning success result:', {
			type: result.type,
			hasInvoiceId: !!result.invoiceId,
			invoiceId: result.invoiceId,
			hasOrderNumber: !!result.orderNumber,
			orderNumber: result.orderNumber,
		});

		return result;
	} catch (error) {
		console.error('Error:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return { type: 'error', message: t('unexpectedError') };
	}
}


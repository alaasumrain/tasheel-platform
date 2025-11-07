'use server';

import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { sendQuoteRequestReceivedEmail } from '@/lib/email-notifications';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';
import { getServiceFields } from '@/lib/service-form-fields';
import { getTranslations } from 'next-intl/server';

if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
	console.log('RESEND_API_KEY or CONTACT_EMAIL is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY || 'DUMMY_KEY');
const contactEmail = process.env.CONTACT_EMAIL || null;
const contactName = process.env.CONTACT_NAME || 'Tasheel';

export async function submitQuoteRequest(formData: FormData): Promise<{
	type: 'success' | 'error';
	message: string;
	orderNumber?: string;
}> {
	const locale = (formData.get('locale') as string) || 'en';
	
	try {
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const serviceSlug = formData.get('service') as string;
		const applicationId = formData.get('applicationId') as string; // Draft application ID
		const urgency = formData.get('urgency') as string;
		const details = formData.get('details') as string;
		const additionalNotes = formData.get('message') as string;

		// Validate form data
		if (!name || !email || !phone || !serviceSlug || !urgency || !details) {
			return {
				type: 'error',
				message: t('fillAllFields'),
			};
		}

		// Extract all form fields (including service-specific ones)
		const allFormFields: Record<string, string> = {};
		for (const [key, value] of formData.entries()) {
			if (!(value instanceof File) && key !== 'applicationId') {
				allFormFields[key] = value as string;
			}
		}

		// Get service-specific fields
		const serviceFields = getServiceFields(serviceSlug);
		const serviceSpecificData: Record<string, string> = {};
		
		serviceFields.forEach(field => {
			if (allFormFields[field.name]) {
				serviceSpecificData[field.name] = allFormFields[field.name];
			}
		});

		// Get uploaded attachments for this application
		const { data: attachments } = await supabase
			.from('application_attachments')
			.select('id, file_name, storage_path, file_size, content_type')
			.eq('application_id', applicationId);

		// Update existing draft application (or create new if applicationId not provided)
		let application;
		if (applicationId) {
			// Update draft to submitted
			const { data: updatedApp, error: updateError } = await supabase
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
						attachments: attachments?.map(att => ({
							id: att.id,
							file_name: att.file_name,
							storage_path: att.storage_path,
							file_size: att.file_size,
							content_type: att.content_type,
						})) || [],
					},
					submitted_at: new Date().toISOString(),
				})
				.eq('id', applicationId)
				.select()
				.single();

			if (updateError || !updatedApp) {
				console.error('Database error updating application:', updateError);
				return {
					type: 'error',
					message: t('submitFailed'),
				};
			}
			application = updatedApp;
		} else {
			// Fallback: create new application (shouldn't happen with new flow)
			const { data: newApp, error: dbError } = await supabase
				.from('applications')
				.insert({
					service_slug: serviceSlug,
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
					},
					submitted_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (dbError || !newApp) {
				console.error('Database error:', dbError);
				return {
					type: 'error',
					message: t('createFailed'),
				};
			}
			application = newApp;
		}

		const orderNumber = application.order_number || 'Pending';

		if (!contactEmail) {
			return {
				type: 'error',
				message: t('emailConfigError'),
			};
		}

		// Send email to business owner
		const attachmentsList = attachments && attachments.length > 0
			? `<p><strong>Uploaded Documents (${attachments.length}):</strong></p><ul>${attachments.map(att => `<li>${att.file_name} (${(att.file_size / 1024).toFixed(2)} KB)</li>`).join('')}</ul>`
			: '<p><em>No documents uploaded</em></p>';

		const serviceSpecificList = Object.keys(serviceSpecificData).length > 0
			? `<p><strong>Service-Specific Information:</strong></p><ul>${Object.entries(serviceSpecificData).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}</ul>`
			: '';

		const adminEmailData = await resend.emails.send({
			from: contactEmail,
			to: contactEmail,
			replyTo: email,
			subject: `New Quote Request: ${orderNumber}`,
			html: `
        <h2>New Quote Request Received</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${serviceSlug}</p>
        <p><strong>Urgency:</strong> ${urgency}</p>
        <p><strong>Details:</strong></p>
        <p>${details}</p>
        ${additionalNotes ? `<p><strong>Additional Notes:</strong></p><p>${additionalNotes}</p>` : ''}
        ${serviceSpecificList}
        ${attachmentsList}
        <hr>
        <p><a href="https://tasheel.ps/admin/orders/${application.id}">View in Admin Dashboard</a></p>
      `,
		});

		if (adminEmailData.error) {
			console.error('Admin email error:', adminEmailData.error);
		}

		// Send confirmation email to customer using React Email template
		try {
			const service = await getServiceBySlug(serviceSlug);
			const serviceName = service
				? convertToLegacyFormat(service, 'en').title
				: serviceSlug;

			const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track?order=${orderNumber}`;
			
			await sendQuoteRequestReceivedEmail({
				orderNumber,
				customerEmail: email,
				customerName: name,
				serviceName,
				trackingUrl,
				contactPhone: '+970 2 240 1234',
			});

			// Send WhatsApp notification if phone number provided
			if (phone) {
				try {
					const { sendOrderConfirmationWhatsApp } = await import('@/lib/whatsapp-notifications');
					await sendOrderConfirmationWhatsApp({
						orderNumber,
						customerPhone: phone,
						customerName: name,
						serviceName,
					});
				} catch (whatsappError) {
					console.log('WhatsApp notification skipped:', whatsappError);
				}
			}
		} catch (emailError) {
			console.error('Error sending quote request received email:', emailError);
			// Don't fail the submission if email fails
		}

		// Log event in application_events
		await supabase.from('application_events').insert({
			application_id: application.id,
			event_type: 'submitted',
			notes: 'Quote request submitted by customer',
			data: {
				source: 'website_form',
			},
		});

		return {
			type: 'success',
			message: t('orderCreated', { orderNumber }),
			orderNumber,
		};
	} catch (error) {
		console.error('Error:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return {
			type: 'error',
			message: t('unexpectedError'),
		};
	}
}

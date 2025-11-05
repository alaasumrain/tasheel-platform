'use server';

import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { sendQuoteRequestReceivedEmail } from '@/lib/email-notifications';
import { getServiceBySlug } from '@/lib/service-queries';
import { convertToLegacyFormat } from '@/lib/types/service';

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
	try {
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const serviceSlug = formData.get('service') as string;
		const urgency = formData.get('urgency') as string;
		const details = formData.get('details') as string;
		const additionalNotes = formData.get('message') as string;

		// Validate form data
		if (!name || !email || !phone || !serviceSlug || !urgency || !details) {
			return {
				type: 'error',
				message: 'Please fill in all required fields.',
			};
		}

		// Create application in Supabase
		const { data: application, error: dbError } = await supabase
			.from('applications')
			.insert({
				service_slug: serviceSlug,
				applicant_email: email,
				customer_name: name,
				customer_phone: phone,
				status: 'submitted',
				payload: {
					urgency,
					details,
					additional_notes: additionalNotes,
				},
				submitted_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (dbError || !application) {
			console.error('Database error:', dbError);
			return {
				type: 'error',
				message: 'Failed to create order. Please try again.',
			};
		}

		const orderNumber = application.order_number || 'Pending';

		if (!contactEmail) {
			return {
				type: 'error',
				message: 'Email configuration error. Please contact support.',
			};
		}

		// Send email to business owner
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
        <hr>
        <p><a href="https://tasheel.ps/admin">View in Admin Dashboard</a></p>
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
			message: `Order ${orderNumber} created successfully! Check your email for confirmation.`,
			orderNumber,
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			type: 'error',
			message: 'An unexpected error occurred. Please try again.',
		};
	}
}

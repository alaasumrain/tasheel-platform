'use server';

import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

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

		// Send confirmation email to customer
		const customerEmailData = await resend.emails.send({
			from: `${contactName} <${contactEmail}>`,
			to: email,
			subject: `Order Confirmed - ${orderNumber}`,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0E21A0;">✅ Your Order Has Been Received!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for choosing Tasheel. Your quote request has been confirmed.</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0E21A0;">Order Details</h3>
            <p style="margin: 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${serviceSlug}</p>
            <p style="margin: 10px 0;"><strong>Urgency:</strong> ${urgency}</p>
          </div>

          <p><strong>What happens next?</strong></p>
          <ol>
            <li>Our team will review your request within 2 hours</li>
            <li>We&apos;ll contact you via phone or email with a detailed quote</li>
            <li>Once approved, we&apos;ll begin processing your order</li>
          </ol>

          <p style="margin-top: 30px;">
            <a href="https://tasheel.ps/track?order=${orderNumber}"
               style="background-color: #0E21A0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Need help?</strong><br>
            Email: ${contactEmail}<br>
            Phone: +970 2 240 1234<br>
            WhatsApp: +970 59 000 0000
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">
            This is an automated confirmation email. Please save your order number (${orderNumber}) for future reference.
          </p>
        </div>
      `,
		});

		if (customerEmailData.error) {
			console.error('Customer email error:', customerEmailData.error);
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

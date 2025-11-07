import { NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
	try {
		// Require admin authentication
		await requireAdminAuthAPI();

		const body = await request.json();
		const { application_id, amount, notes } = body;

		if (!application_id || !amount) {
			return NextResponse.json(
				{ error: 'Missing required fields: application_id, amount' },
				{ status: 400 }
			);
		}

		// Create quote (stored in invoices table with quote status)
		// Generate invoice number
		const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
		const { count } = await supabase
			.from('invoices')
			.select('*', { count: 'exact', head: true })
			.gte('invoice_number', `INV-${today}-`)
			.lt('invoice_number', `INV-${today}-999`);

		const sequence = String((count || 0) + 1).padStart(3, '0');
		const invoiceNumber = `INV-${today}-${sequence}`;

		// Insert invoice
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.insert({
				application_id,
				invoice_number: invoiceNumber,
				amount,
				status: 'quote',
				notes: notes || null,
				due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
			})
			.select()
			.single();

		if (invoiceError) {
			console.error('Error creating invoice:', invoiceError);
			return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
		}

		// Update application status to quote_sent
		await supabase
			.from('applications')
			.update({ status: 'quote_sent', updated_at: new Date().toISOString() })
			.eq('id', application_id);

		// Create event
		await supabase.from('application_events').insert({
			application_id,
			event_type: 'quote_created',
			notes: `Quote created: ${amount} NIS${notes ? ` - ${notes}` : ''}`,
			data: { invoice_id: invoice.id, amount },
		});

		// Send quote email to customer
		try {
			const { sendQuoteSentEmail } = await import('@/lib/email-notifications');
			const { getServiceBySlug } = await import('@/lib/service-queries');
			const { convertToLegacyFormat } = await import('@/lib/types/service');
			
			// Get application details
			const { data: application } = await supabase
				.from('applications')
				.select('service_slug, applicant_email, customer_name, customer_phone, order_number')
				.eq('id', application_id)
				.single();

			if (application) {
				const service = await getServiceBySlug(application.service_slug);
				const serviceName = service
					? convertToLegacyFormat(service, 'en').title
					: application.service_slug || 'Service';

				const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/requests/${application_id}`;
				
				await sendQuoteSentEmail({
					orderNumber: application.order_number || invoice.invoice_number,
					customerEmail: application.applicant_email,
					customerName: application.customer_name || undefined,
					serviceName,
					amount,
					currency: 'ILS',
					paymentLink: paymentUrl,
					expiryHours: 48,
				});

				// Send WhatsApp notification if phone number available
				if (application.customer_phone) {
					try {
						const { sendQuoteReadyWhatsApp } = await import('@/lib/whatsapp-notifications');
						await sendQuoteReadyWhatsApp({
							orderNumber: application.order_number || invoice.invoice_number,
							customerPhone: application.customer_phone,
							customerName: application.customer_name || undefined,
							amount,
							currency: 'ILS',
							paymentLink: paymentUrl,
						});
					} catch (whatsappError) {
						console.log('WhatsApp notification skipped:', whatsappError);
					}
				}
			}
		} catch (emailError) {
			console.error('Error sending quote email:', emailError);
			// Don't fail the quote creation if email fails
		}

		return NextResponse.json({ success: true, invoice });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in POST /api/admin/quotes:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

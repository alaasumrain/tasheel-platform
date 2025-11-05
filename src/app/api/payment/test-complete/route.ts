import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCustomerProfile } from '@/lib/supabase/auth-helpers';

/**
 * Test Payment Completion API
 * 
 * ⚠️ TESTING MODE ONLY
 * 
 * This endpoint simulates payment completion for testing purposes.
 * In production, this should be replaced with webhook handlers from:
 * - PalPay webhook
 * - PayTabs webhook
 * 
 * TODO: Replace with actual payment gateway webhook:
 * 1. Verify webhook signature/authentication
 * 2. Update invoice status to 'paid'
 * 3. Create payment record in payments table
 * 4. Send confirmation email
 * 5. Update application status if needed
 */

export async function POST(request: Request) {
	try {
		const customer = await getCustomerProfile();
		if (!customer) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { invoiceId, amount, currency, transactionId, status } = body;

		if (!invoiceId || !amount || !transactionId) {
			return NextResponse.json(
				{ error: 'Missing required fields: invoiceId, amount, transactionId' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		// Verify invoice belongs to customer
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.select('*, applications!inner(customer_id)')
			.eq('id', invoiceId)
			.single();

		if (invoiceError || !invoice) {
			return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
		}

		// Check if customer owns this invoice
		const application = invoice.applications as any;
		if (application.customer_id !== customer.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Update invoice status
		const { error: updateError } = await supabase
			.from('invoices')
			.update({
				status: 'paid',
				paid_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq('id', invoiceId);

		if (updateError) {
			console.error('Error updating invoice:', updateError);
			return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
		}

		// Create payment record
		const { error: paymentError } = await supabase.from('payments').insert({
			invoice_id: invoiceId,
			gateway: 'test',
			transaction_id: transactionId,
			amount: amount,
			status: 'completed',
			gateway_response: {
				test: true,
				completed_at: new Date().toISOString(),
			},
		});

		if (paymentError) {
			console.error('Error creating payment record:', paymentError);
			// Don't fail - invoice is already updated
		}

		// Create event
		await supabase.from('application_events').insert({
			application_id: invoice.application_id,
			event_type: 'payment_completed',
			notes: `Payment completed: ${transactionId} - ${amount} ${currency}`,
			data: {
				invoice_id: invoiceId,
				transaction_id: transactionId,
				amount,
				currency,
			},
		});

		// Send payment confirmation email
		try {
			const { sendPaymentConfirmedEmail } = await import('@/lib/email-notifications');
			const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/requests/${invoice.application_id}`;
			const invoiceUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/requests/${invoice.application_id}`;
			
			await sendPaymentConfirmedEmail({
				orderNumber: invoice.invoice_number,
				customerEmail: customer.email,
				customerName: customer.name || undefined,
				amount: amount,
				currency: currency,
				transactionId: transactionId,
				dashboardUrl,
				invoiceUrl,
			});

			// Send WhatsApp notification if phone number available
			if (customer.phone) {
				try {
					const { sendPaymentConfirmedWhatsApp } = await import('@/lib/whatsapp-notifications');
					await sendPaymentConfirmedWhatsApp({
						orderNumber: invoice.invoice_number,
						customerPhone: customer.phone,
						customerName: customer.name || undefined,
						amount: amount,
						currency: currency,
						transactionId: transactionId,
					});
				} catch (whatsappError) {
					console.log('WhatsApp notification skipped:', whatsappError);
				}
			}
		} catch (emailError) {
			console.error('Error sending payment confirmation email:', emailError);
			// Don't fail the payment if email fails
		}

		return NextResponse.json({
			success: true,
			message: 'Payment completed successfully',
			invoiceId,
		});
	} catch (error) {
		console.error('Error in test payment completion:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


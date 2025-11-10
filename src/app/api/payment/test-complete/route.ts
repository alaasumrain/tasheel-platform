import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { logger } from '@/lib/utils/logger';

/**
 * Test Payment Completion API
 * 
 * ⚠️ TESTING MODE ONLY - DISABLED IN PRODUCTION
 * 
 * This endpoint simulates payment completion for testing purposes.
 * In production, this should be replaced with webhook handlers from:
 * - PalPay webhook
 * - PayTabs webhook
 * 
 * Security: Requires admin authentication even in placeholder mode
 */

export async function POST(request: Request) {
	// Disable in production
	if (process.env.NODE_ENV === 'production') {
		return NextResponse.json(
			{ error: 'This endpoint is disabled in production' },
			{ status: 403 }
		);
	}

	try {
		// Require admin authentication even for test endpoint
		await requireAdminAuthAPI();

		const body = await request.json();
		const { invoiceId, amount, currency, transactionId } = body;

		if (!invoiceId || !amount || !transactionId) {
			return NextResponse.json(
				{ error: 'Missing required fields: invoiceId, amount, transactionId' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		// Get invoice
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.select('*, applications(id, order_number, applicant_email, customer_name, customer_phone, customer_id)')
			.eq('id', invoiceId)
			.single();

		if (invoiceError || !invoice) {
			return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
		}

		// Validate amount matches invoice amount
		if (Math.abs(invoice.amount - amount) > 0.01) {
			return NextResponse.json(
				{ error: 'Amount mismatch' },
				{ status: 400 }
			);
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
			logger.error('Error updating invoice in test endpoint', updateError, { invoiceId });
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
			logger.error('Error creating payment record in test endpoint', paymentError, { invoiceId });
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
			const customerEmail = invoice.applications?.applicant_email || (invoice as Record<string, unknown>).customer_email as string | undefined;
			const customerName = invoice.applications?.customer_name || (invoice as Record<string, unknown>).customer_name as string | undefined;
			const customerPhone = invoice.applications?.customer_phone || (invoice as Record<string, unknown>).customer_phone as string | undefined;
			
			if (customerEmail) {
				const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/requests/${invoice.application_id}`;
				const invoiceUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/requests/${invoice.application_id}`;
				
				await sendPaymentConfirmedEmail({
					orderNumber: invoice.applications?.order_number || invoice.invoice_number,
					customerEmail,
					customerName: customerName || undefined,
					amount: amount,
					currency: currency,
					transactionId: transactionId,
					dashboardUrl,
					invoiceUrl,
				});

				// Send WhatsApp notification if phone number available
				if (customerPhone) {
					try {
						const { sendPaymentConfirmedWhatsApp } = await import('@/lib/whatsapp-notifications');
						await sendPaymentConfirmedWhatsApp({
							orderNumber: invoice.applications?.order_number || invoice.invoice_number,
							customerPhone,
							customerName: customerName || undefined,
							amount: amount,
							currency: currency,
							transactionId: transactionId,
						});
					} catch (whatsappError) {
						logger.warn('WhatsApp notification skipped in test endpoint', { whatsappError });
					}
				}
			}
		} catch (emailError) {
			logger.error('Error sending payment confirmation email in test endpoint', emailError, { invoiceId });
			// Don't fail the payment if email fails
		}

		return NextResponse.json({
			success: true,
			message: 'Payment completed successfully',
			invoiceId,
		});
	} catch (error) {
		logger.error('Error in test payment completion endpoint', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


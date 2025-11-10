import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPaymentConfirmedEmail } from '@/lib/email-notifications';
import { sendPaymentConfirmedWhatsApp } from '@/lib/whatsapp-notifications';
import { verifyWebhookSignature } from '@/lib/utils/webhook-verification';
import { logger } from '@/lib/utils/logger';

/**
 * Payment webhook handler
 * Receives payment status updates from payment gateway
 */
export async function POST(request: NextRequest) {
	let gatewayType: 'palpay' | 'paytabs' | 'generic' = 'palpay';
	let body: Record<string, unknown> | null = null;
	
	try {
		gatewayType = (process.env.PAYMENT_GATEWAY_TYPE || 'palpay') as 'palpay' | 'paytabs' | 'generic';
		const webhookSecret = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET;

		// Get raw body for signature verification (must be done before JSON parsing)
		const rawBody = await request.text();
		body = JSON.parse(rawBody) as Record<string, unknown>;

		// Verify webhook signature
		const signature = request.headers.get('x-signature') || 
			request.headers.get('signature') ||
			request.headers.get('x-palpay-signature') ||
			request.headers.get('x-paytabs-signature');
		
		if (webhookSecret && signature) {
			const isValid = verifyWebhookSignature(
				rawBody,
				signature,
				webhookSecret,
				gatewayType
			);

			if (!isValid) {
				return NextResponse.json(
					{ error: 'Invalid webhook signature' },
					{ status: 401 }
				);
			}
		} else if (process.env.NODE_ENV === 'production') {
			// In production, require signature verification
			return NextResponse.json(
				{ error: 'Webhook signature verification required' },
				{ status: 401 }
			);
		}

		const supabase = await createClient();

		// Parse webhook payload based on gateway type
		let invoiceId: string;
		let transactionId: string;
		let amount: number;
		let status: 'paid' | 'failed' | 'pending';
		
		if (!body) {
			return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
		}
		
		if (gatewayType === 'palpay') {
			// PalPay webhook format
			invoiceId = (body.metadata as Record<string, unknown>)?.invoice_id as string || body.order_id as string;
			transactionId = body.transaction_id as string || body.id as string;
			amount = parseFloat((body.amount as string) || (body.total_amount as string));
			status = body.status === 'success' || body.status === 'completed' ? 'paid' : 
				body.status === 'failed' ? 'failed' : 'pending';
		} else if (gatewayType === 'paytabs') {
			// PayTabs webhook format
			invoiceId = body.cart_id as string || body.invoice_id as string;
			transactionId = body.tran_ref as string || body.transaction_id as string;
			amount = parseFloat((body.cart_amount as string) || (body.amount as string));
			status = (body.payment_result as Record<string, unknown>)?.response_status === 'A' ? 'paid' :
				(body.payment_result as Record<string, unknown>)?.response_status === 'D' ? 'failed' : 'pending';
		} else {
			// Generic format (for testing)
			invoiceId = body.invoice_id as string || body.invoiceId as string;
			transactionId = body.transaction_id as string || body.transactionId as string;
			amount = parseFloat(body.amount as string);
			status = body.status === 'paid' || body.status === 'success' ? 'paid' :
				body.status === 'failed' ? 'failed' : 'pending';
		}

		if (!invoiceId) {
			return NextResponse.json({ error: 'Invoice ID not found in webhook' }, { status: 400 });
		}

		// Get invoice and application details
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.select('*, applications(id, order_number, applicant_email, customer_name, customer_phone)')
			.eq('id', invoiceId)
			.single();

		if (invoiceError || !invoice) {
			logger.error('Invoice not found in webhook', invoiceError, { invoiceId });
			return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
		}

		// Validate amount matches invoice amount (prevent manipulation)
		if (Math.abs(invoice.amount - amount) > 0.01) {
			return NextResponse.json(
				{ error: 'Amount mismatch' },
				{ status: 400 }
			);
		}

		const customerEmail = invoice.applications?.applicant_email || (body?.customer_email as string);
		const orderNumber = invoice.applications?.order_number || invoice.invoice_number;

		// Update invoice status
		const { error: updateError } = await supabase
			.from('invoices')
			.update({
				status: status,
				transaction_id: transactionId,
				paid_at: status === 'paid' ? new Date().toISOString() : null,
				updated_at: new Date().toISOString(),
			})
			.eq('id', invoiceId);

		if (updateError) {
			logger.error('Failed to update invoice status', updateError, { invoiceId, status });
			return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
		}

		// If payment successful, update application status and send notifications
		if (status === 'paid') {
			// Update application status to in_progress
			await supabase
				.from('applications')
				.update({
					status: 'in_progress',
					updated_at: new Date().toISOString(),
				})
				.eq('id', invoice.applications?.id);

			// Create payment event
			await supabase.from('application_events').insert({
				application_id: invoice.applications?.id,
				event_type: 'payment_received',
				notes: `Payment received: ${transactionId}`,
				data: {
					invoice_id: invoiceId,
					transaction_id: transactionId,
					amount: amount,
					currency: invoice.currency || 'ILS',
				},
			});

			// Send payment confirmation email
			if (customerEmail) {
				try {
					await sendPaymentConfirmedEmail({
						orderNumber: orderNumber || invoice.invoice_number,
						customerEmail,
						customerName: invoice.applications?.customer_name,
						amount,
						currency: invoice.currency || 'ILS',
						transactionId,
						dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/requests/${invoice.applications?.id}`,
					});
				} catch (emailError) {
					// Log error but don't fail webhook - email failures shouldn't block payment processing
					logger.error('Failed to send payment confirmation email', emailError, {
						customerEmail,
						orderNumber,
						invoiceId,
					});
				}
			}

			// Send WhatsApp notification
			if (invoice.applications?.customer_phone) {
				try {
					await sendPaymentConfirmedWhatsApp({
						orderNumber: orderNumber || invoice.invoice_number,
						customerPhone: invoice.applications.customer_phone,
						customerName: invoice.applications.customer_name,
						amount,
						currency: invoice.currency || 'ILS',
						transactionId,
					});
				} catch (whatsappError) {
					// Log error but don't fail webhook - WhatsApp failures shouldn't block payment processing
					logger.error('Failed to send payment confirmation WhatsApp', whatsappError, {
						customerPhone: invoice.applications.customer_phone,
						orderNumber,
						invoiceId,
					});
				}
			}
		}

		return NextResponse.json({ success: true, status });
	} catch (error: unknown) {
		logger.error('Payment webhook error', error, {
			gatewayType,
			body: body ? JSON.stringify(body) : 'null',
		});
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

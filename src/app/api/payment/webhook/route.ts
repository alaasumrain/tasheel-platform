import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { sendPaymentConfirmedEmail } from '@/lib/email-notifications';
import { sendPaymentConfirmedWhatsApp } from '@/lib/whatsapp-notifications';

/**
 * Payment webhook handler
 * Receives payment status updates from payment gateway
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const gatewayType = process.env.PAYMENT_GATEWAY_TYPE || 'palpay';
		const webhookSecret = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET;

		// Verify webhook signature (if provided)
		const signature = request.headers.get('x-signature') || request.headers.get('signature');
		if (webhookSecret && signature) {
			// TODO: Implement signature verification based on gateway
			// This is a placeholder - actual implementation depends on gateway
		}

		const supabase = await createClient();

		let invoiceId: string;
		let transactionId: string;
		let amount: number;
		let status: 'paid' | 'failed' | 'pending';
		let customerEmail: string;
		let orderNumber: string;

		// Parse webhook payload based on gateway type
		if (gatewayType === 'palpay') {
			// PalPay webhook format
			invoiceId = body.metadata?.invoice_id || body.order_id;
			transactionId = body.transaction_id || body.id;
			amount = parseFloat(body.amount || body.total_amount);
			status = body.status === 'success' || body.status === 'completed' ? 'paid' : 
				body.status === 'failed' ? 'failed' : 'pending';
		} else if (gatewayType === 'paytabs') {
			// PayTabs webhook format
			invoiceId = body.cart_id || body.invoice_id;
			transactionId = body.tran_ref || body.transaction_id;
			amount = parseFloat(body.cart_amount || body.amount);
			status = body.payment_result?.response_status === 'A' ? 'paid' :
				body.payment_result?.response_status === 'D' ? 'failed' : 'pending';
		} else {
			// Generic format (for testing)
			invoiceId = body.invoice_id || body.invoiceId;
			transactionId = body.transaction_id || body.transactionId;
			amount = parseFloat(body.amount);
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
			console.error('Invoice not found:', invoiceError);
			return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
		}

		customerEmail = invoice.applications?.applicant_email || body.customer_email;
		orderNumber = invoice.applications?.order_number || invoice.invoice_number;

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
			console.error('Error updating invoice:', updateError);
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
					console.error('Error sending payment confirmation email:', emailError);
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
					console.error('Error sending WhatsApp notification:', whatsappError);
				}
			}
		}

		return NextResponse.json({ success: true, status });
	} catch (error: any) {
		console.error('Error processing webhook:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}


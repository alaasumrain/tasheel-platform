import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Create payment session with payment gateway
 * Supports PalPay and PayTabs
 */
export async function POST(request: NextRequest) {
	try {
		const { invoiceId, amount, currency, orderNumber } = await request.json();

		if (!invoiceId || !amount || !currency) {
			return NextResponse.json(
				{ error: 'Missing required fields: invoiceId, amount, currency' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		// Get invoice details
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.select('*, applications(id, order_number, applicant_email, customer_name, customer_phone)')
			.eq('id', invoiceId)
			.single();

		if (invoiceError || !invoice) {
			return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
		}

		const customerEmail = invoice.applications?.applicant_email || '';
		if (!customerEmail) {
			return NextResponse.json(
				{ error: 'Customer email not found' },
				{ status: 400 }
			);
		}

		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
		const gatewayMode = process.env.PAYMENT_GATEWAY_MODE || 'sandbox';
		const gatewayType = process.env.PAYMENT_GATEWAY_TYPE || 'palpay'; // 'palpay' or 'paytabs'
		const usePlaceholder = process.env.PAYMENT_USE_PLACEHOLDER === 'true' || 
			!process.env.PAYMENT_GATEWAY_API_KEY || 
			!process.env.PAYMENT_GATEWAY_MERCHANT_ID;

		// PLACEHOLDER MODE: If gateway not configured, return placeholder payment URL
		if (usePlaceholder) {
			const placeholderUrl = `${siteUrl}/payment/success?invoice=${invoiceId}&placeholder=true`;
			const placeholderSessionId = `PLACEHOLDER-${Date.now()}-${invoiceId}`;
			
			// Update invoice with placeholder session
			await supabase
				.from('invoices')
				.update({
					payment_session_id: placeholderSessionId,
					payment_link: placeholderUrl,
					updated_at: new Date().toISOString(),
				})
				.eq('id', invoiceId);

			return NextResponse.json({
				success: true,
				paymentUrl: placeholderUrl,
				sessionId: placeholderSessionId,
				placeholder: true,
				message: 'Payment gateway not configured. Using placeholder mode.',
			});
		}

		// Create payment session based on gateway type
		let paymentUrl: string;
		let sessionId: string;

		if (gatewayType === 'palpay') {
			// PalPay integration
			const palpayApiKey = process.env.PAYMENT_GATEWAY_API_KEY;
			const palpayMerchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;

			if (!palpayApiKey || !palpayMerchantId) {
				return NextResponse.json(
					{ error: 'PalPay credentials not configured' },
					{ status: 500 }
				);
			}

			// Create PalPay payment session
			const palpayResponse = await fetch(
				gatewayMode === 'production'
					? 'https://api.palpay.ps/v1/payments'
					: 'https://sandbox.palpay.ps/v1/payments',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${palpayApiKey}`,
					},
					body: JSON.stringify({
						merchant_id: palpayMerchantId,
						amount: amount,
						currency: currency,
						order_id: invoice.invoice_number || invoiceId,
						customer_email: customerEmail,
						customer_name: invoice.applications?.customer_name || 'Customer',
						return_url: `${siteUrl}/payment/success?invoice=${invoiceId}`,
						cancel_url: `${siteUrl}/payment/cancel?invoice=${invoiceId}`,
						webhook_url: `${siteUrl}/api/payment/webhook`,
						metadata: {
							invoice_id: invoiceId,
							order_number: orderNumber || invoice.applications?.order_number,
						},
					}),
				}
			);

			if (!palpayResponse.ok) {
				const errorData = await palpayResponse.text();
				console.error('PalPay API error:', errorData);
				return NextResponse.json(
					{ error: 'Failed to create payment session' },
					{ status: 500 }
				);
			}

			const palpayData = await palpayResponse.json();
			paymentUrl = palpayData.payment_url || palpayData.url;
			sessionId = palpayData.session_id || palpayData.id;
		} else if (gatewayType === 'paytabs') {
			// PayTabs integration
			const paytabsApiKey = process.env.PAYMENT_GATEWAY_API_KEY;
			const paytabsMerchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;

			if (!paytabsApiKey || !paytabsMerchantId) {
				return NextResponse.json(
					{ error: 'PayTabs credentials not configured' },
					{ status: 500 }
				);
			}

			// Create PayTabs payment session
			const paytabsResponse = await fetch(
				gatewayMode === 'production'
					? 'https://secure.paytabs.com/payment/request'
					: 'https://secure-egypt.paytabs.com/payment/request',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': paytabsApiKey,
					},
					body: JSON.stringify({
						profile_id: paytabsMerchantId,
						tran_type: 'sale',
						tran_class: 'ecom',
						cart_id: invoice.invoice_number || invoiceId,
						cart_currency: currency,
						cart_amount: amount,
						cart_description: `Payment for order ${orderNumber || invoice.invoice_number}`,
						customer_details: {
							name: invoice.applications?.customer_name || 'Customer',
							email: customerEmail,
							phone: invoice.applications?.customer_phone || '',
						},
						callback: `${siteUrl}/payment/success?invoice=${invoiceId}`,
						return: `${siteUrl}/payment/cancel?invoice=${invoiceId}`,
						hide_shipping: true,
					}),
				}
			);

			if (!paytabsResponse.ok) {
				const errorData = await paytabsResponse.text();
				console.error('PayTabs API error:', errorData);
				return NextResponse.json(
					{ error: 'Failed to create payment session' },
					{ status: 500 }
				);
			}

			const paytabsData = await paytabsResponse.json();
			paymentUrl = paytabsData.redirect_url || paytabsData.payment_url;
			sessionId = paytabsData.tran_ref || paytabsData.session_id;
		} else {
			return NextResponse.json(
				{ error: 'Invalid payment gateway type' },
				{ status: 400 }
			);
		}

		// Update invoice with payment session ID
		await supabase
			.from('invoices')
			.update({
				payment_session_id: sessionId,
				payment_link: paymentUrl,
				updated_at: new Date().toISOString(),
			})
			.eq('id', invoiceId);

		return NextResponse.json({
			success: true,
			paymentUrl,
			sessionId,
		});
	} catch (error: any) {
		console.error('Error creating payment session:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}


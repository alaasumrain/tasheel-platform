import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * WhatsApp Webhook Handler
 * 
 * Receives incoming WhatsApp messages from Twilio/Meta
 * 
 * ⚠️ SETUP REQUIRED:
 * 1. Configure webhook URL in Twilio/Meta dashboard
 * 2. Set webhook URL to: https://yourdomain.com/api/whatsapp/webhook
 * 3. Verify webhook signature for security
 * 
 * TODO: When Twilio is configured:
 * 1. Verify webhook signature
 * 2. Parse incoming message
 * 3. Find related order/application
 * 4. Store message in database
 * 5. Create event in application_events
 * 6. Notify admin if needed
 */

export async function POST(request: Request) {
	try {
		const body = await request.json();
		console.log('WhatsApp webhook received:', body);

		// TODO: Verify webhook signature
		// const signature = request.headers.get('x-twilio-signature');
		// if (!verifySignature(body, signature)) {
		//   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
		// }

		// Parse incoming message (Twilio format)
		// TODO: Adjust based on actual webhook payload structure
		const fromNumber = body.From || body.from;
		const messageBody = body.Body || body.body || body.message?.text;
		const messageId = body.MessageSid || body.id;

		if (!fromNumber || !messageBody) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Format phone number (remove whatsapp: prefix if present)
		const phoneNumber = fromNumber.replace(/^whatsapp:/, '').replace(/[^0-9+]/g, '');

		// Find customer by phone number
		const supabase = await createClient();
		const { data: customer } = await supabase
			.from('customers')
			.select('id, email, name')
			.eq('phone', phoneNumber)
			.single();

		if (!customer) {
			console.log(`No customer found for phone: ${phoneNumber}`);
			// Could send auto-reply asking them to register
			return NextResponse.json({ received: true, message: 'Customer not found' });
		}

		// Find most recent application for this customer
		const { data: application } = await supabase
			.from('applications')
			.select('id, order_number, customer_id')
			.eq('customer_id', customer.id)
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		if (application) {
			// Store message in communications log (if communications table exists)
			// For now, create an event
			await supabase.from('application_events').insert({
				application_id: application.id,
				event_type: 'whatsapp_message_received',
				notes: `WhatsApp message from customer: ${messageBody}`,
				data: {
					phone: phoneNumber,
					message_id: messageId,
					message: messageBody,
				},
			});

			console.log(`WhatsApp message logged for order ${application.order_number}`);
		}

		// TODO: Auto-reply logic (if needed)
		// TODO: Notify admin of customer message

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Error processing WhatsApp webhook:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// GET endpoint for webhook verification (if required by provider)
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const mode = searchParams.get('hub.mode');
	const token = searchParams.get('hub.verify_token');
	const challenge = searchParams.get('hub.challenge');

	// Meta WhatsApp verification
	if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
		return new Response(challenge, { status: 200 });
	}

	return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}


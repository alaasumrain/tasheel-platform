import { Resend } from 'resend';
import { render } from '@react-email/components';
import { Application, ApplicationStatus } from './admin-queries';
import { getServiceBySlug } from './service-queries';
import { convertToLegacyFormat } from './types/service';
import { OrderStatusEmail } from '@/components/emails/OrderStatusEmail';
import { QuoteSentEmail } from '@/components/emails/QuoteSentEmail';
import { PaymentConfirmedEmail } from '@/components/emails/PaymentConfirmedEmail';
import { QuoteRequestReceivedEmail } from '@/components/emails/QuoteRequestReceivedEmail';

// Lazy-initialize Resend client to avoid errors during build
function getResendClient() {
	if (!process.env.RESEND_API_KEY) {
		throw new Error('RESEND_API_KEY is not configured');
	}
	return new Resend(process.env.RESEND_API_KEY);
}

const statusMessages: Record<ApplicationStatus, { subject: string; message: string }> = {
	draft: {
		subject: 'Order Draft Created',
		message: 'Your order draft has been created.',
	},
	submitted: {
		subject: 'Order Received',
		message: 'We have received your order and will review it shortly.',
	},
	scoping: {
		subject: 'Order Under Review',
		message: 'We are reviewing your order requirements and will get back to you soon.',
	},
	quote_sent: {
		subject: 'Quote Ready',
		message: 'Your quote is ready! Please check your email for details.',
	},
	in_progress: {
		subject: 'Order Processing Started',
		message: 'Great news! We have started processing your order.',
	},
	review: {
		subject: 'Order Under Review',
		message: 'Your order is currently under review. We will update you soon.',
	},
	completed: {
		subject: 'Order Completed',
		message: 'Your order has been completed and is ready for pickup/delivery!',
	},
	archived: {
		subject: 'Order Archived',
		message: 'Your order has been archived.',
	},
	rejected: {
		subject: 'Order Update',
		message: 'There has been an update regarding your order. Please contact us for more information.',
	},
	cancelled: {
		subject: 'Order Cancelled',
		message: 'Your order has been cancelled.',
	},
};

async function getServiceName(serviceSlug: string | null): Promise<string> {
	if (!serviceSlug) {
		return 'Service';
	}
	const service = await getServiceBySlug(serviceSlug);
	if (!service) {
		return serviceSlug;
	}
	const legacyService = convertToLegacyFormat(service, 'en');
	return legacyService.title;
}

export async function sendOrderStatusEmail(order: Application) {
	if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
		console.log('Email not configured. Skipping email notification.');
		return;
	}

	const statusInfo = statusMessages[order.status];
	const serviceName = await getServiceName(order.service_slug);
	const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track?order=${order.order_number}`;

	// Render email using React Email component
	const htmlContent = await render(
		OrderStatusEmail({
			orderNumber: order.order_number,
			customerName: order.customer_name || undefined,
			serviceName,
			status: order.status,
			statusMessage: statusInfo.message,
			trackingUrl,
			contactEmail: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
		})
	);

	try {
		const resend = getResendClient();
		await resend.emails.send({
			from: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
			to: order.applicant_email,
			subject: `${statusInfo.subject} - ${order.order_number}`,
			html: htmlContent,
		});

		console.log(`Email sent to ${order.applicant_email} for order ${order.order_number}`);

		// Send WhatsApp notification if phone number available
		if (order.customer_phone) {
			try {
				const { sendStatusUpdateWhatsApp } = await import('./whatsapp-notifications');
				await sendStatusUpdateWhatsApp({
					orderNumber: order.order_number,
					customerPhone: order.customer_phone,
					customerName: order.customer_name || undefined,
					status: order.status,
					statusMessage: statusInfo.message,
				});
			} catch (whatsappError) {
				console.log('WhatsApp notification skipped:', whatsappError);
			}
		}
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
}

/**
 * Send quote sent email to customer
 */
export async function sendQuoteSentEmail(params: {
	orderNumber: string;
	customerEmail: string;
	customerName?: string;
	serviceName: string;
	amount: number;
	currency: string;
	paymentLink?: string;
	expiryHours?: number;
}) {
	if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
		console.log('Email not configured. Skipping email notification.');
		return;
	}

	const htmlContent = await render(
		QuoteSentEmail({
			orderNumber: params.orderNumber,
			customerName: params.customerName,
			serviceName: params.serviceName,
			amount: params.amount,
			currency: params.currency,
			paymentLink: params.paymentLink,
			expiryHours: params.expiryHours,
			contactEmail: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
		})
	);

	try {
		const resend = getResendClient();
		await resend.emails.send({
			from: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
			to: params.customerEmail,
			subject: `Your Quote is Ready - ${params.orderNumber}`,
			html: htmlContent,
		});

		console.log(`Quote sent email to ${params.customerEmail} for order ${params.orderNumber}`);
	} catch (error) {
		console.error('Error sending quote email:', error);
		throw error;
	}
}

/**
 * Send payment confirmed email to customer
 */
export async function sendPaymentConfirmedEmail(params: {
	orderNumber: string;
	customerEmail: string;
	customerName?: string;
	amount: number;
	currency: string;
	transactionId: string;
	invoiceUrl?: string;
	dashboardUrl?: string;
}) {
	if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
		console.log('Email not configured. Skipping email notification.');
		return;
	}

	const htmlContent = await render(
		PaymentConfirmedEmail({
			orderNumber: params.orderNumber,
			customerName: params.customerName,
			amount: params.amount,
			currency: params.currency,
			transactionId: params.transactionId,
			invoiceUrl: params.invoiceUrl,
			dashboardUrl: params.dashboardUrl,
			contactEmail: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
		})
	);

	try {
		const resend = getResendClient();
		await resend.emails.send({
			from: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
			to: params.customerEmail,
			subject: `Payment Confirmed - ${params.orderNumber}`,
			html: htmlContent,
		});

		console.log(`Payment confirmation email sent to ${params.customerEmail} for order ${params.orderNumber}`);
	} catch (error) {
		console.error('Error sending payment confirmation email:', error);
		throw error;
	}
}

/**
 * Send quote request received email to customer
 */
export async function sendQuoteRequestReceivedEmail(params: {
	orderNumber: string;
	customerEmail: string;
	customerName?: string;
	serviceName: string;
	trackingUrl: string;
	contactPhone?: string;
}) {
	if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
		console.log('Email not configured. Skipping email notification.');
		return;
	}

	const htmlContent = await render(
		QuoteRequestReceivedEmail({
			orderNumber: params.orderNumber,
			customerName: params.customerName,
			serviceName: params.serviceName,
			trackingUrl: params.trackingUrl,
			contactEmail: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
			contactPhone: params.contactPhone,
		})
	);

	try {
		const resend = getResendClient();
		await resend.emails.send({
			from: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
			to: params.customerEmail,
			subject: `Your Request Has Been Received - ${params.orderNumber}`,
			html: htmlContent,
		});

		console.log(`Quote request received email sent to ${params.customerEmail} for order ${params.orderNumber}`);
	} catch (error) {
		console.error('Error sending quote request received email:', error);
		throw error;
	}
}

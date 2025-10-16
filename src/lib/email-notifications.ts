import { Resend } from 'resend';
import { Application, ApplicationStatus } from './admin-queries';
import { services } from '@/data/services';

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

function getServiceName(serviceSlug: string): string {
	const service = services.find((s) => s.slug === serviceSlug);
	return service?.title || serviceSlug;
}

export async function sendOrderStatusEmail(order: Application) {
	if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
		console.log('Email not configured. Skipping email notification.');
		return;
	}

	const statusInfo = statusMessages[order.status];
	const serviceName = getServiceName(order.service_slug);
	const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track?order=${order.order_number}`;

	const htmlContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${statusInfo.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
		<tr>
			<td align="center">
				<table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<!-- Header -->
					<tr>
						<td style="background-color: rgba(14, 33, 160, 1); padding: 30px 40px; text-align: center;">
							<h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
								Order Update
							</h1>
						</td>
					</tr>

					<!-- Content -->
					<tr>
						<td style="padding: 40px;">
							<p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333;">
								Hi ${order.customer_name || 'there'},
							</p>

							<p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333;">
								${statusInfo.message}
							</p>

							<!-- Order Details Box -->
							<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; margin: 30px 0;">
								<tr>
									<td style="padding: 20px;">
										<table width="100%" cellpadding="8" cellspacing="0">
											<tr>
												<td style="color: #666; font-size: 14px;">Order Number:</td>
												<td style="color: #333; font-size: 14px; font-weight: 600; text-align: right;">
													${order.order_number}
												</td>
											</tr>
											<tr>
												<td style="color: #666; font-size: 14px;">Service:</td>
												<td style="color: #333; font-size: 14px; text-align: right;">
													${serviceName}
												</td>
											</tr>
											<tr>
												<td style="color: #666; font-size: 14px;">Status:</td>
												<td style="color: #333; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">
													${order.status.replace(/_/g, ' ')}
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>

							<!-- CTA Button -->
							<table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
								<tr>
									<td align="center">
										<a href="${trackingUrl}"
											 style="display: inline-block; background-color: rgba(14, 33, 160, 1); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
											Track Your Order
										</a>
									</td>
								</tr>
							</table>

							<p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #666;">
								If you have any questions, feel free to reply to this email or contact us at
								<a href="mailto:${process.env.CONTACT_EMAIL}" style="color: rgba(14, 33, 160, 1); text-decoration: none;">
									${process.env.CONTACT_EMAIL}
								</a>
							</p>
						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td style="background-color: #f9f9f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
							<p style="margin: 0; font-size: 14px; color: #666;">
								© ${new Date().getFullYear()} Tasheel. All rights reserved.
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim();

	try {
		const resend = getResendClient();
		await resend.emails.send({
			from: process.env.CONTACT_EMAIL || 'noreply@tasheel.com',
			to: order.applicant_email,
			subject: `${statusInfo.subject} - ${order.order_number}`,
			html: htmlContent,
		});

		console.log(`Email sent to ${order.applicant_email} for order ${order.order_number}`);
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
}

/**
 * WhatsApp Notification Functions
 * 
 * Send WhatsApp messages for order updates, quotes, payments, etc.
 */

import { sendWhatsAppMessage, formatPhoneNumber, isValidPhoneNumber } from './whatsapp';

interface OrderNotificationParams {
	orderNumber: string;
	customerPhone: string;
	customerName?: string;
	serviceName: string;
}

/**
 * Send order confirmation WhatsApp message
 */
export async function sendOrderConfirmationWhatsApp(params: OrderNotificationParams): Promise<void> {
	if (!isValidPhoneNumber(params.customerPhone)) {
		console.warn(`Invalid phone number for WhatsApp: ${params.customerPhone}`);
		return;
	}

	const formattedPhone = formatPhoneNumber(params.customerPhone);
	const message = `مرحبا ${params.customerName || 'عزيزي العميل'}،

شكراً لاستخدام منصة تسهيل! تم استلام طلبك بنجاح.

📋 رقم الطلب: ${params.orderNumber}
🛎️ الخدمة: ${params.serviceName}

سيراجع فريقنا طلبك خلال ساعتين ونتصل بك.

للمتابعة: https://tasheel.ps/track?order=${params.orderNumber}

---
Hello ${params.customerName || 'there'},

Thank you for choosing Tasheel! We've received your request.

📋 Order Number: ${params.orderNumber}
🛎️ Service: ${params.serviceName}

Our team will review your request within 2 hours and contact you.

Track: https://tasheel.ps/track?order=${params.orderNumber}`;

	await sendWhatsAppMessage({
		to: formattedPhone,
		message,
	});
}

/**
 * Send quote ready WhatsApp message
 */
export async function sendQuoteReadyWhatsApp(params: {
	orderNumber: string;
	customerPhone: string;
	customerName?: string;
	amount: number;
	currency: string;
	paymentLink?: string;
}): Promise<void> {
	if (!isValidPhoneNumber(params.customerPhone)) {
		console.warn(`Invalid phone number for WhatsApp: ${params.customerPhone}`);
		return;
	}

	const formattedPhone = formatPhoneNumber(params.customerPhone);
	const paymentButton = params.paymentLink
		? `\n💳 للدفع: ${params.paymentLink}`
		: '';
	const message = `مرحبا ${params.customerName || 'عزيزي العميل'}،

عرض السعر جاهز!

📋 رقم الطلب: ${params.orderNumber}
💰 المبلغ: ${params.amount.toFixed(2)} ${params.currency}${paymentButton}

⏰ هذا العرض صالح لمدة 48 ساعة.

---
Hello ${params.customerName || 'there'},

Your quote is ready!

📋 Order Number: ${params.orderNumber}
💰 Amount: ${params.amount.toFixed(2)} ${params.currency}${paymentButton ? `\n💳 Pay: ${params.paymentLink}` : ''}

⏰ This quote is valid for 48 hours.`;

	await sendWhatsAppMessage({
		to: formattedPhone,
		message,
	});
}

/**
 * Send payment confirmed WhatsApp message
 */
export async function sendPaymentConfirmedWhatsApp(params: {
	orderNumber: string;
	customerPhone: string;
	customerName?: string;
	amount: number;
	currency: string;
	transactionId: string;
}): Promise<void> {
	if (!isValidPhoneNumber(params.customerPhone)) {
		console.warn(`Invalid phone number for WhatsApp: ${params.customerPhone}`);
		return;
	}

	const formattedPhone = formatPhoneNumber(params.customerPhone);
	const message = `✅ تم تأكيد الدفعة!

مرحبا ${params.customerName || 'عزيزي العميل'}،

تم استلام دفعتك بنجاح.

📋 رقم الطلب: ${params.orderNumber}
💰 المبلغ: ${params.amount.toFixed(2)} ${params.currency}
🔖 رقم المعاملة: ${params.transactionId}

سنتصل بك قريباً لبدء معالجة طلبك.

---
✅ Payment Confirmed!

Hello ${params.customerName || 'there'},

Your payment has been successfully processed.

📋 Order Number: ${params.orderNumber}
💰 Amount: ${params.amount.toFixed(2)} ${params.currency}
🔖 Transaction ID: ${params.transactionId}

We'll contact you soon to start processing your order.`;

	await sendWhatsAppMessage({
		to: formattedPhone,
		message,
	});
}

/**
 * Send status update WhatsApp message
 */
export async function sendStatusUpdateWhatsApp(params: {
	orderNumber: string;
	customerPhone: string;
	customerName?: string;
	status: string;
	statusMessage: string;
}): Promise<void> {
	if (!isValidPhoneNumber(params.customerPhone)) {
		console.warn(`Invalid phone number for WhatsApp: ${params.customerPhone}`);
		return;
	}

	const formattedPhone = formatPhoneNumber(params.customerPhone);
	const message = `📢 تحديث على طلبك

مرحبا ${params.customerName || 'عزيزي العميل'}،

${params.statusMessage}

📋 رقم الطلب: ${params.orderNumber}
📊 الحالة: ${params.status}

للمتابعة: https://tasheel.ps/track?order=${params.orderNumber}

---
📢 Update on Your Request

Hello ${params.customerName || 'there'},

${params.statusMessage}

📋 Order Number: ${params.orderNumber}
📊 Status: ${params.status}

Track: https://tasheel.ps/track?order=${params.orderNumber}`;

	await sendWhatsAppMessage({
		to: formattedPhone,
		message,
	});
}

/**
 * Send order completed WhatsApp message
 */
export async function sendOrderCompletedWhatsApp(params: {
	orderNumber: string;
	customerPhone: string;
	customerName?: string;
	downloadUrl?: string;
}): Promise<void> {
	if (!isValidPhoneNumber(params.customerPhone)) {
		console.warn(`Invalid phone number for WhatsApp: ${params.customerPhone}`);
		return;
	}

	const formattedPhone = formatPhoneNumber(params.customerPhone);
	const downloadLink = params.downloadUrl
		? `\n📥 للتحميل: ${params.downloadUrl}`
		: '';
	const message = `🎉 طلبك جاهز!

مرحبا ${params.customerName || 'عزيزي العميل'}،

تم إكمال طلبك بنجاح!

📋 رقم الطلب: ${params.orderNumber}${downloadLink}

يمكنك تحميل الملفات من لوحة التحكم الخاصة بك.

شكراً لاستخدام منصة تسهيل! 🙏

---
🎉 Your Order is Ready!

Hello ${params.customerName || 'there'},

Your order has been completed successfully!

📋 Order Number: ${params.orderNumber}${downloadLink ? `\n📥 Download: ${params.downloadUrl}` : ''}

You can download files from your dashboard.

Thank you for using Tasheel! 🙏`;

	await sendWhatsAppMessage({
		to: formattedPhone,
		message,
	});
}


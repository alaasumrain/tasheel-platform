'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { IconCheck } from '@tabler/icons-react';

// Celebration Animation Component
export function CelebrationAnimation({ show }: { show: boolean }) {
	return (
		<AnimatePresence>
			{show && (
				<Box
					component={motion.div}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						pointerEvents: 'none',
						zIndex: 9999,
						overflow: 'hidden',
					}}
				>
					{/* Confetti particles */}
					{Array.from({ length: 50 }).map((_, i) => (
						<Box
							key={i}
							component={motion.div}
							initial={{
								x: Math.random() * window.innerWidth,
								y: -20,
								rotate: 0,
								opacity: 1,
							}}
							animate={{
								y: window.innerHeight + 20,
								rotate: 360,
								opacity: 0,
							}}
							transition={{
								duration: Math.random() * 2 + 1,
								delay: Math.random() * 0.5,
								ease: 'easeOut',
							}}
							sx={{
								position: 'absolute',
								width: 10,
								height: 10,
								backgroundColor: ['primary.main', 'accent.main', 'success.main', 'warning.main'][
									Math.floor(Math.random() * 4)
								],
								borderRadius: '50%',
							}}
						/>
					))}
					{/* Success checkmark animation */}
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: [0, 1.2, 1] }}
							transition={{ duration: 0.5 }}
						>
							<Box
								sx={{
									width: 120,
									height: 120,
									borderRadius: '50%',
									backgroundColor: 'success.main',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
								}}
							>
								<IconCheck size={64} color="white" />
							</Box>
						</motion.div>
					</Box>
				</Box>
			)}
		</AnimatePresence>
	);
}

// QR Code Component for Order Tracking
export function OrderQRCode({ orderNumber, locale }: { orderNumber: string; locale: 'en' | 'ar' }) {
	const trackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/track?order=${encodeURIComponent(orderNumber)}`;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
				p: 3,
				borderRadius: 2,
				border: '1px solid',
				borderColor: 'divider',
				backgroundColor: 'background.paper',
			}}
		>
			<Typography variant="subtitle2" fontWeight={600}>
				{locale === 'ar' ? 'امسح للتبع' : 'Scan to Track'}
			</Typography>
			<Box
				sx={{
					p: 2,
					backgroundColor: 'white',
					borderRadius: 2,
					boxShadow: 1,
				}}
			>
				<QRCodeSVG value={trackUrl} size={160} level="M" />
			</Box>
			<Typography variant="caption" color="text.secondary" textAlign="center">
				{locale === 'ar'
					? 'امسح رمز QR أعلاه لتتبع طلبك'
					: 'Scan the QR code above to track your order'}
			</Typography>
		</Box>
	);
}

// Add to Calendar Component
export function AddToCalendarButton({
	orderNumber,
	estimatedDate,
	locale,
}: {
	orderNumber: string;
	estimatedDate?: Date;
	locale: 'en' | 'ar';
}) {
	const handleAddToCalendar = () => {
		if (!estimatedDate) return;

		const startDate = estimatedDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		const endDate = new Date(estimatedDate.getTime() + 60 * 60 * 1000)
			.toISOString()
			.replace(/[-:]/g, '')
			.split('.')[0] + 'Z';

		const title = encodeURIComponent(
			locale === 'ar' ? `متابعة طلب ${orderNumber}` : `Follow up on Order ${orderNumber}`
		);
		const description = encodeURIComponent(
			locale === 'ar'
				? `متابعة حالة الطلب ${orderNumber}`
				: `Follow up on order status for ${orderNumber}`
		);
		const location = encodeURIComponent('Tasheel Platform');

		const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;

		window.open(googleCalendarUrl, '_blank');
	};

	if (!estimatedDate) return null;

	return (
		<Button
			variant="outlined"
			size="medium"
			onClick={handleAddToCalendar}
			sx={{ minWidth: 200 }}
		>
			{locale === 'ar' ? 'إضافة إلى التقويم' : 'Add to Calendar'}
		</Button>
	);
}

// Download Receipt Component
export function DownloadReceiptButton({
	orderNumber,
	customerName,
	serviceName,
	submittedAt,
	locale,
}: {
	orderNumber: string;
	customerName?: string | null;
	serviceName?: string | null;
	submittedAt?: string | null;
	locale: 'en' | 'ar';
}) {
	const handleDownloadReceipt = () => {
		// Create a simple receipt HTML
		const receiptHTML = `
			<!DOCTYPE html>
			<html dir="${locale === 'ar' ? 'rtl' : 'ltr'}">
			<head>
				<meta charset="UTF-8">
				<title>${locale === 'ar' ? 'إيصال الطلب' : 'Order Receipt'} - ${orderNumber}</title>
				<style>
					body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
					.header { text-align: center; margin-bottom: 30px; }
					.order-number { font-size: 24px; font-weight: bold; margin: 20px 0; }
					.details { margin: 20px 0; }
					.detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
					.footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="header">
					<h1>${locale === 'ar' ? 'منصة تسهيل' : 'Tasheel Platform'}</h1>
					<div class="order-number">${locale === 'ar' ? 'رقم الطلب' : 'Order Number'}: ${orderNumber}</div>
				</div>
				<div class="details">
					${customerName ? `<div class="detail-row"><span>${locale === 'ar' ? 'العميل' : 'Customer'}:</span><span>${customerName}</span></div>` : ''}
					${serviceName ? `<div class="detail-row"><span>${locale === 'ar' ? 'الخدمة' : 'Service'}:</span><span>${serviceName}</span></div>` : ''}
					${submittedAt ? `<div class="detail-row"><span>${locale === 'ar' ? 'تاريخ الإرسال' : 'Submitted'}:</span><span>${new Date(submittedAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span></div>` : ''}
				</div>
				<div class="footer">
					${locale === 'ar' ? 'شكراً لاستخدام منصة تسهيل' : 'Thank you for using Tasheel Platform'}
				</div>
			</body>
			</html>
		`;

		// Create blob and download
		const blob = new Blob([receiptHTML], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `receipt-${orderNumber}.html`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<Button variant="outlined" size="medium" onClick={handleDownloadReceipt} sx={{ minWidth: 200 }}>
			{locale === 'ar' ? 'تحميل الإيصال' : 'Download Receipt'}
		</Button>
	);
}


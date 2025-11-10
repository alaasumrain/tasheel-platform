import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, getOrderById, ApplicationStatus } from '@/lib/admin-queries';
import { sendOrderStatusEmail } from '@/lib/email-notifications';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { logger } from '@/lib/utils/logger';

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic';

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		// Require admin authentication
		await requireAdminAuthAPI();

		const { id } = await context.params;
		const { status, notes } = await request.json();

		if (!status) {
			return NextResponse.json({ error: 'Status is required' }, { status: 400 });
		}

		// Update the order status
		await updateOrderStatus(id, status as ApplicationStatus, notes);

		// Get the updated order for email
		const order = await getOrderById(id);

		// Send notification email to customer
		try {
			await sendOrderStatusEmail(order);
		} catch (emailError) {
			logger.error('Failed to send email notification', emailError, { orderId: id });
			// Don't fail the request if email fails
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		logger.error('Error updating order status', error, { orderId: (await context.params).id });
		return NextResponse.json(
			{ error: 'Failed to update status' },
			{ status: 500 }
		);
	}
}

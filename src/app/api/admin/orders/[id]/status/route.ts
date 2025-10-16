import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateOrderStatus, getOrderById, ApplicationStatus } from '@/lib/admin-queries';
import { sendOrderStatusEmail } from '@/lib/email-notifications';

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		// Check admin auth
		const cookieStore = await cookies();
		const session = cookieStore.get('admin_session');

		if (!session || session.value !== 'authenticated') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

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
			console.error('Failed to send email notification:', emailError);
			// Don't fail the request if email fails
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating order status:', error);
		return NextResponse.json(
			{ error: 'Failed to update status' },
			{ status: 500 }
		);
	}
}

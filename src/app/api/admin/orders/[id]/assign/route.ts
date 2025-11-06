import { NextRequest, NextResponse } from 'next/server';
import { assignOrder } from '@/lib/admin-queries';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// TODO: Add admin authentication check here
		// Get the logged-in admin's name for the timeline event

		const { id } = await params;
		const body = await request.json();
		const { userId } = body;

		// userId can be null (for unassigning) or a valid UUID
		await assignOrder(id, userId || null, 'Admin'); // TODO: Pass actual admin name

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating assignment:', error);
		return NextResponse.json(
			{ error: 'Failed to update assignment' },
			{ status: 500 }
		);
	}
}

import { NextRequest, NextResponse } from 'next/server';
import { assignOrder } from '@/lib/admin-queries';
import { requireAdminAuthAPI } from '@/lib/admin-auth';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Require admin authentication
		const adminUser = await requireAdminAuthAPI();

		const { id } = await params;
		const body = await request.json();
		const { userId } = body;

		// userId can be null (for unassigning) or a valid UUID
		await assignOrder(id, userId || null, adminUser.name || adminUser.email);

		return NextResponse.json({ success: true });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error updating assignment:', error);
		return NextResponse.json(
			{ error: 'Failed to update assignment' },
			{ status: 500 }
		);
	}
}

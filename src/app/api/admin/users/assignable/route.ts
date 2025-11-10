import { NextRequest, NextResponse } from 'next/server';
import { getAssignableUsers } from '@/lib/admin-queries';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { logger } from '@/lib/utils/logger';

// Force dynamic rendering for API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	try {
		// Require admin authentication
		await requireAdminAuthAPI();

		const users = await getAssignableUsers();
		return NextResponse.json(users);
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		logger.error('Error fetching assignable users', error);
		return NextResponse.json(
			{ error: 'Failed to fetch assignable users' },
			{ status: 500 }
		);
	}
}

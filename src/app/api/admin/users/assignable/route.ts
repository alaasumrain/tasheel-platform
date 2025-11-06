import { NextRequest, NextResponse } from 'next/server';
import { getAssignableUsers } from '@/lib/admin-queries';

export async function GET(request: NextRequest) {
	try {
		// TODO: Add admin authentication check here
		// For now, we'll allow the request

		const users = await getAssignableUsers();
		return NextResponse.json(users);
	} catch (error) {
		console.error('Error fetching assignable users:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch assignable users' },
			{ status: 500 }
		);
	}
}

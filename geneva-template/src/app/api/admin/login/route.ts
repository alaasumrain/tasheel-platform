import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
	try {
		const { password } = await request.json();

		// Check against environment variable
		const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

		if (password === adminPassword) {
			// Set a secure cookie
			const cookieStore = await cookies();
			cookieStore.set('admin_session', 'authenticated', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24, // 24 hours
			});

			return NextResponse.json({ success: true });
		} else {
			return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
		}
	} catch {
		return NextResponse.json(
			{ error: 'An error occurred' },
			{ status: 500 }
		);
	}
}

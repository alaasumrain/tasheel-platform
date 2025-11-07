import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		// Authenticate with Supabase Auth
		const {
			data: { user, session },
			error: authError,
		} = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError || !user || !session) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Verify user exists in the users table and is active
		const { data: adminUser, error: userError } = await supabase
			.from('users')
			.select('id, email, name, role, is_active')
			.eq('id', user.id)
			.eq('is_active', true)
			.single();

		if (userError || !adminUser) {
			// Sign out the user if they're not in the users table
			await supabase.auth.signOut();
			return NextResponse.json(
				{ error: 'Access denied. User not authorized.' },
				{ status: 403 }
			);
		}

		// Session is automatically managed by Supabase via cookies
		// No need to manually set cookies - Supabase handles this

		return NextResponse.json({
			success: true,
			user: {
				id: adminUser.id,
				email: adminUser.email,
				name: adminUser.name,
				role: adminUser.role,
			},
		});
	} catch (error) {
		console.error('Admin login error:', error);
		return NextResponse.json(
			{ error: 'An error occurred during login' },
			{ status: 500 }
		);
	}
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

// Create Supabase admin client for user management
function getSupabaseAdmin() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseServiceKey) {
		throw new Error('Missing Supabase service role key');
	}

	const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
	return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

export async function POST(request: NextRequest) {
	try {
		await requireAdminAuthAPI();

		const { email, password, name, role } = await request.json();

		if (!email || !password || !name || !role) {
			return NextResponse.json(
				{ error: 'Missing required fields: email, password, name, role' },
				{ status: 400 }
			);
		}

		const supabaseAdmin = getSupabaseAdmin();

		// Step 1: Create user in Supabase Auth
		const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: {
				name,
				role,
			},
		});

		if (authError || !authUser.user) {
			console.error('Error creating auth user:', authError);
			return NextResponse.json(
				{ error: authError?.message || 'Failed to create user' },
				{ status: 500 }
			);
		}

		// Step 2: Create record in users table
		const supabase = await createClient();
		const { data: dbUser, error: dbError } = await supabase
			.from('users')
			.insert({
				id: authUser.user.id,
				email: authUser.user.email!,
				name,
				role,
				is_active: true,
			})
			.select()
			.single();

		if (dbError) {
			// Clean up auth user if DB insert fails
			await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
			console.error('Error creating user record:', dbError);
			return NextResponse.json(
				{ error: 'Failed to create user record' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, user: dbUser });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in POST /api/admin/users:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


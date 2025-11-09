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

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const { email, name, role, is_active, password } = await request.json();

		const supabase = await createClient();
		const supabaseAdmin = getSupabaseAdmin();

		// Update user in users table
		const updateData: any = {
			updated_at: new Date().toISOString(),
		};

		if (email !== undefined) updateData.email = email;
		if (name !== undefined) updateData.name = name;
		if (role !== undefined) updateData.role = role;
		if (is_active !== undefined) updateData.is_active = is_active;

		const { data: dbUser, error: dbError } = await supabase
			.from('users')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (dbError) {
			console.error('Error updating user:', dbError);
			return NextResponse.json(
				{ error: 'Failed to update user' },
				{ status: 500 }
			);
		}

		// Update auth user if email or password changed
		if (email !== undefined || password !== undefined) {
			const authUpdateData: any = {};
			if (email !== undefined) authUpdateData.email = email;
			if (password !== undefined) authUpdateData.password = password;

			const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdateData);

			if (authError) {
				console.error('Error updating auth user:', authError);
				// Don't fail the request, DB update succeeded
			}
		}

		return NextResponse.json({ success: true, user: dbUser });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in PUT /api/admin/users/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const supabase = await createClient();
		const supabaseAdmin = getSupabaseAdmin();

		// Soft delete: set is_active to false
		const { error: dbError } = await supabase
			.from('users')
			.update({
				is_active: false,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id);

		if (dbError) {
			console.error('Error deleting user:', dbError);
			return NextResponse.json(
				{ error: 'Failed to delete user' },
				{ status: 500 }
			);
		}

		// Optionally delete from auth (commented out for safety)
		// await supabaseAdmin.auth.admin.deleteUser(id);

		return NextResponse.json({ success: true });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in DELETE /api/admin/users/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


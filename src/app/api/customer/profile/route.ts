import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Create or update customer profile after Supabase Auth signup
 * Called after auth.signUp() to sync customer data
 */
export async function POST(request: Request) {
	try {
		const supabase = await createClient();

		// Get authenticated user
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { name, phone } = body;

		// Upsert customer profile (id = auth.users.id)
		const { data: customer, error: customerError } = await supabase
			.from('customers')
			.upsert(
				{
					id: user.id,
					email: user.email!,
					name: name || null,
					phone: phone || null,
					language_preference: 'ar', // Default to Arabic
				},
				{
					onConflict: 'id',
				}
			)
			.select()
			.single();

		if (customerError) {
			console.error('Error creating customer profile:', customerError);
			return NextResponse.json(
				{ error: 'Failed to create customer profile' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, customer });
	} catch (error) {
		console.error('Error in POST /api/customer/profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

/**
 * Update customer profile
 */
export async function PATCH(request: Request) {
	try {
		const supabase = await createClient();

		// Get authenticated user
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { name, phone, language_preference } = body;

		// Update customer profile
		const { data: customer, error: customerError } = await supabase
			.from('customers')
			.update({
				name: name || null,
				phone: phone || null,
				language_preference: language_preference || 'ar',
				updated_at: new Date().toISOString(),
			})
			.eq('id', user.id)
			.select()
			.single();

		if (customerError) {
			console.error('Error updating customer profile:', customerError);
			return NextResponse.json(
				{ error: 'Failed to update customer profile' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, customer });
	} catch (error) {
		console.error('Error in PATCH /api/customer/profile:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


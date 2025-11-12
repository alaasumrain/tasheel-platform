import { createClient as createServiceClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey } from '@/lib/supabase-config';

/**
 * Find auth user by phone number
 * OPTIMIZED: First checks customers table (indexed), then falls back to admin API if needed
 * Returns the user if found, null otherwise
 */
export async function findUserByPhone(phone: string): Promise<{ id: string; email?: string; phone?: string } | null> {
	const serviceKey = getSupabaseServiceKey();
	if (!serviceKey) {
		throw new Error('Server configuration error: SUPABASE_SERVICE_ROLE_KEY not set');
	}

	const serviceClient = createServiceClient(getSupabaseUrl(), serviceKey);
	
	// OPTIMIZATION: Check customers table first (has phone column, likely indexed)
	// This is much faster than paginating through all auth users
	const { data: customer, error: customerError } = await serviceClient
		.from('customers')
		.select('id, email, phone')
		.eq('phone', phone)
		.maybeSingle();

	if (!customerError && customer) {
		// Found in customers table - verify user exists in auth.users
		// Use admin API to get full user details
		const { data: authUser, error: authError } = await serviceClient.auth.admin.getUserById(customer.id);
		
		if (!authError && authUser?.user) {
			return {
				id: authUser.user.id,
				email: authUser.user.email,
				phone: authUser.user.phone,
			};
		}
	}

	// Fallback: Use admin API listUsers with pagination (slower but comprehensive)
	// This handles edge cases where customer record doesn't exist yet
	let page = 1;
	const perPage = 1000;
	const maxPages = 100; // Reduced from 1000 - if we have 100k+ users, optimize differently
	
	while (page <= maxPages) {
		const { data, error } = await serviceClient.auth.admin.listUsers({
			page,
			perPage,
		});

		if (error) {
			console.error('Error listing users:', error);
			return null;
		}

		const users = data?.users || [];
		const foundUser = users.find(u => u.phone === phone);
		
		if (foundUser) {
			return {
				id: foundUser.id,
				email: foundUser.email,
				phone: foundUser.phone,
			};
		}

		// If we got fewer users than perPage, we've reached the end
		if (users.length < perPage) {
			break;
		}

		page++;
	}

	return null;
}


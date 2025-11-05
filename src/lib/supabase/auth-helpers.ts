'use server';

import { createClient } from './server';
import { redirect } from 'next/navigation';

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	return user;
}

/**
 * Get customer profile for authenticated user
 */
export async function getCustomerProfile() {
	const user = await getCurrentUser();

	if (!user) {
		return null;
	}

	const supabase = await createClient();
	const { data: customer, error } = await supabase
		.from('customers')
		.select('*')
		.eq('id', user.id)
		.single();

	if (error || !customer) {
		return null;
	}

	return customer;
}


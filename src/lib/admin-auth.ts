import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

/**
 * Admin user interface
 */
export interface AdminUser {
	id: string;
	email: string;
	name: string | null;
	role: 'admin' | 'officer' | 'supervisor' | 'intake' | 'auditor';
	is_active: boolean;
}

/**
 * Get the current authenticated admin user
 * Returns null if not authenticated or not an admin
 */
export async function getAdminUser(): Promise<AdminUser | null> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return null;
		}

		// Check if user exists in the users table and is active
		const { data: adminUser, error: userError } = await supabase
			.from('users')
			.select('id, email, name, role, is_active')
			.eq('id', user.id)
			.eq('is_active', true)
			.single();

		if (userError || !adminUser) {
			return null;
		}

		return adminUser as AdminUser;
	} catch (error) {
		console.error('Error checking admin auth:', error);
		return null;
	}
}

/**
 * Require admin authentication - redirects to login if not authenticated
 * Use this in Server Components and Server Actions
 */
export async function checkAdminAuth(): Promise<AdminUser> {
	const adminUser = await getAdminUser();

	if (!adminUser) {
		redirect('/admin/login');
	}

	return adminUser;
}

/**
 * Check admin authentication for API routes
 * Returns authentication status and admin user if authenticated
 * Use this in API routes that need to return JSON instead of redirecting
 */
export async function checkAdminAuthAPI(): Promise<{
	isAuthenticated: boolean;
	adminUser?: AdminUser;
}> {
	const adminUser = await getAdminUser();

	if (!adminUser) {
		return { isAuthenticated: false };
	}

	return { isAuthenticated: true, adminUser };
}

/**
 * Require admin authentication for API routes
 * Throws error if not authenticated (returns 401)
 */
export async function requireAdminAuthAPI(): Promise<AdminUser> {
	const adminUser = await getAdminUser();

	if (!adminUser) {
		throw new Error('Unauthorized');
	}

	return adminUser;
}

'use server';

import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

import { logger } from '@/lib/utils/logger';

import { createClient } from './server';

export interface CustomerProfile {
	id: string;
	email: string | null;
	name: string | null;
	phone: string | null;
	language_preference?: 'ar' | 'en';
	created_at?: string;
	updated_at?: string;
}

interface CreateCustomerOptions {
	name?: string | null;
	phone?: string | null;
	email?: string | null;
	languagePreference?: 'ar' | 'en';
}

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
export async function getCustomerProfile(existingUser?: User): Promise<CustomerProfile | null> {
	const user = existingUser ?? (await getCurrentUser());

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

	return customer as CustomerProfile;
}

export async function createCustomerFromUser(
	user: User,
	options: CreateCustomerOptions = {}
): Promise<CustomerProfile | null> {
	const supabase = await createClient();

	const fullName =
		options.name ||
		(user.user_metadata?.name as string | undefined) ||
		(user.user_metadata?.full_name as string | undefined) ||
		null;
	const phone =
		options.phone ||
		(user.phone as string | undefined) ||
		(user.user_metadata?.phone as string | undefined) ||
		null;
	const email = options.email ?? user.email ?? null;

	const { data: customer, error } = await supabase
		.from('customers')
		.upsert(
			{
				id: user.id,
				email,
				name: fullName,
				phone,
				language_preference: options.languagePreference || 'ar',
			},
			{ onConflict: 'id' }
		)
		.select('*')
		.single();

	if (error || !customer) {
		logger.error('Failed to create customer profile', error, { userId: user.id });
		return null;
	}

	return customer as CustomerProfile;
}

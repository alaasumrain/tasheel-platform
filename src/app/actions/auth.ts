'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type AuthResponse = 
	| { error: string }
	| { user: { id: string; email: string | undefined }; session: { access_token: string } };

/**
 * Login with email and password
 * Server action - handles authentication securely
 */
export async function login(formData: { email: string; password: string }): Promise<AuthResponse> {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithPassword({
		email: formData.email,
		password: formData.password,
	});

	if (error) {
		return { error: error.message };
	}

	if (!data.user || !data.session) {
		return { error: 'Authentication failed' };
	}

	// Revalidate user-dependent pages
	revalidatePath('/dashboard');
	revalidatePath('/profile');

	return {
		user: {
			id: data.user.id,
			email: data.user.email,
		},
		session: {
			access_token: data.session.access_token,
		},
	};
}

/**
 * Sign up with email and password
 * Creates customer record automatically
 */
export async function signup(formData: {
	name: string;
	email: string;
	password: string;
	phone?: string;
}): Promise<AuthResponse> {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signUp({
		email: formData.email,
		password: formData.password,
		options: {
			data: {
				full_name: formData.name,
				phone: formData.phone || null,
			},
		},
	});

	if (error) {
		return { error: error.message };
	}

	if (!data.user) {
		return { error: 'Failed to create account' };
	}

	// Create customer record
	// This will be handled by a database trigger or we can do it here
	// For now, let's create it manually
	const { error: customerError } = await supabase
		.from('customers')
		.insert({
			id: data.user.id,
			email: formData.email,
			phone: formData.phone || null,
			name: formData.name,
		});

	// Don't fail if customer creation fails - it might already exist
	// or be created by a trigger

	revalidatePath('/dashboard');

	return {
		user: {
			id: data.user.id,
			email: data.user.email,
		},
		session: data.session ? {
			access_token: data.session.access_token,
		} : {
			access_token: '', // Email confirmation required
		},
	};
}

/**
 * Logout user
 */
export async function logout(): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		return { error: error.message };
	}

	revalidatePath('/');
	redirect('/');
}


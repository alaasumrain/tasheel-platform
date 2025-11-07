'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseUrl, getSupabaseAnonKey } from '../supabase-config';

/**
 * Client-side Supabase client for use in React components
 * This client automatically handles cookie management for authentication
 */
export function createClient() {
	return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}


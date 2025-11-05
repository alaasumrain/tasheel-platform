'use client';

import { createBrowserClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../supabase-config';

/**
 * Client-side Supabase client for use in React components
 * This client automatically handles cookie management for authentication
 */
export function createClient() {
	return createBrowserClient(supabaseUrl, supabaseAnonKey);
}


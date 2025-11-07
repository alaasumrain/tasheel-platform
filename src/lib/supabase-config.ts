// Centralized Supabase configuration
// Gracefully handle missing env vars instead of crashing the entire app
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Check if Supabase is properly configured
 * Returns true if both URL and key are present
 */
export function isSupabaseConfigured(): boolean {
	return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Get Supabase URL, throwing only if required
 * Use this when Supabase is required for the operation
 */
export function getSupabaseUrl(): string {
	if (!supabaseUrl) {
		throw new Error(
			'Missing Supabase environment variable: NEXT_PUBLIC_SUPABASE_URL is required'
		);
	}
	return supabaseUrl;
}

/**
 * Get Supabase anon key, throwing only if required
 * Use this when Supabase is required for the operation
 */
export function getSupabaseAnonKey(): string {
	if (!supabaseAnonKey) {
		throw new Error(
			'Missing Supabase environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY is required'
		);
	}
	return supabaseAnonKey;
}


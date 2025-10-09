'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Singleton instance
let supabaseClient = null;

export function getSupabaseBrowserClient() {
  // Only create client once and reuse it
  if (!supabaseClient) {
    console.log('🔵 Creating Supabase client (singleton)');
    supabaseClient = createClientComponentClient();
  }
  return supabaseClient;
}

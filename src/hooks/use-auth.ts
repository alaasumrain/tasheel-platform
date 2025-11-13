'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Hook to check authentication state on client side
 * Returns user object if authenticated, null otherwise
 */
export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		let isMounted = true;

		const checkAuth = async () => {
			try {
				const { data, error } = await supabase.auth.getUser();
				if (!isMounted) return;

				if (error) {
					setUser(null);
					setLoading(false);
					return;
				}

				if (data.user) {
					setUser(data.user);
				} else {
					setUser(null);
				}
			} catch (error) {
				if (isMounted) {
					console.error('Error checking auth status:', error);
					setUser(null);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!isMounted) return;

			if (session?.user) {
				setUser(session.user);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [supabase]);

	return { user, loading };
}



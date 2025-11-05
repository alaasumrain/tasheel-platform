import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { requireAuth } from '@/lib/supabase/auth-helpers';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default async function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
	const user = await requireAuth();

	if (!user) {
		redirect('/login');
	}

	return <DashboardLayout>{children}</DashboardLayout>;
}


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAdminAuth() {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session || session.value !== 'authenticated') {
		redirect('/admin/login');
	}

	return true;
}

// For API routes that need to return JSON instead of redirecting
export async function checkAdminAuthAPI() {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session || session.value !== 'authenticated') {
		return { isAuthenticated: false };
	}

	return { isAuthenticated: true };
}

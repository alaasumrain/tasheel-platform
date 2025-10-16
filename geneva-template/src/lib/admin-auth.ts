import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAdminAuth() {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session || session.value !== 'authenticated') {
		redirect('/login');
	}

	return true;
}

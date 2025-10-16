import { AdminLayout } from '@/components/admin/AdminLayout';
import { checkAdminAuth } from '@/lib/admin-auth';

export const metadata = {
	title: 'Admin Dashboard | Tasheel',
	description: 'Manage orders and customers',
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	await checkAdminAuth();

	return <AdminLayout>{children}</AdminLayout>;
}

import { Box } from '@mui/material';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { SLAConfigForm } from '@/components/admin/SLAConfigForm';
import { getSLAConfigs } from '@/lib/admin-queries';
import { getAllServices } from '@/lib/service-queries';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditSLAConfigPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const t = await getTranslations('Admin.sla.configs');
	const { id } = await params;
	const [slaConfigs, services] = await Promise.all([
		getSLAConfigs(),
		getAllServices(),
	]);

	const config = slaConfigs.find(c => c.id === id);

	if (!config) {
		notFound();
	}

	// Map services to include id and name
	const servicesMap = services.map(service => ({
		id: service.id,
		name: service.name_en || service.name_ar || service.slug,
	}));

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'SLA Tracking', href: '/admin/sla' },
					{ label: 'Edit Configuration' },
				]}
			/>
			<SLAConfigForm
				config={config}
				services={servicesMap}
				mode="edit"
			/>
		</Box>
	);
}


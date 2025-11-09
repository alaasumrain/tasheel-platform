import { Box } from '@mui/material';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { SLAConfigForm } from '@/components/admin/SLAConfigForm';
import { getSLAConfigs } from '@/lib/admin-queries';
import { getAllServices } from '@/lib/service-queries';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CreateSLAConfigPage() {
	const t = await getTranslations('Admin.sla.configs');
	const [slaConfigs, services] = await Promise.all([
		getSLAConfigs(),
		getAllServices(),
	]);

	// Map services to include id and name, exclude services that already have configs
	const configuredServiceIds = new Set(slaConfigs.map(c => c.service_id));
	const availableServices = services
		.filter(service => !configuredServiceIds.has(service.id))
		.map(service => ({
			id: service.id,
			name: service.name_en || service.name_ar || service.slug,
		}));

	return (
		<Box>
			<AdminBreadcrumbs
				items={[
					{ label: 'Dashboard', href: '/admin' },
					{ label: 'SLA Tracking', href: '/admin/sla' },
					{ label: 'Create Configuration' },
				]}
			/>
			<SLAConfigForm
				services={availableServices}
				mode="create"
			/>
		</Box>
	);
}


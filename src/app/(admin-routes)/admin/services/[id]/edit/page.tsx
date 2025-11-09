import { notFound } from 'next/navigation';
import { ServiceEditPageClient } from '@/components/admin/ServiceEditPageClient';
import { getServiceCategories } from '@/lib/service-queries';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	// Fetch service using server-side client
	const supabase = await createClient();
	const { data: service, error } = await supabase.from('services').select('*').eq('id', id).single();

	if (error || !service) {
		notFound();
	}

	// Fetch categories
	const categories = await getServiceCategories();

	return <ServiceEditPageClient serviceId={id} initialService={service} initialCategories={categories} />;
}

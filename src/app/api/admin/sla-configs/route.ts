import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
	try {
		await requireAdminAuthAPI();

		const body = await request.json();
		const { service_id, target_hours, warning_threshold_percent } = body;

		if (!service_id || !target_hours) {
			return NextResponse.json(
				{ error: 'Missing required fields: service_id, target_hours' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		const { data: slaConfig, error } = await supabase
			.from('sla_configs')
			.insert({
				service_id,
				target_hours,
				warning_threshold_percent: warning_threshold_percent || 70,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating SLA config:', error);
			return NextResponse.json({ error: 'Failed to create SLA config' }, { status: 500 });
		}

		return NextResponse.json({ success: true, slaConfig });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in POST /api/admin/sla-configs:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


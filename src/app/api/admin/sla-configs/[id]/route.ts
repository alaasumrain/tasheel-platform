import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const body = await request.json();
		const { target_hours, warning_threshold_percent } = body;

		const supabase = await createClient();

		const updateData: any = {
			updated_at: new Date().toISOString(),
		};

		if (target_hours !== undefined) updateData.target_hours = target_hours;
		if (warning_threshold_percent !== undefined) updateData.warning_threshold_percent = warning_threshold_percent;

		const { data: slaConfig, error } = await supabase
			.from('sla_configs')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating SLA config:', error);
			return NextResponse.json({ error: 'Failed to update SLA config' }, { status: 500 });
		}

		return NextResponse.json({ success: true, slaConfig });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in PUT /api/admin/sla-configs/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const supabase = await createClient();

		const { error } = await supabase
			.from('sla_configs')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Error deleting SLA config:', error);
			return NextResponse.json({ error: 'Failed to delete SLA config' }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in DELETE /api/admin/sla-configs/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


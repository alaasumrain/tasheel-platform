import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { getTasks } from '@/lib/admin-queries';

export async function GET(request: NextRequest) {
	try {
		await requireAdminAuthAPI();

		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status') as 'open' | 'in_progress' | 'done' | 'cancelled' | null;
		const assigned_to = searchParams.get('assigned_to');
		const application_id = searchParams.get('application_id');

		const tasks = await getTasks({
			status: status || undefined,
			assigned_to: assigned_to || undefined,
			application_id: application_id || undefined,
		});

		return NextResponse.json({ tasks });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in GET /api/admin/tasks:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const adminUser = await requireAdminAuthAPI();

		const body = await request.json();
		const {
			application_id,
			title,
			description,
			type,
			assigned_to,
			due_date,
			priority,
		} = body;

		if (!title || !type) {
			return NextResponse.json(
				{ error: 'Missing required fields: title, type' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		const { data: task, error } = await supabase
			.from('tasks')
			.insert({
				application_id: application_id || null,
				title,
				description: description || null,
				type,
				assigned_to: assigned_to || null,
				created_by: adminUser.id,
				due_date: due_date || null,
				priority: priority || 'normal',
				status: 'open',
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating task:', error);
			return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
		}

		return NextResponse.json({ success: true, task });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in POST /api/admin/tasks:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


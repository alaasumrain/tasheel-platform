import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { getTaskById } from '@/lib/admin-queries';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const task = await getTaskById(id);

		if (!task) {
			return NextResponse.json({ error: 'Task not found' }, { status: 404 });
		}

		return NextResponse.json({ task });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in GET /api/admin/tasks/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const body = await request.json();
		const {
			title,
			description,
			type,
			assigned_to,
			due_date,
			priority,
			status,
			time_spent_minutes,
			outcome_notes,
		} = body;

		const supabase = await createClient();

		const updateData: any = {
			updated_at: new Date().toISOString(),
		};

		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (type !== undefined) updateData.type = type;
		if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
		if (due_date !== undefined) updateData.due_date = due_date;
		if (priority !== undefined) updateData.priority = priority;
		if (status !== undefined) updateData.status = status;
		if (time_spent_minutes !== undefined) updateData.time_spent_minutes = time_spent_minutes;
		if (outcome_notes !== undefined) updateData.outcome_notes = outcome_notes;

		const { data: task, error } = await supabase
			.from('tasks')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating task:', error);
			return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
		}

		return NextResponse.json({ success: true, task });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in PUT /api/admin/tasks/[id]:', error);
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

		// Soft delete: set status to cancelled
		const { error } = await supabase
			.from('tasks')
			.update({
				status: 'cancelled',
				updated_at: new Date().toISOString(),
			})
			.eq('id', id);

		if (error) {
			console.error('Error deleting task:', error);
			return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in DELETE /api/admin/tasks/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


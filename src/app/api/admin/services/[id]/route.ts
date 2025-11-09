import { NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { executeBeforeDbHook, executeAfterDbHook, createCrudHooksWithAudit } from '@/lib/utils/crud-hooks';
import { z } from 'zod';

// Create hooks for services CRUD operations
const serviceHooks = createCrudHooksWithAudit('services', {
	beforeDb: async (data: any, context) => {
		// Add updated timestamp
		return {
			...data,
			updated_at: new Date().toISOString(),
		};
	},
	afterDb: async (result: any, context) => {
		// Log successful operation
		console.log(`[AUDIT] Service ${context.mode}:`, {
			id: result?.id || result?.service?.id,
			mode: context.mode,
			timestamp: new Date().toISOString(),
		});
		return result;
	},
});

// Validation schema for service update (all fields optional except id)
const serviceUpdateSchema = z.object({
	name_en: z.string().min(1).optional(),
	name_ar: z.string().min(1).optional(),
	slug: z.string().min(1).optional(),
	category_id: z.string().uuid().optional(),
	short_description_en: z.string().optional(),
	short_description_ar: z.string().optional(),
	description_en: z.string().optional(),
	description_ar: z.string().optional(),
	detailed_description: z.string().optional(),
	pricing: z
		.object({
			type: z.enum(['fixed', 'quote', 'starting']),
			amount: z.number().positive().optional(),
			note_en: z.string().optional(),
			note_ar: z.string().optional(),
		})
		.optional(),
	features: z.array(z.string()).optional(),
	process_steps: z
		.array(
			z.object({
				number: z.number(),
				title_en: z.string(),
				title_ar: z.string(),
				description_en: z.string(),
				description_ar: z.string(),
			})
		)
		.optional(),
	required_documents: z.array(z.string()).optional(),
	icon: z.string().optional(),
	image_light: z.string().optional(),
	image_dark: z.string().optional(),
	is_active: z.boolean().optional(),
	is_featured: z.boolean().optional(),
	sort_order: z.number().optional(),
	turnaround_days: z.number().optional(),
	turnaround_window: z.string().optional(),
});

// GET /api/admin/services/[id] - Get single service
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const supabase = await createClient();

		const { data: service, error } = await supabase
			.from('services')
			.select('*, service_categories(name, slug)')
			.eq('id', id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json({ error: 'Service not found' }, { status: 404 });
			}
			console.error('Error fetching service:', error);
			return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
		}

		return NextResponse.json({ service });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in GET /api/admin/services/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT /api/admin/services/[id] - Update service
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const body = await request.json();

		// Validate input
		const validationResult = serviceUpdateSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: 'Validation failed', details: validationResult.error.issues }, { status: 400 });
		}

		const data = validationResult.data;
		const supabase = await createClient();

		// Check if service exists
		const { data: existingService } = await supabase.from('services').select('id, slug').eq('id', id).single();

		if (!existingService) {
			return NextResponse.json({ error: 'Service not found' }, { status: 404 });
		}

		// Execute beforeDb hook
		const transformedData = await executeBeforeDbHook(
			data,
			{ mode: 'edit', resource: 'services' },
			serviceHooks.beforeDb
		);

		// Check if slug is being changed and if new slug already exists
		if (transformedData.slug && transformedData.slug !== existingService.slug) {
			const { data: slugExists } = await supabase.from('services').select('id').eq('slug', transformedData.slug).single();
			if (slugExists) {
				return NextResponse.json({ error: 'Service with this slug already exists' }, { status: 400 });
			}
		}

		// Prepare update data
		const updateData: any = {
			updated_at: new Date().toISOString(),
		};

		// Only include fields that are provided
		if (transformedData.name_en !== undefined) {
			updateData.name = transformedData.name_en; // Fallback name
			updateData.name_en = transformedData.name_en;
		}
		if (transformedData.name_ar !== undefined) updateData.name_ar = transformedData.name_ar;
		if (transformedData.slug !== undefined) updateData.slug = transformedData.slug;
		if (transformedData.category_id !== undefined) updateData.category_id = transformedData.category_id;
		if (transformedData.short_description_en !== undefined) {
			updateData.short_description = transformedData.short_description_en;
			updateData.short_description_en = transformedData.short_description_en;
		}
		if (transformedData.short_description_ar !== undefined) updateData.short_description_ar = transformedData.short_description_ar;
		if (transformedData.description_en !== undefined) updateData.description_en = transformedData.description_en;
		if (transformedData.description_ar !== undefined) updateData.description_ar = transformedData.description_ar;
		if (transformedData.detailed_description !== undefined) updateData.detailed_description = transformedData.detailed_description;
		if (transformedData.pricing !== undefined) updateData.pricing = transformedData.pricing;
		if (transformedData.features !== undefined) updateData.features = transformedData.features;
		if (transformedData.process_steps !== undefined) updateData.process_steps = transformedData.process_steps;
		if (transformedData.required_documents !== undefined) updateData.required_documents = transformedData.required_documents;
		if (transformedData.icon !== undefined) updateData.icon = transformedData.icon;
		if (transformedData.image_light !== undefined) updateData.image_light = transformedData.image_light;
		if (transformedData.image_dark !== undefined) updateData.image_dark = transformedData.image_dark;
		if (transformedData.is_active !== undefined) updateData.is_active = transformedData.is_active;
		if (transformedData.is_featured !== undefined) updateData.is_featured = transformedData.is_featured;
		if (transformedData.sort_order !== undefined) updateData.sort_order = transformedData.sort_order;
		if (transformedData.turnaround_days !== undefined) updateData.turnaround_days = transformedData.turnaround_days;
		if (transformedData.turnaround_window !== undefined) updateData.turnaround_window = transformedData.turnaround_window;

		// Update service
		const { data: service, error: updateError } = await supabase.from('services').update(updateData).eq('id', id).select().single();

		if (updateError) {
			console.error('Error updating service:', updateError);
			return NextResponse.json({ error: 'Failed to update service', details: updateError.message }, { status: 500 });
		}

		// Execute afterDb hook
		const finalResult = await executeAfterDbHook(
			{ success: true, service },
			{ mode: 'edit', resource: 'services', originalData: existingService },
			serviceHooks.afterDb
		);

		return NextResponse.json(finalResult);
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in PUT /api/admin/services/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// DELETE /api/admin/services/[id] - Delete service (soft delete)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		await requireAdminAuthAPI();

		const { id } = await params;
		const supabase = await createClient();

		// Check if service exists
		const { data: existingService } = await supabase.from('services').select('id').eq('id', id).single();

		if (!existingService) {
			return NextResponse.json({ error: 'Service not found' }, { status: 404 });
		}

		// Soft delete (set is_active to false)
		const { error: deleteError } = await supabase
			.from('services')
			.update({ is_active: false, updated_at: new Date().toISOString() })
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting service:', deleteError);
			return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
		}

		// Execute afterDb hook
		const finalResult = await executeAfterDbHook(
			{ success: true, message: 'Service deleted successfully' },
			{ mode: 'delete', resource: 'services', originalData: existingService },
			serviceHooks.afterDb
		);

		return NextResponse.json(finalResult);
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in DELETE /api/admin/services/[id]:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


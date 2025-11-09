import { NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { buildQuery, parseQueryParams } from '@/lib/utils/query-builder';
import { executeBeforeDbHook, executeAfterDbHook, createCrudHooksWithAudit } from '@/lib/utils/crud-hooks';
import { z } from 'zod';

// Create hooks for services CRUD operations
const serviceHooks = createCrudHooksWithAudit('services', {
	beforeDb: async (data: any, context) => {
		// Add timestamps and ensure required fields
		const now = new Date().toISOString();
		return {
			...data,
			created_at: context.mode === 'create' ? now : data.created_at,
			updated_at: now,
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

// Validation schema for service
const serviceSchema = z.object({
	name_en: z.string().min(1, 'English name is required'),
	name_ar: z.string().min(1, 'Arabic name is required'),
	slug: z.string().min(1, 'Slug is required'),
	category_id: z.string().uuid('Invalid category ID'),
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
	is_active: z.boolean().default(true),
	is_featured: z.boolean().default(false),
	sort_order: z.number().default(0),
	turnaround_days: z.number().optional(),
	turnaround_window: z.string().optional(),
});

// GET /api/admin/services - List all services with filtering, sorting, and pagination
export async function GET(request: Request) {
	try {
		await requireAdminAuthAPI();

		const { searchParams } = new URL(request.url);
		const supabase = await createClient();

		// Parse query params
		const queryOptions = parseQueryParams(searchParams);
		
		// Get individual filter params
		const categoryId = searchParams.get('category_id');
		const isActive = searchParams.get('is_active');

		let baseQuery = supabase
			.from('services')
			.select('*, service_categories(name, slug)', { count: queryOptions.page ? 'exact' : undefined });

		// Build query with search, filters, sorting
		const finalOptions: typeof queryOptions = {
			...queryOptions,
			searchFields: queryOptions.searchFields || ['name_en', 'name_ar', 'slug', 'short_description_en'],
			filters: {
				...queryOptions.filters,
				...(categoryId && { category_id: categoryId }),
				...(isActive !== null && { is_active: isActive === 'true' }),
			},
			sortColumn: queryOptions.sortColumn || 'sort_order',
			sortDirection: queryOptions.sortDirection || 'asc',
		};

		const { query: builtQuery, skip, take } = buildQuery(baseQuery, finalOptions);

		// Apply pagination if page is specified
		if (queryOptions.page) {
			builtQuery.range(skip, skip + take - 1);
		}

		// Add secondary sort if primary sort is not name
		if (finalOptions.sortColumn !== 'name' && finalOptions.sortColumn !== 'name_en') {
			builtQuery.order('name', { ascending: true });
		}

		const { data, error, count } = await builtQuery;

		if (error) {
			console.error('Error fetching services:', error);
			return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
		}

		if (queryOptions.page) {
			return NextResponse.json({
				services: data || [],
				pagination: {
					total: count || 0,
					page: queryOptions.page,
					pageSize: take,
					totalPages: Math.ceil((count || 0) / take),
				},
			});
		}

		return NextResponse.json({ services: data || [] });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in GET /api/admin/services:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// POST /api/admin/services - Create new service
export async function POST(request: Request) {
	try {
		await requireAdminAuthAPI();

		const body = await request.json();
		const supabase = await createClient();

		// Validate input
		const validationResult = serviceSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: 'Validation failed', details: validationResult.error.issues }, { status: 400 });
		}

		const data = validationResult.data;

		// Execute beforeDb hook
		const transformedData = await executeBeforeDbHook(
			data,
			{ mode: 'create', resource: 'services' },
			serviceHooks.beforeDb
		);

		// Check if slug already exists
		const { data: existingService } = await supabase.from('services').select('id').eq('slug', transformedData.slug).single();

		if (existingService) {
			return NextResponse.json({ error: 'Service with this slug already exists' }, { status: 400 });
		}

		// Prepare service data
		const serviceData: any = {
			name: data.name_en, // Fallback name
			name_en: data.name_en,
			name_ar: data.name_ar,
			slug: data.slug,
			category_id: data.category_id,
			short_description: data.short_description_en || null,
			short_description_en: data.short_description_en || null,
			short_description_ar: data.short_description_ar || null,
			detailed_description: data.detailed_description || null,
			description_en: data.description_en || null,
			description_ar: data.description_ar || null,
			pricing: data.pricing || null,
			features: data.features || [],
			process_steps: data.process_steps || [],
			required_documents: data.required_documents || [],
			icon: data.icon || null,
			image_light: data.image_light || null,
			image_dark: data.image_dark || null,
			is_active: data.is_active ?? true,
			is_featured: data.is_featured ?? false,
			sort_order: data.sort_order ?? 0,
			turnaround_days: data.turnaround_days || null,
			turnaround_window: data.turnaround_window || null,
		};

		// Insert service
		const { data: service, error: insertError } = await supabase.from('services').insert(serviceData).select().single();

		if (insertError) {
			console.error('Error creating service:', insertError);
			return NextResponse.json({ error: 'Failed to create service', details: insertError.message }, { status: 500 });
		}

		// Execute afterDb hook
		const finalResult = await executeAfterDbHook(
			{ success: true, service },
			{ mode: 'create', resource: 'services', originalData: transformedData },
			serviceHooks.afterDb
		);

		return NextResponse.json(finalResult, { status: 201 });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error in POST /api/admin/services:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


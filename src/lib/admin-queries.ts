import { buildQuery, type QueryOptions } from './utils/query-builder';
import { createClient } from './supabase/server';

export interface Application {
	id: string;
	order_number: string;
	customer_name: string | null;
	customer_phone: string | null;
	applicant_email: string;
	service_slug: string;
	status: ApplicationStatus;
	payload: Record<string, unknown>;
	submitted_at: string;
	created_at: string;
	updated_at: string;
	assigned_to: string | null; // UUID of assigned user
}

export type ApplicationStatus =
	| 'draft'
	| 'submitted'
	| 'scoping'
	| 'quote_sent'
	| 'in_progress'
	| 'review'
	| 'completed'
	| 'archived'
	| 'rejected'
	| 'cancelled';

export interface ApplicationEvent {
	id: string;
	application_id: string;
	event_type: string;
	notes: string | null;
	data: Record<string, unknown>;
	created_at: string;
}

export interface DashboardMetrics {
	totalOrders: number;
	pendingOrders: number;
	inProgressOrders: number;
	completedToday: number;
}

export interface OrdersFilter {
	status?: ApplicationStatus;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	pageSize?: number;
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

/**
 * Get all orders with optional filters, sorting, and pagination
 */
export async function getOrders(filters?: OrdersFilter): Promise<Application[]>;
export async function getOrders(filters?: OrdersFilter & { paginated?: false }): Promise<Application[]>;
export async function getOrders(filters?: OrdersFilter & { paginated: true }): Promise<PaginatedResult<Application>>;
export async function getOrders(filters?: OrdersFilter & { paginated?: boolean }): Promise<Application[] | PaginatedResult<Application>> {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('applications')
		.select('*', { count: filters?.paginated ? 'exact' : undefined });

	// Build query with search, filters, sorting
	const queryOptions: QueryOptions = {
		search: filters?.search,
		searchFields: ['order_number', 'customer_name', 'applicant_email', 'customer_phone'],
		filters: {
			...(filters?.status && { status: filters.status }),
			...(filters?.dateFrom && { submitted_at_gte: filters.dateFrom }),
			...(filters?.dateTo && { submitted_at_lte: filters.dateTo }),
		},
		sortColumn: filters?.sortColumn || 'submitted_at',
		sortDirection: filters?.sortDirection || 'desc',
		page: filters?.page,
		pageSize: filters?.pageSize,
	};

	const { query: builtQuery, skip, take } = buildQuery(query, queryOptions);

	// Apply pagination if needed
	if (filters?.paginated) {
		builtQuery.range(skip, skip + take - 1);
	}

	const { data, error, count } = await builtQuery;

	if (error) {
		console.error('Error fetching orders:', error);
		throw error;
	}

	if (filters?.paginated) {
		const total = count || 0;
		const pageSize = filters.pageSize || 25;
		return {
			data: (data as Application[]) || [],
			total,
			page: filters.page || 1,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	return (data as Application[]) || [];
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('applications')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching order:', error);
		throw error;
	}

	return data as Application;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('applications')
		.select('*')
		.eq('order_number', orderNumber)
		.single();

	if (error) {
		console.error('Error fetching order:', error);
		return null;
	}

	return data as Application;
}

/**
 * Get order events/history
 */
export async function getOrderEvents(applicationId: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('application_events')
		.select('*')
		.eq('application_id', applicationId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching events:', error);
		throw error;
	}

	return (data as ApplicationEvent[]) || [];
}

/**
 * Update order status
 */
export async function updateOrderStatus(
	id: string,
	status: ApplicationStatus,
	notes?: string
) {
	const supabaseClient = await createClient();
	// Update the application
	const { error: updateError } = await supabaseClient
		.from('applications')
		.update({ status, updated_at: new Date().toISOString() })
		.eq('id', id);

	if (updateError) {
		console.error('Error updating order status:', updateError);
		throw updateError;
	}

	// Create an event
	const { error: eventError } = await supabaseClient
		.from('application_events')
		.insert({
			application_id: id,
			event_type: 'status_changed',
			notes: notes || `Status changed to ${status}`,
			data: { new_status: status, old_status: null },
		});

	if (eventError) {
		console.error('Error creating event:', eventError);
		// Don't throw here, status was updated successfully
	}

	return true;
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
	const supabaseClient = await createClient();
	
	// Get all applications
	const { data: allOrders, error } = await supabaseClient
		.from('applications')
		.select('status, submitted_at');

	if (error) {
		console.error('Error fetching dashboard metrics:', error);
		return {
			totalOrders: 0,
			pendingOrders: 0,
			inProgressOrders: 0,
			completedToday: 0,
		};
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const metrics = {
		totalOrders: allOrders.length,
		pendingOrders: allOrders.filter((o) => o.status === 'submitted').length,
		inProgressOrders: allOrders.filter((o) => o.status === 'in_progress').length,
		completedToday: allOrders.filter((o) => {
			if (o.status !== 'completed') return false;
			const submittedDate = new Date(o.submitted_at);
			return submittedDate >= today;
		}).length,
	};

	return metrics;
}

/**
 * Get orders timeline data for charts (last 7 days)
 */
export async function getOrdersTimeline() {
	const supabaseClient = await createClient();
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const { data, error } = await supabaseClient
		.from('applications')
		.select('submitted_at')
		.gte('submitted_at', sevenDaysAgo.toISOString());

	if (error) {
		console.error('Error fetching orders timeline:', error);
		return [];
	}

	// Group by date
	const groupedByDate: Record<string, number> = {};

	for (let i = 0; i < 7; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];
		groupedByDate[dateStr] = 0;
	}

	data.forEach((order) => {
		const dateStr = order.submitted_at.split('T')[0];
		if (groupedByDate[dateStr] !== undefined) {
			groupedByDate[dateStr]++;
		}
	});

	return Object.entries(groupedByDate)
		.map(([date, count]) => ({ date, count }))
		.reverse();
}

/**
 * Get orders by service for pie chart
 */
export async function getOrdersByService() {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('applications')
		.select('service_slug');

	if (error) {
		console.error('Error fetching orders by service:', error);
		return [];
	}

	// Group by service
	const groupedByService: Record<string, number> = {};

	data.forEach((order) => {
		const service = order.service_slug || 'unknown';
		groupedByService[service] = (groupedByService[service] || 0) + 1;
	});

	return Object.entries(groupedByService).map(([service, count]) => ({
		service,
		count,
	}));
}

/**
 * Get status distribution for bar chart
 */
export async function getStatusDistribution() {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('applications')
		.select('status');

	if (error) {
		console.error('Error fetching status distribution:', error);
		return [];
	}

	// Group by status
	const groupedByStatus: Record<string, number> = {};

	data.forEach((order) => {
		const status = order.status || 'unknown';
		groupedByStatus[status] = (groupedByStatus[status] || 0) + 1;
	});

	return Object.entries(groupedByStatus).map(([status, count]) => ({
		status,
		count,
	}));
}

export interface User {
	id: string;
	email: string;
	name: string | null;
	role: 'admin' | 'officer' | 'supervisor' | 'intake' | 'auditor';
	team_id: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface UsersFilter {
	role?: string;
	search?: string;
	isActive?: boolean;
	page?: number;
	pageSize?: number;
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
}

/**
 * Get all users with optional filters, sorting, and pagination
 */
export async function getUsers(filters?: UsersFilter): Promise<User[]>;
export async function getUsers(filters?: UsersFilter & { paginated?: false }): Promise<User[]>;
export async function getUsers(filters?: UsersFilter & { paginated: true }): Promise<PaginatedResult<User>>;
export async function getUsers(filters?: UsersFilter & { paginated?: boolean }): Promise<User[] | PaginatedResult<User>> {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('users')
		.select('*', { count: filters?.paginated ? 'exact' : undefined });

	// Build query with search, filters, sorting
	const queryOptions: QueryOptions = {
		search: filters?.search,
		searchFields: ['email', 'name'],
		filters: {
			...(filters?.role && { role: filters.role }),
			...(filters?.isActive !== undefined && { is_active: filters.isActive }),
		},
		sortColumn: filters?.sortColumn || 'created_at',
		sortDirection: filters?.sortDirection || 'desc',
		page: filters?.page,
		pageSize: filters?.pageSize,
	};

	const { query: builtQuery, skip, take } = buildQuery(query, queryOptions);

	// Apply pagination if needed
	if (filters?.paginated) {
		builtQuery.range(skip, skip + take - 1);
	}

	const { data, error, count } = await builtQuery;

	if (error) {
		console.error('Error fetching users:', error);
		throw error;
	}

	if (filters?.paginated) {
		const total = count || 0;
		const pageSize = filters.pageSize || 25;
		return {
			data: (data as User[]) || [],
			total,
			page: filters.page || 1,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	return (data as User[]) || [];
}

/**
 * Get users who can be assigned to orders (officers, supervisors, admins)
 */
export async function getAssignableUsers() {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('users')
		.select('*')
		.in('role', ['admin', 'officer', 'supervisor'])
		.eq('is_active', true)
		.order('name', { ascending: true });

	if (error) {
		console.error('Error fetching assignable users:', error);
		throw error;
	}

	return (data as User[]) || [];
}

/**
 * Assign an order to a user
 */
export async function assignOrder(
	applicationId: string,
	userId: string | null,
	assignedByName?: string
) {
	const supabaseClient = await createClient();
	// Update the application
	const { error: updateError } = await supabaseClient
		.from('applications')
		.update({ assigned_to: userId, updated_at: new Date().toISOString() })
		.eq('id', applicationId);

	if (updateError) {
		console.error('Error assigning order:', updateError);
		throw updateError;
	}

	// Create an event in the timeline
	const eventData: any = {
		application_id: applicationId,
		event_type: 'assignment_changed',
		notes: userId
			? `Order assigned${assignedByName ? ` by ${assignedByName}` : ''}`
			: `Order unassigned${assignedByName ? ` by ${assignedByName}` : ''}`,
		data: {
			assigned_to: userId,
			assigned_by: assignedByName,
		},
		created_at: new Date().toISOString(),
	};

	const { error: eventError } = await supabaseClient
		.from('application_events')
		.insert(eventData);

	if (eventError) {
		console.error('Error creating assignment event:', eventError);
		// Don't throw, assignment already succeeded
	}

	return true;
}

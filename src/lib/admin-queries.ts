import { buildQuery, type QueryOptions } from './utils/query-builder';
import { createClient } from './supabase/server';
import { calculateSLA } from './utils/business-hours';
import { getAllServices } from './service-queries';

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

export interface Customer {
	id: string;
	email: string;
	phone: string | null;
	name: string | null;
	language_preference: 'ar' | 'en';
	created_at: string;
	updated_at: string;
}

export interface CustomersFilter {
	search?: string;
	page?: number;
	pageSize?: number;
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
}

/**
 * Get all customers with optional filters, sorting, and pagination
 */
export async function getCustomers(filters?: CustomersFilter): Promise<Customer[]>;
export async function getCustomers(filters?: CustomersFilter & { paginated?: false }): Promise<Customer[]>;
export async function getCustomers(filters?: CustomersFilter & { paginated: true }): Promise<PaginatedResult<Customer>>;
export async function getCustomers(filters?: CustomersFilter & { paginated?: boolean }): Promise<Customer[] | PaginatedResult<Customer>> {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('customers')
		.select('*', { count: filters?.paginated ? 'exact' : undefined });

	const queryOptions: QueryOptions = {
		search: filters?.search,
		searchFields: ['email', 'name', 'phone'],
		sortColumn: filters?.sortColumn || 'created_at',
		sortDirection: filters?.sortDirection || 'desc',
		page: filters?.page,
		pageSize: filters?.pageSize,
	};

	const { query: builtQuery, skip, take } = buildQuery(query, queryOptions);

	if (filters?.paginated) {
		builtQuery.range(skip, skip + take - 1);
	}

	const { data, error, count } = await builtQuery;

	if (error) {
		console.error('Error fetching customers:', error);
		throw error;
	}

	if (filters?.paginated) {
		const total = count || 0;
		const pageSize = filters.pageSize || 25;
		return {
			data: (data as Customer[]) || [],
			total,
			page: filters.page || 1,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	return (data as Customer[]) || [];
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('customers')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching customer:', error);
		throw error;
	}

	return data as Customer;
}

/**
 * Get all orders for a customer
 * Supports filtering by customer_id or email (for backward compatibility)
 */
export async function getCustomerOrders(customerIdOrEmail: string, filterByEmail = false) {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('applications')
		.select('*');
	
	if (filterByEmail) {
		query = query.eq('applicant_email', customerIdOrEmail);
	} else {
		query = query.eq('customer_id', customerIdOrEmail);
	}
	
	const { data, error } = await query.order('submitted_at', { ascending: false });

	if (error) {
		// Use proper error logging instead of console.error
		throw error;
	}

	return (data as Application[]) || [];
}

export interface Invoice {
	id: string;
	application_id: string;
	invoice_number: string;
	amount: number;
	currency: string;
	status: 'pending' | 'paid' | 'failed' | 'cancelled';
	payment_link: string | null;
	paid_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface Payment {
	id: string;
	invoice_id: string;
	gateway: string;
	transaction_id: string | null;
	amount: number;
	status: 'pending' | 'completed' | 'failed';
	gateway_response: Record<string, unknown> | null;
	created_at: string;
}

export interface RevenueMetrics {
	revenueToday: number;
	revenueThisWeek: number;
	revenueThisMonth: number;
	revenueAllTime: number;
	outstandingInvoices: number;
	paidInvoices: number;
	pendingInvoices: number;
}

/**
 * Get revenue metrics
 */
export async function getRevenueMetrics(): Promise<RevenueMetrics> {
	const supabaseClient = await createClient();
	
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	
	const thisWeek = new Date();
	thisWeek.setDate(thisWeek.getDate() - 7);
	
	const thisMonth = new Date();
	thisMonth.setMonth(thisMonth.getMonth() - 1);
	
	// Get all invoices
	const { data: invoices, error } = await supabaseClient
		.from('invoices')
		.select('amount, status, paid_at, created_at');
	
	if (error) {
		console.error('Error fetching revenue metrics:', error);
		return {
			revenueToday: 0,
			revenueThisWeek: 0,
			revenueThisMonth: 0,
			revenueAllTime: 0,
			outstandingInvoices: 0,
			paidInvoices: 0,
			pendingInvoices: 0,
		};
	}
	
	// Calculate revenue metrics
	const paidInvoices = invoices?.filter(inv => inv.status === 'paid') || [];
	
	const revenueToday = paidInvoices
		.filter(inv => inv.paid_at && new Date(inv.paid_at) >= today)
		.reduce((sum, inv) => sum + Number(inv.amount), 0);
	
	const revenueThisWeek = paidInvoices
		.filter(inv => inv.paid_at && new Date(inv.paid_at) >= thisWeek)
		.reduce((sum, inv) => sum + Number(inv.amount), 0);
	
	const revenueThisMonth = paidInvoices
		.filter(inv => inv.paid_at && new Date(inv.paid_at) >= thisMonth)
		.reduce((sum, inv) => sum + Number(inv.amount), 0);
	
	const revenueAllTime = paidInvoices
		.reduce((sum, inv) => sum + Number(inv.amount), 0);
	
	// Get invoice counts
	const outstandingInvoices = invoices?.filter(inv => inv.status === 'pending').length || 0;
	const paidInvoicesCount = paidInvoices.length;
	const pendingInvoices = invoices?.filter(inv => inv.status === 'pending').length || 0;
	
	return {
		revenueToday,
		revenueThisWeek,
		revenueThisMonth,
		revenueAllTime,
		outstandingInvoices,
		paidInvoices: paidInvoicesCount,
		pendingInvoices,
	};
}

export interface InvoicesFilter {
	status?: string;
	page?: number;
	pageSize?: number;
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
}

/**
 * Get all invoices with optional filters, sorting, and pagination
 */
export async function getInvoices(filters?: InvoicesFilter): Promise<Invoice[]>;
export async function getInvoices(filters?: InvoicesFilter & { paginated?: false }): Promise<Invoice[]>;
export async function getInvoices(filters?: InvoicesFilter & { paginated: true }): Promise<PaginatedResult<Invoice>>;
export async function getInvoices(filters?: InvoicesFilter & { paginated?: boolean }): Promise<Invoice[] | PaginatedResult<Invoice>> {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('invoices')
		.select('*', { count: filters?.paginated ? 'exact' : undefined });

	const queryOptions: QueryOptions = {
		filters: {
			...(filters?.status && { status: filters.status }),
		},
		sortColumn: filters?.sortColumn || 'created_at',
		sortDirection: filters?.sortDirection || 'desc',
		page: filters?.page,
		pageSize: filters?.pageSize,
	};

	const { query: builtQuery, skip, take } = buildQuery(query, queryOptions);

	if (filters?.paginated) {
		builtQuery.range(skip, skip + take - 1);
	}

	const { data, error, count } = await builtQuery;

	if (error) {
		console.error('Error fetching invoices:', error);
		throw error;
	}

	if (filters?.paginated) {
		const total = count || 0;
		const pageSize = filters.pageSize || 25;
		return {
			data: (data as Invoice[]) || [],
			total,
			page: filters.page || 1,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	return (data as Invoice[]) || [];
}

/**
 * Get all payments
 */
export async function getPayments(filters?: {
	page?: number;
	pageSize?: number;
}): Promise<Payment[]> {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('payments')
		.select('*')
		.order('created_at', { ascending: false });

	if (filters?.page && filters?.pageSize) {
		const skip = (filters.page - 1) * filters.pageSize;
		query = query.range(skip, skip + filters.pageSize - 1);
	}

	const { data, error } = await query;

	if (error) {
		console.error('Error fetching payments:', error);
		throw error;
	}

	return (data as Payment[]) || [];
}

export interface Task {
	id: string;
	application_id: string | null;
	title: string;
	description: string | null;
	type: 'call' | 'whatsapp' | 'email' | 'office_visit' | 'ministry' | 'qa';
	assigned_to: string | null;
	created_by: string | null;
	due_date: string | null;
	priority: 'low' | 'normal' | 'high' | 'urgent';
	status: 'open' | 'in_progress' | 'done' | 'cancelled';
	time_spent_minutes: number | null;
	outcome_notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface TasksFilter {
	status?: Task['status'];
	priority?: Task['priority'];
	type?: Task['type'];
	assigned_to?: string;
	application_id?: string;
	page?: number;
	pageSize?: number;
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
}

/**
 * Get all tasks with optional filters, sorting, and pagination
 */
export async function getTasks(filters?: TasksFilter): Promise<Task[]>;
export async function getTasks(filters?: TasksFilter & { paginated?: false }): Promise<Task[]>;
export async function getTasks(filters?: TasksFilter & { paginated: true }): Promise<PaginatedResult<Task>>;
export async function getTasks(filters?: TasksFilter & { paginated?: boolean }): Promise<Task[] | PaginatedResult<Task>> {
	const supabaseClient = await createClient();
	
	let query = supabaseClient
		.from('tasks')
		.select('*', { count: filters?.paginated ? 'exact' : undefined });

	const queryOptions: QueryOptions = {
		filters: {
			...(filters?.status && { status: filters.status }),
			...(filters?.priority && { priority: filters.priority }),
			...(filters?.type && { type: filters.type }),
			...(filters?.assigned_to && { assigned_to: filters.assigned_to }),
			...(filters?.application_id && { application_id: filters.application_id }),
		},
		sortColumn: filters?.sortColumn || 'created_at',
		sortDirection: filters?.sortDirection || 'desc',
		page: filters?.page,
		pageSize: filters?.pageSize,
	};

	const { query: builtQuery, skip, take } = buildQuery(query, queryOptions);

	if (filters?.paginated) {
		builtQuery.range(skip, skip + take - 1);
	}

	const { data, error, count } = await builtQuery;

	if (error) {
		console.error('Error fetching tasks:', error);
		throw error;
	}

	if (filters?.paginated) {
		const total = count || 0;
		const pageSize = filters.pageSize || 25;
		return {
			data: (data as Task[]) || [],
			total,
			page: filters.page || 1,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	return (data as Task[]) || [];
}

/**
 * Get task by ID
 */
export async function getTaskById(id: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('tasks')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching task:', error);
		throw error;
	}

	return data as Task;
}

/**
 * Get tasks by application ID
 */
export async function getTasksByApplication(applicationId: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('tasks')
		.select('*')
		.eq('application_id', applicationId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching tasks by application:', error);
		throw error;
	}

	return (data as Task[]) || [];
}

export interface SLAConfig {
	id: string;
	service_id: string;
	target_hours: number;
	warning_threshold_percent: number;
	created_at: string;
	updated_at: string;
}

export interface ApplicationWithSLA extends Application {
	sla?: {
		hoursElapsed: number;
		targetHours: number;
		percentElapsed: number;
		status: 'on_track' | 'at_risk' | 'breached';
		hoursRemaining: number;
		deadline: Date;
	};
}

/**
 * Get SLA config by service ID
 */
export async function getSLAConfigByServiceId(serviceId: string) {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('sla_configs')
		.select('*')
		.eq('service_id', serviceId)
		.single();

	if (error) {
		// Return null if no config exists (not an error)
		if (error.code === 'PGRST116') {
			return null;
		}
		console.error('Error fetching SLA config:', error);
		throw error;
	}

	return data as SLAConfig | null;
}

/**
 * Get all SLA configs
 */
export async function getSLAConfigs() {
	const supabaseClient = await createClient();
	const { data, error } = await supabaseClient
		.from('sla_configs')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching SLA configs:', error);
		throw error;
	}

	return (data as SLAConfig[]) || [];
}

/**
 * Get SLA metrics for dashboard
 */
export async function getSLAMetrics() {
	const supabaseClient = await createClient();
	const { data: applications, error } = await supabaseClient
		.from('applications')
		.select('id, service_slug, submitted_at, status')
		.in('status', ['submitted', 'scoping', 'quote_sent', 'in_progress', 'review']);

	if (error) {
		console.error('Error fetching SLA metrics:', error);
		return {
			atRisk: 0,
			breached: 0,
			onTrack: 0,
			total: 0,
		};
	}

	// Get all SLA configs
	const slaConfigs = await getSLAConfigs();
	const services = await getAllServices();

	// Create maps for quick lookup
	const serviceMap = new Map(services.map(s => [s.slug, s.id]));
	const slaMap = new Map(slaConfigs.map(c => [c.service_id, c]));

	let atRisk = 0;
	let breached = 0;
	let onTrack = 0;

	applications.forEach((app) => {
		const serviceId = serviceMap.get(app.service_slug);
		if (!serviceId) return;

		const slaConfig = slaMap.get(serviceId);
		if (!slaConfig) return;

		const sla = calculateSLA(
			new Date(app.submitted_at),
			slaConfig.target_hours,
			slaConfig.warning_threshold_percent
		);

		if (sla.status === 'breached') breached++;
		else if (sla.status === 'at_risk') atRisk++;
		else onTrack++;
	});

	return {
		atRisk,
		breached,
		onTrack,
		total: applications.length,
	};
}

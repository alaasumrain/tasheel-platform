import { supabase } from './supabase';

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
}

/**
 * Get all orders with optional filters
 */
export async function getOrders(filters?: OrdersFilter) {
	let query = supabase
		.from('applications')
		.select('*')
		.order('submitted_at', { ascending: false });

	// Apply filters
	if (filters?.status) {
		query = query.eq('status', filters.status);
	}

	if (filters?.search) {
		query = query.or(
			`order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,applicant_email.ilike.%${filters.search}%`
		);
	}

	if (filters?.dateFrom) {
		query = query.gte('submitted_at', filters.dateFrom);
	}

	if (filters?.dateTo) {
		query = query.lte('submitted_at', filters.dateTo);
	}

	const { data, error } = await query;

	if (error) {
		console.error('Error fetching orders:', error);
		throw error;
	}

	return (data as Application[]) || [];
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
	const { data, error } = await supabase
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
	const { data, error } = await supabase
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
	const { data, error } = await supabase
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
	// Update the application
	const { error: updateError } = await supabase
		.from('applications')
		.update({ status, updated_at: new Date().toISOString() })
		.eq('id', id);

	if (updateError) {
		console.error('Error updating order status:', updateError);
		throw updateError;
	}

	// Create an event
	const { error: eventError } = await supabase
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
	// Get all applications
	const { data: allOrders, error } = await supabase
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
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const { data, error } = await supabase
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
	const { data, error } = await supabase
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
	const { data, error } = await supabase
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

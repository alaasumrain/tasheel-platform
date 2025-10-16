import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
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

export interface Application {
	id: string;
	order_number: string | null;
	service_slug: string | null;
	customer_name: string | null;
	customer_phone: string | null;
	applicant_email: string | null;
	status: ApplicationStatus;
	payload: Record<string, unknown>;
	submitted_at: string;
	created_at: string;
	updated_at: string;
}

export interface ApplicationEvent {
	id: string;
	application_id: string;
	event_type: string;
	notes: string | null;
	data: Record<string, unknown> | null;
	created_at: string;
}

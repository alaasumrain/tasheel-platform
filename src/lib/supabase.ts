// Legacy server-side client - use createClient from @/lib/supabase/server for new code
import { createClient as createLegacyClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './supabase-config';

export const supabase = createLegacyClient(supabaseUrl, supabaseAnonKey);

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

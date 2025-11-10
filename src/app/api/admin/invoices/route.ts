import { NextResponse } from 'next/server';
import { requireAdminAuthAPI } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/utils/logger';

export async function POST(request: Request) {
	try {
		// Require admin authentication
		await requireAdminAuthAPI();

		const body = await request.json();
		const { application_id, amount, due_date } = body;

		if (!application_id || !amount || !due_date) {
			return NextResponse.json(
				{ error: 'Missing required fields: application_id, amount, due_date' },
				{ status: 400 }
			);
		}

		// Generate invoice number
		const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
		const { count } = await supabase
			.from('invoices')
			.select('*', { count: 'exact', head: true })
			.gte('invoice_number', `INV-${today}-`)
			.lt('invoice_number', `INV-${today}-999`);

		const sequence = String((count || 0) + 1).padStart(3, '0');
		const invoiceNumber = `INV-${today}-${sequence}`;

		// Insert invoice
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.insert({
				application_id,
				invoice_number: invoiceNumber,
				amount,
				status: 'pending',
				due_date,
			})
			.select()
			.single();

		if (invoiceError) {
			logger.error('Error creating invoice', invoiceError, { application_id, amount, due_date });
			return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
		}

		// Create event
		await supabase.from('application_events').insert({
			application_id,
			event_type: 'invoice_created',
			notes: `Invoice created: ${invoiceNumber} - ${amount} NIS`,
			data: { invoice_id: invoice.id, amount },
		});

		// TODO: Send email to customer (Phase 2)

		return NextResponse.json({ success: true, invoice });
	} catch (error: any) {
		if (error.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		logger.error('Error in POST /api/admin/invoices', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

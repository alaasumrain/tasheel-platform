import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { event, properties } = body;

		if (!event) {
			return NextResponse.json({ error: 'Event name required' }, { status: 400 });
		}

		const supabase = await createClient();

		// Store analytics event in database
		const { error } = await supabase.from('analytics_events').insert({
			event_name: event,
			properties: properties || {},
			user_agent: request.headers.get('user-agent') || null,
			ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
			created_at: new Date().toISOString(),
		});

		if (error) {
			console.error('Error storing analytics event:', error);
			// Don't fail the request if analytics fails
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Analytics API error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


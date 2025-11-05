/**
 * Direct script to seed all 149 services
 * Run with: npx tsx scripts/seed-all-services.ts
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ServiceSeedData {
	slug: string;
	name_en: string;
	name_ar: string;
	short_description_en: string;
	short_description_ar: string;
	description_en: string;
	description_ar: string;
	category_id: string;
	turnaround_days: number;
	required_documents: string[];
	process_steps: Array<{
		number: number;
		title_en: string;
		title_ar: string;
		description_en: string;
		description_ar: string;
	}>;
	pricing: {
		type: 'fixed' | 'quote' | 'starting';
		amount?: number;
		note_en?: string;
		note_ar?: string;
	};
	sort_order: number;
}

// Category IDs
const CATEGORY_IDS = {
	translation: '20c51882-f009-4f38-abd6-bdb11f367f13',
	government: '172ca066-d4b5-4e3e-9758-e6c783128064',
	legalization: '062a48a0-4146-41a7-bee1-49f4fb6d69d5',
	business: '9e6660b2-3111-434b-b11d-bf2e53ba1fc9',
};

function createSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// Import the generateAllServices function from the API route
// For now, let's just call the API endpoint or replicate the logic
async function main() {
	console.log('🌱 Starting service seed...\n');

	try {
		// Get existing services
		const { data: existingServices, error: fetchError } = await supabase
			.from('services')
			.select('slug');

		if (fetchError) {
			console.error('Error fetching existing services:', fetchError);
			process.exit(1);
		}

		const existingSlugs = new Set((existingServices || []).map((s) => s.slug));
		console.log(`📊 Found ${existingSlugs.size} existing services\n`);

		// Call the API endpoint (requires admin auth, so let's use a direct approach)
		// Actually, let's just fetch the services from the API route logic
		// For now, let's use fetch to call our own API with a workaround
		
		// Better approach: Import and use the generateAllServices logic directly
		// Since we can't easily import server-side code, let's call the API
		
		console.log('📡 Calling seed API endpoint...');
		const response = await fetch('http://localhost:3000/api/admin/seed-services', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('❌ API Error:', error);
			console.log('\n💡 Make sure the dev server is running and you are logged in as admin');
			process.exit(1);
		}

		const result = await response.json();
		
		if (result.success) {
			console.log(`✅ ${result.message}`);
			console.log(`   Added: ${result.added} services`);
			console.log(`   Total: ${result.total} services`);
			if (result.existing) {
				console.log(`   Already existed: ${result.existing} services`);
			}
		} else {
			console.error('❌ Error:', result.error);
			process.exit(1);
		}

		// Verify the count
		const { count } = await supabase
			.from('services')
			.select('*', { count: 'exact', head: true });

		console.log(`\n📊 Total services in database: ${count}`);
		console.log('✅ Seed complete!\n');
	} catch (error: any) {
		console.error('❌ Error:', error.message);
		process.exit(1);
	}
}

main();



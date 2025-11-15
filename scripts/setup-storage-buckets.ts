/**
 * Setup script to create required Supabase storage buckets
 * Run this with: npx tsx scripts/setup-storage-buckets.ts
 * 
 * Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS } from '../src/lib/storage-shared';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
	console.error('❌ Missing required environment variables:');
	console.error('   - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
	console.error('   - SUPABASE_SERVICE_ROLE_KEY');
	console.error('\n💡 Make sure these are set in your .env.local file');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

interface BucketConfig {
	name: string;
	public: boolean;
	fileSizeLimit?: number;
	allowedMimeTypes?: string[];
}

const buckets: BucketConfig[] = [
	{
		name: STORAGE_BUCKETS.CUSTOMER_UPLOADS,
		public: false,
		fileSizeLimit: 10 * 1024 * 1024, // 10MB
		allowedMimeTypes: [
			'image/jpeg',
			'image/png',
			'image/webp',
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		],
	},
	{
		name: STORAGE_BUCKETS.COMPLETED_WORK,
		public: false,
		fileSizeLimit: 50 * 1024 * 1024, // 50MB
	},
	{
		name: STORAGE_BUCKETS.INVOICES,
		public: false,
		fileSizeLimit: 5 * 1024 * 1024, // 5MB
		allowedMimeTypes: ['application/pdf'],
	},
	{
		name: STORAGE_BUCKETS.TEAM_AVATARS,
		public: true, // Public so they can be displayed without auth
		fileSizeLimit: 2 * 1024 * 1024, // 2MB
		allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
	},
	{
		name: STORAGE_BUCKETS.SERVICE_IMAGES,
		public: true, // Public for service catalog
		fileSizeLimit: 5 * 1024 * 1024, // 5MB
		allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
	},
];

async function createBucket(config: BucketConfig) {
	console.log(`\n📦 Creating bucket: ${config.name}...`);

	// Check if bucket already exists
	const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
	
	if (listError) {
		console.error(`   ❌ Error listing buckets: ${listError.message}`);
		return false;
	}

	const exists = existingBuckets?.some((b) => b.name === config.name);
	if (exists) {
		console.log(`   ✅ Bucket "${config.name}" already exists`);
		return true;
	}

	// Create the bucket
	const { data, error } = await supabase.storage.createBucket(config.name, {
		public: config.public,
		fileSizeLimit: config.fileSizeLimit,
		allowedMimeTypes: config.allowedMimeTypes,
	});

	if (error) {
		console.error(`   ❌ Error creating bucket: ${error.message}`);
		return false;
	}

	console.log(`   ✅ Successfully created bucket: ${config.name}`);
	if (config.public) {
		console.log(`      📢 Public bucket (files accessible without auth)`);
	} else {
		console.log(`      🔒 Private bucket (requires authentication)`);
	}
	if (config.fileSizeLimit) {
		console.log(`      📏 File size limit: ${(config.fileSizeLimit / 1024 / 1024).toFixed(0)}MB`);
	}
	if (config.allowedMimeTypes) {
		console.log(`      📄 Allowed types: ${config.allowedMimeTypes.join(', ')}`);
	}

	return true;
}

async function main() {
	console.log('🚀 Setting up Supabase storage buckets...\n');
	console.log(`📍 Project: ${supabaseUrl}\n`);

	let successCount = 0;
	let failCount = 0;

	for (const bucket of buckets) {
		const success = await createBucket(bucket);
		if (success) {
			successCount++;
		} else {
			failCount++;
		}
	}

	console.log('\n' + '='.repeat(50));
	console.log(`✅ Successfully processed: ${successCount} buckets`);
	if (failCount > 0) {
		console.log(`❌ Failed: ${failCount} buckets`);
	}
	console.log('='.repeat(50));

	if (failCount === 0) {
		console.log('\n🎉 All storage buckets are ready!');
		console.log('\n⚠️  Next steps:');
		console.log('   1. Go to Supabase Dashboard > Storage');
		console.log('   2. Set up RLS policies for each bucket');
		console.log('   3. See TECHNICAL_SPEC.md for example policies');
	} else {
		console.log('\n⚠️  Some buckets failed to create. Check the errors above.');
		process.exit(1);
	}
}

main().catch((error) => {
	console.error('\n❌ Fatal error:', error);
	process.exit(1);
});


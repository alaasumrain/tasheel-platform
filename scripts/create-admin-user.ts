/**
 * Helper script to create admin users for Tasheel platform
 * 
 * This script creates a user in Supabase Auth and links it to the users table.
 * 
 * Usage:
 * 1. Set up your Supabase credentials in .env.local
 * 2. Run: npx tsx scripts/create-admin-user.ts <email> <password> <name> [role]
 * 
 * Example:
 * npx tsx scripts/create-admin-user.ts admin@tasheel.ps SecurePassword123 "Admin User" admin
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials in .env.local');
	console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}

// Create Supabase admin client (uses service role key for admin operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

async function createAdminUser(
	email: string,
	password: string,
	name: string,
	role: 'admin' | 'supervisor' | 'officer' | 'intake' | 'auditor' = 'admin'
) {
	try {
		console.log(`\n🔐 Creating admin user: ${email}`);

		// Step 1: Create user in Supabase Auth
		console.log('  1. Creating user in Supabase Auth...');
		const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: true, // Auto-confirm email so they can login immediately
			user_metadata: {
				name,
				role,
			},
		});

		if (authError) {
			console.error('❌ Failed to create auth user:', authError.message);
			process.exit(1);
		}

		if (!authUser.user) {
			console.error('❌ Auth user creation returned no user');
			process.exit(1);
		}

		console.log(`  ✅ Auth user created with ID: ${authUser.user.id}`);

		// Step 2: Create record in users table
		console.log('  2. Creating record in users table...');
		const { data: dbUser, error: dbError } = await supabaseAdmin
			.from('users')
			.insert({
				id: authUser.user.id, // Use the same ID from auth.users
				email: authUser.user.email!,
				name,
				role,
				is_active: true,
				password_hash: null, // Not needed with Supabase Auth
			})
			.select()
			.single();

		if (dbError) {
			console.error('❌ Failed to create user record:', dbError.message);
			// Try to clean up auth user if DB insert fails
			await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
			console.error('  🧹 Cleaned up auth user');
			process.exit(1);
		}

		console.log(`  ✅ User record created in database`);
		console.log(`\n✅ Admin user created successfully!`);
		console.log(`\n📋 User Details:`);
		console.log(`   Email: ${email}`);
		console.log(`   Name: ${name}`);
		console.log(`   Role: ${role}`);
		console.log(`   ID: ${authUser.user.id}`);
		console.log(`\n🔑 You can now login at /admin/login with these credentials.`);
	} catch (error: any) {
		console.error('❌ Unexpected error:', error.message);
		process.exit(1);
	}
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
	console.log('Usage: npx tsx scripts/create-admin-user.ts <email> <password> <name> [role]');
	console.log('\nExample:');
	console.log('  npx tsx scripts/create-admin-user.ts admin@tasheel.ps SecurePass123 "Admin User" admin');
	console.log('\nRoles: admin, supervisor, officer, intake, auditor');
	process.exit(1);
}

const [email, password, name, role = 'admin'] = args;

if (!['admin', 'supervisor', 'officer', 'intake', 'auditor'].includes(role)) {
	console.error(`❌ Invalid role: ${role}`);
	console.error('Valid roles: admin, supervisor, officer, intake, auditor');
	process.exit(1);
}

createAdminUser(email, password, name, role as any).catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});


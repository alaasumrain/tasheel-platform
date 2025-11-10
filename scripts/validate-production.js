#!/usr/bin/env node
/**
 * Production Build Validation Script
 * 
 * Run this script before deploying to production:
 *   node scripts/validate-production.js
 * 
 * This script validates:
 * - Required environment variables are set
 * - No development code is present
 * - Critical security settings are configured
 */

const { validateEnvVars } = require('../src/lib/utils/env-validation');

console.log('🔍 Validating production readiness...\n');

// Validate environment variables
const envResult = validateEnvVars();

if (!envResult.isValid) {
	console.error('❌ FAILED: Missing required environment variables:');
	envResult.missing.forEach(v => console.error(`   - ${v}`));
	console.error('\nPlease set these variables before deploying to production.\n');
	process.exit(1);
}

if (envResult.warnings.length > 0) {
	console.warn('⚠️  WARNING: Missing important environment variables:');
	envResult.warnings.forEach(v => console.warn(`   - ${v}`));
	console.warn('\nThese are optional but recommended for production.\n');
}

// Check NODE_ENV
if (process.env.NODE_ENV !== 'production') {
	console.warn('⚠️  WARNING: NODE_ENV is not set to "production"');
	console.warn('   Set NODE_ENV=production in your production environment\n');
}

// Check for development URLs
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (siteUrl && (siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1'))) {
	console.error('❌ FAILED: NEXT_PUBLIC_SITE_URL contains localhost');
	console.error(`   Current value: ${siteUrl}`);
	console.error('   Use your production domain instead\n');
	process.exit(1);
}

// Check for HTTPS in production
if (siteUrl && !siteUrl.startsWith('https://')) {
	console.warn('⚠️  WARNING: NEXT_PUBLIC_SITE_URL does not use HTTPS');
	console.warn(`   Current value: ${siteUrl}`);
	console.warn('   HTTPS is required for production\n');
}

console.log('✅ Environment variables validated successfully!\n');
console.log('📋 Next steps:');
console.log('   1. Run: npm run build');
console.log('   2. Test the build locally');
console.log('   3. Deploy to production');
console.log('   4. Monitor error logs after deployment\n');

process.exit(0);


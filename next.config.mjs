import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

// Note: Environment variable validation should be run before build
// Use: node scripts/validate-production.js
// Or set up in your CI/CD pipeline

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, // ✅ ENABLED - Helps catch bugs during development
	poweredByHeader: false,
	eslint: {
		// ✅ ENABLED - Enforce code quality during builds
		ignoreDuringBuilds: false,
	},
	typescript: {
		// Exclude geneva-template from type checking
		ignoreBuildErrors: false,
	},
	experimental: {
		// Workaround for MUI SSR issues with Next.js 15
		optimizePackageImports: ['@mui/material', '@mui/icons-material'],
	},

	// ✅ Image Optimization Configuration
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
	},

	// ✅ Security Headers
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload',
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https: blob:",
							"font-src 'self' data:",
							"connect-src 'self' https://*.supabase.co https://api.stripe.com",
							"frame-src 'self' https://js.stripe.com",
							"object-src 'none'",
							"base-uri 'self'",
							"form-action 'self'",
							"frame-ancestors 'self'",
							"upgrade-insecure-requests",
						].join('; '),
					},
				],
			},
			// Cache static assets
			{
				source: '/static/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/_next/image',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			// API CORS headers
			{
				source: '/api/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
					{
						key: 'Access-Control-Allow-Origin',
						value: process.env.ALLOWED_ORIGINS || '*',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,POST,PUT,DELETE,OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'X-Requested-With, Content-Type, Authorization',
					},
				],
			},
		];
	},

	// Exclude geneva-template directory from compilation
	webpack: (config) => {
		config.watchOptions = {
			...config.watchOptions,
			ignored: ['**/node_modules', '**/geneva-template'],
		};
		return config;
	},
};

export default withNextIntl(nextConfig);


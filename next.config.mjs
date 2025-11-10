import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

// Note: Environment variable validation should be run before build
// Use: node scripts/validate-production.js
// Or set up in your CI/CD pipeline

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	poweredByHeader: false,
	eslint: {
		// Disable ESLint during production builds
		// Tasheel project intentionally ignores lint errors during builds
		ignoreDuringBuilds: true,
	},
	typescript: {
		// Exclude geneva-template from type checking
		ignoreBuildErrors: false,
	},
	experimental: {
		// Workaround for MUI SSR issues with Next.js 15
		optimizePackageImports: ['@mui/material', '@mui/icons-material'],
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


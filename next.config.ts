import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
	webpack: (config, { isServer }) => {
		config.watchOptions = {
			...config.watchOptions,
			ignored: ['**/node_modules', '**/geneva-template'],
		};
		return config;
	},
};

export default nextConfig;

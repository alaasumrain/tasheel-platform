import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false,
	poweredByHeader: false,
	output: 'standalone',
	eslint: {
		// Disable ESLint during production builds
		// Tasheel project intentionally ignores lint errors during builds
		ignoreDuringBuilds: true,
	},
	experimental: {
		// Workaround for MUI SSR issues with Next.js 15
		optimizePackageImports: ['@mui/material', '@mui/icons-material'],
	},
};

export default nextConfig;

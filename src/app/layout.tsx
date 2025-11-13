import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import { Box } from '@mui/material';

import { Providers } from '@/providers';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from '@/theme';
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes';

// System font for English
const systemFont = {
	variable: '--font-mona-sans',
	className: 'font-sans',
};

// Tajawal font for Arabic - Optimized to load only essential weights
const tajawal = localFont({
	src: [
		{
			path: '../fonts/tajawal/tajawal-400.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../fonts/tajawal/tajawal-500.ttf',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../fonts/tajawal/tajawal-700.ttf',
			weight: '700',
			style: 'normal',
		},
	],
	variable: '--font-tajawal',
	display: 'swap',
	preload: true,
	fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
	title: 'Tasheel — Government services concierge for Palestine',
	description:
		'Tasheel helps residents and businesses in Palestine manage government documents, translations, and legalizations entirely online',
	icons: {
		icon: '/favicon.png',
		apple: '/favicon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning>
			<LocaleHtmlAttributes />
			<body className={`${systemFont.variable} ${tajawal.variable} antialiased`}>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme} defaultMode="light">
						<InitColorSchemeScript attribute="class" defaultMode="light" />
						<Providers>
							<Box sx={{ position: 'relative', zIndex: 2 }}>{children}</Box>
						</Providers>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import { Box } from '@mui/material';

import { Providers } from '@/providers';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from '@/theme';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Tasheel — Government services concierge for Palestine',
	description:
		'Tasheel helps residents and businesses in Palestine manage government documents, translations, and legalizations entirely online.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
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

import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import './globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import { Box } from '@mui/material';

import { Providers } from '@/providers';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from '@/theme';

const monaSans = Mona_Sans({
	variable: '--font-mona-sans',
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
			<body className={`${monaSans.variable} antialiased`}>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme} defaultMode="dark">
						<InitColorSchemeScript attribute="class" />
						<Providers>
							<Box sx={{ position: 'relative', zIndex: 2 }}>{children}</Box>
						</Providers>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}

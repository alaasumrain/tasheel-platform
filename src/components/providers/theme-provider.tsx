/**
 * Direction-Aware Theme Provider
 * Sets theme direction based on locale (RTL for Arabic, LTR for English)
 */

'use client';

import { useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { useLocale } from 'next-intl';
import { createTheme } from '@mui/material/styles';
import baseTheme from '@/theme';

interface ThemeProviderProps {
	children: React.ReactNode;
}

export function DirectionAwareThemeProvider({ children }: ThemeProviderProps) {
	const locale = useLocale();
	const isRTL = locale === 'ar';

	const theme = useMemo(() => {
		return createTheme({
			...baseTheme,
			direction: isRTL ? 'rtl' : 'ltr',
		});
	}, [isRTL]);

	return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
}


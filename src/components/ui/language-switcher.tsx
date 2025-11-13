'use client';

import { Button, useColorScheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usePathname as useNextPathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface LanguageSwitcherProps {
	fullWidth?: boolean;
}

export default function LanguageSwitcher({ fullWidth = false }: LanguageSwitcherProps) {
	const router = useRouter();
	const nextPathname = useNextPathname();
	const currentLocale = useLocale();
	const { mode } = useColorScheme();

	// Extract locale-less pathname (works with both (ar)/ and en/ folder structure)
	// Remove /en or /ar prefix if present, default to / if empty
	const pathname = nextPathname?.replace(/^\/(en|ar)/, '') || '/';

	const isDark = mode === 'dark';
	const navColor = isDark ? '#F8FAFF' : '#0F172A';
	const outlineBorder = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(15, 23, 42, 0.16)';
	const outlineHoverBorder = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.3)';
	const outlineHoverBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)';

	const handleLanguageSwitch = () => {
		const newLocale = currentLocale === 'en' ? 'ar' : 'en';

		// Manually construct the correct path based on locale
		// Arabic (default) = no prefix, just pathname
		// English = /en prefix
		const targetPath = newLocale === 'ar' ? pathname : `/en${pathname}`;

		// Use router.push to navigate
		router.push(targetPath);
	};

	return (
		<Button
			suppressHydrationWarning
			onClick={handleLanguageSwitch}
			fullWidth={fullWidth}
			sx={{
				backgroundColor: 'transparent',
				border: '1.5px solid',
				borderColor: outlineBorder,
				borderRadius: '999px',
				color: navColor,
				fontSize: 13,
				fontWeight: 600,
				px: 1.5,
				py: 0.25,
				textTransform: 'none',
				transition: 'all 0.2s ease',
				minWidth: fullWidth ? 'auto' : 'fit-content',
				minHeight: '32px',
				height: '32px',
				'&:hover': {
					backgroundColor: outlineHoverBg,
					borderColor: outlineHoverBorder,
				},
			}}
		>
			{currentLocale === 'en' ? 'العربية' : 'English'}
		</Button>
	);
}

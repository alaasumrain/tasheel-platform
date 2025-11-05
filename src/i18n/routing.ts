import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ['ar', 'en'], // Default locale FIRST

	// Used when no locale matches
	defaultLocale: 'ar',

	// Never show prefix for default locale, always show for others
	// This ensures: / = Arabic, /en = English (never /ar)
	localePrefix: {
		mode: 'as-needed',
	},

	// Disable automatic locale detection to prevent /tools being treated as a locale
	localeDetection: false,
});


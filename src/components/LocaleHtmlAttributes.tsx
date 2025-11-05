'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function LocaleHtmlAttributes() {
	const locale = useLocale();
	const isRTL = locale === 'ar';

	useEffect(() => {
		// Set HTML lang attribute
		document.documentElement.lang = locale;

		// Set HTML dir attribute for RTL/LTR
		document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

		// Apply font class
		document.documentElement.classList.remove('font-mona-sans', 'font-tajawal');
		document.documentElement.classList.add(isRTL ? 'font-tajawal' : 'font-mona-sans');
	}, [locale, isRTL]);

	return null;
}


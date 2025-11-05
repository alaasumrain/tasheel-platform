import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes';

export const metadata: Metadata = {
	title: 'تسهيل — خدمات حكومية لفلسطين',
	description:
		'تسهيل يساعد المواطنين والشركات في فلسطين لإدارة الوثائق الحكومية والترجمات والتصديقات عبر الإنترنت.',
};

type Props = {
	children: ReactNode;
};

export default async function ArabicLayout({ children }: Props) {
	// Set the locale to Arabic for this route group
	setRequestLocale('ar');

	// Load Arabic messages
	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale="ar" messages={messages}>
			<LocaleHtmlAttributes />
			<Header />
			{children}
			<Footer />
		</NextIntlClientProvider>
	);
}

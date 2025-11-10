import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes';
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator';

export const metadata: Metadata = {
	title: 'Tasheel — Government services concierge for Palestine',
	description:
		'Tasheel helps residents and businesses in Palestine manage government documents, translations, and legalizations entirely online.',
};

type Props = {
	children: ReactNode;
};

export default async function EnglishLayout({ children }: Props) {
	// Set the locale to English for this route group
	setRequestLocale('en');

	// Load English messages
	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale="en" messages={messages}>
			<LocaleHtmlAttributes />
			<Header />
			{children}
			<Footer />
			<NetworkStatusIndicator />
		</NextIntlClientProvider>
	);
}

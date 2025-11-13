import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes';
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tasheel.ps';

export const metadata: Metadata = {
	title: 'Tasheel — Government services concierge for Palestine',
	description:
		'Tasheel helps residents and businesses in Palestine manage government documents, translations, and legalizations entirely online.',
	keywords: [
		'Tasheel',
		'Palestine',
		'government services',
		'documents',
		'translation',
		'legalization',
		'passport',
		'driver license',
		'birth certificate',
		'embassy services',
		'document processing',
	].join(', '),

	// OpenGraph metadata for social sharing
	openGraph: {
		type: 'website',
		locale: 'en',
		url: `${baseUrl}/en`,
		siteName: 'Tasheel',
		title: 'Tasheel — Government services concierge for Palestine',
		description:
			'Tasheel helps residents and businesses in Palestine manage government documents, translations, and legalizations entirely online.',
		images: [
			{
				url: `${baseUrl}/og-image-en.jpg`,
				width: 1200,
				height: 630,
				alt: 'Tasheel - Government services for Palestine',
			},
		],
	},

	// Twitter Card metadata
	twitter: {
		card: 'summary_large_image',
		title: 'Tasheel — Government services concierge for Palestine',
		description:
			'Tasheel helps residents and businesses in Palestine manage government documents, translations, and legalizations entirely online.',
		images: [`${baseUrl}/og-image-en.jpg`],
	},

	// Alternate language links
	alternates: {
		canonical: `${baseUrl}/en`,
		languages: {
			ar: baseUrl,
			en: `${baseUrl}/en`,
		},
	},

	// Additional metadata
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
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

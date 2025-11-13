import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import LocaleHtmlAttributes from '@/components/LocaleHtmlAttributes';
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tasheel.ps';

export const metadata: Metadata = {
	title: 'تسهيل — خدمات حكومية لفلسطين',
	description:
		'تسهيل يساعد المواطنين والشركات في فلسطين لإدارة الوثائق الحكومية والترجمات والتصديقات عبر الإنترنت.',
	keywords: [
		'تسهيل',
		'خدمات حكومية',
		'فلسطين',
		'وثائق',
		'ترجمة',
		'تصديقات',
		'جواز سفر',
		'رخصة قيادة',
		'شهادة ميلاد',
		'Palestine',
		'government services',
	].join(', '),

	// OpenGraph metadata for social sharing
	openGraph: {
		type: 'website',
		locale: 'ar',
		url: baseUrl,
		siteName: 'تسهيل',
		title: 'تسهيل — خدمات حكومية لفلسطين',
		description:
			'تسهيل يساعد المواطنين والشركات في فلسطين لإدارة الوثائق الحكومية والترجمات والتصديقات عبر الإنترنت.',
		images: [
			{
				url: `${baseUrl}/og-image-ar.jpg`,
				width: 1200,
				height: 630,
				alt: 'تسهيل - خدمات حكومية لفلسطين',
			},
		],
	},

	// Twitter Card metadata
	twitter: {
		card: 'summary_large_image',
		title: 'تسهيل — خدمات حكومية لفلسطين',
		description:
			'تسهيل يساعد المواطنين والشركات في فلسطين لإدارة الوثائق الحكومية والترجمات والتصديقات عبر الإنترنت.',
		images: [`${baseUrl}/og-image-ar.jpg`],
	},

	// Alternate language links
	alternates: {
		canonical: baseUrl,
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
			<NetworkStatusIndicator />
		</NextIntlClientProvider>
	);
}

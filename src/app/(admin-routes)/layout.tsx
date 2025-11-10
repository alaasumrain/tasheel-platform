import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator';

// Admin routes layout - NO public Header/Footer
export default async function AdminRoutesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Set locale to English for admin panel
	setRequestLocale('en');
	
	// Load messages for admin
	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale="en" messages={messages}>
			{children}
			<NetworkStatusIndicator />
		</NextIntlClientProvider>
	);
}

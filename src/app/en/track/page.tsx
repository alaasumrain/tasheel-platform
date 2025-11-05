import { setRequestLocale } from 'next-intl/server';
import Track from '@/components/sections/track';

export const dynamic = 'force-dynamic';

export default async function Page() {
	setRequestLocale('en');
	return <Track />;
}

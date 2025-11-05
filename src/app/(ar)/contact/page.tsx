import { setRequestLocale } from 'next-intl/server';
import Contact from '@/components/sections/contact';


export default async function Page() {
	setRequestLocale('ar');
	return <Contact />;
}

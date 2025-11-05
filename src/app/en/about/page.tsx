import { setRequestLocale } from 'next-intl/server';
import About from '@/components/sections/about';


export default async function Page() {
	setRequestLocale('en');
	return <About />;
}

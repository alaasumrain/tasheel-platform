import { setRequestLocale } from 'next-intl/server';
import PricingPlans from '@/components/sections/pricing-plans-stripe';

export default async function PricingPage() {
	setRequestLocale('ar');
	return <PricingPlans />;
}


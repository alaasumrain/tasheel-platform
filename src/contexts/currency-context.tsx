'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'EUR' | 'ILS';

interface CurrencyContextType {
	currency: Currency;
	setCurrency: (currency: Currency) => void;
	getCurrencyCode: () => string;
	getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'tasheel-currency';

const currencyMap: Record<Currency, { code: string; symbol: string }> = {
	USD: { code: 'USD', symbol: '$' },
	EUR: { code: 'EUR', symbol: '€' },
	ILS: { code: 'ILS', symbol: '₪' },
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
	const [currency, setCurrencyState] = useState<Currency>('ILS');

	// Load currency from localStorage on mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency;
			if (stored && ['USD', 'EUR', 'ILS'].includes(stored)) {
				setCurrencyState(stored);
			}
		}
	}, []);

	const setCurrency = (newCurrency: Currency) => {
		setCurrencyState(newCurrency);
		if (typeof window !== 'undefined') {
			localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
		}
	};

	const getCurrencyCode = () => currencyMap[currency].code;
	const getCurrencySymbol = () => currencyMap[currency].symbol;

	return (
		<CurrencyContext.Provider
			value={{
				currency,
				setCurrency,
				getCurrencyCode,
				getCurrencySymbol,
			}}
		>
			{children}
		</CurrencyContext.Provider>
	);
}

export function useCurrency() {
	const context = useContext(CurrencyContext);
	if (context === undefined) {
		throw new Error('useCurrency must be used within a CurrencyProvider');
	}
	return context;
}


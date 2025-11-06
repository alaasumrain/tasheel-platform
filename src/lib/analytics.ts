export function trackServicesEvent(event: string, payload: Record<string, unknown> = {}) {
	if (typeof window === 'undefined') return;

	const detail = { event, payload, timestamp: Date.now() };

	if (Array.isArray((window as any).dataLayer)) {
		(window as any).dataLayer.push({ event, ...payload });
	}

	if (typeof (window as any).gtag === 'function') {
		(window as any).gtag('event', event, payload);
	}

	try {
		window.dispatchEvent(new CustomEvent('tasheel:analytics', { detail }));
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn('[Analytics] Failed to dispatch custom event', error);
		}
	}

	if (process.env.NODE_ENV !== 'production') {
		// eslint-disable-next-line no-console
		console.info('[Analytics]', event, payload);
	}
}

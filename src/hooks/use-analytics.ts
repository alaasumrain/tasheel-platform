'use client';

import { useEffect } from 'react';

// Analytics Hook
export function useAnalytics() {
	const trackEvent = (eventName: string, properties?: Record<string, any>) => {
		if (typeof window === 'undefined') return;

		// Google Analytics 4
		if (window.gtag) {
			window.gtag('event', eventName, properties);
		}

		// Custom analytics endpoint
		fetch('/api/analytics/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ event: eventName, properties }),
		}).catch((err) => console.error('Analytics error:', err));
	};

	const trackPageView = (path: string) => {
		if (typeof window === 'undefined') return;

		if (window.gtag) {
			window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
				page_path: path,
			});
		}
	};

	const trackFormStart = (formName: string) => {
		trackEvent('form_start', { form_name: formName });
	};

	const trackFormComplete = (formName: string, duration?: number) => {
		trackEvent('form_complete', { form_name: formName, duration });
	};

	const trackFormAbandon = (formName: string, step?: number) => {
		trackEvent('form_abandon', { form_name: formName, step });
	};

	const trackFileUpload = (fileName: string, fileSize: number, success: boolean) => {
		trackEvent('file_upload', {
			file_name: fileName,
			file_size: fileSize,
			success,
		});
	};

	const trackError = (errorType: string, errorMessage: string, context?: Record<string, any>) => {
		trackEvent('error', {
			error_type: errorType,
			error_message: errorMessage,
			...context,
		});
	};

	return {
		trackEvent,
		trackPageView,
		trackFormStart,
		trackFormComplete,
		trackFormAbandon,
		trackFileUpload,
		trackError,
	};
}

// Form Analytics Hook
export function useFormAnalytics(formName: string) {
	const analytics = useAnalytics();
	const startTime = Date.now();

	useEffect(() => {
		analytics.trackFormStart(formName);

		return () => {
			const duration = Date.now() - startTime;
			// Only track abandon if form wasn't completed
			// This would need to be managed by the form component
		};
	}, [formName]);

	const trackStep = (step: number, stepName?: string) => {
		analytics.trackEvent('form_step', {
			form_name: formName,
			step,
			step_name: stepName,
		});
	};

	const trackFieldFocus = (fieldName: string) => {
		analytics.trackEvent('form_field_focus', {
			form_name: formName,
			field_name: fieldName,
		});
	};

	const trackFieldBlur = (fieldName: string, hasError: boolean) => {
		analytics.trackEvent('form_field_blur', {
			form_name: formName,
			field_name: fieldName,
			has_error: hasError,
		});
	};

	const trackValidationError = (fieldName: string, errorType: string) => {
		analytics.trackEvent('form_validation_error', {
			form_name: formName,
			field_name: fieldName,
			error_type: errorType,
		});
	};

	const completeForm = () => {
		const duration = Date.now() - startTime;
		analytics.trackFormComplete(formName, duration);
	};

	return {
		trackStep,
		trackFieldFocus,
		trackFieldBlur,
		trackValidationError,
		completeForm,
	};
}

// Conversion Tracking Hook
export function useConversionTracking() {
	const analytics = useAnalytics();

	const trackOrderSubmission = (orderNumber: string, serviceSlug: string, amount?: number) => {
		analytics.trackEvent('order_submitted', {
			order_number: orderNumber,
			service_slug: serviceSlug,
			amount,
		});

		// Track conversion
		if (window.gtag) {
			window.gtag('event', 'conversion', {
				send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
				value: amount,
				currency: 'ILS',
			});
		}
	};

	const trackPaymentComplete = (orderNumber: string, amount: number, paymentMethod: string) => {
		analytics.trackEvent('payment_complete', {
			order_number: orderNumber,
			amount,
			payment_method: paymentMethod,
		});
	};

	return {
		trackOrderSubmission,
		trackPaymentComplete,
	};
}

// Scroll Tracking Hook
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 100]) {
	const analytics = useAnalytics();

	useEffect(() => {
		const trackedThresholds = new Set<number>();

		const handleScroll = () => {
			const scrollPercent = Math.round(
				((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
			);

			thresholds.forEach((threshold) => {
				if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
					trackedThresholds.add(threshold);
					analytics.trackEvent('scroll_depth', {
						threshold,
						scroll_percent: scrollPercent,
					});
				}
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [thresholds]);
}

// Time on Page Tracking Hook
export function useTimeOnPage() {
	const analytics = useAnalytics();

	useEffect(() => {
		const startTime = Date.now();

		const handleUnload = () => {
			const timeSpent = Math.round((Date.now() - startTime) / 1000);
			analytics.trackEvent('time_on_page', {
				seconds: timeSpent,
			});
		};

		window.addEventListener('beforeunload', handleUnload);
		return () => window.removeEventListener('beforeunload', handleUnload);
	}, []);
}

// Declare gtag for TypeScript
declare global {
	interface Window {
		gtag?: (...args: any[]) => void;
	}
}


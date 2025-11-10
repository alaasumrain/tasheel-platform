'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Performance optimization: Debounced search
export function useDebouncedSearch<T>(
	searchFn: (query: string) => Promise<T[]>,
	delay: number = 300
) {
	const [results, setResults] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const search = useCallback(
		(query: string) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(async () => {
				if (!query.trim()) {
					setResults([]);
					return;
				}

				setLoading(true);
				setError(null);

				try {
					const data = await searchFn(query);
					setResults(data);
				} catch (err) {
					setError(err instanceof Error ? err.message : 'Search failed');
					setResults([]);
				} finally {
					setLoading(false);
				}
			}, delay);
		},
		[searchFn, delay]
	);

	return { results, loading, error, search };
}

// Performance optimization: Virtual scrolling hook
export function useVirtualScroll<T>(
	items: T[],
	itemHeight: number,
	containerHeight: number
) {
	const [scrollTop, setScrollTop] = useState(0);

	const visibleRange = useMemo(() => {
		const start = Math.floor(scrollTop / itemHeight);
		const end = Math.min(
			start + Math.ceil(containerHeight / itemHeight) + 1,
			items.length
		);

		return { start, end };
	}, [scrollTop, itemHeight, containerHeight, items.length]);

	const visibleItems = useMemo(() => {
		return items.slice(visibleRange.start, visibleRange.end);
	}, [items, visibleRange.start, visibleRange.end]);

	const totalHeight = items.length * itemHeight;
	const offsetY = visibleRange.start * itemHeight;

	return {
		visibleItems,
		totalHeight,
		offsetY,
		setScrollTop,
		startIndex: visibleRange.start,
		endIndex: visibleRange.end,
	};
}

// Performance optimization: Lazy loading hook
export function useLazyLoad<T>(
	loadFn: () => Promise<T>,
	dependencies: React.DependencyList = []
) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await loadFn();
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Load failed'));
		} finally {
			setLoading(false);
		}
	}, dependencies);

	return { data, loading, error, load };
}

// Performance optimization: Image lazy loading
export function useImageLazyLoad(src: string, placeholder?: string) {
	const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setImageSrc(src);
			setIsLoaded(true);
		};
		img.onerror = () => {
			setError(true);
		};
		img.src = src;
	}, [src]);

	return { imageSrc, isLoaded, error };
}

// Performance optimization: Intersection Observer hook
export function useIntersectionObserver(
	options?: IntersectionObserverInit
) {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [ref, setRef] = useState<Element | null>(null);

	useEffect(() => {
		if (!ref) return;

		const observer = new IntersectionObserver(([entry]) => {
			setIsIntersecting(entry.isIntersecting);
		}, options);

		observer.observe(ref);

		return () => {
			observer.disconnect();
		};
	}, [ref, options]);

	return { ref: setRef, isIntersecting };
}

// Performance optimization: Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export function useDeduplicatedRequest<T>(
	key: string,
	requestFn: () => Promise<T>
): Promise<T> {
	if (pendingRequests.has(key)) {
		return pendingRequests.get(key)!;
	}

	const promise = requestFn().finally(() => {
		pendingRequests.delete(key);
	});

	pendingRequests.set(key, promise);
	return promise;
}

// Performance optimization: Response caching
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useCachedRequest<T>(
	key: string,
	requestFn: () => Promise<T>,
	ttl: number = CACHE_TTL
): Promise<T> {
	const cached = responseCache.get(key);

	if (cached && Date.now() - cached.timestamp < ttl) {
		return Promise.resolve(cached.data);
	}

	const promise = requestFn().then((data) => {
		responseCache.set(key, { data, timestamp: Date.now() });
		return data;
	});

	return promise;
}

// Performance optimization: Prefetch hook
export function usePrefetch(url: string) {
	const router = useRouter();

	useEffect(() => {
		router.prefetch(url);
	}, [url, router]);
}

// Performance optimization: Batch updates
export function useBatchedUpdates<T>(
	updateFn: (items: T[]) => void,
	batchSize: number = 10,
	delay: number = 100
) {
	const batchRef = useRef<T[]>([]);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const addToBatch = useCallback(
		(item: T) => {
			batchRef.current.push(item);

			if (batchRef.current.length >= batchSize) {
				updateFn([...batchRef.current]);
				batchRef.current = [];
			} else {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					if (batchRef.current.length > 0) {
						updateFn([...batchRef.current]);
						batchRef.current = [];
					}
				}, delay);
			}
		},
		[updateFn, batchSize, delay]
	);

	const flushBatch = useCallback(() => {
		if (batchRef.current.length > 0) {
			updateFn([...batchRef.current]);
			batchRef.current = [];
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	}, [updateFn]);

	return { addToBatch, flushBatch };
}


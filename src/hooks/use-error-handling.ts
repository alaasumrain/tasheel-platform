'use client';

import { useEffect, useState, useCallback } from 'react';

// Network Status Hook
export function useNetworkStatus() {
	const [isOnline, setIsOnline] = useState(true);
	const [wasOffline, setWasOffline] = useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			if (wasOffline) {
				setWasOffline(false);
			}
		};

		const handleOffline = () => {
			setIsOnline(false);
			setWasOffline(true);
		};

		// Set initial state
		setIsOnline(navigator.onLine);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, [wasOffline]);

	return { isOnline, wasOffline };
}

// Retry Hook with Exponential Backoff
export function useRetry<T>(
	fn: () => Promise<T>,
	options?: {
		maxRetries?: number;
		initialDelay?: number;
		onRetry?: (attempt: number) => void;
	}
) {
	const [isRetrying, setIsRetrying] = useState(false);
	const [retryCount, setRetryCount] = useState(0);

	const { maxRetries = 3, initialDelay = 1000, onRetry } = options || {};

	const retry = useCallback(async (): Promise<T> => {
		setIsRetrying(true);
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const result = await fn();
				setRetryCount(0);
				setIsRetrying(false);
				return result;
			} catch (error) {
				lastError = error as Error;

				if (attempt < maxRetries) {
					const delay = initialDelay * Math.pow(2, attempt);
					onRetry?.(attempt + 1);
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		}

		setIsRetrying(false);
		throw lastError || new Error('Retry failed');
	}, [fn, maxRetries, initialDelay, onRetry]);

	return { retry, isRetrying, retryCount };
}

// Offline Queue Manager
class OfflineQueue {
	private queue: Array<{ id: string; action: () => Promise<void>; timestamp: number }> = [];
	private storageKey = 'offline_queue';

	constructor() {
		if (typeof window !== 'undefined') {
			this.loadQueue();
		}
	}

	private loadQueue() {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				this.queue = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Error loading offline queue:', error);
		}
	}

	private saveQueue() {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
		} catch (error) {
			console.error('Error saving offline queue:', error);
		}
	}

	add(action: () => Promise<void>, id?: string): string {
		const actionId = id || `action_${Date.now()}_${Math.random()}`;
		this.queue.push({
			id: actionId,
			action,
			timestamp: Date.now(),
		});
		this.saveQueue();
		return actionId;
	}

	async processQueue(): Promise<{ success: number; failed: number }> {
		let success = 0;
		let failed = 0;

		const itemsToProcess = [...this.queue];
		this.queue = [];

		for (const item of itemsToProcess) {
			try {
				await item.action();
				success++;
			} catch (error) {
				console.error(`Failed to process queued action ${item.id}:`, error);
				// Re-add failed items to queue
				this.queue.push(item);
				failed++;
			}
		}

		this.saveQueue();
		return { success, failed };
	}

	getQueueLength(): number {
		return this.queue.length;
	}

	clear() {
		this.queue = [];
		this.saveQueue();
	}
}

export const offlineQueue = typeof window !== 'undefined' ? new OfflineQueue() : null;

// Offline Queue Processor Hook
export function useOfflineQueue() {
	const { isOnline } = useNetworkStatus();
	const [queueLength, setQueueLength] = useState(0);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		if (offlineQueue) {
			setQueueLength(offlineQueue.getQueueLength());
		}
	}, []);

	useEffect(() => {
		if (isOnline && offlineQueue && offlineQueue.getQueueLength() > 0 && !processing) {
			setProcessing(true);
			offlineQueue
				.processQueue()
				.then((result) => {
					setQueueLength(offlineQueue.getQueueLength());
					console.log(`Processed offline queue: ${result.success} succeeded, ${result.failed} failed`);
				})
				.finally(() => {
					setProcessing(false);
				});
		}
	}, [isOnline, processing]);

	return { queueLength, processing };
}


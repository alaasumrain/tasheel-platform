'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import { useNetworkStatus, offlineQueue } from './use-error-handling';

// Form Persistence Hook
export function useFormPersistence<T extends Record<string, any>>(
	storageKey: string,
	initialData: T,
	options?: {
		debounceMs?: number;
		excludeKeys?: string[];
	}
) {
	const { isOnline } = useNetworkStatus();
	const [data, setData] = useState<T>(initialData);
	const [isRestored, setIsRestored] = useState(false);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const { debounceMs = 500, excludeKeys = [] } = options || {};

	// Load from storage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			if (stored) {
				const parsed = JSON.parse(stored);
				setData(parsed);
				setIsRestored(true);
			}
		} catch (error) {
			console.error('Error loading form data from storage:', error);
		}
	}, [storageKey]);

	// Save to storage with debouncing
	const saveData = useCallback(
		(newData: T) => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				try {
					// Filter out excluded keys
					const dataToSave = Object.keys(newData).reduce((acc, key) => {
						if (!excludeKeys.includes(key)) {
							(acc as any)[key] = (newData as any)[key];
						}
						return acc;
					}, {} as Partial<T>);

					localStorage.setItem(storageKey, JSON.stringify(dataToSave));
				} catch (error) {
					// Handle quota exceeded
					if (error instanceof DOMException && error.name === 'QuotaExceededError') {
						console.warn('Storage quota exceeded, trying IndexedDB fallback');
						// Fallback to IndexedDB could be implemented here
					} else {
						console.error('Error saving form data to storage:', error);
					}
				}
			}, debounceMs);
		},
		[storageKey, debounceMs, excludeKeys]
	);

	// Update data and save
	const updateData = useCallback(
		(updates: Partial<T>) => {
			const newData = { ...data, ...updates };
			setData(newData);
			saveData(newData);
		},
		[data, saveData]
	);

	// Clear stored data
	const clearData = useCallback(() => {
		try {
			localStorage.removeItem(storageKey);
			setData(initialData);
		} catch (error) {
			console.error('Error clearing form data:', error);
		}
	}, [storageKey, initialData]);

	return {
		data,
		updateData,
		clearData,
		isRestored,
		setData: (newData: T) => {
			setData(newData);
			saveData(newData);
		},
	};
}

// File Upload with Retry Hook
export function useFileUploadWithRetry() {
	const { isOnline } = useNetworkStatus();
	const [uploadQueue, setUploadQueue] = useState<
		Array<{
			id: string;
			file: File;
			onUpload: (file: File) => Promise<void>;
			retries: number;
		}>
	>([]);

	const queueUpload = useCallback(
		async (file: File, onUpload: (file: File) => Promise<void>): Promise<void> => {
			const uploadId = `upload_${Date.now()}_${Math.random()}`;

			if (!isOnline) {
				// Queue for later
				setUploadQueue((prev) => [...prev, { id: uploadId, file, onUpload, retries: 0 }]);
				return;
			}

			// Try upload immediately
			try {
				await onUpload(file);
			} catch (error) {
				// Queue for retry
				setUploadQueue((prev) => [...prev, { id: uploadId, file, onUpload, retries: 0 }]);
			}
		},
		[isOnline]
	);

	// Process upload queue when online
	useEffect(() => {
		if (isOnline && uploadQueue.length > 0) {
			const processQueue = async () => {
				for (const item of [...uploadQueue]) {
					try {
						await item.onUpload(item.file);
						setUploadQueue((prev) => prev.filter((i) => i.id !== item.id));
					} catch (error) {
						if (item.retries < 3) {
							setUploadQueue((prev) =>
								prev.map((i) => (i.id === item.id ? { ...i, retries: i.retries + 1 } : i))
							);
						} else {
							// Max retries reached, remove from queue
							setUploadQueue((prev) => prev.filter((i) => i.id !== item.id));
						}
					}
				}
			};

			processQueue();
		}
	}, [isOnline, uploadQueue]);

	return { queueUpload, queueLength: uploadQueue.length };
}

// Session Management Hook
export function useSessionManagement() {
	const [sessionExpired, setSessionExpired] = useState(false);
	const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const checkSession = async () => {
			// Check if session is still valid
			// This would typically check with your auth system
			try {
				// Example: Check token expiry or make a lightweight API call
				const response = await fetch('/api/auth/check', { method: 'HEAD' });
				if (!response.ok) {
					setSessionExpired(true);
				}
			} catch (error) {
				// Network error, don't expire session
				console.error('Session check failed:', error);
			}
		};

		// Check every 5 minutes
		sessionCheckIntervalRef.current = setInterval(checkSession, 5 * 60 * 1000);

		return () => {
			if (sessionCheckIntervalRef.current) {
				clearInterval(sessionCheckIntervalRef.current);
			}
		};
	}, []);

	return { sessionExpired };
}

// Browser Compatibility Check
export function useBrowserCompatibility() {
	const [compatibility, setCompatibility] = useState({
		isCompatible: true,
		warnings: [] as string[],
	});

	useEffect(() => {
		const warnings: string[] = [];

		// Check for required features
		if (!window.localStorage) {
			warnings.push('LocalStorage is not available. Form auto-save will not work.');
		}

		if (!navigator.clipboard) {
			warnings.push('Clipboard API is not available. Copy functionality may not work.');
		}

		if (!window.FileReader) {
			warnings.push('FileReader API is not available. File previews may not work.');
		}

		if (!('serviceWorker' in navigator)) {
			warnings.push('Service Worker is not available. Offline functionality is limited.');
		}

		setCompatibility({
			isCompatible: warnings.length === 0,
			warnings,
		});
	}, []);

	return compatibility;
}


'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Alert, IconButton } from '@mui/material';
import { IconX, IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';

// Toast Notification System
interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

class ToastManager {
	private toasts: Toast[] = [];
	private listeners: Array<(toasts: Toast[]) => void> = [];

	subscribe(listener: (toasts: Toast[]) => void) {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}

	private notify() {
		this.listeners.forEach((listener) => listener([...this.toasts]));
	}

	add(toast: Omit<Toast, 'id'>) {
		const id = Math.random().toString(36).substring(7);
		const newToast = { ...toast, id };
		this.toasts.push(newToast);
		this.notify();

		// Auto remove after duration
		if (toast.duration !== 0) {
			setTimeout(() => {
				this.remove(id);
			}, toast.duration || 5000);
		}

		return id;
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
		this.notify();
	}

	clear() {
		this.toasts = [];
		this.notify();
	}
}

export const toastManager = new ToastManager();

// Toast Component
export function ToastContainer() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	useEffect(() => {
		return toastManager.subscribe(setToasts);
	}, []);

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 16,
				right: 16,
				zIndex: 9999,
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
				maxWidth: 400,
			}}
		>
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.id}
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						<Alert
							severity={toast.type}
							icon={
								toast.type === 'success' ? (
									<IconCircleCheck size={20} />
								) : toast.type === 'error' ? (
									<IconAlertCircle size={20} />
								) : undefined
							}
							action={
								<>
									{toast.action && (
										<Box
											component="button"
											onClick={toast.action.onClick}
											sx={{
												background: 'none',
												border: 'none',
												color: 'inherit',
												cursor: 'pointer',
												textDecoration: 'underline',
												mr: 1,
											}}
										>
											{toast.action.label}
										</Box>
									)}
									<IconButton
										size="small"
										onClick={() => toastManager.remove(toast.id)}
										sx={{ color: 'inherit' }}
									>
										<IconX size={18} />
									</IconButton>
								</>
							}
							sx={{ minWidth: 300 }}
						>
							{toast.message}
						</Alert>
					</motion.div>
				))}
			</AnimatePresence>
		</Box>
	);
}

// Toast Hook
export function useToast() {
	const showToast = useCallback(
		(message: string, type: Toast['type'] = 'info', options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
			return toastManager.add({ message, type, ...options });
		},
		[]
	);

	return {
		success: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
			showToast(message, 'success', options),
		error: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
			showToast(message, 'error', options),
		warning: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
			showToast(message, 'warning', options),
		info: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) =>
			showToast(message, 'info', options),
	};
}

// Inline Notification Component
interface InlineNotificationProps {
	message: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	onDismiss?: () => void;
	dismissible?: boolean;
}

export function InlineNotification({
	message,
	type = 'info',
	onDismiss,
	dismissible = true,
}: InlineNotificationProps) {
	return (
		<Alert
			severity={type}
			action={
				dismissible && onDismiss ? (
					<IconButton size="small" onClick={onDismiss}>
						<IconX size={18} />
					</IconButton>
				) : undefined
			}
			sx={{ borderRadius: 2 }}
		>
			{message}
		</Alert>
	);
}


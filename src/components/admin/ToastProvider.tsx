/**
 * Toast Notification System
 * Simple toast notifications using MUI Snackbar
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastContextType {
	showToast: (message: string, severity?: AlertColor) => void;
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
	showInfo: (message: string) => void;
	showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState<AlertColor>('info');

	const showToast = useCallback((msg: string, sev: AlertColor = 'info') => {
		setMessage(msg);
		setSeverity(sev);
		setOpen(true);
	}, []);

	const showSuccess = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
	const showError = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
	const showInfo = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
	const showWarning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);

	const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	return (
		<ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return context;
}


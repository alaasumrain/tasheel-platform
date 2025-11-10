'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; fallback?: React.ReactNode },
	ErrorBoundaryState
> {
	constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		// You can log to error reporting service here
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<Box sx={{ p: 4, textAlign: 'center' }}>
					<IconAlertCircle size={48} color="error" />
					<Typography variant="h6" sx={{ mt: 2 }}>
						Something went wrong
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						{this.state.error?.message || 'An unexpected error occurred'}
					</Typography>
					<Button
						variant="contained"
						sx={{ mt: 3 }}
						onClick={() => {
							this.setState({ hasError: false, error: null });
							window.location.reload();
						}}
					>
						Reload Page
					</Button>
				</Box>
			);
		}

		return this.props.children;
	}
}


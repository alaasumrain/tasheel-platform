'use client';

import { Component, ReactNode } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree
 * and displays a fallback UI instead of crashing the whole app
 */

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error to console in development
		if (process.env.NODE_ENV === 'development') {
			console.error('Error caught by boundary:', error);
			console.error('Error info:', errorInfo);
		}

		// TODO: Send error to error tracking service (Sentry, etc.)
		// Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI
			return (
				<Container maxWidth="sm" sx={{ py: 8 }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							gap: 3,
						}}
					>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: '50%',
								bgcolor: 'error.lighter',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<IconAlertCircle size={48} color="var(--mui-palette-error-main)" />
						</Box>

						<Box>
							<Typography variant="h4" gutterBottom fontWeight={700}>
								حدث خطأ غير متوقع
							</Typography>
							<Typography variant="body1" color="text.secondary">
								نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذه الصفحة.
							</Typography>
						</Box>

						{process.env.NODE_ENV === 'development' && this.state.error && (
							<Box
								sx={{
									width: '100%',
									p: 2,
									bgcolor: 'grey.100',
									borderRadius: 2,
									textAlign: 'left',
									overflow: 'auto',
									maxHeight: 200,
								}}
							>
								<Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
									{this.state.error.message}
								</Typography>
							</Box>
						)}

						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								variant="contained"
								startIcon={<IconRefresh size={18} />}
								onClick={this.handleReset}
							>
								حاول مرة أخرى
							</Button>
							<Button
								variant="outlined"
								onClick={() => (window.location.href = '/')}
							>
								العودة للصفحة الرئيسية
							</Button>
						</Box>
					</Box>
				</Container>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;

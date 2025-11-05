'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	TextField,
	Typography,
	Alert,
} from '@mui/material';

export default function AdminLoginPage() {
	const router = useRouter();
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			});

			if (response.ok) {
				router.push('/admin');
			} else {
				setError('Invalid password');
			}
		} catch {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: 'background.default',
			}}
		>
			<Container maxWidth="sm">
				<Card sx={{ borderRadius: 4 }}>
					<CardContent sx={{ p: 4 }}>
						<Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
							Admin Login
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Enter your password to access the admin dashboard
						</Typography>

						{error && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}

						<form onSubmit={handleSubmit}>
							<TextField
								fullWidth
								type="password"
								label="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								sx={{ mb: 3 }}
								autoFocus
							/>
							<Button
								type="submit"
								variant="contained"
								fullWidth
								size="large"
								disabled={loading}
							>
								{loading ? 'Logging in...' : 'Login'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

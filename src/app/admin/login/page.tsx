'use client';

import { useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	TextField,
	Typography,
	Alert,
	Stack,
} from '@mui/material';
import { IconArrowRight } from '@tabler/icons-react';

export default function AdminLoginPage() {
	const [email, setEmail] = useState('');
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
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				// Use window.location for full page reload to ensure cookies are sent
				window.location.href = '/admin';
			} else {
				setError(data.error || 'Invalid email or password');
				setLoading(false);
			}
		} catch {
			setError('An error occurred. Please try again.');
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
						<Stack spacing={3}>
							<Box>
								<Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
									Admin Login
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Enter your credentials to access the admin dashboard
								</Typography>
							</Box>

							{error && (
								<Alert severity="error">
									{error}
								</Alert>
							)}

							<form onSubmit={handleSubmit}>
								<Stack spacing={3}>
									<TextField
										fullWidth
										type="email"
										label="Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										autoFocus
										autoComplete="email"
									/>
									<TextField
										fullWidth
										type="password"
										label="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										autoComplete="current-password"
									/>
									<Button
										type="submit"
										variant="contained"
										fullWidth
										size="large"
										disabled={loading}
										endIcon={<IconArrowRight />}
										sx={{ borderRadius: 2 }}
									>
										{loading ? 'Logging in...' : 'Login'}
									</Button>
								</Stack>
							</form>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

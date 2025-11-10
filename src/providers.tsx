'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer } from '@/components/ui/toast';
import { CurrencyProvider } from '@/contexts/currency-context';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<CurrencyProvider>
				<Gradient elevation={0}>
					{children}
					<ToastContainer />
					<Toaster
						position="top-center"
						reverseOrder={false}
						gutter={8}
						containerClassName=""
						containerStyle={{}}
						toastOptions={{
							duration: 3000,
							position: 'bottom-center',
							style: {
								background: '#363636',
								color: '#fff',
							},
						}}
					/>
				</Gradient>
			</CurrencyProvider>
		</QueryClientProvider>
	);
}

const Gradient = styled(Paper)(({ theme }) => [
	{
		position: 'relative',
		backgroundColor: theme.palette.mode === 'dark' ? '#111' : '#FFFFFF',
		'&:after': {
			background:
				'linear-gradient(180deg, rgba(197, 202, 232, 0.25) 0%, rgba(231, 233, 246, 1) 100%)',
			content: "''",
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 0,
			pointerEvents: 'none',
			[theme.breakpoints.up('md')]: {
				height: 1000,
			},
		},
	},
	theme.applyStyles('dark', {
		backgroundColor: '#111',
		'&:after': {
			background: 'linear-gradient(180deg, #222 0%, #111 100%)',
		},
	}),
]);

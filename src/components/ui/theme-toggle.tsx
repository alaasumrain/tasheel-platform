import * as React from 'react';
import { Box } from '@mui/material';
import {
	IconMoonFilled as IconDark,
	IconSunFilled as IconLight,
} from '@tabler/icons-react';

import { useColorScheme } from '@mui/material/styles';

export default function ThemeToggle() {
	const { mode, setMode } = useColorScheme();
	const handleChange = () => {
		const newMode = mode === 'dark' ? 'light' : 'dark';
		setMode(newMode);
	};

	if (!mode) {
		return null;
	}

	return (
		<Box
			component="button"
			onClick={handleChange}
			sx={[
				{
					alignItems: 'center',
					backgroundColor: 'rgba(16, 16, 30, 0.12)',
					boxShadow: '0px 2px 0px 0px rgba(16, 16, 30, 0.12) inset',
					borderRadius: '50vh',
					cursor: 'pointer',
					display: 'flex',
					flexDirection: 'row',
					height: 32,
					justifyContent: 'space-between',
					position: 'relative',
					p: 0.5,
					width: 64,
					zIndex: 2,
					'&:after': {
						backgroundColor: 'rgba(255, 255, 255, 0.5)',
						borderRadius: '50vh',
						borderTop: '2px solid rgba(255, 255, 255, 1)',
						content: "''",
						left: 4,
						position: 'absolute',
						height: 24,
						width: 24,
						top: 4,
						transform: 'translateX(32px)',
						transition: 'transform 0.3s ease-in-out',
						zIndex: 0,
					},
				},
				(theme) =>
					theme.applyStyles('dark', {
						backgroundColor: 'rgba(221, 221, 221, 0.12)',
						'&:after': {
							backgroundColor: 'rgba(221, 221, 221, 1)',
							transform: 'translateX(0)',
						},
					}),
			]}
		>
			<Box
				sx={[
					{
						alignItems: 'center',
						color: 'rgba(75, 75, 101, 1)',
						cursor: 'pointer',
						display: 'flex',
					height: 24,
						justifyContent: 'center',
						position: 'relative',
						transition: 'color 0.3s ease-in-out',
					width: 24,
						zIndex: 1,
					},
					(theme) =>
						theme.applyStyles('dark', {
							color: '#000000',
						}),
				]}
			>
				<IconDark size={14} />
			</Box>
			<Box
				sx={[
					{
						alignItems: 'center',
						color: '#10101E',
						cursor: 'pointer',
						display: 'flex',
					height: 24,
						justifyContent: 'center',
						position: 'relative',
						transition: 'color 0.3s ease-in-out',
					width: 24,
						zIndex: 1,
					},
					(theme) =>
						theme.applyStyles('dark', {
							color: '#AAAAAA',
						}),
				]}
			>
				<IconLight size={14} />
			</Box>
		</Box>
	);
}

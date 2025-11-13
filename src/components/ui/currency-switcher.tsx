'use client';

import { Button, Menu, MenuItem, useColorScheme } from '@mui/material';
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { useCurrency } from '@/contexts/currency-context';

interface CurrencySwitcherProps {
	fullWidth?: boolean;
}

export default function CurrencySwitcher({ fullWidth = false }: CurrencySwitcherProps) {
	const { currency, setCurrency } = useCurrency();
	const { mode } = useColorScheme();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const isDark = mode === 'dark';
	const navColor = isDark ? '#F8FAFF' : '#0F172A';
	const outlineBorder = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(15, 23, 42, 0.16)';
	const outlineHoverBorder = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.3)';
	const outlineHoverBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)';

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSelect = (newCurrency: 'USD' | 'EUR' | 'ILS') => {
		setCurrency(newCurrency);
		handleClose();
	};

	const currencyLabels: Record<'USD' | 'EUR' | 'ILS', string> = {
		USD: 'USD',
		EUR: 'EUR',
		ILS: 'ILS',
	};

	return (
		<>
			<Button
				suppressHydrationWarning
				onClick={handleClick}
				fullWidth={fullWidth}
				sx={{
					backgroundColor: 'transparent',
					border: '1.5px solid',
					borderColor: outlineBorder,
					borderRadius: '999px',
					color: navColor,
					fontSize: 13,
					fontWeight: 600,
					px: 1.5,
					py: 0.25,
					textTransform: 'none',
					transition: 'all 0.2s ease',
					minWidth: fullWidth ? 'auto' : 'fit-content',
					minHeight: '32px',
					height: '32px',
					whiteSpace: 'nowrap',
					display: 'flex',
					alignItems: 'center',
					gap: 0.5,
					'&:hover': {
						backgroundColor: outlineHoverBg,
						borderColor: outlineHoverBorder,
					},
				}}
			>
				{currency}
				<IconChevronDown size={14} style={{ marginLeft: '2px' }} />
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				sx={{
					'& .MuiPaper-root': {
						borderRadius: '12px',
						minWidth: 100,
						mt: 1,
					},
					'& .MuiMenuItem-root': {
						fontSize: 15,
						fontWeight: 600,
						px: 3,
						py: 1,
					},
				}}
			>
				<MenuItem onClick={() => handleSelect('USD')} selected={currency === 'USD'}>
					USD
				</MenuItem>
				<MenuItem onClick={() => handleSelect('EUR')} selected={currency === 'EUR'}>
					EUR
				</MenuItem>
				<MenuItem onClick={() => handleSelect('ILS')} selected={currency === 'ILS'}>
					NIS
				</MenuItem>
			</Menu>
		</>
	);
}

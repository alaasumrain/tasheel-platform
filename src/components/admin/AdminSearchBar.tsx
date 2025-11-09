/**
 * Admin Search Bar Component
 * Debounced search input with URL sync
 */

'use client';

import { TextField, InputAdornment, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useDebouncedSearch, useUrlParams } from '@/lib/hooks/use-url-params';
import { useEffect } from 'react';

interface AdminSearchBarProps {
	placeholder?: string;
	debounceMs?: number;
	defaultValue?: string;
	sx?: any;
}

export function AdminSearchBar({
	placeholder = 'Search...',
	debounceMs = 500,
	defaultValue,
	sx,
}: AdminSearchBarProps) {
	const { updateParams, getParam } = useUrlParams();
	const initialValue = defaultValue || getParam('search') || '';

	const { searchValue, setSearchValue, debouncedValue } = useDebouncedSearch(
		initialValue,
		debounceMs,
		(value) => {
			updateParams({ search: value || null, page: null }); // Reset to page 1 on search
		}
	);

	// Sync URL param changes to input
	useEffect(() => {
		const urlSearch = getParam('search');
		if (urlSearch !== searchValue) {
			setSearchValue(urlSearch || '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getParam('search')]);

	const handleClear = () => {
		setSearchValue('');
		updateParams({ search: null, page: null });
	};

	return (
		<Box sx={sx}>
			<TextField
				fullWidth
				size="small"
				placeholder={placeholder}
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				aria-label="Search"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon color="action" aria-hidden="true" />
						</InputAdornment>
					),
					endAdornment:
						searchValue ? (
							<InputAdornment position="end">
								<ClearIcon
									sx={{ cursor: 'pointer', fontSize: 18 }}
									onClick={handleClear}
									color="action"
									aria-label="Clear search"
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											handleClear();
										}
									}}
								/>
							</InputAdornment>
						) : null,
				}}
				sx={{
					'& .MuiOutlinedInput-root': {
						backgroundColor: 'background.paper',
					},
				}}
			/>
		</Box>
	);
}


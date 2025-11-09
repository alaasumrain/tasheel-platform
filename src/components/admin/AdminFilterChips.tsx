/**
 * Admin Filter Chips Component
 * Filter chips with URL sync
 */

'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { useUrlParams } from '@/lib/hooks/use-url-params';
import { useMemo } from 'react';

export interface FilterOption {
	key: string;
	label: string;
	value: string | boolean | number;
	color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

interface AdminFilterChipsProps {
	filters: FilterOption[];
	paramKey?: string; // URL param key (default: 'filter_')
	showLabel?: boolean;
	sx?: any;
}

export function AdminFilterChips({
	filters,
	paramKey = 'filter_',
	showLabel = true,
	sx,
}: AdminFilterChipsProps) {
	const { updateParams, getParam } = useUrlParams();

	const activeFilters = useMemo(() => {
		return filters.filter((filter) => {
			const urlValue = getParam(`${paramKey}${filter.key}`);
			if (urlValue === null) return false;
			return String(urlValue) === String(filter.value);
		});
	}, [filters, getParam, paramKey]);

	// Create a map for quick lookup of active filters
	const activeFilterMap = useMemo(() => {
		const map = new Map<string, string | boolean | number>();
		activeFilters.forEach((f) => {
			map.set(`${f.key}-${f.value}`, f.value);
		});
		return map;
	}, [activeFilters]);

	const handleToggle = (filter: FilterOption) => {
		const isActive = activeFilterMap.has(`${filter.key}-${filter.value}`);
		if (isActive) {
			updateParams({ [`${paramKey}${filter.key}`]: null, page: null });
		} else {
			updateParams({ [`${paramKey}${filter.key}`]: String(filter.value), page: null });
		}
	};

	if (filters.length === 0) return null;

	return (
		<Box sx={sx}>
			{showLabel && (
				<Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
					Filters:
				</Typography>
			)}
			<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
				{filters.map((filter, index) => {
					const isActive = activeFilterMap.has(`${filter.key}-${filter.value}`);
					return (
						<Chip
							key={`${filter.key}-${filter.value}-${index}`}
							label={filter.label}
							onClick={() => handleToggle(filter)}
							color={isActive ? (filter.color || 'primary') : 'default'}
							variant={isActive ? 'filled' : 'outlined'}
							size="small"
							aria-label={`Filter by ${filter.label}`}
							sx={{
								cursor: 'pointer',
								...(isActive && {
									fontWeight: 600,
								}),
							}}
						/>
					);
				})}
			</Stack>
		</Box>
	);
}


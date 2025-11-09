/**
 * Admin Pagination Component
 * Pagination controls with URL sync
 */

'use client';

import { Box, Pagination, Select, MenuItem, FormControl, InputLabel, Typography, Stack } from '@mui/material';
import { usePagination, useUrlParams } from '@/lib/hooks/use-url-params';
import { useMemo } from 'react';

interface AdminPaginationProps {
	total: number;
	pageSizeOptions?: number[];
	defaultPageSize?: number;
	showPageSize?: boolean;
	sx?: any;
}

export function AdminPagination({
	total,
	pageSizeOptions = [10, 25, 50, 100],
	defaultPageSize = 25,
	showPageSize = true,
	sx,
}: AdminPaginationProps) {
	const { page, pageSize, goToPage, changePageSize } = usePagination(1, defaultPageSize);
	const totalPages = Math.ceil(total / pageSize);

	const startItem = useMemo(() => {
		return total === 0 ? 0 : (page - 1) * pageSize + 1;
	}, [page, pageSize, total]);

	const endItem = useMemo(() => {
		return Math.min(page * pageSize, total);
	}, [page, pageSize, total]);

	if (total === 0) {
		return (
			<Box sx={{ ...sx, py: 2 }}>
				<Typography variant="body2" color="text.secondary" textAlign="center">
					No items to display
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: 2,
				py: 2,
				...sx,
			}}
		>
			<Stack direction="row" spacing={2} alignItems="center">
				<Typography variant="body2" color="text.secondary">
					Showing {startItem} - {endItem} of {total}
				</Typography>
				{showPageSize && (
					<FormControl size="small" sx={{ minWidth: 120 }}>
						<InputLabel id="page-size-label">Per page</InputLabel>
						<Select
							value={pageSize}
							label="Per page"
							labelId="page-size-label"
							onChange={(e) => changePageSize(Number(e.target.value))}
							aria-label="Items per page"
						>
							{pageSizeOptions.map((size) => (
								<MenuItem key={size} value={size}>
									{size}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</Stack>

			<Pagination
				count={totalPages}
				page={page}
				onChange={(_, value) => goToPage(value)}
				color="primary"
				shape="rounded"
				showFirstButton
				showLastButton
			/>
		</Box>
	);
}


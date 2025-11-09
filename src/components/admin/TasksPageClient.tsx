'use client';

import { useState } from 'react';
import { Box, Typography, Button, Stack, Tabs, Tab } from '@mui/material';
import { Add as AddIcon, ViewKanban as KanbanIcon, ViewList as ListIcon } from '@mui/icons-material';
import { TaskKanbanBoard } from '@/components/admin/TaskKanbanBoard';
import { TasksTable } from '@/components/admin/TasksTable';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { AdminFilterChips, type FilterOption } from '@/components/admin/AdminFilterChips';
import { Task } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface TasksPageClientProps {
	tasks: Task[];
}

export function TasksPageClient({ tasks }: TasksPageClientProps) {
	const t = useTranslations('Admin.tasks');
	const router = useRouter();
	const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

	const statusFilters: FilterOption[] = [
		{ key: 'status', label: t('statuses.open'), value: 'open', color: 'info' },
		{ key: 'status', label: t('statuses.in_progress'), value: 'in_progress', color: 'warning' },
		{ key: 'status', label: t('statuses.done'), value: 'done', color: 'success' },
		{ key: 'status', label: t('statuses.cancelled'), value: 'cancelled', color: 'default' },
	];

	const priorityFilters: FilterOption[] = [
		{ key: 'priority', label: t('priorities.low'), value: 'low', color: 'default' },
		{ key: 'priority', label: t('priorities.normal'), value: 'normal', color: 'primary' },
		{ key: 'priority', label: t('priorities.high'), value: 'high', color: 'warning' },
		{ key: 'priority', label: t('priorities.urgent'), value: 'urgent', color: 'error' },
	];

	return (
		<Box>
			<Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
						{t('pageTitle')}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{t('pageDescription')}
					</Typography>
				</Box>
				<Stack direction="row" spacing={2}>
					<Button
						variant={viewMode === 'kanban' ? 'contained' : 'outlined'}
						startIcon={<KanbanIcon />}
						onClick={() => setViewMode('kanban')}
					>
						{t('kanban') || 'Kanban'}
					</Button>
					<Button
						variant={viewMode === 'list' ? 'contained' : 'outlined'}
						startIcon={<ListIcon />}
						onClick={() => setViewMode('list')}
					>
						{t('list') || 'List'}
					</Button>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => router.push('/admin/tasks/new')}
						size="large"
					>
						{t('createTask') || 'Create Task'}
					</Button>
				</Stack>
			</Box>

			{/* Search and Filters */}
			<Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<AdminSearchBar placeholder={t('searchPlaceholder') || 'Search tasks...'} />
				<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
					<AdminFilterChips filters={statusFilters} showLabel={false} />
					<AdminFilterChips filters={priorityFilters} showLabel={false} />
				</Box>
			</Box>

			{/* View Mode */}
			{viewMode === 'kanban' ? (
				<TaskKanbanBoard tasks={tasks} />
			) : (
				<TasksTable tasks={tasks} />
			)}
		</Box>
	);
}


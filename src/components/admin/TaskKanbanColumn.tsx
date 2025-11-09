'use client';

import { useDroppable } from '@dnd-kit/core';
import { Box, Typography, Chip, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskKanbanCard } from './TaskKanbanCard';
import { Task } from '@/lib/admin-queries';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface TaskKanbanColumnProps {
	id: string;
	title: string;
	tasks: Task[];
	color: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function TaskKanbanColumn({ id, title, tasks, color }: TaskKanbanColumnProps) {
	const router = useRouter();
	const t = useTranslations('Admin.tasks');
	const { isOver, setNodeRef } = useDroppable({ id });

	return (
		<Box
			ref={setNodeRef}
			sx={{
				minWidth: 300,
				maxWidth: 300,
				display: 'flex',
				flexDirection: 'column',
				bgcolor: 'background.paper',
				borderRadius: 2,
				border: '2px solid',
				borderColor: isOver ? 'primary.main' : 'divider',
				p: 2,
			}}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography variant="subtitle2" fontWeight={600}>
						{title}
					</Typography>
					<Chip label={tasks.length} size="small" color={color} />
				</Box>
				<Button
					size="small"
					startIcon={<AddIcon />}
					onClick={() => router.push(`/admin/tasks/new?status=${id}`)}
					variant="outlined"
				>
					{t('add') || 'Add'}
				</Button>
			</Box>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					overflowY: 'auto',
					maxHeight: 'calc(100vh - 300px)',
				}}
			>
				{tasks.map((task) => (
					<TaskKanbanCard key={task.id} task={task} />
				))}
				{tasks.length === 0 && (
					<Box sx={{ p: 2, textAlign: 'center' }}>
						<Typography variant="caption" color="text.secondary">
							{t('noTasks') || 'No tasks'}
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}


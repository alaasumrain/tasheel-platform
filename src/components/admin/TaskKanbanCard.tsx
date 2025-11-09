'use client';

import { useDraggable } from '@dnd-kit/core';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import { Task } from '@/lib/admin-queries';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface TaskKanbanCardProps {
	task: Task;
}

const priorityColors: Record<Task['priority'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
	low: 'default',
	normal: 'primary',
	high: 'warning',
	urgent: 'error',
};

export function TaskKanbanCard({ task }: TaskKanbanCardProps) {
	const router = useRouter();
	const t = useTranslations('Admin.tasks');
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: task.id,
		data: { task },
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				opacity: isDragging ? 0.5 : 1,
			}
		: {};

	const typeLabels: Record<Task['type'], string> = {
		call: t('types.call'),
		whatsapp: t('types.whatsapp'),
		email: t('types.email'),
		office_visit: t('types.office_visit'),
		ministry: t('types.ministry'),
		qa: t('types.qa'),
	};

	const priorityLabels: Record<Task['priority'], string> = {
		low: t('priorities.low'),
		normal: t('priorities.normal'),
		high: t('priorities.high'),
		urgent: t('priorities.urgent'),
	};

	return (
		<Card
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			style={style}
			sx={{
				cursor: 'grab',
				'&:active': {
					cursor: 'grabbing',
				},
				'&:hover': {
					boxShadow: 3,
				},
			}}
			onClick={() => router.push(`/admin/tasks/${task.id}/edit`)}
		>
			<CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
					<Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>
						{task.title}
					</Typography>
					<Chip label={typeLabels[task.type]} size="small" sx={{ ml: 1 }} />
				</Box>
				{task.description && (
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
						{task.description.substring(0, 60)}
						{task.description.length > 60 ? '...' : ''}
					</Typography>
				)}
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
					<Chip
						label={priorityLabels[task.priority]}
						size="small"
						color={priorityColors[task.priority]}
					/>
					{task.due_date && (
						<Typography variant="caption" color="text.secondary">
							{t('form.dueDate')}: {new Date(task.due_date).toLocaleDateString()}
						</Typography>
					)}
				</Box>
			</CardContent>
		</Card>
	);
}


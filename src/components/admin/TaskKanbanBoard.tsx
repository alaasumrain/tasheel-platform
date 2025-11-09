'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';
import { TaskKanbanColumn } from './TaskKanbanColumn';
import { Task } from '@/lib/admin-queries';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface TaskKanbanBoardProps {
	tasks: Task[];
}

export function TaskKanbanBoard({ tasks }: TaskKanbanBoardProps) {
	const router = useRouter();
	const t = useTranslations('Admin.tasks');
	const [activeId, setActiveId] = useState<string | null>(null);

	const statusColumns = [
		{ id: 'open', label: t('statuses.open'), color: 'info' },
		{ id: 'in_progress', label: t('statuses.in_progress'), color: 'warning' },
		{ id: 'done', label: t('statuses.done'), color: 'success' },
		{ id: 'cancelled', label: t('statuses.cancelled'), color: 'default' },
	] as const;

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 5,
		},
	});

	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			distance: 5,
		},
	});

	const sensors = useSensors(mouseSensor, touchSensor);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const taskId = active.id as string;
		const newStatus = over.id as Task['status'];

		try {
			const response = await fetch(`/api/admin/tasks/${taskId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});

			if (!response.ok) {
				throw new Error('Failed to update task status');
			}

			router.refresh();
		} catch (error) {
			console.error('Error updating task status:', error);
		} finally {
			setActiveId(null);
		}
	};

	const groupedTasks = statusColumns.reduce((acc, column) => {
		acc[column.id] = tasks.filter((task) => task.status === column.id);
		return acc;
	}, {} as Record<string, Task[]>);

	return (
		<DndContext onDragEnd={handleDragEnd} sensors={sensors}>
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					overflowX: 'auto',
					pb: 2,
					minHeight: '600px',
				}}
			>
				{statusColumns.map((column) => (
					<TaskKanbanColumn
						key={column.id}
						id={column.id}
						title={column.label}
						tasks={groupedTasks[column.id] || []}
						color={column.color}
					/>
				))}
			</Box>
		</DndContext>
	);
}


'use client';

import { useState } from 'react';
import {
	Box,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
	CircularProgress,
	Autocomplete,
} from '@mui/material';
import { Task } from '@/lib/admin-queries';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/admin/ToastProvider';
import { Application, User } from '@/lib/admin-queries';

interface TaskFormProps {
	task?: Task;
	mode: 'create' | 'edit';
	applications?: Application[];
	users?: User[];
}

export function TaskForm({ task, mode, applications = [], users = [] }: TaskFormProps) {
	const t = useTranslations('Admin.tasks');
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showSuccess, showError } = useToast();

	const [formData, setFormData] = useState({
		application_id: task?.application_id || searchParams.get('application_id') || '',
		title: task?.title || '',
		description: task?.description || '',
		type: task?.type || 'call',
		assigned_to: task?.assigned_to || '',
		due_date: task?.due_date ? task.due_date.split('T')[0] : '',
		priority: task?.priority || 'normal',
		status: task?.status || searchParams.get('status') || 'open',
		time_spent_minutes: task?.time_spent_minutes || '',
		outcome_notes: task?.outcome_notes || '',
	});

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = t('errors.titleRequired') || 'Title is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setLoading(true);

		try {
			const url = mode === 'create' 
				? '/api/admin/tasks'
				: `/api/admin/tasks/${task?.id}`;
			
			const method = mode === 'create' ? 'POST' : 'PUT';

			const body: any = {
				title: formData.title,
				description: formData.description || null,
				type: formData.type,
				priority: formData.priority,
				status: formData.status,
				assigned_to: formData.assigned_to || null,
				due_date: formData.due_date || null,
				application_id: formData.application_id || null,
			};

			if (mode === 'edit') {
				if (formData.time_spent_minutes) {
					body.time_spent_minutes = parseInt(formData.time_spent_minutes as string);
				}
				if (formData.outcome_notes) {
					body.outcome_notes = formData.outcome_notes;
				}
			}

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save task');
			}

			showSuccess(
				mode === 'create' 
					? t('createSuccess') || 'Task created successfully!'
					: t('updateSuccess') || 'Task updated successfully!'
			);
			router.push('/admin/tasks');
			router.refresh();
		} catch (error: any) {
			console.error('Error saving task:', error);
			showError(error.message || t('saveError') || 'Failed to save task');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<Stack spacing={3}>
				<TextField
					label={t('form.title') || 'Title'}
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					error={!!errors.title}
					helperText={errors.title}
					required
					fullWidth
				/>

				<TextField
					label={t('form.description') || 'Description'}
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					multiline
					rows={4}
					fullWidth
				/>

				<FormControl fullWidth required>
					<InputLabel>{t('form.type') || 'Type'}</InputLabel>
					<Select
						value={formData.type}
						label={t('form.type') || 'Type'}
						onChange={(e) => setFormData({ ...formData, type: e.target.value as Task['type'] })}
					>
						<MenuItem value="call">{t('types.call') || 'Call'}</MenuItem>
						<MenuItem value="whatsapp">{t('types.whatsapp') || 'WhatsApp'}</MenuItem>
						<MenuItem value="email">{t('types.email') || 'Email'}</MenuItem>
						<MenuItem value="office_visit">{t('types.office_visit') || 'Office Visit'}</MenuItem>
						<MenuItem value="ministry">{t('types.ministry') || 'Ministry'}</MenuItem>
						<MenuItem value="qa">{t('types.qa') || 'QA'}</MenuItem>
					</Select>
				</FormControl>

				<FormControl fullWidth>
					<InputLabel>{t('form.priority') || 'Priority'}</InputLabel>
					<Select
						value={formData.priority}
						label={t('form.priority') || 'Priority'}
						onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
					>
						<MenuItem value="low">{t('priorities.low') || 'Low'}</MenuItem>
						<MenuItem value="normal">{t('priorities.normal') || 'Normal'}</MenuItem>
						<MenuItem value="high">{t('priorities.high') || 'High'}</MenuItem>
						<MenuItem value="urgent">{t('priorities.urgent') || 'Urgent'}</MenuItem>
					</Select>
				</FormControl>

				{mode === 'edit' && (
					<FormControl fullWidth>
						<InputLabel>{t('form.status') || 'Status'}</InputLabel>
						<Select
							value={formData.status}
							label={t('form.status') || 'Status'}
							onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
						>
							<MenuItem value="open">{t('statuses.open') || 'Open'}</MenuItem>
							<MenuItem value="in_progress">{t('statuses.in_progress') || 'In Progress'}</MenuItem>
							<MenuItem value="done">{t('statuses.done') || 'Done'}</MenuItem>
							<MenuItem value="cancelled">{t('statuses.cancelled') || 'Cancelled'}</MenuItem>
						</Select>
					</FormControl>
				)}

				<Autocomplete
					options={users}
					getOptionLabel={(option) => option.name || option.email}
					value={users.find((u) => u.id === formData.assigned_to) || null}
					onChange={(_, value) => setFormData({ ...formData, assigned_to: value?.id || '' })}
					renderInput={(params) => (
						<TextField
							{...params}
							label={t('form.assignedTo') || 'Assigned To'}
							placeholder={t('form.assignedToPlaceholder') || 'Select user...'}
						/>
					)}
				/>

				<TextField
					label={t('form.dueDate') || 'Due Date'}
					type="date"
					value={formData.due_date}
					onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
					InputLabelProps={{ shrink: true }}
					fullWidth
				/>

				{mode === 'edit' && (
					<>
						<TextField
							label={t('form.timeSpent') || 'Time Spent (minutes)'}
							type="number"
							value={formData.time_spent_minutes}
							onChange={(e) => setFormData({ ...formData, time_spent_minutes: e.target.value })}
							fullWidth
						/>

						<TextField
							label={t('form.outcomeNotes') || 'Outcome Notes'}
							value={formData.outcome_notes}
							onChange={(e) => setFormData({ ...formData, outcome_notes: e.target.value })}
							multiline
							rows={3}
							fullWidth
						/>
					</>
				)}

				<Stack direction="row" spacing={2} justifyContent="flex-end">
					<Button
						variant="outlined"
						onClick={() => router.back()}
						disabled={loading}
					>
						{t('cancel') || 'Cancel'}
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={loading}
						startIcon={loading ? <CircularProgress size={20} /> : null}
					>
						{loading 
							? (t('saving') || 'Saving...')
							: (mode === 'create' ? t('create') || 'Create Task' : t('update') || 'Update Task')
						}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}


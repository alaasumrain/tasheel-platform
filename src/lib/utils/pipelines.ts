/**
 * Workflow Pipeline Definitions
 * Defines status stages for different service types
 */

export interface PipelineStage {
	key: ApplicationStatus;
	label_en: string;
	label_ar: string;
	color: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export interface Pipeline {
	name: string;
	stages: PipelineStage[];
}

import { ApplicationStatus } from '@/lib/admin-queries';

export const PIPELINES: Record<string, Pipeline> = {
	translation: {
		name: 'Translation Pipeline',
		stages: [
			{ key: 'submitted', label_en: 'Submitted', label_ar: 'تم الإرسال', color: 'info' },
			{ key: 'scoping', label_en: 'Review', label_ar: 'مراجعة', color: 'primary' },
			{ key: 'quote_sent', label_en: 'Quote Sent', label_ar: 'تم إرسال العرض', color: 'warning' },
			{ key: 'in_progress', label_en: 'Translation', label_ar: 'ترجمة', color: 'primary' },
			{ key: 'review', label_en: 'QA Review', label_ar: 'مراجعة الجودة', color: 'warning' },
			{ key: 'completed', label_en: 'Completed', label_ar: 'مكتمل', color: 'success' },
		],
	},
	government: {
		name: 'Government Services Pipeline',
		stages: [
			{ key: 'submitted', label_en: 'Submitted', label_ar: 'تم الإرسال', color: 'info' },
			{ key: 'scoping', label_en: 'Scoping', label_ar: 'تحديد النطاق', color: 'primary' },
			{ key: 'quote_sent', label_en: 'Quote Sent', label_ar: 'تم إرسال العرض', color: 'warning' },
			{ key: 'in_progress', label_en: 'Processing', label_ar: 'قيد المعالجة', color: 'primary' },
			{ key: 'review', label_en: 'Review', label_ar: 'مراجعة', color: 'warning' },
			{ key: 'completed', label_en: 'Completed', label_ar: 'مكتمل', color: 'success' },
		],
	},
	business: {
		name: 'Business Services Pipeline',
		stages: [
			{ key: 'submitted', label_en: 'Submitted', label_ar: 'تم الإرسال', color: 'info' },
			{ key: 'scoping', label_en: 'Assessment', label_ar: 'تقييم', color: 'primary' },
			{ key: 'quote_sent', label_en: 'Quote Sent', label_ar: 'تم إرسال العرض', color: 'warning' },
			{ key: 'in_progress', label_en: 'In Progress', label_ar: 'قيد التنفيذ', color: 'primary' },
			{ key: 'review', label_en: 'Final Review', label_ar: 'المراجعة النهائية', color: 'warning' },
			{ key: 'completed', label_en: 'Completed', label_ar: 'مكتمل', color: 'success' },
		],
	},
};

export function getPipelineForService(serviceCategory: string): Pipeline {
	if (serviceCategory === 'translation') return PIPELINES.translation;
	if (serviceCategory === 'government') return PIPELINES.government;
	if (serviceCategory === 'business') return PIPELINES.business;
	return PIPELINES.government; // default
}

export function getNextStatus(currentStatus: ApplicationStatus, pipeline: Pipeline): ApplicationStatus | null {
	const currentIndex = pipeline.stages.findIndex(stage => stage.key === currentStatus);
	if (currentIndex === -1 || currentIndex === pipeline.stages.length - 1) {
		return null;
	}
	return pipeline.stages[currentIndex + 1].key;
}

export function getPreviousStatus(currentStatus: ApplicationStatus, pipeline: Pipeline): ApplicationStatus | null {
	const currentIndex = pipeline.stages.findIndex(stage => stage.key === currentStatus);
	if (currentIndex <= 0) {
		return null;
	}
	return pipeline.stages[currentIndex - 1].key;
}


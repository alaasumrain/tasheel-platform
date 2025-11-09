'use client';

import { Box, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { Pipeline, PipelineStage } from '@/lib/utils/pipelines';
import { ApplicationStatus } from '@/lib/admin-queries';
import { useLocale, useTranslations } from 'next-intl';

interface PipelineVisualizationProps {
	pipeline: Pipeline;
	currentStatus: ApplicationStatus;
}

export function PipelineVisualization({ pipeline, currentStatus }: PipelineVisualizationProps) {
	const locale = useLocale() as 'en' | 'ar';
	const t = useTranslations('Admin.orders');
	const currentIndex = pipeline.stages.findIndex(stage => stage.key === currentStatus);

	return (
		<Box sx={{ width: '100%', py: 2 }}>
			<Stepper activeStep={currentIndex >= 0 ? currentIndex : 0} alternativeLabel>
				{pipeline.stages.map((stage: PipelineStage, index: number) => (
					<Step key={stage.key}>
						<StepLabel
							optional={
								index === currentIndex ? (
									<Chip
										label={t('current') || (locale === 'ar' ? 'الحالي' : 'Current')}
										size="small"
										color={stage.color}
									/>
								) : null
							}
						>
							{locale === 'ar' ? stage.label_ar : stage.label_en}
						</StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	);
}


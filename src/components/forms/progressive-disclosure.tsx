'use client';

import { useState, useCallback, useMemo } from 'react';
import {
	Box,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Stack,
	Button,
	IconButton,
	Tooltip,
} from '@mui/material';
import {
	IconChevronDown,
	IconChevronUp,
	IconInfoCircle,
	IconCheck,
	IconX,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';

// Progressive Disclosure Component
interface ProgressiveDisclosureProps {
	sections: Array<{
		id: string;
		title: string;
		description?: string;
		content: React.ReactNode;
		required?: boolean;
		completed?: boolean;
	}>;
	onSectionComplete?: (sectionId: string) => void;
	allowSkip?: boolean;
}

export function ProgressiveDisclosure({
	sections,
	onSectionComplete,
	allowSkip = true,
}: ProgressiveDisclosureProps) {
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([sections[0]?.id]));

	const toggleSection = useCallback((sectionId: string) => {
		setExpandedSections((prev) => {
			const next = new Set(prev);
			if (next.has(sectionId)) {
				next.delete(sectionId);
			} else {
				next.add(sectionId);
			}
			return next;
		});
	}, []);

	const expandAll = useCallback(() => {
		setExpandedSections(new Set(sections.map((s) => s.id)));
	}, [sections]);

	const collapseAll = useCallback(() => {
		setExpandedSections(new Set());
	}, []);

	const completedCount = useMemo(
		() => sections.filter((s) => s.completed).length,
		[sections]
	);

	return (
		<Box>
			{/* Progress Header */}
			<Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Stack spacing={0.5}>
						<Typography variant="subtitle1" fontWeight={600}>
							Progress: {completedCount} / {sections.length} sections
						</Typography>
						<Box sx={{ width: 200, height: 8, borderRadius: 1, backgroundColor: 'divider', overflow: 'hidden' }}>
							<Box
								sx={{
									width: `${(completedCount / sections.length) * 100}%`,
									height: '100%',
									backgroundColor: 'primary.main',
									transition: 'width 0.3s ease',
								}}
							/>
						</Box>
					</Stack>
					<Stack direction="row" spacing={1}>
						<Button size="small" onClick={expandAll}>
							Expand All
						</Button>
						<Button size="small" onClick={collapseAll}>
							Collapse All
						</Button>
					</Stack>
				</Stack>
			</Box>

			{/* Sections */}
			<Stack spacing={2}>
				{sections.map((section, index) => {
					const isExpanded = expandedSections.has(section.id);
					const isPreviousCompleted = index === 0 || sections[index - 1]?.completed;

					return (
						<Accordion
							key={section.id}
							expanded={isExpanded}
							onChange={() => toggleSection(section.id)}
							disabled={!isPreviousCompleted && !allowSkip}
							sx={{
								'&:before': { display: 'none' },
								border: '1px solid',
								borderColor: section.completed ? 'success.main' : 'divider',
								borderRadius: 2,
								boxShadow: section.completed ? '0 0 0 2px rgba(76, 175, 80, 0.1)' : 'none',
							}}
						>
							<AccordionSummary
								expandIcon={
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										{section.completed && (
											<IconCheck size={20} color="success" />
										)}
										{isExpanded ? <IconChevronUp /> : <IconChevronDown />}
									</Box>
								}
							>
								<Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
									<Box
										sx={{
											width: 32,
											height: 32,
											borderRadius: '50%',
											backgroundColor: section.completed ? 'success.main' : 'primary.main',
											color: 'white',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontWeight: 600,
											flexShrink: 0,
										}}
									>
										{section.completed ? <IconCheck size={18} /> : index + 1}
									</Box>
									<Stack spacing={0.5} sx={{ flex: 1 }}>
										<Typography variant="subtitle1" fontWeight={600}>
											{section.title}
											{section.required && (
												<Typography component="span" color="error" sx={{ ml: 0.5 }}>
													*
												</Typography>
											)}
										</Typography>
										{section.description && (
											<Typography variant="caption" color="text.secondary">
												{section.description}
											</Typography>
										)}
									</Stack>
								</Stack>
							</AccordionSummary>
							<AccordionDetails>
								<AnimatePresence>
									{isExpanded && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.2 }}
										>
											<Box sx={{ pt: 2 }}>{section.content}</Box>
										</motion.div>
									)}
								</AnimatePresence>
							</AccordionDetails>
						</Accordion>
					);
				})}
			</Stack>
		</Box>
	);
}

// Smart Form Wizard Component
interface SmartFormWizardProps {
	steps: Array<{
		id: string;
		title: string;
		description?: string;
		content: React.ReactNode;
		required?: boolean;
		isValid?: boolean;
	}>;
	onComplete?: () => void;
	showProgress?: boolean;
}

export function SmartFormWizard({ steps, onComplete, showProgress = true }: SmartFormWizardProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

	const handleNext = useCallback(() => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
			setCompletedSteps((prev) => new Set([...prev, currentStep]));
		} else {
			onComplete?.();
		}
	}, [currentStep, steps.length, onComplete]);

	const handlePrevious = useCallback(() => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	}, [currentStep]);

	const handleStepClick = useCallback((stepIndex: number) => {
		// Only allow clicking on completed steps or the next step
		if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
			setCurrentStep(stepIndex);
		}
	}, [currentStep, completedSteps]);

	const progress = ((currentStep + 1) / steps.length) * 100;
	const canProceed = steps[currentStep]?.isValid !== false;

	return (
		<Box>
			{showProgress && (
				<Box sx={{ mb: 4 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
						<Typography variant="subtitle2" color="text.secondary">
							Step {currentStep + 1} of {steps.length}
						</Typography>
						<Typography variant="subtitle2" fontWeight={600}>
							{Math.round(progress)}% Complete
						</Typography>
					</Stack>
					<Box sx={{ width: '100%', height: 8, borderRadius: 1, backgroundColor: 'divider', overflow: 'hidden' }}>
						<Box
							sx={{
								width: `${progress}%`,
								height: '100%',
								backgroundColor: 'primary.main',
								transition: 'width 0.3s ease',
							}}
						/>
					</Box>
					{/* Step Indicators */}
					<Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
						{steps.map((step, index) => (
							<Tooltip key={step.id} title={step.title}>
								<Box
									onClick={() => handleStepClick(index)}
									sx={{
										width: 32,
										height: 32,
										borderRadius: '50%',
										backgroundColor:
											index === currentStep
												? 'primary.main'
												: completedSteps.has(index)
													? 'success.main'
													: 'divider',
										color: index === currentStep || completedSteps.has(index) ? 'white' : 'text.secondary',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: index <= currentStep || completedSteps.has(index - 1) ? 'pointer' : 'default',
										transition: 'all 0.2s',
										'&:hover': {
											transform: index <= currentStep || completedSteps.has(index - 1) ? 'scale(1.1)' : 'none',
										},
									}}
								>
									{completedSteps.has(index) ? <IconCheck size={18} /> : index + 1}
								</Box>
							</Tooltip>
						))}
					</Stack>
				</Box>
			)}

			{/* Current Step Content */}
			<motion.div
				key={currentStep}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				transition={{ duration: 0.3 }}
			>
				<Box sx={{ mb: 4 }}>
					<Stack spacing={1} sx={{ mb: 3 }}>
						<Typography variant="h5" fontWeight={600}>
							{steps[currentStep]?.title}
						</Typography>
						{steps[currentStep]?.description && (
							<Typography variant="body2" color="text.secondary">
								{steps[currentStep]?.description}
							</Typography>
						)}
					</Stack>
					{steps[currentStep]?.content}
				</Box>
			</motion.div>

			{/* Navigation */}
			<Stack direction="row" spacing={2} justifyContent="space-between">
				<Button
					variant="outlined"
					onClick={handlePrevious}
					disabled={currentStep === 0}
				>
					Previous
				</Button>
				<Button
					variant="contained"
					onClick={handleNext}
					disabled={!canProceed}
				>
					{currentStep === steps.length - 1 ? 'Complete' : 'Next'}
				</Button>
			</Stack>
		</Box>
	);
}


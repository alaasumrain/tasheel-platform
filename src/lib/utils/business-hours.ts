/**
 * Palestinian Business Hours Calculator
 * Excludes weekends (Friday/Saturday) and Palestinian holidays
 */

export const PALESTINIAN_HOLIDAYS_2025 = [
	'2025-01-01', // New Year
	'2025-03-29', // Eid al-Fitr (estimated)
	'2025-03-30', // Eid al-Fitr Day 2
	'2025-03-31', // Eid al-Fitr Day 3
	'2025-06-06', // Eid al-Adha (estimated)
	'2025-06-07', // Eid al-Adha Day 2
	'2025-06-08', // Eid al-Adha Day 3
	'2025-06-09', // Eid al-Adha Day 4
	'2025-06-27', // Islamic New Year (estimated)
	'2025-09-05', // Prophet's Birthday (estimated)
	'2025-11-15', // Independence Day
	'2025-12-25', // Christmas
];

export const BUSINESS_HOURS = {
	START: 8, // 8 AM
	END: 16,  // 4 PM
	DAILY_HOURS: 8,
};

export function isBusinessDay(date: Date): boolean {
	const day = date.getDay();
	const dateStr = date.toISOString().split('T')[0];

	// Friday (5) and Saturday (6) are weekends in Palestine
	if (day === 5 || day === 6) return false;

	// Check if it's a holiday
	if (PALESTINIAN_HOLIDAYS_2025.includes(dateStr)) return false;

	return true;
}

export function calculateBusinessHours(
	startDate: Date,
	endDate: Date
): number {
	let totalHours = 0;
	let current = new Date(startDate);

	while (current < endDate) {
		if (isBusinessDay(current)) {
			const currentHour = current.getHours();
			const endHour = current.toDateString() === endDate.toDateString()
				? endDate.getHours()
				: BUSINESS_HOURS.END;

			// Calculate hours within business hours
			const startHour = Math.max(currentHour, BUSINESS_HOURS.START);
			const endWorkHour = Math.min(endHour, BUSINESS_HOURS.END);

			if (startHour < endWorkHour) {
				totalHours += endWorkHour - startHour;
			}
		}

		// Move to next day
		current.setDate(current.getDate() + 1);
		current.setHours(BUSINESS_HOURS.START, 0, 0, 0);
	}

	return totalHours;
}

export function addBusinessHours(
	startDate: Date,
	hoursToAdd: number
): Date {
	let current = new Date(startDate);
	let remainingHours = hoursToAdd;

	while (remainingHours > 0) {
		if (isBusinessDay(current)) {
			const currentHour = current.getHours();

			// If we're before business hours, jump to start
			if (currentHour < BUSINESS_HOURS.START) {
				current.setHours(BUSINESS_HOURS.START, 0, 0, 0);
			}

			// If we're after business hours, jump to next business day
			if (currentHour >= BUSINESS_HOURS.END) {
				current.setDate(current.getDate() + 1);
				current.setHours(BUSINESS_HOURS.START, 0, 0, 0);
				continue;
			}

			// Calculate hours available today
			const hoursLeftToday = BUSINESS_HOURS.END - current.getHours();

			if (remainingHours <= hoursLeftToday) {
				current.setHours(current.getHours() + remainingHours);
				remainingHours = 0;
			} else {
				remainingHours -= hoursLeftToday;
				current.setDate(current.getDate() + 1);
				current.setHours(BUSINESS_HOURS.START, 0, 0, 0);
			}
		} else {
			// Skip to next day
			current.setDate(current.getDate() + 1);
			current.setHours(BUSINESS_HOURS.START, 0, 0, 0);
		}
	}

	return current;
}

export interface SLAResult {
	hoursElapsed: number;
	targetHours: number;
	percentElapsed: number;
	status: 'on_track' | 'at_risk' | 'breached';
	hoursRemaining: number;
	deadline: Date;
}

export function calculateSLA(
	submittedAt: Date,
	targetHours: number,
	warningThresholdPercent: number = 70
): SLAResult {
	const now = new Date();
	const hoursElapsed = calculateBusinessHours(submittedAt, now);
	const percentElapsed = (hoursElapsed / targetHours) * 100;
	const deadline = addBusinessHours(submittedAt, targetHours);
	const hoursRemaining = Math.max(0, targetHours - hoursElapsed);

	let status: 'on_track' | 'at_risk' | 'breached';
	if (percentElapsed >= 100) {
		status = 'breached';
	} else if (percentElapsed >= warningThresholdPercent) {
		status = 'at_risk';
	} else {
		status = 'on_track';
	}

	return {
		hoursElapsed,
		targetHours,
		percentElapsed,
		status,
		hoursRemaining,
		deadline,
	};
}


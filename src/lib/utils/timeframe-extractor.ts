/**
 * Timeframe extraction utility
 * Parses URL search params for time period filters
 */

/**
 * Creates a timeframe extractor function
 * @param selectedTimeFrame - URL param value like "payments_overview:monthly,orders:yearly"
 * @returns Function that extracts timeframe for a given section key
 */
export function createTimeFrameExtractor(selectedTimeFrame: string | undefined) {
	return (sectionKey: string): string | undefined => {
		if (!selectedTimeFrame) return undefined;

		const timeframes = selectedTimeFrame.split(',');
		const match = timeframes.find((value) => value.includes(sectionKey));

		if (!match) return undefined;

		// Extract value after colon
		const parts = match.split(':');
		return parts.length > 1 ? parts[1] : undefined;
	};
}

/**
 * Extract timeframe from URL search params
 * @param searchParams - URLSearchParams object
 * @param sectionKey - Section identifier (e.g., "orders", "payments")
 * @returns Timeframe string or undefined
 */
export function extractTimeFrame(
	searchParams: URLSearchParams,
	sectionKey: string
): string | undefined {
	const selectedTimeFrame = searchParams.get('selected_time_frame');
	if (!selectedTimeFrame) return undefined;

	return createTimeFrameExtractor(selectedTimeFrame)(sectionKey);
}


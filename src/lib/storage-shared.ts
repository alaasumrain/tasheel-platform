/**
 * Shared storage utilities that can be used in both client and server contexts
 * These are pure functions with no client/server dependencies
 */

export const STORAGE_BUCKETS = {
	CUSTOMER_UPLOADS: 'customer-uploads', // Customer-submitted files
	COMPLETED_WORK: 'completed-work', // Team-uploaded deliverables
	INVOICES: 'invoices', // Generated PDF invoices
	TEAM_AVATARS: 'team-avatars', // Staff profile photos
	SERVICE_IMAGES: 'service-images', // Service catalog images
} as const;

/**
 * Generate file path for storage
 * Pure function - no client/server dependencies
 */
export function getUploadPath(
	bucket: keyof typeof STORAGE_BUCKETS,
	applicationId: string,
	fileName: string
): string {
	const timestamp = Date.now();
	const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
	const now = new Date();

	switch (bucket) {
		case 'CUSTOMER_UPLOADS':
			// customer-uploads/2025/01/app-uuid/timestamp-filename.pdf
			return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${applicationId}/${timestamp}-${sanitized}`;

		case 'COMPLETED_WORK':
			// completed-work/2025/01/app-uuid/final-timestamp-filename.pdf
			return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${applicationId}/final-${timestamp}-${sanitized}`;

		case 'INVOICES':
			// invoices/2025/01/INV-20250122-001.pdf
			return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/INV-${timestamp}-${sanitized}`;

		default:
			return `${applicationId}/${timestamp}-${sanitized}`;
	}
}


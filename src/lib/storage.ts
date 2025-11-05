/**
 * Supabase Storage Utilities
 * Handles file uploads and downloads for customer documents and completed work
 */

import { createClient } from './supabase/client';

export const STORAGE_BUCKETS = {
	CUSTOMER_UPLOADS: 'customer-uploads', // Customer-submitted files
	COMPLETED_WORK: 'completed-work', // Team-uploaded deliverables
	INVOICES: 'invoices', // Generated PDF invoices
	TEAM_AVATARS: 'team-avatars', // Staff profile photos
	SERVICE_IMAGES: 'service-images', // Service catalog images
} as const;

/**
 * Generate file path for storage
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

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
	bucket: keyof typeof STORAGE_BUCKETS,
	applicationId: string,
	file: File
): Promise<{ path: string; url: string; error?: string }> {
	const supabase = createClient();
	const path = getUploadPath(bucket, applicationId, file.name);

	const { data, error } = await supabase.storage
		.from(STORAGE_BUCKETS[bucket])
		.upload(path, file, {
			cacheControl: '3600',
			upsert: false,
		});

	if (error) {
		return { path: '', url: '', error: error.message };
	}

	// Generate signed URL (valid for 1 year)
	const { data: urlData } = await supabase.storage
		.from(STORAGE_BUCKETS[bucket])
		.createSignedUrl(path, 31536000);

	return {
		path: data.path,
		url: urlData?.signedUrl || '',
	};
}

/**
 * Get download URL for a file (signed URL with expiry)
 */
export async function getDownloadUrl(
	bucket: keyof typeof STORAGE_BUCKETS,
	filePath: string,
	expiresIn: number = 3600 // 1 hour
): Promise<string | null> {
	const supabase = createClient();

	const { data } = await supabase.storage
		.from(STORAGE_BUCKETS[bucket])
		.createSignedUrl(filePath, expiresIn);

	return data?.signedUrl || null;
}

/**
 * Delete file from storage
 */
export async function deleteFile(
	bucket: keyof typeof STORAGE_BUCKETS,
	filePath: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = createClient();

	const { error } = await supabase.storage
		.from(STORAGE_BUCKETS[bucket])
		.remove([filePath]);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}


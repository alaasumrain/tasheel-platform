'use client';

/**
 * Client-side Supabase Storage Utilities
 * Handles file uploads and downloads for customer documents and completed work
 * Use this in Client Components only. For Server Actions, use @/lib/storage-server
 */

import { createClient } from './supabase/client';
import { STORAGE_BUCKETS, getUploadPath } from './storage-shared';

// Re-export shared constants and utilities
export { STORAGE_BUCKETS, getUploadPath };

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


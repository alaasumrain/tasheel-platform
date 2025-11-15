/**
 * Server-side Supabase Storage Utilities
 * Handles file uploads and downloads for customer documents and completed work
 * Use this in Server Actions and Server Components
 */

import { createClient } from './supabase/server';
import { STORAGE_BUCKETS, getUploadPath } from './storage-shared';

// Re-export STORAGE_BUCKETS for convenience
export { STORAGE_BUCKETS };

/**
 * Upload file to Supabase Storage (Server-side)
 * Handles File objects from FormData in server actions
 */
export async function uploadFile(
	bucket: keyof typeof STORAGE_BUCKETS,
	applicationId: string,
	file: File
): Promise<{ path: string; url: string; error?: string }> {
	try {
		const supabase = await createClient();
		const path = getUploadPath(bucket, applicationId, file.name);

		// Convert File to ArrayBuffer for server-side compatibility
		// File objects from FormData in server actions may not have readable streams
		const arrayBuffer = await file.arrayBuffer();
		const blob = new Blob([arrayBuffer], { type: file.type });

		console.log('[Storage Server] Uploading file:', {
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
			path,
			bucket: STORAGE_BUCKETS[bucket],
		});

		const { data, error } = await supabase.storage
			.from(STORAGE_BUCKETS[bucket])
			.upload(path, blob, {
				cacheControl: '3600',
				upsert: false,
				contentType: file.type,
			});

		if (error) {
			console.error('[Storage Server] Upload error:', error);
			return { path: '', url: '', error: error.message };
		}

		if (!data) {
			console.error('[Storage Server] Upload returned no data');
			return { path: '', url: '', error: 'Upload failed: no data returned' };
		}

		// Generate signed URL (valid for 1 year)
		const { data: urlData, error: urlError } = await supabase.storage
			.from(STORAGE_BUCKETS[bucket])
			.createSignedUrl(path, 31536000);

		if (urlError) {
			console.error('[Storage Server] Error creating signed URL:', urlError);
			// Still return success with path, even if URL generation failed
			return {
				path: data.path,
				url: '',
			};
		}

		return {
			path: data.path,
			url: urlData?.signedUrl || '',
		};
	} catch (error) {
		console.error('[Storage Server] Exception during upload:', error);
		return {
			path: '',
			url: '',
			error: error instanceof Error ? error.message : 'Unknown upload error',
		};
	}
}

/**
 * Get download URL for a file (signed URL with expiry) - Server-side
 */
export async function getDownloadUrl(
	bucket: keyof typeof STORAGE_BUCKETS,
	filePath: string,
	expiresIn: number = 3600 // 1 hour
): Promise<string | null> {
	const supabase = await createClient();

	const { data } = await supabase.storage
		.from(STORAGE_BUCKETS[bucket])
		.createSignedUrl(filePath, expiresIn);

	return data?.signedUrl || null;
}

/**
 * Delete file from storage - Server-side
 */
export async function deleteFile(
	bucket: keyof typeof STORAGE_BUCKETS,
	filePath: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();

	const { error } = await supabase.storage
		.from(STORAGE_BUCKETS[bucket])
		.remove([filePath]);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}


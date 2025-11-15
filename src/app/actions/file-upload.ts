'use server';

import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import {
	getCurrentUser,
	getCustomerProfile,
	createCustomerFromUser,
} from '@/lib/supabase/auth-helpers';
import { logger } from '@/lib/utils/logger';

/**
 * Create a draft application for file uploads
 * This allows files to be uploaded immediately when selected
 */
export async function createDraftApplication(serviceSlug: string, locale: string = 'en'): Promise<{
	type: 'success' | 'error';
	applicationId?: string;
	message?: string;
}> {
	try {
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		const user = await getCurrentUser();

		if (!user) {
			return {
				type: 'error',
				message: t('authRequired'),
			};
		}

		let customer = await getCustomerProfile(user);

		if (!customer) {
			customer = await createCustomerFromUser(user, {
				languagePreference: locale === 'en' ? 'en' : 'ar',
			});
		}

		if (!customer) {
			logger.error('Unable to create customer profile for draft application', null, {
				userId: user.id,
				serviceSlug,
			});
			return {
				type: 'error',
				message: t('unexpectedError'),
			};
		}
		
		// Use server client with user's auth context for RLS
		// IMPORTANT: customer.id should equal user.id (which equals auth.uid())
		// This is required for the RLS policy: customer_id = auth.uid()
		const supabase = await createClient();
		
		// Verify the user is authenticated in the Supabase client
		const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
		if (authError || !authUser) {
			logger.error('Supabase client not authenticated', authError, {
				userId: user.id,
				serviceSlug,
			});
			return {
				type: 'error',
				message: t('authRequired'),
			};
		}
		
		// Verify customer.id matches user.id (they should be the same)
		if (customer.id !== user.id || customer.id !== authUser.id) {
			logger.error('Customer ID mismatch', null, {
				userId: user.id,
				authUserId: authUser.id,
				customerId: customer.id,
				serviceSlug,
			});
			return {
				type: 'error',
				message: t('unexpectedError'),
			};
		}
		
		// Use SECURITY DEFINER function to bypass RLS policy evaluation issues
		// This function can insert without triggering users table permission checks
		const { data: applicationId, error: functionError } = await supabase.rpc(
			'create_draft_application',
			{
				p_service_slug: serviceSlug,
				p_customer_id: user.id,
				p_customer_name: customer.name,
				p_customer_phone: customer.phone,
				p_applicant_email: customer.email || user.email,
				p_applicant_id: user.id,
			}
		);

		if (functionError || !applicationId) {
			// Fallback to direct insert if function doesn't exist or fails
			logger.error('Error creating draft application via function', functionError, {
				userId: user.id,
				serviceSlug,
				customerId: customer.id,
				errorCode: functionError?.code,
				errorMessage: functionError?.message,
			});
			
			// Try direct insert as fallback
			const { data: application, error: insertError } = await supabase
				.from('applications')
				.insert({
					service_slug: serviceSlug,
					status: 'draft',
					form_slug: serviceSlug,
					payload: {},
					customer_id: user.id,
					customer_name: customer.name,
					customer_phone: customer.phone,
					applicant_email: customer.email || user.email,
					applicant_id: user.id,
				})
				.select('id')
				.single();

			if (insertError || !application) {
				logger.error('Error creating draft application (fallback)', insertError, {
					userId: user.id,
					serviceSlug,
					customerId: customer.id,
					errorCode: insertError?.code,
					errorMessage: insertError?.message,
				});
				console.error('Error creating draft application:', insertError);
				return {
					type: 'error',
					message: t('initFormFailed'),
				};
			}

			return {
				type: 'success',
				applicationId: application.id,
			};
		}

		return {
			type: 'success',
			applicationId: applicationId as string,
		};
	} catch (error) {
		console.error('Error creating draft application:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return {
			type: 'error',
			message: t('unexpectedError'),
		};
	}
}

/**
 * Upload a file immediately when selected
 */
export async function uploadFileImmediately(
	applicationId: string,
	fieldName: string,
	file: File,
	locale: string = 'en'
): Promise<{
	type: 'success' | 'error';
	attachmentId?: string;
	storagePath?: string;
	message?: string;
}> {
	try {
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		
		// Import storage utilities
		const { uploadFile: uploadToStorage } = await import('@/lib/storage');

		// Upload to Supabase Storage
		const { path, url, error: uploadError } = await uploadToStorage(
			'CUSTOMER_UPLOADS',
			applicationId,
			file
		);

		if (uploadError || !path) {
			return {
				type: 'error',
				message: uploadError || t('fileUploadFailed'),
			};
		}

		// Use server client with user's auth context for RLS
		const supabase = await createClient();
		const user = await getCurrentUser();
		
		// Create attachment record
		const { data: attachment, error: dbError } = await supabase
			.from('application_attachments')
			.insert({
				application_id: applicationId,
				storage_path: path,
				file_name: file.name,
				content_type: file.type,
				file_size: file.size,
				uploaded_by: user?.id || null,
			})
			.select('id, storage_path')
			.single();

		if (dbError || !attachment) {
			console.error('Error creating attachment record:', dbError);
			// Try to clean up uploaded file
			const { deleteFile } = await import('@/lib/storage');
			await deleteFile('CUSTOMER_UPLOADS', path);
			
			return {
				type: 'error',
				message: t('saveFileFailed'),
			};
		}

		return {
			type: 'success',
			attachmentId: attachment.id,
			storagePath: attachment.storage_path,
		};
	} catch (error) {
		console.error('Error uploading file:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return {
			type: 'error',
			message: t('uploadError'),
		};
	}
}

/**
 * Delete an uploaded file (if user removes it before submission)
 */
export async function deleteUploadedFile(
	attachmentId: string,
	storagePath: string,
	locale: string = 'en'
): Promise<{
	type: 'success' | 'error';
	message?: string;
}> {
	try {
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		
		// Use server client with user's auth context for RLS
		const supabase = await createClient();
		
		// Delete from database
		const { error: dbError } = await supabase
			.from('application_attachments')
			.delete()
			.eq('id', attachmentId);

		if (dbError) {
			console.error('Error deleting attachment record:', dbError);
			return {
				type: 'error',
				message: t('removeFileFailed'),
			};
		}

		// Delete from storage
		const { deleteFile } = await import('@/lib/storage');
		const { success, error: storageError } = await deleteFile('CUSTOMER_UPLOADS', storagePath);

		if (!success || storageError) {
			console.error('Error deleting file from storage:', storageError);
			// Don't fail - record is deleted, file cleanup can happen later
		}

		return {
			type: 'success',
		};
	} catch (error) {
		console.error('Error deleting file:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return {
			type: 'error',
			message: t('deleteError'),
		};
	}
}

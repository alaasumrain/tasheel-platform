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
 * Save draft application data to database
 * Allows users to return and continue later
 */
export async function saveDraftApplication(
	applicationId: string,
	formData: Record<string, string>,
	activeStep: number,
	locale: string = 'en'
): Promise<{
	type: 'success' | 'error';
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

		const supabase = await createClient();
		
		// Get current application to merge payload
		const { data: currentApp, error: fetchError } = await supabase
			.from('applications')
			.select('payload')
			.eq('id', applicationId)
			.eq('customer_id', user.id)
			.single();

		if (fetchError || !currentApp) {
			logger.error('Error fetching current application for draft save', fetchError, {
				applicationId,
				userId: user.id,
			});
			return {
				type: 'error',
				message: t('unexpectedError'),
			};
		}

		// Merge draft data with existing payload
		const currentPayload = currentApp.payload || {};
		const updatedPayload = {
			...currentPayload,
			draft_data: formData,
			draft_step: activeStep,
			last_saved: new Date().toISOString(),
		};
		
		// Update application payload with current form data
		const { error: updateError } = await supabase
			.from('applications')
			.update({
				payload: updatedPayload,
				updated_at: new Date().toISOString(),
			})
			.eq('id', applicationId)
			.eq('customer_id', user.id); // Ensure user owns the application

		if (updateError) {
			logger.error('Error saving draft application', updateError, {
				applicationId,
				userId: user.id,
			});
			return {
				type: 'error',
				message: t('unexpectedError'),
			};
		}

		return {
			type: 'success',
		};
	} catch (error) {
		console.error('Error saving draft application:', error);
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return {
			type: 'error',
			message: t('unexpectedError'),
		};
	}
}

/**
 * Upload a file immediately when selected
 * Accepts FormData to work with Server Actions
 */
export async function uploadFileImmediately(
	formData: FormData
): Promise<{
	type: 'success' | 'error';
	attachmentId?: string;
	storagePath?: string;
	message?: string;
}> {
	try {
		const applicationId = formData.get('applicationId') as string;
		const fieldName = formData.get('fieldName') as string;
		const locale = (formData.get('locale') as string) || 'en';
		const file = formData.get('file') as File;

		if (!file || !(file instanceof File)) {
			const t = await getTranslations({ locale, namespace: 'Quote.errors' });
			return {
				type: 'error',
				message: t('fileUploadFailed'),
			};
		}

		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		
		// Import server-side storage utilities
		const { uploadFile: uploadToStorage } = await import('@/lib/storage-server');

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
		console.log('[FileUpload Server] Creating Supabase client...');
		const supabase = await createClient();
		
		// Verify auth context in Supabase client (this is what RLS uses)
		// IMPORTANT: Call getUser() to ensure session is established
		const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
		// Get session separately if needed
		const { data: { session } } = await supabase.auth.getSession();
		
		console.log('[FileUpload Server] Auth context:', {
			hasUser: !!authUser,
			userId: authUser?.id,
			hasSession: !!session,
			sessionExpiresAt: session?.expires_at,
			error: authError,
		});
		
		if (authError || !authUser) {
			console.error('[FileUpload Server] Supabase client not authenticated:', {
				error: authError,
				message: authError?.message,
			});
			// Clean up uploaded file
			const { deleteFile } = await import('@/lib/storage-server');
			await deleteFile('CUSTOMER_UPLOADS', path);
			return {
				type: 'error',
				message: t('authRequired'),
			};
		}
		
		// Refresh session if needed to ensure it's valid
		if (session && session.expires_at && session.expires_at * 1000 < Date.now() + 60000) {
			console.log('[FileUpload Server] Refreshing session...');
			const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
			if (refreshError) {
				console.error('[FileUpload Server] Error refreshing session:', refreshError);
			} else {
				console.log('[FileUpload Server] Session refreshed');
			}
		}
		
		const user = await getCurrentUser();
		
		if (!user || user.id !== authUser.id) {
			console.error('[FileUpload Server] User mismatch:', {
				getCurrentUserId: user?.id,
				authUserId: authUser.id,
			});
			// Clean up uploaded file
			const { deleteFile } = await import('@/lib/storage-server');
			await deleteFile('CUSTOMER_UPLOADS', path);
			return {
				type: 'error',
				message: t('authRequired'),
			};
		}
		
		// Verify the user owns the application (required for RLS policy)
		// The RLS policy will check this in a subquery, but we verify first for better error messages
		const { data: application, error: appError } = await supabase
			.from('applications')
			.select('id, customer_id, applicant_id')
			.eq('id', applicationId)
			.single();
		
		console.log('[FileUpload Server] Application query result:', {
			hasApplication: !!application,
			error: appError,
			applicationId,
			authUserId: authUser.id,
		});
		
		if (appError) {
			console.error('[FileUpload Server] Error querying application:', {
				error: appError,
				code: appError.code,
				message: appError.message,
				details: appError.details,
				hint: appError.hint,
				applicationId,
				authUserId: authUser.id,
			});
		}
		
		if (appError || !application) {
			// Clean up uploaded file
			const { deleteFile } = await import('@/lib/storage-server');
			await deleteFile('CUSTOMER_UPLOADS', path);
			return {
				type: 'error',
				message: appError?.message === 'new row violates row-level security policy' 
					? t('authRequired')
					: t('unexpectedError'),
			};
		}
		
		// Verify user owns the application
		const ownsApplication = 
			application.customer_id === authUser.id || 
			(application.customer_id === null && application.applicant_id === authUser.id);
		
		console.log('[FileUpload Server] Application ownership check:', {
			authUserId: authUser.id,
			applicationCustomerId: application.customer_id,
			applicationApplicantId: application.applicant_id,
			ownsApplication,
			customerIdMatches: application.customer_id === authUser.id,
			applicantIdMatches: application.applicant_id === authUser.id,
		});
		
		if (!ownsApplication) {
			console.error('[FileUpload Server] User does not own application:', {
				authUserId: authUser.id,
				userId: user.id,
				customerId: application.customer_id,
				applicantId: application.applicant_id,
			});
			// Clean up uploaded file
			const { deleteFile } = await import('@/lib/storage-server');
			await deleteFile('CUSTOMER_UPLOADS', path);
			return {
				type: 'error',
				message: t('unexpectedError'),
			};
		}
		
		console.log('[FileUpload Server] Supabase client created, user:', {
			hasUser: !!user,
			userId: user.id,
			authUserId: authUser.id,
			applicationId,
			applicationCustomerId: application.customer_id,
			applicationApplicantId: application.applicant_id,
			fieldName,
			fileName: file.name,
		});
		
		// Create attachment record
		// IMPORTANT: uploaded_by must match auth.uid() for RLS policy
		const attachmentData = {
			application_id: applicationId,
			storage_path: path,
			file_name: file.name,
			content_type: file.type,
			file_size: file.size,
			uploaded_by: authUser.id, // Must match auth.uid() for RLS - use authUser.id not user.id
		};
		console.log('[FileUpload Server] Inserting attachment:', {
			...attachmentData,
			authUid: authUser.id,
			userUid: user.id,
			matches: authUser.id === user.id,
		});
		
		// Test if we can query the application with the current auth context
		// This helps debug RLS issues
		const { data: testApp, error: testError } = await supabase
			.from('applications')
			.select('id, customer_id, applicant_id')
			.eq('id', applicationId)
			.eq('customer_id', authUser.id)
			.single();
		
		console.log('[FileUpload Server] RLS test query:', {
			canSeeApplication: !!testApp,
			testError: testError?.message,
			authUid: authUser.id,
			expectedCustomerId: application.customer_id,
		});
		
		const { data: attachment, error: dbError } = await supabase
			.from('application_attachments')
			.insert(attachmentData)
			.select('id, storage_path')
			.single();

		if (dbError) {
			console.error('[FileUpload Server] Error creating attachment record:', {
				error: dbError,
				code: dbError.code,
				message: dbError.message,
				details: dbError.details,
				hint: dbError.hint,
			});
			// Try to clean up uploaded file
			const { deleteFile } = await import('@/lib/storage-server');
			await deleteFile('CUSTOMER_UPLOADS', path);
			
			return {
				type: 'error',
				message: t('saveFileFailed') || `Database error: ${dbError.message}`,
			};
		}

		if (!attachment) {
			console.error('[FileUpload Server] Attachment creation returned no data');
			// Try to clean up uploaded file
			const { deleteFile } = await import('@/lib/storage-server');
			await deleteFile('CUSTOMER_UPLOADS', path);
			
			return {
				type: 'error',
				message: t('saveFileFailed') || 'Failed to save file record',
			};
		}

		console.log('[FileUpload Server] Attachment created successfully:', {
			attachmentId: attachment.id,
			storagePath: attachment.storage_path,
		});

		return {
			type: 'success',
			attachmentId: attachment.id,
			storagePath: attachment.storage_path,
		};
	} catch (error) {
		console.error('[FileUpload Server] Error uploading file:', error);
		console.error('[FileUpload Server] Error details:', {
			error,
			errorMessage: error instanceof Error ? error.message : String(error),
			errorStack: error instanceof Error ? error.stack : undefined,
			errorName: error instanceof Error ? error.name : undefined,
		});
		const locale = 'en'; // fallback
		const t = await getTranslations({ locale, namespace: 'Quote.errors' });
		return {
			type: 'error',
			message: error instanceof Error ? error.message : t('uploadError'),
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
		const { deleteFile } = await import('@/lib/storage-server');
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

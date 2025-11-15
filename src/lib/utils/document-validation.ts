/**
 * Document Type Validation Utilities
 * Validates uploaded files to ensure they match the expected document type
 * 
 * This provides quick validation based on file names and basic heuristics.
 * For production, consider adding AI-based validation (Google Vision API, AWS Rekognition).
 */

export type DocumentType = 'passport' | 'license' | 'photo' | 'unknown';

export interface DocumentValidationResult {
	valid: boolean;
	confidence: 'high' | 'medium' | 'low';
	detectedType: DocumentType;
	message: string;
	message_ar: string;
}

/**
 * Quick validation based on file name patterns
 * This is a fast, client-side validation that can catch common mistakes
 */
export function validateDocumentByFileName(
	fileName: string,
	expectedType: 'passport' | 'license' | 'photo'
): DocumentValidationResult {
	const lowerFileName = fileName.toLowerCase();
	
	// Detect document type from file name
	const passportKeywords = ['passport', 'جواز', 'جواز سفر', 'pass'];
	const licenseKeywords = ['license', 'licence', 'رخصة', 'driving', 'driver'];
	const photoKeywords = ['photo', 'picture', 'pic', 'image', 'صورة', 'صوره', 'شخصية'];
	
	let detectedType: DocumentType = 'unknown';
	let confidence: 'high' | 'medium' | 'low' = 'low';
	
	// Check for passport
	if (passportKeywords.some(keyword => lowerFileName.includes(keyword))) {
		detectedType = 'passport';
		confidence = 'high';
	}
	// Check for license
	else if (licenseKeywords.some(keyword => lowerFileName.includes(keyword))) {
		detectedType = 'license';
		confidence = 'high';
	}
	// Check for photo
	else if (photoKeywords.some(keyword => lowerFileName.includes(keyword))) {
		detectedType = 'photo';
		confidence = 'medium';
	}
	
	// Validate match
	const valid = detectedType === expectedType || detectedType === 'unknown';
	
	// Generate messages
	let message = '';
	let message_ar = '';
	
	if (!valid && detectedType !== 'unknown') {
		if (expectedType === 'passport' && detectedType === 'license') {
			message = 'This file appears to be a license, but you uploaded it in the passport field. Please upload your passport copy.';
			message_ar = 'هذا الملف يبدو أنه رخصة، لكنك رفعته في حقل جواز السفر. يرجى رفع نسخة جواز السفر.';
		} else if (expectedType === 'passport' && detectedType === 'photo') {
			message = 'This file appears to be a photo, but you uploaded it in the passport field. Please upload your passport copy.';
			message_ar = 'هذا الملف يبدو أنه صورة، لكنك رفعته في حقل جواز السفر. يرجى رفع نسخة جواز السفر.';
		} else if (expectedType === 'license' && detectedType === 'passport') {
			message = 'This file appears to be a passport, but you uploaded it in the license field. Please upload your license copy.';
			message_ar = 'هذا الملف يبدو أنه جواز سفر، لكنك رفعته في حقل الرخصة. يرجى رفع نسخة الرخصة.';
		} else if (expectedType === 'license' && detectedType === 'photo') {
			message = 'This file appears to be a photo, but you uploaded it in the license field. Please upload your license copy.';
			message_ar = 'هذا الملف يبدو أنه صورة، لكنك رفعته في حقل الرخصة. يرجى رفع نسخة الرخصة.';
		} else if (expectedType === 'photo' && detectedType === 'passport') {
			message = 'This file appears to be a passport, but you uploaded it in the photo field. Please upload your personal photo.';
			message_ar = 'هذا الملف يبدو أنه جواز سفر، لكنك رفعته في حقل الصورة الشخصية. يرجى رفع الصورة الشخصية.';
		} else if (expectedType === 'photo' && detectedType === 'license') {
			message = 'This file appears to be a license, but you uploaded it in the photo field. Please upload your personal photo.';
			message_ar = 'هذا الملف يبدو أنه رخصة، لكنك رفعته في حقل الصورة الشخصية. يرجى رفع الصورة الشخصية.';
		}
	}
	
	return {
		valid,
		confidence,
		detectedType,
		message,
		message_ar,
	};
}

/**
 * Validate file size for different document types
 */
export function validateDocumentSize(
	fileSize: number,
	documentType: 'passport' | 'license' | 'photo'
): { valid: boolean; message: string; message_ar: string } {
	const maxSizes: Record<typeof documentType, number> = {
		passport: 10 * 1024 * 1024, // 10MB
		license: 10 * 1024 * 1024, // 10MB
		photo: 5 * 1024 * 1024, // 5MB
	};
	
	const maxSize = maxSizes[documentType];
	const valid = fileSize <= maxSize;
	
	if (!valid) {
		const sizeMB = (fileSize / 1024 / 1024).toFixed(2);
		const maxMB = (maxSize / 1024 / 1024).toFixed(0);
		
		return {
			valid: false,
			message: `File size (${sizeMB}MB) exceeds maximum allowed size (${maxMB}MB) for ${documentType}.`,
			message_ar: `حجم الملف (${sizeMB} ميجابايت) يتجاوز الحد الأقصى المسموح (${maxMB} ميجابايت) لـ ${documentType === 'passport' ? 'جواز السفر' : documentType === 'license' ? 'الرخصة' : 'الصورة الشخصية'}.`,
		};
	}
	
	return { valid: true, message: '', message_ar: '' };
}

/**
 * Validate file type for different document types
 */
export function validateDocumentFileType(
	fileType: string,
	documentType: 'passport' | 'license' | 'photo'
): { valid: boolean; message: string; message_ar: string } {
	const allowedTypes: Record<typeof documentType, string[]> = {
		passport: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
		license: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
		photo: ['image/jpeg', 'image/jpg', 'image/png'], // Photos should be images only
	};
	
	const allowed = allowedTypes[documentType];
	const valid = allowed.includes(fileType.toLowerCase());
	
	if (!valid) {
		return {
			valid: false,
			message: `File type not allowed for ${documentType}. Allowed types: ${allowed.map(t => t.split('/')[1]).join(', ')}.`,
			message_ar: `نوع الملف غير مسموح لـ ${documentType === 'passport' ? 'جواز السفر' : documentType === 'license' ? 'الرخصة' : 'الصورة الشخصية'}. الأنواع المسموحة: ${documentType === 'photo' ? 'JPG, PNG' : 'PDF, JPG, PNG'}.`,
		};
	}
	
	return { valid: true, message: '', message_ar: '' };
}

/**
 * Comprehensive document validation
 * Combines file name, size, and type validation
 */
export function validateDocument(
	file: File,
	fieldName: string,
	expectedType: 'passport' | 'license' | 'photo'
): DocumentValidationResult {
	// Map field names to document types
	const fieldTypeMap: Record<string, 'passport' | 'license' | 'photo'> = {
		passport_upload: 'passport',
		license_upload: 'license',
		personal_photo_upload: 'photo',
	};
	
	const mappedType = fieldTypeMap[fieldName] || expectedType;
	
	// Validate file name
	const nameValidation = validateDocumentByFileName(file.name, mappedType);
	
	// Validate file size
	const sizeValidation = validateDocumentSize(file.size, mappedType);
	
	// Validate file type
	const typeValidation = validateDocumentFileType(file.type, mappedType);
	
	// Combine results
	const allValid = nameValidation.valid && sizeValidation.valid && typeValidation.valid;
	
	// Prioritize error messages
	let message = '';
	let message_ar = '';
	
	if (!typeValidation.valid) {
		message = typeValidation.message;
		message_ar = typeValidation.message_ar;
	} else if (!sizeValidation.valid) {
		message = sizeValidation.message;
		message_ar = sizeValidation.message_ar;
	} else if (!nameValidation.valid) {
		message = nameValidation.message;
		message_ar = nameValidation.message_ar;
	}
	
	return {
		valid: allValid,
		confidence: nameValidation.confidence,
		detectedType: nameValidation.detectedType,
		message,
		message_ar,
	};
}

/**
 * Check for duplicate document uploads
 * Prevents uploading the same file to multiple fields
 */
export function checkDuplicateUpload(
	file: File,
	uploadedFiles: Record<string, File>,
	currentFieldName: string
): { isDuplicate: boolean; duplicateField?: string; message: string; message_ar: string } {
	for (const [fieldName, uploadedFile] of Object.entries(uploadedFiles)) {
		if (fieldName !== currentFieldName && uploadedFile.name === file.name) {
			const fieldLabels: Record<string, { en: string; ar: string }> = {
				passport_upload: { en: 'passport', ar: 'جواز السفر' },
				license_upload: { en: 'license', ar: 'الرخصة' },
				personal_photo_upload: { en: 'personal photo', ar: 'الصورة الشخصية' },
			};
			
			const duplicateFieldLabel = fieldLabels[fieldName] || { en: fieldName, ar: fieldName };
			
			return {
				isDuplicate: true,
				duplicateField: fieldName,
				message: `This file was already uploaded in the ${duplicateFieldLabel.en} field. Please upload a different file.`,
				message_ar: `هذا الملف تم رفعه مسبقاً في حقل ${duplicateFieldLabel.ar}. يرجى رفع ملف مختلف.`,
			};
		}
	}
	
	return { isDuplicate: false, message: '', message_ar: '' };
}


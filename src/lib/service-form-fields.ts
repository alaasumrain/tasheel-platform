// Service-specific form fields configuration

export interface FormField {
	name: string;
	label: string;
	label_ar?: string; // Arabic label (optional, falls back to label)
	type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea' | 'file';
	placeholder?: string;
	placeholder_ar?: string; // Arabic placeholder (optional)
	required?: boolean;
	options?: string[];
	options_ar?: string[]; // Arabic options (optional, falls back to options)
	helperText?: string;
	helperText_ar?: string; // Arabic helper text (optional)
}

// Define service-specific fields for each service
export const serviceFormFields: Record<string, FormField[]> = {
	// GOVERNMENT SERVICES
	'drivers-license-renewal': [
		{
			name: 'start_date_request',
			label: 'Start Date Request',
			label_ar: 'تاريخ بدء الطلب',
			type: 'date',
			required: true,
			helperText: 'When would you like to start the license renewal process?',
			helperText_ar: 'متى تريد البدء في عملية تجديد الرخصة؟',
		},
		{
			name: 'current_license_number',
			label: 'Current License Number',
			label_ar: 'رقم الرخصة الحالي',
			type: 'text',
			placeholder: 'e.g., 123456789',
			placeholder_ar: 'مثال: 123456789',
			required: true,
			helperText: 'Enter your current Palestinian license number',
			helperText_ar: 'أدخل رقم رخصتك الفلسطينية الحالي',
		},
		{
			name: 'expiry_date',
			label: 'License Expiry Date',
			label_ar: 'تاريخ انتهاء الرخصة',
			type: 'date',
			required: true,
		},
		{
			name: 'vision_test_needed',
			label: 'Vision Test',
			label_ar: 'فحص النظر',
			type: 'select',
			required: true,
			options: [
				'Yes, please arrange for me',
				'No, I have a valid vision test certificate',
			],
			options_ar: [
				'نعم، يرجى الترتيب لي',
				'لا، لدي شهادة فحص نظر صالحة',
			],
		},
		{
			name: 'passport_upload',
			label: 'Upload Passport',
			label_ar: 'رفع جواز السفر',
			type: 'file',
			required: true,
			helperText: 'PDF, JPG, or PNG (Max 10MB). Clear photo of passport page',
			helperText_ar: 'PDF أو JPG أو PNG (الحد الأقصى 10 ميجابايت). صورة واضحة لصفحة جواز السفر',
		},
		{
			name: 'personal_photo_upload',
			label: 'Upload Personal Photo (White Background)',
			label_ar: 'رفع صورة شخصية (خلفية بيضاء)',
			type: 'file',
			required: true,
			helperText: 'PDF, JPG, or PNG (Max 10MB). Personal photo with white background. If you don\'t have a white background photo, we can do it for 15 NIS extra charge.',
			helperText_ar: 'PDF أو JPG أو PNG (الحد الأقصى 10 ميجابايت). صورة شخصية بخلفية بيضاء. إذا لم تكن لديك صورة بخلفية بيضاء، يمكننا القيام بذلك مقابل رسوم إضافية 15 شيكل.',
		},
		{
			name: 'license_upload',
			label: 'Upload Current License Copy (Optional)',
			label_ar: 'رفع نسخة من الرخصة الحالية (اختياري)',
			type: 'file',
			helperText: 'PDF, JPG, or PNG (Max 5MB)',
			helperText_ar: 'PDF أو JPG أو PNG (الحد الأقصى 5 ميجابايت)',
		},
		{
			name: 'approval_print_deliver',
			label: 'I approve Tasheel to print and deliver the document',
			label_ar: 'أوافق على قيام تسهيل بطباعة وتسليم المستند',
			type: 'select',
			required: true,
			options: ['Yes, I approve', 'No'],
			options_ar: ['نعم، أوافق', 'لا'],
			helperText: 'Your approval is required to complete the process',
			helperText_ar: 'موافقتك مطلوبة لإكمال العملية',
		},
		{
			name: 'approval_submission',
			label: 'I confirm and approve submission of this request',
			label_ar: 'أؤكد وأوافق على تقديم هذا الطلب',
			type: 'select',
			required: true,
			options: ['Yes, I confirm and approve', 'No'],
			options_ar: ['نعم، أؤكد وأوافق', 'لا'],
			helperText: 'Final approval required to proceed with the service',
			helperText_ar: 'الموافقة النهائية مطلوبة للمتابعة مع الخدمة',
		},
	],

	'marriage-certificate-attestation': [
		{
			name: 'country_of_issue',
			label: 'Country Where Certificate Was Issued',
			type: 'text',
			required: true,
			placeholder: 'e.g., Jordan, USA, UK',
		},
		{
			name: 'number_of_copies',
			label: 'Number of Certified Copies Needed',
			type: 'select',
			required: true,
			options: ['1 copy', '2 copies', '3 copies', '4+ copies'],
		},
		{
			name: 'apostille_required',
			label: 'Do you need Apostille certification?',
			type: 'select',
			required: true,
			options: ['Yes', 'No', 'Not sure - please advise'],
		},
		{
			name: 'certificate_upload',
			label: 'Upload Marriage Certificate (Optional)',
			type: 'file',
			helperText: 'PDF, JPG, or PNG (Max 5MB)',
		},
	],

	'birth-certificate-attestation': [
		{
			name: 'country_of_issue',
			label: 'Country Where Certificate Was Issued',
			type: 'text',
			required: true,
			placeholder: 'e.g., Jordan, USA, UK',
		},
		{
			name: 'child_age',
			label: "Child's Age",
			type: 'number',
			required: true,
			placeholder: 'e.g., 5',
		},
		{
			name: 'purpose',
			label: 'Purpose of Attestation',
			type: 'select',
			required: true,
			options: [
				'School enrollment',
				'Residency application',
				'Passport application',
				'Other',
			],
		},
		{
			name: 'number_of_copies',
			label: 'Number of Certified Copies Needed',
			type: 'select',
			required: true,
			options: ['1 copy', '2 copies', '3 copies', '4+ copies'],
		},
	],

	'degree-certificate-attestation': [
		{
			name: 'degree_level',
			label: 'Degree Level',
			type: 'select',
			required: true,
			options: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Other'],
		},
		{
			name: 'university_name',
			label: 'University/Institution Name',
			type: 'text',
			required: true,
		},
		{
			name: 'country_of_issue',
			label: 'Country of Issue',
			type: 'text',
			required: true,
		},
		{
			name: 'purpose',
			label: 'Purpose of Attestation',
			type: 'select',
			required: true,
			options: [
				'Employment in Palestine',
				'MOE equivalency',
				'Professional licensing',
				'Further education',
				'Other',
			],
		},
		{
			name: 'transcripts_needed',
			label: 'Do you also need transcripts attested?',
			type: 'select',
			required: true,
			options: ['Yes', 'No'],
		},
	],

	'police-clearance-certificate': [
		{
			name: 'certificate_country',
			label: 'Which country PCC do you need?',
			type: 'select',
			required: true,
			options: ['Palestine', 'Jordan', 'Other (please specify in notes)'],
		},
		{
			name: 'purpose',
			label: 'Purpose of PCC',
			type: 'select',
			required: true,
			options: [
				'Employment',
				'Immigration/Visa',
				'Residency',
				'Business license',
				'Other',
			],
		},
		{
			name: 'passport_upload',
			label: 'Upload Passport Copy',
			type: 'file',
			required: true,
			helperText: 'Required for PCC application',
		},
	],

	// TRANSLATION SERVICES
	'legal-translation': [
		{
			name: 'source_language',
			label: 'From Language',
			type: 'select',
			required: true,
			options: ['Arabic', 'English', 'Hebrew', 'French', 'Spanish', 'Other'],
		},
		{
			name: 'target_language',
			label: 'To Language',
			type: 'select',
			required: true,
			options: ['Arabic', 'English', 'Hebrew', 'French', 'Spanish', 'Other'],
		},
		{
			name: 'document_type',
			label: 'Document Type',
			type: 'select',
			required: true,
			options: [
				'Contract',
				'Court document',
				'Legal agreement',
				'Power of attorney',
				'Other legal document',
			],
		},
		{
			name: 'page_count',
			label: 'Approximate Number of Pages',
			type: 'number',
			required: true,
			placeholder: 'e.g., 5',
		},
		{
			name: 'certification_needed',
			label: 'Do you need MOJ certification?',
			type: 'select',
			required: true,
			options: ['Yes', 'No', 'Not sure - please advise'],
		},
		{
			name: 'document_upload',
			label: 'Upload Document',
			type: 'file',
			required: true,
			helperText: 'PDF, DOC, DOCX (Max 10MB)',
		},
	],

	'medical-translation': [
		{
			name: 'source_language',
			label: 'From Language',
			type: 'select',
			required: true,
			options: ['Arabic', 'English', 'Hebrew', 'Other'],
		},
		{
			name: 'target_language',
			label: 'To Language',
			type: 'select',
			required: true,
			options: ['Arabic', 'English', 'Hebrew', 'Other'],
		},
		{
			name: 'document_type',
			label: 'Document Type',
			type: 'select',
			required: true,
			options: [
				'Medical report',
				'Prescription',
				'Test results',
				'Medical history',
				'Other',
			],
		},
		{
			name: 'page_count',
			label: 'Number of Pages',
			type: 'number',
			required: true,
		},
	],

	// LEGALIZATION & ATTESTATION
	'embassy-legalization': [
		{
			name: 'document_type',
			label: 'Type of Document',
			type: 'select',
			required: true,
			options: [
				'Educational certificate',
				'Commercial document',
				'Personal document',
				'Power of attorney',
				'Other',
			],
		},
		{
			name: 'destination_country',
			label: 'Destination Country',
			type: 'text',
			required: true,
			placeholder: 'Where will this document be used?',
		},
		{
			name: 'mofae_completed',
			label: 'Has MOFAE attestation been completed?',
			type: 'select',
			required: true,
			options: ['Yes', 'No', 'Not sure'],
		},
	],

	'apostille-services': [
		{
			name: 'document_type',
			label: 'Type of Document',
			type: 'select',
			required: true,
			options: [
				'Birth certificate',
				'Marriage certificate',
				'Educational certificate',
				'Power of attorney',
				'Other',
			],
		},
		{
			name: 'destination_country',
			label: 'Destination Country (Hague Convention)',
			type: 'text',
			required: true,
			placeholder: 'e.g., USA, UK, Germany',
		},
		{
			name: 'number_of_documents',
			label: 'Number of Documents',
			type: 'number',
			required: true,
		},
	],

	'mofa-attestation': [
		{
			name: 'document_type',
			label: 'Type of Document',
			type: 'select',
			required: true,
			options: [
				'Educational certificate',
				'Marriage certificate',
				'Birth certificate',
				'Commercial document',
				'Other',
			],
		},
		{
			name: 'previous_attestation',
			label: 'Has the document been attested by home country?',
			type: 'select',
			required: true,
			options: ['Yes', 'No', 'Not applicable'],
		},
		{
			name: 'express_service',
			label: 'Do you need express (same-day) service?',
			type: 'select',
			required: true,
			options: ['Yes', 'No'],
		},
	],

	// BUSINESS SERVICES
	'business-registration': [
		{
			name: 'business_type',
			label: 'Type of Business Entity',
			type: 'select',
			required: true,
			options: [
				'Limited Liability Company (LLC)',
				'Partnership',
				'Sole Proprietorship',
				'Branch Office',
				'Other',
			],
		},
		{
			name: 'business_location',
			label: 'Business Location',
			type: 'select',
			required: true,
			options: [
				'Ramallah',
				'Bethlehem',
				'Nablus',
				'Hebron',
				'Jerusalem',
				'Other West Bank city',
			],
		},
		{
			name: 'business_activity',
			label: 'Main Business Activity',
			type: 'text',
			required: true,
			placeholder: 'e.g., Import/Export, IT Services, Consulting',
		},
		{
			name: 'capital_amount',
			label: 'Initial Capital (NIS)',
			type: 'number',
			required: true,
			placeholder: 'e.g., 50000',
		},
		{
			name: 'num_partners',
			label: 'Number of Partners/Shareholders',
			type: 'number',
			required: true,
		},
	],

	'commercial-license-renewal': [
		{
			name: 'current_license_number',
			label: 'Current License Number',
			type: 'text',
			required: true,
		},
		{
			name: 'business_name',
			label: 'Business Name',
			type: 'text',
			required: true,
		},
		{
			name: 'municipality',
			label: 'Municipality',
			type: 'select',
			required: true,
			options: [
				'Ramallah',
				'Bethlehem',
				'Nablus',
				'Hebron',
				'Jerusalem',
				'Other',
			],
		},
		{
			name: 'activity_changes',
			label: 'Any changes to business activities?',
			type: 'select',
			required: true,
			options: ['Yes', 'No'],
		},
	],

	// INTERNATIONAL DRIVING LICENSE
	'international-driving-license': [
		{
			name: 'passport_number',
			label: 'Passport Number',
			label_ar: 'رقم جواز السفر',
			type: 'text',
			required: true,
			placeholder: 'e.g., P1234567',
			placeholder_ar: 'مثال: P1234567',
			helperText: 'Enter your passport number',
			helperText_ar: 'أدخل رقم جواز سفرك',
		},
		{
			name: 'existing_license_number',
			label: 'Existing License Number',
			label_ar: 'رقم الرخصة الحالي',
			type: 'text',
			required: true,
			placeholder: 'e.g., 123456789',
			placeholder_ar: 'مثال: 123456789',
			helperText: 'Enter your current Palestinian driver\'s license number',
			helperText_ar: 'أدخل رقم رخصتك الفلسطينية الحالية',
		},
		{
			name: 'license_expiry_date',
			label: 'License Expiry Date',
			label_ar: 'تاريخ انتهاء الرخصة',
			type: 'date',
			required: true,
		},
		{
			name: 'passport_upload',
			label: 'Upload Passport Copy',
			label_ar: 'رفع نسخة جواز السفر',
			type: 'file',
			required: true,
			helperText: 'PDF, JPG, or PNG (Max 10MB). Clear photo of passport page',
			helperText_ar: 'PDF أو JPG أو PNG (الحد الأقصى 10 ميجابايت). صورة واضحة لصفحة جواز السفر',
		},
		{
			name: 'license_upload',
			label: 'Upload Existing License Copy',
			label_ar: 'رفع نسخة الرخصة الحالية',
			type: 'file',
			required: true,
			helperText: 'PDF, JPG, or PNG (Max 10MB). Clear photo of both sides',
			helperText_ar: 'PDF أو JPG أو PNG (الحد الأقصى 10 ميجابايت). صورة واضحة للوجهين',
		},
		{
			name: 'personal_photo_upload',
			label: 'Upload Personal Photo',
			label_ar: 'رفع الصورة الشخصية',
			type: 'file',
			required: true,
			helperText: 'JPG or PNG (Max 5MB). White background preferred',
			helperText_ar: 'JPG أو PNG (الحد الأقصى 5 ميجابايت). خلفية بيضاء مفضلة',
		},
	],
};

// Helper function to get fields for a service
export function getServiceFields(serviceSlug: string): FormField[] {
	return serviceFormFields[serviceSlug] || [];
}

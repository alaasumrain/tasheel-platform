// Service-specific form fields configuration

export interface FormField {
	name: string;
	label: string;
	type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea' | 'file';
	placeholder?: string;
	required?: boolean;
	options?: string[];
	helperText?: string;
}

// Define service-specific fields for each service
export const serviceFormFields: Record<string, FormField[]> = {
	// GOVERNMENT SERVICES
	'drivers-license-renewal': [
		{
			name: 'current_license_number',
			label: 'Current License Number',
			type: 'text',
			placeholder: 'e.g., 123456789',
			required: true,
			helperText: 'Enter your current Palestinian license number',
		},
		{
			name: 'expiry_date',
			label: 'License Expiry Date',
			type: 'date',
			required: true,
		},
		{
			name: 'vision_test_needed',
			label: 'Vision Test',
			type: 'select',
			required: true,
			options: [
				'Yes, please arrange for me',
				'No, I have a valid vision test certificate',
			],
		},
		{
			name: 'license_upload',
			label: 'Upload Current License Copy (Optional)',
			type: 'file',
			helperText: 'PDF, JPG, or PNG (Max 5MB)',
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
			type: 'text',
			required: true,
			placeholder: 'e.g., P1234567',
			helperText: 'Enter your passport number',
		},
		{
			name: 'existing_license_number',
			label: 'Existing License Number',
			type: 'text',
			required: true,
			placeholder: 'e.g., 123456789',
			helperText: 'Enter your current Palestinian driver\'s license number',
		},
		{
			name: 'license_expiry_date',
			label: 'License Expiry Date',
			type: 'date',
			required: true,
		},
		{
			name: 'passport_upload',
			label: 'Upload Passport Copy',
			type: 'file',
			required: true,
			helperText: 'PDF, JPG, or PNG (Max 10MB). Clear photo of passport page',
		},
		{
			name: 'license_upload',
			label: 'Upload Existing License Copy',
			type: 'file',
			required: true,
			helperText: 'PDF, JPG, or PNG (Max 10MB). Clear photo of both sides',
		},
	],
};

// Helper function to get fields for a service
export function getServiceFields(serviceSlug: string): FormField[] {
	return serviceFormFields[serviceSlug] || [];
}

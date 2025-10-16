export interface Service {
	slug: string;
	title: string;
	category: 'government' | 'translation' | 'legalization' | 'business';
	shortDescription: string;
	description: string;
	icon: string;
	image: {
		light: string;
		dark: string;
	};
	processSteps: {
		number: number;
		title: string;
		description: string;
	}[];
	requiredDocuments: string[];
	pricing: {
		type: 'fixed' | 'quote' | 'starting';
		amount?: number;
		note?: string;
	};
	turnaroundTime: string;
	features: string[];
}

export const services: Service[] = [
	// GOVERNMENT SERVICES
	{
		slug: 'drivers-license-renewal',
		title: "Driver's License Renewal",
		category: 'government',
		shortDescription:
			"Renew your Palestinian driver's license without visiting the licensing directorate. We coordinate tests and submissions on your behalf.",
		description:
			"Skip ministry queues and paperwork. Our driver's license renewal service manages the entire process with the Palestinian Ministry of Transport and Road Safety. We coordinate vision tests, verify documents, submit your renewal, handle payments you approve, and deliver the updated license to your door.",
		icon: '/icons/drivers-license.svg',
		image: {
			light: '/light/services/drivers-license.jpg',
			dark: '/dark/services/drivers-license.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Submit Details Online',
				description:
					'Fill out our guided request with license details and secure document uploads.',
			},
			{
				number: 2,
				title: 'Vision Test Coordination',
				description:
					'We book a certified vision test in your city and collect the results for you.',
			},
			{
				number: 3,
				title: 'Ministry Processing',
				description:
					'Our specialists submit your renewal to the Ministry of Transport and monitor approvals.',
			},
			{
				number: 4,
				title: 'License Delivery',
				description:
					'Receive your renewed license by courier anywhere in the West Bank or Jerusalem.',
			},
		],
		requiredDocuments: [
			'Copy of existing driver\'s license',
			'Palestinian ID card copy',
			'Passport copy (if available)',
			'Vision test certificate (we can arrange)',
			'Employer or sponsor approval (if required)',
		],
		pricing: {
			type: 'starting',
			amount: 275,
			note: 'Service fee in NIS. Government fees charged separately at cost.',
		},
		turnaroundTime: '4-6 business days',
		features: [
			'No ministry visit required',
			'Vision test coordination',
			'Document verification',
			'Real-time tracking',
			'Courier delivery',
			'SMS/Email updates',
		],
	},
	{
		slug: 'marriage-certificate-attestation',
		title: 'Marriage Certificate Attestation',
		category: 'government',
		shortDescription:
			'Get your marriage certificate attested for Palestinian residency applications, family reunification, or international recognition.',
		description:
			'Marriage certificate attestation is required for registering marriages with Palestinian authorities and supporting family reunification abroad. We manage the entire chain from home-country legalization through the Palestinian mission and the Ministry of Foreign Affairs and Expatriates (MOFAE) in Ramallah.',
		icon: '/icons/marriage.svg',
		image: {
			light: '/light/services/marriage-cert.jpg',
			dark: '/dark/services/marriage-cert.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Document Collection',
				description:
					'Free pickup of your original certificate in Ramallah or Bethlehem, or insured courier from other Palestinian cities.',
			},
			{
				number: 2,
				title: 'Home Country Attestation',
				description:
					'Attestation from issuing authority and foreign ministry in your home country.',
			},
			{
				number: 3,
				title: 'Palestinian Mission Legalization',
				description:
					'Legalization through the Palestinian embassy or mission in the country where the certificate was issued.',
			},
			{
				number: 4,
				title: 'MOFAE Attestation',
				description:
					'Final attestation at the Ministry of Foreign Affairs and Expatriates in Ramallah.',
			},
		],
		requiredDocuments: [
			'Original marriage certificate',
			'Passport copy of both spouses',
			'Palestinian ID card copies (if applicable)',
		],
		pricing: {
			type: 'quote',
			note: 'Varies by country of issuance. Request quote for accurate pricing.',
		},
		turnaroundTime: '10-15 business days (varies by country)',
		features: [
			'Free pickup & delivery across the West Bank',
			'Complete attestation chain',
			'Track every step',
			'Expert guidance',
			'Secure handling',
			'Fast-track available',
		],
	},
	{
		slug: 'birth-certificate-attestation',
		title: 'Birth Certificate Attestation',
		category: 'government',
		shortDescription:
			'Attest birth certificates for child residency, school admissions, and passport applications in Palestine and abroad.',
		description:
			'Birth certificate attestation is mandatory for child residency applications, school enrollments, and official procedures in Palestine. We coordinate the full attestation chain, including Palestinian mission legalization and MOFAE approval, with pickup and delivery.',
		icon: '/icons/birth.svg',
		image: {
			light: '/light/services/birth-cert.jpg',
			dark: '/dark/services/birth-cert.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Verify Document',
				description:
					'We verify your birth certificate and guide on any additional requirements.',
			},
			{
				number: 2,
				title: 'Attestation Chain',
				description:
					'Complete attestation from home-country authorities through the Palestinian mission in the issuing country.',
			},
			{
				number: 3,
				title: 'MOFAE Ramallah',
				description:
					'Final attestation from the Ministry of Foreign Affairs and Expatriates in Palestine.',
			},
			{
				number: 4,
				title: 'Safe Return',
				description: 'Attested certificate delivered back to your address.',
			},
		],
		requiredDocuments: [
			'Original birth certificate',
			'Passport copy of child',
			"Parents' passport copies",
			'Palestinian ID card copy (if applicable)',
		],
		pricing: {
			type: 'quote',
			note: 'Pricing depends on country of issuance and urgency.',
		},
		turnaroundTime: '10-15 business days',
		features: [
			'Free document pickup',
			'Complete attestation',
			'School admission ready',
			'Visa sponsorship ready',
			'Secure processing',
			'Real-time updates',
		],
	},
	{
		slug: 'degree-certificate-attestation',
		title: 'Degree Certificate Attestation',
		category: 'government',
		shortDescription:
			'Attest educational certificates for Palestinian employment, MOE equivalency, and international licensing.',
		description:
			'Degree attestation is mandatory for professional licensing in Palestine and abroad. We manage university verification, home-country legalization, Palestinian mission stamping, and MOFAE attestation so your qualifications are recognized everywhere.',
		icon: '/icons/degree.svg',
		image: {
			light: '/light/services/degree-cert.jpg',
			dark: '/dark/services/degree-cert.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Document Verification',
				description:
					'Verify authenticity and guide on the complete attestation process.',
			},
			{
				number: 2,
				title: 'University & HRD',
				description:
					'Attestation from university and Human Resource Development department.',
			},
			{
				number: 3,
				title: 'Foreign Ministry & Mission',
				description:
					'Home-country foreign ministry and Palestinian mission legalization for your documents.',
			},
			{
				number: 4,
				title: 'MOFAE Palestine',
				description: 'Final attestation from MOFAE for use in Palestine and abroad.',
			},
		],
		requiredDocuments: [
			'Original degree certificate',
			'Original mark sheets/transcripts',
			'Passport copy',
			'Work permit or sponsorship letter (if applicable)',
		],
		pricing: {
			type: 'quote',
			note: 'Varies by country and degree level. Request quote.',
		},
		turnaroundTime: '15-20 business days',
		features: [
			'Employment visa ready',
			'Palestinian MOE equivalency support',
			'All countries covered',
			'University verification',
			'Express service available',
			'Degree equivalency assistance',
		],
	},
	{
		slug: 'police-clearance-certificate',
		title: 'Police Clearance Certificate',
		category: 'government',
		shortDescription:
			'Obtain and attest police clearance certificates from Palestine and abroad for residency or immigration applications.',
		description:
			'Get a Palestinian Police Clearance Certificate or legalize foreign PCC documents for residency, employment, or immigration purposes. We coordinate applications, follow up on approvals, and deliver attested certificates.',
		icon: '/icons/police.svg',
		image: {
			light: '/light/services/pcc.jpg',
			dark: '/dark/services/pcc.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Application Submission',
				description:
					'We submit your PCC application to the Palestinian Police or the appropriate foreign authority.',
			},
			{
				number: 2,
				title: 'Processing',
				description:
					'Background verification and clearance certificate issuance.',
			},
			{
				number: 3,
				title: 'Attestation',
				description: 'Complete attestation chain if required for your purpose.',
			},
			{
				number: 4,
				title: 'Delivery',
				description: 'Attested PCC delivered to your address.',
			},
		],
		requiredDocuments: [
			'Passport copy',
			'Palestinian ID card copy',
			'Residency or visa copy (if applicable)',
			'Application form (we provide)',
		],
		pricing: {
			type: 'starting',
			amount: 320,
			note: 'Palestine PCC. Foreign PCC pricing varies by country and jurisdiction.',
		},
		turnaroundTime: '3-5 business days (Palestine), varies for other countries',
		features: [
			'Palestine Police PCC',
			'Home country PCC',
			'Complete attestation',
			'Express service',
			'Immigration ready',
			'Employment ready',
		],
	},

	// TRANSLATION SERVICES
	{
		slug: 'legal-translation',
		title: 'Legal Document Translation',
		category: 'translation',
		shortDescription:
			'Certified legal document translation by approved translators for court submissions and official use.',
		description:
			'Get certified translations of legal documents by Palestinian Ministry of Justice-approved translators. Perfect for court submissions, contracts, agreements, and official legal proceedings.',
		icon: '/icons/legal-translation.svg',
		image: {
			light: '/light/services/legal-translation.jpg',
			dark: '/dark/services/legal-translation.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Document Upload',
				description: 'Upload your legal document securely through our platform.',
			},
			{
				number: 2,
				title: 'Expert Translation',
				description: 'MOJ-approved legal translator works on your document.',
			},
			{
				number: 3,
				title: 'Certification',
				description: 'Translation certified and stamped by approved authority.',
			},
			{
				number: 4,
				title: 'Delivery',
				description:
					'Receive certified translation digitally and physically.',
			},
		],
		requiredDocuments: [
			'Original document (scan or photo)',
			'Purpose of translation',
			'Delivery address',
		],
		pricing: {
			type: 'starting',
			amount: 150,
			note: 'Per page. Volume discounts available.',
		},
		turnaroundTime: '2-3 business days',
		features: [
			'Palestinian Ministry of Justice-approved translators',
			'Court-ready certification',
			'40+ languages',
			'Legal terminology expertise',
			'Confidential handling',
			'Same-day express option',
		],
	},
	{
		slug: 'medical-translation',
		title: 'Medical Document Translation',
		category: 'translation',
		shortDescription:
			'Certified medical translation for prescriptions, reports, and healthcare documents.',
		description:
			'Accurate medical document translation by certified translators with healthcare expertise. For hospital submissions, insurance claims, and medical visa applications.',
		icon: '/icons/medical-translation.svg',
		image: {
			light: '/light/services/medical-translation.jpg',
			dark: '/dark/services/medical-translation.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Submit Documents',
				description:
					'Upload medical records, reports, or prescriptions securely.',
			},
			{
				number: 2,
				title: 'Medical Translation',
				description: 'Certified translator with medical background translates.',
			},
			{
				number: 3,
				title: 'Quality Check',
				description: 'Medical terminology verified by healthcare professional.',
			},
			{
				number: 4,
				title: 'Certified Delivery',
				description: 'Receive certified translation ready for official use.',
			},
		],
		requiredDocuments: [
			'Medical document (report/prescription/record)',
			'Patient information',
			'Intended use',
		],
		pricing: {
			type: 'starting',
			amount: 120,
			note: 'Per page. Complex medical terminology may vary.',
		},
		turnaroundTime: '2-4 business days',
		features: [
			'Medical terminology experts',
			'Certified translations',
			'HIPAA compliant',
			'Insurance accepted',
			'Multiple languages',
			'Express available',
		],
	},

	// LEGALIZATION & ATTESTATION
	{
		slug: 'embassy-legalization',
		title: 'Embassy Legalization',
		category: 'legalization',
		shortDescription:
			'Complete embassy legalization service for documents issued in Palestine or destined for Palestinian authorities.',
		description:
			'We manage embassy legalization for documents issued in Palestine to be used abroad, as well as foreign documents that need recognition in Palestine. Our team coordinates MOFAE stamping, embassy appointments in Jerusalem, Amman, or Cairo, and returns fully legalized paperwork.',
		icon: '/icons/embassy.svg',
		image: {
			light: '/light/services/embassy.jpg',
			dark: '/dark/services/embassy.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Document Assessment',
				description:
					'We map the legalization steps required by your destination country or Palestinian authority.',
			},
			{
				number: 2,
				title: 'MOFAE Attestation',
				description:
					'If needed, we secure attestation from the Ministry of Foreign Affairs and Expatriates in Ramallah.',
			},
			{
				number: 3,
				title: 'Embassy Legalization',
				description:
					'We submit documents to the relevant embassy or consulate and collect legalized originals.',
			},
			{
				number: 4,
				title: 'Delivery',
				description: 'Legalized documents delivered anywhere in Palestine or abroad.',
			},
		],
		requiredDocuments: [
			'Original document',
			'MOFAE attestation (if already completed)',
			'Passport copy',
			'Destination country details',
		],
		pricing: {
			type: 'quote',
			note: 'Varies by embassy and document type. Request quote.',
		},
		turnaroundTime: '5-10 business days (varies by embassy)',
		features: [
			'Embassy runs in Jerusalem, Amman, Cairo, and more',
			'MOFAE coordination',
			'Express service',
			'Document verification',
			'International use ready',
			'Free consultation',
		],
	},
	{
		slug: 'apostille-services',
		title: 'Apostille Services',
		category: 'legalization',
		shortDescription:
			'Apostille certification for Hague Convention countries—ideal for documents issued in or destined for Palestine.',
		description:
			'Apostille is a simplified certification for documents used in Hague Convention countries. We confirm eligibility, complete notarization, and secure the apostille stamp so your paperwork is accepted abroad without embassy visits.',
		icon: '/icons/apostille.svg',
		image: {
			light: '/light/services/apostille.jpg',
			dark: '/dark/services/apostille.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Verify Hague Status',
				description:
					'Confirm your destination country accepts apostille certification.',
			},
			{
				number: 2,
				title: 'Document Preparation',
				description:
					'Notarization and other pre-apostille requirements if needed.',
			},
			{
				number: 3,
				title: 'Apostille Stamp',
				description:
					'Obtain apostille certification from competent authority.',
			},
			{
				number: 4,
				title: 'Ready for Use',
				description: 'Document ready for international use without embassy.',
			},
		],
		requiredDocuments: [
			'Original document',
			'Destination country information',
			'Notarization (if applicable)',
		],
		pricing: {
			type: 'starting',
			amount: 450,
			note: 'Includes apostille and processing. Country-specific.',
		},
		turnaroundTime: '7-10 business days',
		features: [
			'Hague Convention countries',
			'Faster than embassy',
			'Internationally recognized',
			'Multiple document support',
			'Notarization included',
			'Expert guidance',
		],
	},
	{
		slug: 'mofa-attestation',
		title: 'MOFAE Attestation',
		category: 'legalization',
		shortDescription:
			'Ministry of Foreign Affairs and Expatriates attestation for documents in Palestine.',
		description:
			'MOFAE attestation is the final step for document legalization in Palestine. It is required for employment, family reunification, and using foreign documents with Palestinian ministries.',
		icon: '/icons/mofa.svg',
		image: {
			light: '/light/services/mofa.jpg',
			dark: '/dark/services/mofa.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Document Check',
				description:
					'Verify all pre-MOFAE requirements (notary, embassy, mission) are completed.',
			},
			{
				number: 2,
				title: 'MOFAE Submission',
				description:
					'Submit documents to MOFAE headquarters in Ramallah or the appropriate district office.',
			},
			{
				number: 3,
				title: 'Processing',
				description: 'MOFAE processes and stamps your documents.',
			},
			{
				number: 4,
				title: 'Collection & Delivery',
				description: 'We collect and deliver to your address.',
			},
		],
		requiredDocuments: [
			'Original document',
			'Palestinian mission attestation (if foreign document)',
			'Passport copy',
		],
		pricing: {
			type: 'starting',
			amount: 220,
			note: 'Standard service in NIS. Express counters and after-hours available.',
		},
		turnaroundTime: '3-5 business days',
		features: [
			'Ramallah MOFAE headquarters support',
			'Work permit ready',
			'Family reunification ready',
			'Same-day express',
			'Courier pickup & delivery',
			'Track status',
		],
	},

	// BUSINESS SERVICES
	{
		slug: 'business-registration',
		title: 'Business Registration & Licensing',
		category: 'business',
		shortDescription:
			'Complete business setup including companies registrar filings, municipal licensing, and corporate documents in Palestine.',
		description:
			'Full-service business registration across the West Bank, Jerusalem, and international free zones. We coordinate with the Ministry of National Economy, draft founding agreements, secure municipal and chamber approvals, and deliver your full registration package.',
		icon: '/icons/business.svg',
		image: {
			light: '/light/services/business.jpg',
			dark: '/dark/services/business.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'Business Consultation',
				description:
					'Discuss business activity, location, and licensing requirements.',
			},
			{
				number: 2,
				title: 'Document Preparation',
				description: 'Prepare MOA, application forms, and required documents.',
			},
			{
				number: 3,
				title: 'Registrar Submission',
				description:
					'Submit incorporation documents to the Companies Registrar and Ministry of National Economy.',
			},
			{
				number: 4,
				title: 'License Issuance',
				description:
					'Receive registration certificates, municipal licenses, and corporate records.',
			},
		],
		requiredDocuments: [
			'Passport copies of shareholders',
			'Palestinian ID cards (if resident)',
			'Office lease or ownership documents',
			'NOC from current employer or sponsor (if applicable)',
			'Business plan',
		],
		pricing: {
			type: 'quote',
		note: 'Varies by entity type, municipality, and capital structure. Request consultation for tailored NIS pricing.',
		},
		turnaroundTime: '7-14 business days',
		features: [
			'West Bank, Jerusalem, and free zone options',
			'Ministry of National Economy coordination',
			'Business licensing processing',
			'Corporate documents',
			'Bank account support',
			'Free consultation',
		],
	},
	{
		slug: 'commercial-license-renewal',
		title: 'Commercial License Renewal',
		category: 'business',
		shortDescription:
			'Renew your commercial registration and municipal licenses without visiting government counters.',
		description:
			'Hassle-free commercial license renewal service. We manage Ministry of National Economy filings, municipal payments, and company registry updates, then deliver your renewed licenses and certificates.',
		icon: '/icons/license-renewal.svg',
		image: {
			light: '/light/services/license-renewal.jpg',
			dark: '/dark/services/license-renewal.jpg',
		},
		processSteps: [
			{
				number: 1,
				title: 'License Review',
				description:
					'We review your existing license and check renewal requirements.',
			},
			{
				number: 2,
				title: 'Document Update',
				description: 'Update tenancy, manager details, or activities if needed.',
			},
			{
				number: 3,
				title: 'Registrar Renewal',
				description: 'Submit renewal applications to the Companies Registrar and municipal authorities with all documents.',
			},
			{
				number: 4,
				title: 'License Delivery',
				description: 'Renewed license delivered to your business address.',
			},
		],
		requiredDocuments: [
			'Existing commercial registration and licenses',
			'Lease agreement or property documents',
			'Palestinian ID cards of partners',
			'Memorandum of Association or partnership agreement',
		],
		pricing: {
			type: 'starting',
			amount: 680,
			note: 'Service fee in NIS. Government renewals and penalties billed at cost.',
		},
		turnaroundTime: '5-7 business days',
		features: [
			'No ministry visit required',
			'Document verification',
			'Activity updates',
			'Management change processing',
			'Express service',
			'Track status',
		],
	},
];

export const serviceCategories = [
	{
		slug: 'government',
		name: 'Government Services',
		description:
			'Driver\'s licenses, permits, certificates, and official document processing.',
		icon: '/icons/government.svg',
	},
	{
		slug: 'translation',
		name: 'Translation Services',
		description:
			'Certified translations for legal, medical, and business documents.',
		icon: '/icons/translation.svg',
	},
	{
		slug: 'legalization',
		name: 'Legalization & Attestation',
		description:
			'Embassy legalization, MOFAE attestation, and apostille services.',
		icon: '/icons/legalization.svg',
	},
	{
		slug: 'business',
		name: 'Business Services',
		description: 'Business registration, licensing, and corporate documentation.',
		icon: '/icons/business.svg',
	},
];

// Helper function to get service by slug
export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((service) => service.slug === slug);
}

// Helper function to get services by category
export function getServicesByCategory(
	category: Service['category']
): Service[] {
	return services.filter((service) => service.category === category);
}

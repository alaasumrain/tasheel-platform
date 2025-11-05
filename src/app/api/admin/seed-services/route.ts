import { NextResponse } from 'next/server';
import { checkAdminAuthAPI } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

/**
 * Seed 30 essential services into the database
 * 
 * This endpoint adds the core 30 services for Phase 1/2.
 * We'll expand to 149 services in Phase 3.
 */

interface ServiceSeedData {
	slug: string;
	name_en: string;
	name_ar: string;
	short_description_en: string;
	short_description_ar: string;
	description_en: string;
	description_ar: string;
	category_id: string;
	turnaround_days: number;
	required_documents: string[];
	process_steps: Array<{
		number: number;
		title_en: string;
		title_ar: string;
		description_en: string;
		description_ar: string;
	}>;
	pricing: {
		type: 'fixed' | 'quote' | 'starting';
		amount?: number;
		note_en?: string;
		note_ar?: string;
	};
	sort_order: number;
}

// Category IDs (from the codebase)
const CATEGORY_IDS = {
	translation: '20c51882-f009-4f38-abd6-bdb11f367f13',
	government: '172ca066-d4b5-4e3e-9758-e6c783128064',
	legalization: '062a48a0-4146-41a7-bee1-49f4fb6d69d5',
	business: '9e6660b2-3111-434b-b11d-bf2e53ba1fc9',
};

// Helper to create slug from English name
function createSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// Generate 30 essential services
function generateAllServices(): ServiceSeedData[] {
	const services: ServiceSeedData[] = [];
	let sortOrder = 0;

	// ============================================
	// TRANSLATION SERVICES (15 services)
	// ============================================

	// Top 5 Document Translation Services (most common)
	const topDocumentTypes = [
		{ en: 'Passport Translation', ar: 'ترجمة جواز السفر', lang: 'EN/AR' },
		{ en: 'ID Card Translation', ar: 'ترجمة بطاقة الهوية', lang: 'EN/AR' },
		{ en: 'Birth Certificate Translation', ar: 'ترجمة شهادة الميلاد', lang: 'EN/AR' },
		{ en: 'Academic Degree Translation', ar: 'ترجمة الشهادة الأكاديمية', lang: 'EN/AR' },
		{ en: 'Driving License Translation', ar: 'ترجمة رخصة القيادة', lang: 'EN/AR' },
	];

	topDocumentTypes.forEach((doc) => {
		const langSlug = doc.lang.replace('/', '-').toLowerCase();
		services.push({
			slug: `translation-${createSlug(doc.en)}-${langSlug}`,
			name_en: `${doc.en} (${doc.lang})`,
			name_ar: `${doc.ar} (${doc.lang})`,
			short_description_en: `Professional translation of ${doc.en.toLowerCase()} from/to ${doc.lang}`,
			short_description_ar: `ترجمة احترافية ل${doc.ar.toLowerCase()} من/إلى ${doc.lang}`,
			description_en: `We provide certified translation services for ${doc.en.toLowerCase()} between ${doc.lang}. Our translations are accepted by government offices, embassies, and educational institutions.`,
			description_ar: `نوفر خدمات الترجمة المعتمدة ل${doc.ar.toLowerCase()} بين ${doc.lang}. ترجماتنا مقبولة في المكاتب الحكومية والسفارات والمؤسسات التعليمية.`,
			category_id: CATEGORY_IDS.translation,
			turnaround_days: 2,
			required_documents: [
				'Original document / المستند الأصلي',
				'Clear copy of the document / نسخة واضحة من المستند',
				'Valid ID / بطاقة هوية صالحة',
			],
			process_steps: [
				{
					number: 1,
					title_en: 'Submit Document',
					title_ar: 'تقديم المستند',
					description_en: 'Upload or bring the original document',
					description_ar: 'قم برفع المستند الأصلي أو أحضره',
				},
				{
					number: 2,
					title_en: 'Translation',
					title_ar: 'الترجمة',
					description_en: 'Our certified translator translates your document',
					description_ar: 'يقوم مترجمنا المعتمد بترجمة مستندك',
				},
				{
					number: 3,
					title_en: 'Review & Certification',
					title_ar: 'المراجعة والتصديق',
					description_en: 'Document is reviewed and certified',
					description_ar: 'يتم مراجعة المستند والتصديق عليه',
				},
				{
					number: 4,
					title_en: 'Delivery',
					title_ar: 'التسليم',
					description_en: 'Receive your translated document',
					description_ar: 'استلم مستندك المترجم',
				},
			],
			pricing: {
				type: 'starting',
				amount: 50,
				note_en: 'Price varies by document length',
				note_ar: 'السعر يختلف حسب طول المستند',
			},
			sort_order: sortOrder++,
		});
	});

	// Legal Translation (3 most common)
	const legalDocs = [
		{ en: 'Contract Translation (Certified)', ar: 'ترجمة العقد (معتمدة)' },
		{ en: 'Power of Attorney Translation', ar: 'ترجمة الوكالة' },
		{ en: 'Court Document Translation', ar: 'ترجمة وثائق المحكمة' },
	];

	legalDocs.forEach((doc) => {
		services.push({
			slug: `translation-legal-${createSlug(doc.en)}`,
			name_en: doc.en,
			name_ar: doc.ar,
			short_description_en: `Certified legal translation for ${doc.en.toLowerCase()}`,
			short_description_ar: `ترجمة قانونية معتمدة ل${doc.ar.toLowerCase()}`,
			description_en: `Professional certified translation of legal documents. Our translations are accepted by courts, law firms, and government agencies.`,
			description_ar: `ترجمة احترافية معتمدة للوثائق القانونية. ترجماتنا مقبولة في المحاكم ومكاتب المحاماة والجهات الحكومية.`,
			category_id: CATEGORY_IDS.translation,
			turnaround_days: 3,
			required_documents: ['Original document', 'Valid ID', 'Any supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Review',
					title_ar: 'مراجعة المستند',
					description_en: 'We review your legal document',
					description_ar: 'نراجع مستندك القانوني',
				},
				{
					number: 2,
					title_en: 'Certified Translation',
					title_ar: 'الترجمة المعتمدة',
					description_en: 'Certified translator handles the translation',
					description_ar: 'يقوم المترجم المعتمد بترجمة المستند',
				},
				{
					number: 3,
					title_en: 'Legal Review',
					title_ar: 'المراجعة القانونية',
					description_en: 'Legal expert reviews the translation',
					description_ar: 'خبير قانوني يراجع الترجمة',
				},
				{
					number: 4,
					title_en: 'Certification & Delivery',
					title_ar: 'التصديق والتسليم',
					description_en: 'Document is certified and delivered',
					description_ar: 'يتم تصديق المستند وتسليمه',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Price based on document complexity',
				note_ar: 'السعر يعتمد على تعقيد المستند',
			},
			sort_order: sortOrder++,
		});
	});

	// Business Translation (2 most common)
	const businessDocs = [
		{ en: 'Company Registration Documents Translation', ar: 'ترجمة وثائق تسجيل الشركة' },
		{ en: 'Financial Statements Translation', ar: 'ترجمة البيانات المالية' },
	];

	businessDocs.forEach((doc) => {
		services.push({
			slug: `translation-business-${createSlug(doc.en)}`,
			name_en: doc.en,
			name_ar: doc.ar,
			short_description_en: `Business document translation for ${doc.en.toLowerCase()}`,
			short_description_ar: `ترجمة وثائق الأعمال ل${doc.ar.toLowerCase()}`,
			description_en: `Professional translation of business documents for international trade and commerce.`,
			description_ar: `ترجمة احترافية لوثائق الأعمال للتجارة الدولية.`,
			category_id: CATEGORY_IDS.translation,
			turnaround_days: 2,
			required_documents: ['Original document', 'Business registration (if applicable)'],
			process_steps: [
				{
					number: 1,
					title_en: 'Submit Document',
					title_ar: 'تقديم المستند',
					description_en: 'Provide your business document',
					description_ar: 'قدم مستندك التجاري',
				},
				{
					number: 2,
					title_en: 'Translation',
					title_ar: 'الترجمة',
					description_en: 'Professional translation',
					description_ar: 'ترجمة احترافية',
				},
				{
					number: 3,
					title_en: 'Delivery',
					title_ar: 'التسليم',
					description_en: 'Receive translated document',
					description_ar: 'استلم المستند المترجم',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Price based on document length',
				note_ar: 'السعر يعتمد على طول المستند',
			},
			sort_order: sortOrder++,
		});
	});

	// Other Translation (5 services)
	const otherTranslation = [
		{ en: 'Website Localization', ar: 'توطين الموقع الإلكتروني' },
		{ en: 'Letter Translation', ar: 'ترجمة الرسالة' },
		{ en: 'Email Translation', ar: 'ترجمة البريد الإلكتروني' },
		{ en: 'Manual Translation', ar: 'ترجمة الدليل' },
		{ en: 'App Localization', ar: 'توطين التطبيق' },
	];

	otherTranslation.forEach((doc) => {
		services.push({
			slug: `translation-other-${createSlug(doc.en)}`,
			name_en: doc.en,
			name_ar: doc.ar,
			short_description_en: `Translation service for ${doc.en.toLowerCase()}`,
			short_description_ar: `خدمة الترجمة ل${doc.ar.toLowerCase()}`,
			description_en: `Professional translation and localization services.`,
			description_ar: `خدمات الترجمة والتوطين الاحترافية.`,
			category_id: CATEGORY_IDS.translation,
			turnaround_days: doc.en.includes('Localization') ? 5 : 1,
			required_documents: ['Document or content to translate'],
			process_steps: [
				{
					number: 1,
					title_en: 'Submit Content',
					title_ar: 'تقديم المحتوى',
					description_en: 'Provide content for translation',
					description_ar: 'قدم المحتوى للترجمة',
				},
				{
					number: 2,
					title_en: 'Translation',
					title_ar: 'الترجمة',
					description_en: 'Translation process',
					description_ar: 'عملية الترجمة',
				},
				{
					number: 3,
					title_en: 'Review & Delivery',
					title_ar: 'المراجعة والتسليم',
					description_en: 'Review and deliver translated content',
					description_ar: 'مراجعة وتسليم المحتوى المترجم',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Price varies by content length',
				note_ar: 'السعر يختلف حسب طول المحتوى',
			},
			sort_order: sortOrder++,
		});
	});

	// ============================================
	// GOVERNMENT SERVICES - MINISTRY OF INTERIOR (10 services)
	// ============================================

	// Civil Affairs (5 most common)
	const civilAffairs = [
		{ en: 'ID Card Renewal', ar: 'تجديد بطاقة الهوية' },
		{ en: 'ID Card Replacement (Lost/Damaged)', ar: 'استبدال بطاقة الهوية (مفقودة/تالفة)' },
		{ en: 'Birth Certificate Issuance', ar: 'إصدار شهادة الميلاد' },
		{ en: 'Non-Criminal Record Certificate', ar: 'شهادة عدم محكومية' },
		{ en: 'Civil Status Certificate', ar: 'شهادة الحالة المدنية' },
	];

	civilAffairs.forEach((service) => {
		services.push({
			slug: `government-interior-civil-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Interior service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة الداخلية: ${service.ar.toLowerCase()}`,
			description_en: `We handle the complete process for ${service.en.toLowerCase()} at the Ministry of Interior.`,
			description_ar: `نقوم بمعالجة العملية الكاملة ل${service.ar.toLowerCase()} في وزارة الداخلية.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 5,
			required_documents: ['Valid ID', 'Application form', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'We prepare all required documents',
					description_ar: 'نقوم بإعداد جميع المستندات المطلوبة',
				},
				{
					number: 2,
					title_en: 'Submission',
					title_ar: 'التقديم',
					description_en: 'Submit application to Ministry of Interior',
					description_ar: 'تقديم الطلب إلى وزارة الداخلية',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on application status',
					description_ar: 'متابعة حالة الطلب',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed document',
					description_ar: 'استلام المستند المكتمل',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Passport Services (3 most common)
	const passportServices = [
		{ en: 'Passport Renewal', ar: 'تجديد جواز السفر' },
		{ en: 'Passport Issuance (New)', ar: 'إصدار جواز السفر (جديد)' },
		{ en: 'Passport Replacement (Lost/Stolen)', ar: 'استبدال جواز السفر (مفقود/مسروق)' },
	];

	passportServices.forEach((service) => {
		services.push({
			slug: `government-interior-passport-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Passport service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة جواز السفر: ${service.ar.toLowerCase()}`,
			description_en: `Complete passport service handling at the Ministry of Interior.`,
			description_ar: `معالجة كاملة لخدمات جواز السفر في وزارة الداخلية.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: service.en.includes('Emergency') ? 1 : 10,
			required_documents: ['Valid ID', 'Old passport (if applicable)', 'Photos', 'Application form'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare all required documents',
					description_ar: 'إعداد جميع المستندات المطلوبة',
				},
				{
					number: 2,
					title_en: 'Ministry Submission',
					title_ar: 'التقديم في الوزارة',
					description_en: 'Submit to Ministry of Interior',
					description_ar: 'التقديم في وزارة الداخلية',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on processing',
					description_ar: 'متابعة المعالجة',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect your passport',
					description_ar: 'استلم جواز سفرك',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Police Services (2 most common)
	const policeServices = [
		{ en: 'Police Clearance Certificate', ar: 'شهادة عدم محكومية من الشرطة' },
		{ en: 'Vehicle Registration', ar: 'تسجيل المركبة' },
	];

	policeServices.forEach((service) => {
		services.push({
			slug: `government-interior-police-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Police service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة الشرطة: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of police and traffic services.`,
			description_ar: `معالجة كاملة لخدمات الشرطة والمرور.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 3,
			required_documents: ['Valid ID', 'Vehicle documents (if applicable)', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare required documents',
					description_ar: 'إعداد المستندات المطلوبة',
				},
				{
					number: 2,
					title_en: 'Police Station Submission',
					title_ar: 'التقديم في مركز الشرطة',
					description_en: 'Submit to relevant police station',
					description_ar: 'التقديم في مركز الشرطة المختص',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on processing',
					description_ar: 'متابعة المعالجة',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed service',
					description_ar: 'استلام الخدمة المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Other Interior Services (0 - removed to keep at 30)
	const otherInterior: Array<{ en: string; ar: string }> = [];

	otherInterior.forEach((service) => {
		services.push({
			slug: `government-interior-other-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Interior service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة الداخلية: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of ${service.en.toLowerCase()} at the Ministry of Interior.`,
			description_ar: `معالجة كاملة ل${service.ar.toLowerCase()} في وزارة الداخلية.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 5,
			required_documents: ['Valid ID', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare all documents',
					description_ar: 'إعداد جميع المستندات',
				},
				{
					number: 2,
					title_en: 'Submission',
					title_ar: 'التقديم',
					description_en: 'Submit to Ministry',
					description_ar: 'التقديم في الوزارة',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on processing',
					description_ar: 'متابعة المعالجة',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed service',
					description_ar: 'استلام الخدمة المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// ============================================
	// GOVERNMENT SERVICES - OTHER MINISTRIES (2 services)
	// ============================================

	// Ministry of Transport (1 service)
	const transportServices = [
		{ en: 'Driving License Renewal', ar: 'تجديد رخصة القيادة' },
	];

	transportServices.forEach((service) => {
		services.push({
			slug: `government-transport-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Transport service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة النقل: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of transport services at the Ministry of Transport.`,
			description_ar: `معالجة كاملة لخدمات النقل في وزارة النقل.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 7,
			required_documents: ['Valid ID', 'Medical certificate (for driving license)', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare required documents',
					description_ar: 'إعداد المستندات المطلوبة',
				},
				{
					number: 2,
					title_en: 'Ministry Submission',
					title_ar: 'التقديم في الوزارة',
					description_en: 'Submit to Ministry of Transport',
					description_ar: 'التقديم في وزارة النقل',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on processing',
					description_ar: 'متابعة المعالجة',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed service',
					description_ar: 'استلام الخدمة المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Ministry of Economy (1 service)
	const economyServices = [
		{ en: 'Company Registration', ar: 'تسجيل الشركة' },
	];

	economyServices.forEach((service) => {
		services.push({
			slug: `government-economy-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Economy service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة الاقتصاد: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of business registration and licensing services.`,
			description_ar: `معالجة كاملة لخدمات تسجيل الشركات والتراخيص.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 10,
			required_documents: ['Valid ID', 'Business documents', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare all business documents',
					description_ar: 'إعداد جميع المستندات التجارية',
				},
				{
					number: 2,
					title_en: 'Ministry Submission',
					title_ar: 'التقديم في الوزارة',
					description_en: 'Submit to Ministry of Economy',
					description_ar: 'التقديم في وزارة الاقتصاد',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on processing',
					description_ar: 'متابعة المعالجة',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed documents',
					description_ar: 'استلام المستندات المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Ministry of Health (0 - removed to keep at 30)
	const healthServices: Array<{ en: string; ar: string }> = [];

	healthServices.forEach((service) => {
		services.push({
			slug: `government-health-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Health service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة الصحة: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of health services at the Ministry of Health.`,
			description_ar: `معالجة كاملة لخدمات الصحة في وزارة الصحة.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 5,
			required_documents: ['Valid ID', 'Medical documents', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare required medical documents',
					description_ar: 'إعداد المستندات الطبية المطلوبة',
				},
				{
					number: 2,
					title_en: 'Ministry Submission',
					title_ar: 'التقديم في الوزارة',
					description_en: 'Submit to Ministry of Health',
					description_ar: 'التقديم في وزارة الصحة',
				},
				{
					number: 3,
					title_en: 'Medical Examination',
					title_ar: 'الفحص الطبي',
					description_en: 'Complete medical examination if required',
					description_ar: 'إكمال الفحص الطبي إذا لزم الأمر',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed certificate',
					description_ar: 'استلام الشهادة المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Ministry of Education (0 - removed to keep at 30)
	const educationServices: Array<{ en: string; ar: string }> = [];

	educationServices.forEach((service) => {
		services.push({
			slug: `government-education-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Education service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة التربية والتعليم: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of education services at the Ministry of Education.`,
			description_ar: `معالجة كاملة لخدمات التربية والتعليم في وزارة التربية والتعليم.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 7,
			required_documents: ['Valid ID', 'Academic documents', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare academic documents',
					description_ar: 'إعداد المستندات الأكاديمية',
				},
				{
					number: 2,
					title_en: 'Ministry Submission',
					title_ar: 'التقديم في الوزارة',
					description_en: 'Submit to Ministry of Education',
					description_ar: 'التقديم في وزارة التربية والتعليم',
				},
				{
					number: 3,
					title_en: 'Verification',
					title_ar: 'التحقق',
					description_en: 'Document verification process',
					description_ar: 'عملية التحقق من المستندات',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect attested documents',
					description_ar: 'استلام المستندات المصادق عليها',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Ministry of Labor (0 - removed to keep at 30)
	const laborServices: Array<{ en: string; ar: string }> = [];

	laborServices.forEach((service) => {
		services.push({
			slug: `government-labor-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Ministry of Labor service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة وزارة العمل: ${service.ar.toLowerCase()}`,
			description_en: `Complete handling of labor services at the Ministry of Labor.`,
			description_ar: `معالجة كاملة لخدمات العمل في وزارة العمل.`,
			category_id: CATEGORY_IDS.government,
			turnaround_days: 7,
			required_documents: ['Valid ID', 'Employment documents', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare employment documents',
					description_ar: 'إعداد مستندات التوظيف',
				},
				{
					number: 2,
					title_en: 'Ministry Submission',
					title_ar: 'التقديم في الوزارة',
					description_en: 'Submit to Ministry of Labor',
					description_ar: 'التقديم في وزارة العمل',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Follow up on processing',
					description_ar: 'متابعة المعالجة',
				},
				{
					number: 4,
					title_en: 'Collection',
					title_ar: 'الاستلام',
					description_en: 'Collect completed documents',
					description_ar: 'استلام المستندات المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Government fees + service fee',
				note_ar: 'الرسوم الحكومية + رسوم الخدمة',
			},
			sort_order: sortOrder++,
		});
	});

	// ============================================
	// BUSINESS & CONSULTING SERVICES (3 services)
	// ============================================

	// Legal Consulting (2 services)
	const legalConsulting = [
		{ en: 'Legal Consultation (1 hour)', ar: 'استشارة قانونية (ساعة واحدة)' },
		{ en: 'Contract Review', ar: 'مراجعة العقد' },
	];

	legalConsulting.forEach((service) => {
		services.push({
			slug: `business-legal-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Legal consulting service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة الاستشارة القانونية: ${service.ar.toLowerCase()}`,
			description_en: `Professional legal consultation and advice from experienced lawyers.`,
			description_ar: `استشارة قانونية احترافية ونصائح من محامين ذوي خبرة.`,
			category_id: CATEGORY_IDS.business,
			turnaround_days: service.en.includes('Consultation') ? 0 : 2,
			required_documents: ['Relevant documents (if applicable)'],
			process_steps: [
				{
					number: 1,
					title_en: 'Book Appointment',
					title_ar: 'حجز موعد',
					description_en: 'Schedule consultation appointment',
					description_ar: 'جدولة موعد الاستشارة',
				},
				{
					number: 2,
					title_en: 'Consultation',
					title_ar: 'الاستشارة',
					description_en: 'Meet with legal expert',
					description_ar: 'الاجتماع مع الخبير القانوني',
				},
				{
					number: 3,
					title_en: 'Report Delivery',
					title_ar: 'تسليم التقرير',
					description_en: 'Receive consultation report',
					description_ar: 'استلام تقرير الاستشارة',
				},
			],
			pricing: {
				type: service.en.includes('Consultation') ? 'fixed' : 'quote',
				amount: service.en.includes('Consultation') ? 100 : undefined,
				note_en: service.en.includes('Consultation') ? 'Per hour' : 'Price varies',
				note_ar: service.en.includes('Consultation') ? 'لكل ساعة' : 'السعر يختلف',
			},
			sort_order: sortOrder++,
		});
	});

	// Business Setup (1 service)
	const businessSetup = [
		{ en: 'Company Formation Package', ar: 'حزمة تأسيس الشركة' },
	];

	businessSetup.forEach((service) => {
		services.push({
			slug: `business-setup-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Business setup service: ${service.en.toLowerCase()}`,
			short_description_ar: `خدمة إعداد الأعمال: ${service.ar.toLowerCase()}`,
			description_en: `Complete business setup and consulting services to get your business started.`,
			description_ar: `خدمات إعداد الأعمال والاستشارات الكاملة لبدء عملك.`,
			category_id: CATEGORY_IDS.business,
			turnaround_days: service.en.includes('Package') ? 15 : 5,
			required_documents: ['Business documents', 'ID', 'Supporting documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Consultation',
					title_ar: 'الاستشارة',
					description_en: 'Initial consultation',
					description_ar: 'الاستشارة الأولية',
				},
				{
					number: 2,
					title_en: 'Document Preparation',
					title_ar: 'إعداد المستندات',
					description_en: 'Prepare all required documents',
					description_ar: 'إعداد جميع المستندات المطلوبة',
				},
				{
					number: 3,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'Complete setup process',
					description_ar: 'إكمال عملية الإعداد',
				},
				{
					number: 4,
					title_en: 'Delivery',
					title_ar: 'التسليم',
					description_en: 'Receive completed package',
					description_ar: 'استلام الحزمة المكتملة',
				},
			],
			pricing: {
				type: 'quote',
				note_en: 'Price varies by package',
				note_ar: 'السعر يختلف حسب الحزمة',
			},
			sort_order: sortOrder++,
		});
	});

	// Administrative Support (0 - removed to keep at 30)
	const adminSupport: Array<{ en: string; ar: string }> = [];

	adminSupport.forEach((service) => {
		services.push({
			slug: `business-admin-${createSlug(service.en)}`,
			name_en: service.en,
			name_ar: service.ar,
			short_description_en: `Administrative support: ${service.en.toLowerCase()}`,
			short_description_ar: `الدعم الإداري: ${service.ar.toLowerCase()}`,
			description_en: `Administrative support services to streamline your business operations.`,
			description_ar: `خدمات الدعم الإداري لتبسيط عمليات عملك.`,
			category_id: CATEGORY_IDS.business,
			turnaround_days: service.en.includes('Express') ? 1 : service.en.includes('Booking') ? 0 : 2,
			required_documents: ['Service-specific documents'],
			process_steps: [
				{
					number: 1,
					title_en: 'Request Submission',
					title_ar: 'تقديم الطلب',
					description_en: 'Submit your request',
					description_ar: 'تقديم طلبك',
				},
				{
					number: 2,
					title_en: 'Processing',
					title_ar: 'المعالجة',
					description_en: 'We handle the process',
					description_ar: 'نقوم بمعالجة العملية',
				},
				{
					number: 3,
					title_en: 'Completion',
					title_ar: 'الإكمال',
					description_en: 'Service completed',
					description_ar: 'اكتملت الخدمة',
				},
			],
			pricing: {
				type: service.en.includes('Express') ? 'starting' : 'quote',
				amount: service.en.includes('Express') ? undefined : undefined,
				note_en: service.en.includes('Express') ? '50% premium on base service' : 'Price varies',
				note_ar: service.en.includes('Express') ? '50% علاوة على الخدمة الأساسية' : 'السعر يختلف',
			},
			sort_order: sortOrder++,
		});
	});

	return services;
}

export async function POST(request: Request) {
	try {
		// Check admin auth
		const authResult = await checkAdminAuthAPI();
		if (!authResult.isAuthenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get all existing services to avoid duplicates
		const { data: existingServices } = await supabase.from('services').select('slug');

		const existingSlugs = new Set((existingServices || []).map((s) => s.slug));

		// Generate all services
		const allServices = generateAllServices();

		// Filter out services that already exist
		const newServices = allServices.filter((service) => !existingSlugs.has(service.slug));

		if (newServices.length === 0) {
			return NextResponse.json({
				success: true,
				message: 'All services already exist in database',
				added: 0,
				total: allServices.length,
			});
		}

		// Insert new services
		const { data, error } = await supabase.from('services').insert(newServices).select();

		if (error) {
			console.error('Error inserting services:', error);
			return NextResponse.json({ error: 'Failed to insert services', details: error.message }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			message: `Successfully added ${newServices.length} services`,
			added: newServices.length,
			total: allServices.length,
			existing: existingSlugs.size,
		});
	} catch (error: any) {
		console.error('Error in seed services:', error);
		return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
	}
}


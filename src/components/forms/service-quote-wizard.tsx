'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Typography,
	Box,
	Alert,
	CircularProgress,
	LinearProgress,
	IconButton,
	Tooltip,
	CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconArrowLeft, IconArrowRight, IconCheck, IconX, IconCreditCard } from '@tabler/icons-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { submitQuoteRequest } from '@/app/actions/submit-quote-request';
import { createDraftApplication, uploadFileImmediately, deleteUploadedFile } from '@/app/actions/file-upload';
import { getServiceFields, type FormField } from '@/lib/service-form-fields';
import type { Service } from '@/data/services';
import { FileUploadField } from './FileUploadField';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import FilePreview from './FilePreview';
import RequiredDocumentsChecklist from './RequiredDocumentsChecklist';
import PricingEstimate from './PricingEstimate';
import { PaymentFlow } from '@/components/dashboard/PaymentFlow';
import { useFormAnalytics } from '@/hooks/use-analytics';
import { useAnalytics } from '@/hooks/use-analytics';
import { useTranslations, useLocale } from 'next-intl';
import { calculateShippingRate, getShippingLocationLabel, getDeliveryTypeLabel, type ShippingLocation, type DeliveryType } from '@/lib/shipping-rates';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';

interface ServiceQuoteWizardProps {
	service: Service;
	isCheckoutFlow?: boolean; // New prop
}

interface FieldErrors {
	[key: string]: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface UploadedAttachment {
	id: string;
	storagePath: string;
	fileName: string;
	fileSize: number;
}

interface CustomerProfileData {
	name: string | null;
	email: string | null;
	phone: string | null;
}

export default function ServiceQuoteWizard({ service, isCheckoutFlow = false }: ServiceQuoteWizardProps) {
	const router = useRouter();
	const t = useTranslations('Quote.wizard');
	const tErrors = useTranslations('Quote.errors');
	const tAuthLogin = useTranslations('Auth.login');
	const tAuthRegister = useTranslations('Auth.register');
	const tQuote = useTranslations('Quote');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	const supabase = useMemo(() => createClient(), []);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const redirectPath = useMemo(() => {
		const currentPath = pathname || '/';
		const query = searchParams?.toString();
		return query ? `${currentPath}?${query}` : currentPath;
	}, [pathname, searchParams]);
	const encodedRedirectPath = encodeURIComponent(redirectPath);
	const loginRedirectUrl = `/login?redirect=${encodedRedirectPath}`;
	const registerRedirectUrl = `/register?redirect=${encodedRedirectPath}`;
	const authRequiredMessage = tErrors('authRequired');
	const signInPromptMessage = tErrors('signInToContinue');
	const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);
	const [customerProfile, setCustomerProfile] = useState<CustomerProfileData | null>(null);
	const [draftInitialized, setDraftInitialized] = useState(false);
	const formAnalytics = useFormAnalytics(`quote_${service.slug}`);
	const analytics = useAnalytics();
	const formRef = useRef<HTMLFormElement>(null);
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [restoredData, setRestoredData] = useState(false);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
	const [applicationId, setApplicationId] = useState<string | null>(null);
	const [invoiceId, setInvoiceId] = useState<string | null>(null);
	const [uploadedAttachments, setUploadedAttachments] = useState<Record<string, UploadedAttachment>>({});
	const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

	const serviceFields = getServiceFields(service.slug);
	const storageKey = `quote_draft_${service.slug}`;

	const steps = isCheckoutFlow 
		? [
			t('steps.step1'),
			t('steps.step2'),
			t('steps.step3'),
			t('steps.step4Payment'), // New step
		]
		: [
			t('steps.step1'),
			t('steps.step2'),
			t('steps.step3'),
		];

	const fetchCustomerProfile = useCallback(
		async (userId: string) => {
			try {
				const { data, error } = await supabase
					.from('customers')
					.select('name, phone, email')
					.eq('id', userId)
					.maybeSingle();

				if (error) {
					console.error('Error fetching customer profile:', error);
					return;
				}

				if (data) {
					const profile = data as CustomerProfileData;
					setCustomerProfile({
						name: profile.name ?? null,
						email: profile.email ?? null,
						phone: profile.phone ?? null,
					});
				} else {
					setCustomerProfile(null);
				}
			} catch (error) {
				console.error('Error fetching customer profile:', error);
			}
		},
		[supabase]
	);

	useEffect(() => {
		let isMounted = true;

		const checkAuth = async () => {
			try {
				const { data, error } = await supabase.auth.getUser();
				if (!isMounted) return;

				if (error) {
					setAuthStatus('unauthenticated');
					setAuthUser(null);
					return;
				}

				if (data.user) {
					setAuthUser(data.user as User);
					setAuthStatus('authenticated');
				} else {
					setAuthUser(null);
					setAuthStatus('unauthenticated');
				}
			} catch (error) {
				if (isMounted) {
					console.error('Error checking auth status:', error);
					setAuthStatus('unauthenticated');
					setAuthUser(null);
				}
			}
		};

		checkAuth();

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!isMounted) return;

			if (session?.user) {
				setAuthUser(session.user as User);
				setAuthStatus('authenticated');
			} else {
				setAuthUser(null);
				setAuthStatus('unauthenticated');
			}
		});

		return () => {
			isMounted = false;
			listener?.subscription.unsubscribe();
		};
	}, [supabase]);

	useEffect(() => {
		if (authStatus === 'authenticated') {
			setAuthPromptMessage(null);
		} else if (authStatus === 'unauthenticated' && !authPromptMessage) {
			setAuthPromptMessage(signInPromptMessage);
		}
	}, [authStatus, signInPromptMessage, authPromptMessage]);

	useEffect(() => {
		if (!authUser) {
			setCustomerProfile(null);
			return;
		}

		fetchCustomerProfile(authUser.id);
	}, [authUser, fetchCustomerProfile]);

	useEffect(() => {
		if (!authUser && !customerProfile) {
			return;
		}

		setFormData((prev) => {
			let changed = false;
			const next = { ...prev };

			if (!prev.name && customerProfile?.name) {
				next.name = customerProfile.name;
				changed = true;
			}

			const fallbackEmail = customerProfile?.email || authUser?.email || '';
			if (!prev.email && fallbackEmail) {
				next.email = fallbackEmail;
				changed = true;
			}

			if (!prev.phone && customerProfile?.phone) {
				next.phone = customerProfile.phone;
				changed = true;
			}

			return changed ? next : prev;
		});
	}, [customerProfile, authUser]);

	useEffect(() => {
		setDraftInitialized(false);
		setApplicationId(null);
	}, [service.slug]);

	useEffect(() => {
		if (authStatus !== 'authenticated') {
			setApplicationId(null);
			setDraftInitialized(false);
		}
	}, [authStatus]);

	// Create draft application once authenticated
	useEffect(() => {
		if (authStatus !== 'authenticated' || draftInitialized) {
			return;
		}

		let mounted = true;

		const createDraft = async () => {
			const result = await createDraftApplication(service.slug, locale);

			if (!mounted) {
				return;
			}

			if (result.type === 'success' && result.applicationId) {
				setApplicationId(result.applicationId);
				setDraftInitialized(true);
				if (authUser && !customerProfile) {
					fetchCustomerProfile(authUser.id);
				}
			} else if (result.type === 'error') {
				if (result.message === authRequiredMessage) {
					setAuthStatus('unauthenticated');
					setAuthPromptMessage(result.message);
				}
				console.error('Failed to create draft application:', result.message);
				toast.error(result.message || t('toast.initFailed'));
			}
		};

		createDraft();

		return () => {
			mounted = false;
		};
	}, [authStatus, draftInitialized, service.slug, locale, authUser, customerProfile, fetchCustomerProfile, authRequiredMessage, t]);

	// Load saved data from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setFormData(parsed);
				setRestoredData(true);
				toast.success(t('toast.draftRestored'));
			} catch {
				// Invalid saved data, ignore
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storageKey]);

	// Auto-save to localStorage whenever formData changes
	useEffect(() => {
		if (Object.keys(formData).length > 0) {
			localStorage.setItem(storageKey, JSON.stringify(formData));
		}
	}, [formData, storageKey]);

	const resetFormState = () => {
		localStorage.removeItem(storageKey);
		formRef.current?.reset();
		setFormData({});
		setActiveStep(0);
		setRestoredData(false);
		setErrors({});
		setUploadedFiles({});
		setUploadedAttachments({});
		setUploadingFiles({});
		setApplicationId(null);
		setDraftInitialized(false);
		setInvoiceId(null);
	};

		const { mutate: send, isPending: isPendingQuote } = useMutation({
			mutationFn: submitQuoteRequest,
			onSuccess: (result) => {
				if (result.type === 'error') {
					analytics.trackError('submit_error', result.message);
					toast.error(result.message.toString());
					if (result.message === authRequiredMessage) {
						setAuthStatus('unauthenticated');
						setAuthPromptMessage(result.message);
					}
					return;
				}
				formAnalytics.completeForm(); // Track successful form completion
				toast.success(result.message.toString());
				resetFormState();
				const orderNumber = result.orderNumber ?? null;
				const confirmationUrl = orderNumber
					? `/confirmation?order=${encodeURIComponent(orderNumber)}`
					: '/confirmation';
				router.push(confirmationUrl);
			},
			onError(error) {
				analytics.trackError('submit_error', error.message);
				toast.error(error.message.toString());
				if (error.message === authRequiredMessage) {
					setAuthStatus('unauthenticated');
					setAuthPromptMessage(error.message);
				}
			},
		});

	const { mutate: sendCheckout, isPending: isCheckoutPending } = useMutation({
			mutationFn: async (data: FormData) => {
				const { submitCheckout } = await import('@/app/actions/submit-checkout');
				return submitCheckout(data);
			},
			onSuccess: (result) => {
				if (result.type === 'error') {
					if (result.message === authRequiredMessage) {
						setAuthStatus('unauthenticated');
						setAuthPromptMessage(result.message);
					}
					toast.error(result.message);
					return;
				}
				if (result.type === 'success' && result.invoiceId) {
					setInvoiceId(result.invoiceId);
					// Store orderNumber for later use
					if (result.orderNumber) {
						setFormData(prev => ({ ...prev, orderNumber: result.orderNumber! }));
					}
					// Move to payment step
					setActiveStep(3);
					toast.success(result.message);
				} else {
					toast.error(result.message);
				}
			},
			onError: (error: Error) => {
				const message = error.message || t('toast.submitFailed');
				toast.error(message);
				if (message === authRequiredMessage) {
					setAuthStatus('unauthenticated');
					setAuthPromptMessage(message);
				}
			},
		});

		const isPending = isCheckoutFlow ? isCheckoutPending : isPendingQuote;

	if (authStatus === 'checking') {
		return (
			<Card>
				<CardContent sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
					<CircularProgress />
				</CardContent>
			</Card>
		);
	}

	if (authStatus === 'unauthenticated') {
		return (
			<Card>
				<CardContent>
					<Stack spacing={3} alignItems="center" textAlign="center">
						<Typography variant="h5" fontWeight={600}>
							{t('title')}
						</Typography>
						<Alert severity="info" sx={{ width: '100%' }}>
							{authPromptMessage || signInPromptMessage}
						</Alert>
						<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%">
							<Button
								variant="contained"
								fullWidth
								onClick={() => router.push(loginRedirectUrl)}
							>
								{tAuthLogin('submit')}
							</Button>
							<Button
								variant="outlined"
								fullWidth
								onClick={() => router.push(registerRedirectUrl)}
							>
								{tAuthRegister('submit')}
							</Button>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		);
	}

	// Validation functions
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Enhanced phone validation with detailed error messages
	const validatePhoneWithMessage = (phone: string): { valid: boolean; error?: string } => {
		if (!phone || phone.trim().length === 0) {
			return { valid: false, error: t('validation.phoneRequired') };
		}
		
		// Remove all whitespace and special characters except + and digits
		const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
		
		// Must have at least some digits
		if (!/\d/.test(cleaned)) {
			return { 
				valid: false, 
				error: locale === 'ar' 
					? 'يرجى إدخال أرقام صحيحة' 
					: 'Please enter valid digits'
			};
		}
		
		// Extract digits only (for validation)
		let digitsOnly = cleaned.replace(/\D/g, '');
		
		// Check for wrong country code
		if (cleaned.startsWith('+') && !cleaned.startsWith('+970')) {
			const countryCode = cleaned.match(/^\+\d{1,3}/)?.[0];
			return { 
				valid: false, 
				error: locale === 'ar'
					? `رمز الدولة ${countryCode} غير صحيح. يجب أن يكون +970 للفلسطيني`
					: `Country code ${countryCode} is incorrect. Must be +970 for Palestinian numbers`
			};
		}
		
		// Handle international format: +970XXXXXXXXX
		if (cleaned.startsWith('+970')) {
			digitsOnly = digitsOnly.slice(3); // Remove 970
		}
		// Handle local format with country code: 970XXXXXXXXX (without +)
		else if (digitsOnly.startsWith('970') && digitsOnly.length >= 12) {
			digitsOnly = digitsOnly.slice(3); // Remove 970
		}
		// Handle local format: 0XXXXXXXXX
		else if (digitsOnly.startsWith('0') && digitsOnly.length >= 10) {
			digitsOnly = digitsOnly.slice(1); // Remove leading 0
		}
		// Handle direct format: 5XXXXXXXXX (already correct)
		
		// Check length
		if (digitsOnly.length < 9) {
			return { 
				valid: false, 
				error: locale === 'ar'
					? `الرقم قصير جداً (${digitsOnly.length} أرقام). يجب أن يكون 9 أرقام بعد إزالة رمز الدولة`
					: `Number is too short (${digitsOnly.length} digits). Must be 9 digits after removing country code`
			};
		}
		
		if (digitsOnly.length > 9) {
			return { 
				valid: false, 
				error: locale === 'ar'
					? `الرقم طويل جداً (${digitsOnly.length} أرقام). يجب أن يكون 9 أرقام بعد إزالة رمز الدولة`
					: `Number is too long (${digitsOnly.length} digits). Must be 9 digits after removing country code`
			};
		}
		
		// Palestinian mobile numbers: Must be 9 digits starting with 5[6-9]
		// Valid patterns: 56XXXXXXX, 57XXXXXXX, 58XXXXXXX, 59XXXXXXX
		if (!digitsOnly.startsWith('5')) {
			return { 
				valid: false, 
				error: locale === 'ar'
					? 'رقم الهاتف الفلسطيني يجب أن يبدأ بـ 5'
					: 'Palestinian mobile number must start with 5'
			};
		}
		
		// Check second digit (must be 6, 7, 8, or 9)
		const secondDigit = parseInt(digitsOnly[1]);
		if (secondDigit < 6 || secondDigit > 9) {
			return { 
				valid: false, 
				error: locale === 'ar'
					? `الرقم الثاني (${secondDigit}) غير صحيح. يجب أن يكون بين 6 و 9 (مثال: 56, 57, 58, 59)`
					: `Second digit (${secondDigit}) is invalid. Must be between 6 and 9 (e.g., 56, 57, 58, 59)`
			};
		}
		
		// All checks passed
		return { valid: true };
	};

	// Simple boolean validation for backward compatibility
	const validatePhone = (phone: string): boolean => {
		return validatePhoneWithMessage(phone).valid;
	};

	const validateStep = (step: number): boolean => {
		const newErrors: FieldErrors = {};

		if (step === 0) {
			// Step 1: Contact Information
			if (!formData.name || formData.name.trim().length < 2) {
				newErrors.name = t('validation.nameRequired');
			}
			if (!formData.email || !validateEmail(formData.email)) {
				newErrors.email = t('validation.emailRequired');
			}
			if (!formData.phone || !validatePhone(formData.phone)) {
				newErrors.phone = t('validation.phoneRequired');
			}
		} else if (step === 1) {
			// Step 2: Service Requirements
			// Validate service-specific required fields
			serviceFields.forEach((field) => {
				if (field.required) {
					if (field.type === 'file') {
						// For file fields, check if uploaded
						if (!uploadedAttachments[field.name]) {
							newErrors[field.name] = t('validation.fieldRequired', { field: field.label });
						}
					} else {
						// For other fields, check if value exists
						const value = formData[field.name];
						if (!value || (typeof value === 'string' && value.trim().length === 0)) {
							newErrors[field.name] = t('validation.fieldRequired', { field: field.label });
						}
						// Additional validation for specific field types
						if (field.type === 'email' && value && !validateEmail(value)) {
							newErrors[field.name] = t('validation.emailInvalid');
						}
						if (field.type === 'tel' && value && !validatePhone(value)) {
							newErrors[field.name] = t('validation.phoneInvalid');
						}
					}
				}
			});

			// Validate shipping fields for checkout flow
			if (isCheckoutFlow) {
				if (!formData.shipping_location) {
					newErrors.shipping_location = t('validation.shippingLocationRequired');
				}
				if (!formData.delivery_type) {
					newErrors.delivery_type = t('validation.deliveryTypeRequired');
				}
				if (formData.delivery_type === 'multiple') {
					const deliveryCount = parseInt(formData.delivery_count || '0', 10);
					if (!formData.delivery_count || deliveryCount < 2) {
						newErrors.delivery_count = t('validation.deliveryCountRequired');
					}
				}
			}

			// Details field is optional, so no validation needed
		} else if (step === 2) {
			// Step 3: Review - Final validation
			// Re-validate critical fields
			if (!formData.name || formData.name.trim().length < 2) {
				newErrors.name = t('validation.nameRequired');
			}
			if (!formData.email || !validateEmail(formData.email)) {
				newErrors.email = t('validation.emailRequired');
			}
			if (!formData.phone || !validatePhone(formData.phone)) {
				newErrors.phone = t('validation.phoneRequired');
			}
			// Details field is optional, so no validation needed
			
			// Check required documents (blocking validation)
			if (service.requiredDocuments && service.requiredDocuments.length > 0) {
				const uploadedFileNames = Object.values(uploadedAttachments).map(att => 
					att.fileName.toLowerCase()
				);
				
				const missingDocs = service.requiredDocuments.filter(doc => {
					const docKeywords = doc.toLowerCase().split(/\s+/);
					return !uploadedFileNames.some(fileName => 
						docKeywords.some(keyword => fileName.includes(keyword))
					);
				});

				// Block submission if any required documents are missing
				if (missingDocs.length > 0) {
					newErrors.requiredDocuments = t('validation.documentsRequired', { 
						documents: missingDocs.join(', ') 
					});
				}
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep(activeStep)) {
			if (activeStep < steps.length - 1) {
				const nextStep = activeStep + 1;
				setActiveStep(nextStep);
				setErrors({}); // Clear errors when moving to next step
				formAnalytics.trackStep(nextStep, steps[nextStep]);
			}
		} else {
			toast.error(t('validation.fixErrors'));
			// Track validation errors
			Object.keys(errors).forEach(fieldName => {
				formAnalytics.trackValidationError(fieldName, errors[fieldName]);
			});
		}
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
		setErrors({}); // Clear errors when going back
	};

	const handleFieldChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		
		// Real-time validation for Step 1 fields
		if (activeStep === 0) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				
				if (name === 'name') {
					if (!value || value.trim().length < 2) {
						newErrors.name = t('validation.nameRequired');
					} else {
						delete newErrors.name;
					}
				} else if (name === 'email') {
					if (!value || !validateEmail(value)) {
						newErrors.email = t('validation.emailInvalid');
					} else {
						delete newErrors.email;
					}
				} else if (name === 'phone') {
					if (!value || !validatePhone(value)) {
						newErrors.phone = t('validation.phoneInvalid');
					} else {
						delete newErrors.phone;
					}
				}
				
				return newErrors;
			});
		} else if (activeStep === 1) {
			// Real-time validation for Step 2 fields
			setErrors((prev) => {
				const newErrors = { ...prev };
				
				// Details field is optional, so no validation needed
				// Remove details from errors if present
				delete newErrors.details;
				
				// For service-specific fields, check if required
				const field = serviceFields.find(f => f.name === name);
				if (field && field.required) {
					if (field.type === 'file') {
						// File validation handled separately
					} else {
						if (!value || (typeof value === 'string' && value.trim().length === 0)) {
							const fieldLabel = locale === 'ar' && field.label_ar ? field.label_ar : field.label;
							newErrors[name] = t('validation.fieldRequired', { field: fieldLabel });
						} else {
							delete newErrors[name];
						}
					}
				} else {
					// Clear error if field is not required or has value
					delete newErrors[name];
				}
				
				return newErrors;
			});
		} else {
			// Clear error for other fields when user starts typing
			if (errors[name]) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[name];
					return newErrors;
				});
			}
		}
		
		// Track field interaction
		formAnalytics.trackFieldFocus(name);
	};

	const handleFileChange = async (fieldName: string, file: File | null) => {
		if (file) {
			// Validate file size
			if (file.size > MAX_FILE_SIZE) {
				setErrors((prev) => ({
					...prev,
					[fieldName]: t('fileUpload.fileSizeError', { 
						maxSize: (MAX_FILE_SIZE / 1024 / 1024).toFixed(0),
						currentSize: (file.size / 1024 / 1024).toFixed(2)
					}),
				}));
				return;
			}

			// Store file locally for preview
			setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
			setFormData((prev) => ({ ...prev, [fieldName]: file.name }));

			// Upload immediately if we have an application ID
			if (applicationId) {
				setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
				
				try {
					const result = await uploadFileImmediately(applicationId, fieldName, file, locale);
					
					if (result.type === 'success' && result.attachmentId && result.storagePath) {
						const attachment: UploadedAttachment = {
							id: result.attachmentId,
							storagePath: result.storagePath,
							fileName: file.name,
							fileSize: file.size,
						};
						setUploadedAttachments((prev) => ({
							...prev,
							[fieldName]: attachment,
						}));
						// Clear any errors for this field
						setErrors((prev) => {
							const newErrors = { ...prev };
							delete newErrors[fieldName];
							return newErrors;
						});
						toast.success(t('toast.fileUploaded', { fileName: file.name }));
						// Track successful file upload
						analytics.trackFileUpload(file.name, file.size, true);
					} else {
						toast.error(result.message || t('toast.uploadFailed'));
						// Track failed file upload
						analytics.trackFileUpload(file.name, file.size, false);
						setErrors((prev) => ({
							...prev,
							[fieldName]: result.message || t('toast.uploadFailed'),
						}));
					}
				} catch (error) {
					console.error('Error uploading file:', error);
					toast.error(t('toast.uploadError'));
					// Track failed file upload
					analytics.trackFileUpload(file.name, file.size, false);
					setErrors((prev) => ({
						...prev,
						[fieldName]: t('toast.uploadError'),
					}));
				} finally {
					setUploadingFiles((prev) => {
						const newState = { ...prev };
						delete newState[fieldName];
						return newState;
					});
				}
			} else {
				// No application ID yet - wait for it
				toast.loading(t('toast.initializing'));
			}

			// Clear error
			if (errors[fieldName]) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[fieldName];
					return newErrors;
				});
			}
		}
	};

	const handleRemoveFile = async (fieldName: string) => {
		const attachment = uploadedAttachments[fieldName];
		
		// Delete from storage if already uploaded
		if (attachment) {
			try {
				const result = await deleteUploadedFile(attachment.id, attachment.storagePath, locale);
				if (result.type === 'error') {
					toast.error(t('toast.removeFailed'));
					return;
				}
			} catch (error) {
				console.error('Error deleting file:', error);
				toast.error(t('toast.removeError'));
				return;
			}
		}

		// Remove from state
		setUploadedAttachments((prev) => {
			const newState = { ...prev };
			delete newState[fieldName];
			return newState;
		});
		setUploadedFiles((prev) => {
			const newFiles = { ...prev };
			delete newFiles[fieldName];
			return newFiles;
		});
		setFormData((prev) => {
			const newData = { ...prev };
			delete newData[fieldName];
			return newData;
		});
		
		// Set error if field is required (only in Step 2)
		if (activeStep === 1) {
			const field = serviceFields.find(f => f.name === fieldName);
			if (field && field.required) {
				const fieldLabel = locale === 'ar' && field.label_ar ? field.label_ar : field.label;
				setErrors((prev) => ({
					...prev,
					[fieldName]: t('validation.fieldRequired', { field: fieldLabel }),
				}));
			} else {
				// Clear error if field is not required
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[fieldName];
					return newErrors;
				});
			}
		}
	};

	const handleClearForm = () => {
		if (window.confirm(t('toast.clearConfirm'))) {
			resetFormState();
			toast.success(t('toast.formCleared'));
		}
	};

	const handlePaymentSuccess = () => {
		// Redirect to confirmation page
		const orderNumber = formData.orderNumber || null;
		const confirmationUrl = orderNumber
			? `/${locale}/confirmation?order=${encodeURIComponent(orderNumber)}`
			: `/${locale}/confirmation`;
		router.push(confirmationUrl);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Final validation on all steps
		let isValid = true;
		for (let step = 0; step < steps.length; step++) {
			if (!validateStep(step)) {
				isValid = false;
				// Jump to first step with errors
				setActiveStep(step);
				break;
			}
		}

		if (!isValid) {
			toast.error(t('validation.fixErrorsSubmit'));
			return;
		}

		if (!applicationId) {
			toast.error(t('toast.formInitializing'));
			return;
		}

		const formElement = formRef.current;
		if (!formElement) return;

		const data = new FormData(formElement);

		// Add application ID for draft update
		data.set('applicationId', applicationId);
		
		// Add locale for server-side translations
		data.set('locale', locale);

		// Add all form fields (including service-specific ones)
		Object.keys(formData).forEach(key => {
			if (formData[key] && key !== 'applicationId') {
				data.set(key, formData[key]);
			}
		});

		// Files are already uploaded, so we don't need to add them to FormData
		// The server action will fetch attachments using applicationId

		if (isCheckoutFlow) {
			// Checkout flow: submit checkout, then move to payment step
			sendCheckout(data);
		} else {
			// Quote flow: submit quote request, then redirect
			send(data);
		}
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<Step1Content
						formData={formData}
						onChange={handleFieldChange}
						errors={errors}
						setErrors={setErrors}
						validatePhone={validatePhone}
						validatePhoneWithMessage={validatePhoneWithMessage}
						validateEmail={validateEmail}
					/>
				);
			case 1:
				return (
					<Step2Content
						serviceFields={serviceFields}
						formData={formData}
						onChange={handleFieldChange}
						errors={errors}
						uploadedFiles={uploadedFiles}
						uploadedAttachments={uploadedAttachments}
						uploadingFiles={uploadingFiles}
						onFileChange={handleFileChange}
						onRemoveFile={handleRemoveFile}
						isCheckoutFlow={isCheckoutFlow}
					/>
				);
			case 2:
				return (
					<Step3Content
						service={service}
						serviceFields={serviceFields}
						formData={formData}
						uploadedFiles={uploadedFiles}
						uploadedAttachments={uploadedAttachments}
						isCheckoutFlow={isCheckoutFlow}
						errors={errors}
					/>
				);
			case 3:
				// Only for checkout flow
				if (isCheckoutFlow && invoiceId) {
					return (
						<Step4PaymentContent
							invoiceId={invoiceId}
							amount={service.pricing?.amount || 0}
							currency="ILS"
							onPaymentSuccess={handlePaymentSuccess}
						/>
					);
				}
				return null;
			default:
				return null;
		}
	};

	const progress = Math.round(((activeStep + 1) / steps.length) * 100);
	
	
	const canContinue =
		activeStep === 0
			? Boolean(
					formData.name &&
					formData.name.trim().length >= 2 &&
					formData.email &&
					validateEmail(formData.email) &&
					formData.phone &&
					validatePhone(formData.phone)
				)
			: activeStep === 1
				? Boolean(
					// Check all required service fields (details is optional, so not included)
					serviceFields.every(field => {
						if (!field.required) return true;
						if (field.type === 'file') {
							return !!uploadedAttachments[field.name];
						}
						const value = formData[field.name];
						return value && (typeof value !== 'string' || value.trim().length > 0);
					})
				)
				: activeStep === 3
					? true // Step 4 (Payment) - PaymentFlow handles its own validation
					: true;

	return (
		<Box sx={{ 
			maxWidth: '672px', 
			mx: 'auto', 
			p: { xs: 2, sm: 3 },
			width: '100%'
		}}>
			<form ref={formRef} onSubmit={handleSubmit}>
				{/* Hidden service field */}
				<input type="hidden" name="service" value={service.slug} />
				{applicationId && <input type="hidden" name="applicationId" value={applicationId} />}

				{/* Header Section */}
				<Box sx={{ mb: { xs: 2, sm: 3 }, direction: isRTL ? 'rtl' : 'ltr' }}>
					{/* Progress bar */}
					<Box sx={{ mb: 2, position: 'relative' }}>
						<LinearProgress 
							variant="determinate" 
							value={progress} 
							sx={{ 
								height: 8, 
								borderRadius: 2,
								bgcolor: 'action.disabledBackground',
								...(isRTL && {
									transform: 'scaleX(-1)',
								}),
								'& .MuiLinearProgress-bar': {
									borderRadius: 2,
									background: isRTL 
										? 'linear-gradient(270deg, primary.main 0%, primary.dark 100%)'
										: 'linear-gradient(90deg, primary.main 0%, primary.dark 100%)',
									...(isRTL && {
										transform: 'scaleX(-1)',
									}),
								}
							}} 
						/>
					</Box>
					{/* Step Indicators */}
					<Box sx={{ position: 'relative', width: '100%' }}>
						{/* Connecting Lines - Behind icons */}
						<Box
							sx={{
								position: 'absolute',
								top: { xs: 16, sm: 18 },
								left: 0,
								right: 0,
								height: 2,
								bgcolor: 'divider',
								zIndex: 0, // Behind the icons
								...(isRTL && {
									transform: 'scaleX(-1)',
								}),
							}}
						>
							<Box
								sx={{
									height: '100%',
									bgcolor: 'primary.main',
									width: `${(activeStep / (steps.length - 1)) * 100}%`,
									transition: 'width 0.3s ease',
									...(isRTL && {
										transform: 'scaleX(-1)',
										marginLeft: 'auto',
									}),
								}}
							/>
						</Box>
						{/* Step Icons - In front of line */}
						<Stack 
							direction={isRTL ? 'row-reverse' : 'row'} 
							spacing={0} 
							sx={{ 
								justifyContent: 'space-between',
								position: 'relative',
								zIndex: 2, // In front of the line
							}}
						>
							{steps.map((label, index) => (
								<Box
									key={label}
									onClick={() => {
										if (index <= activeStep) {
											setActiveStep(index);
										}
									}}
									sx={{
										flex: 1,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										cursor: index <= activeStep ? 'pointer' : 'default',
										opacity: index > activeStep ? 0.4 : 1,
										transition: 'opacity 0.2s',
										position: 'relative',
										zIndex: 2, // Ensure each icon is in front
									}}
								>
									<Box
										sx={{
											width: { xs: 32, sm: 36 },
											height: { xs: 32, sm: 36 },
											borderRadius: '50%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											bgcolor: index < activeStep 
												? 'success.main' 
												: index === activeStep 
													? 'primary.main' 
													: 'action.disabledBackground',
											color: index <= activeStep ? 'primary.contrastText' : 'text.disabled',
											fontWeight: 700,
											fontSize: { xs: '0.75rem', sm: '0.8125rem' },
											mb: 0.75,
											transition: 'all 0.3s ease',
											border: index === activeStep ? '3px solid' : 'none',
											borderColor: index === activeStep ? 'primary.light' : 'transparent',
											boxShadow: index === activeStep 
												? '0 0 0 4px rgba(25, 118, 210, 0.1)' 
												: 'none',
											position: 'relative',
											zIndex: 2, // Ensure circle is in front of line
										}}
									>
										{index < activeStep ? (
											<IconCheck size={16} />
										) : (
											index + 1
										)}
									</Box>
									<Typography
										variant="caption"
										sx={{
											fontSize: { xs: '0.6875rem', sm: '0.75rem' },
											fontWeight: index === activeStep ? 700 : 500,
											color: index === activeStep ? 'primary.main' : 'text.secondary',
											textAlign: 'center',
											lineHeight: 1.3,
										}}
									>
										{label}
									</Typography>
								</Box>
							))}
						</Stack>
					</Box>
				</Box>

				{/* Content Card */}
				<Box sx={{ 
					p: { xs: 2, sm: 3 }, 
					mb: 0,
					borderRadius: 2,
					boxShadow: 2,
					bgcolor: 'background.paper',
					maxHeight: { xs: 'calc(100vh - 380px)', sm: 'calc(100vh - 400px)', md: '600px' },
					overflowY: 'auto',
					overflowX: 'hidden',
					'&::-webkit-scrollbar': {
						width: '6px',
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'rgba(0,0,0,0.2)',
						borderRadius: '3px',
						'&:hover': {
							background: 'rgba(0,0,0,0.3)',
						},
					},
				}}>
					<Stack spacing={2}>
						{/* Restored Data Alert */}
						{restoredData && (
							<Alert
								severity="success"
								sx={{ borderRadius: 2 }}
								action={
									<Tooltip title="Clear saved draft">
										<IconButton size="small" onClick={handleClearForm}>
											<IconX size={18} />
										</IconButton>
									</Tooltip>
								}
							>
								{t('draftRestored')}
							</Alert>
						)}
						{/* Step Content */}
						{renderStepContent(activeStep)}
					</Stack>
				</Box>

				{/* Navigation */}
				{activeStep !== 3 && ( // Hide navigation on Step 4 (Payment) - PaymentFlow handles its own navigation
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						spacing={{ xs: 1, sm: 2 }}
						sx={{ mt: { xs: 2, sm: 3 } }}
					>
						{activeStep > 0 ? (
							<Button
								variant="outlined"
								onClick={handleBack}
								startIcon={isRTL ? <IconArrowRight size={18} /> : <IconArrowLeft size={18} />}
								disabled={isPending}
							>
								{t('back')}
							</Button>
						) : (
							<Box />
						)}
						<Box sx={{ flexGrow: 1 }} />
						{activeStep < steps.length - 1 ? (
							<Button
								variant="contained"
								onClick={handleNext}
								endIcon={isRTL ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
								size="large"
								disabled={!canContinue}
							>
								{t('continue')}
							</Button>
						) : activeStep === 2 && isCheckoutFlow ? (
							<Button
								type="submit"
								variant="contained"
								disabled={isPending}
								startIcon={<IconCreditCard size={18} />}
								size="large"
							>
								{isPending ? t('checkout.processing') : t('checkout.payNow')}
							</Button>
						) : (
							<Button
								type="submit"
								variant="contained"
								disabled={isPending}
								startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <IconCheck size={18} />}
								size="large"
							>
								{isPending ? t('submitting') : t('submitRequest')}
							</Button>
						)}
					</Stack>
				)}
			</form>
		</Box>
	);
}

// Step 1: Contact Information
function Step1Content({
	formData,
	onChange,
	errors,
	setErrors,
	validatePhone,
	validatePhoneWithMessage,
	validateEmail,
}: {
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
	errors: FieldErrors;
	setErrors: (errors: FieldErrors | ((prev: FieldErrors) => FieldErrors)) => void;
	validatePhone: (phone: string) => boolean;
	validatePhoneWithMessage: (phone: string) => { valid: boolean; error?: string };
	validateEmail: (email: string) => boolean;
}) {
	const t = useTranslations('Quote.wizard');
	const locale = useLocale() as 'en' | 'ar';
	const isRTL = locale === 'ar';
	
	return (
		<Stack spacing={2}>
			<Box>
				<Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
					{t('step1Title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{t('step1Subtitle') || (locale === 'ar' 
						? 'نحتاج إلى معلومات الاتصال الخاصة بك للتواصل معك بشأن طلبك'
						: 'We need your contact information to reach out about your request')}
				</Typography>
			</Box>

			<Stack spacing={2}>
					<FormControl required fullWidth error={!!errors.name}>
						<FormLabel htmlFor="name" sx={{ position: 'relative', mb: 1, [isRTL ? 'pl' : 'pr']: 3 }}>
							{t('fullName')}
							{formData.name && formData.name.trim().length >= 2 && !errors.name && (
								<Box 
									component="span" 
									sx={{ 
										position: 'absolute',
										[isRTL ? 'left' : 'right']: 0,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'success.main',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<IconCheck size={16} />
								</Box>
							)}
						</FormLabel>
					<OutlinedInput
						id="name"
						name="name"
						value={formData.name || ''}
						onChange={(e) => onChange('name', e.target.value)}
						error={!!errors.name}
						autoComplete="name"
						sx={{ 
							bgcolor: 'background.paper',
							'&:hover': {
								bgcolor: 'action.hover',
							}
						}}
					/>
					{errors.name && <FormHelperText error sx={{ mt: 0.5 }}>{errors.name}</FormHelperText>}
				</FormControl>

				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<FormControl required fullWidth error={!!errors.email}>
						<FormLabel htmlFor="email" sx={{ position: 'relative', mb: 1, [isRTL ? 'pl' : 'pr']: 3 }}>
							{t('emailAddress')}
							{formData.email && validateEmail(formData.email) && !errors.email && (
								<Box 
									component="span" 
									sx={{ 
										position: 'absolute',
										[isRTL ? 'left' : 'right']: 0,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'success.main',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<IconCheck size={16} />
								</Box>
							)}
						</FormLabel>
						<OutlinedInput
							id="email"
							name="email"
							type="email"
							value={formData.email || ''}
							onChange={(e) => onChange('email', e.target.value)}
							error={!!errors.email}
							autoComplete="email"
							sx={{ 
								bgcolor: 'background.paper',
								'&:hover': {
									bgcolor: 'action.hover',
								}
							}}
						/>
						{errors.email && <FormHelperText error sx={{ mt: 0.5 }}>{errors.email}</FormHelperText>}
					</FormControl>

					<FormControl required fullWidth error={!!errors.phone}>
						<FormLabel htmlFor="phone" sx={{ position: 'relative', mb: 1, [isRTL ? 'pl' : 'pr']: 3 }}>
							{t('phoneNumber')}
							{formData.phone && validatePhone(formData.phone) && !errors.phone && (
								<Box 
									component="span" 
									sx={{ 
										position: 'absolute',
										[isRTL ? 'left' : 'right']: 0,
										top: '50%',
										transform: 'translateY(-50%)',
										color: 'success.main',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<IconCheck size={16} />
								</Box>
							)}
						</FormLabel>
							<OutlinedInput
								id="phone"
								name="phone"
								type="tel"
								placeholder={locale === 'ar' ? "0592123456" : "0592123456"}
								value={formData.phone || ''}
								onChange={(e) => {
									const value = e.target.value;
									onChange('phone', value);
									
									// Real-time validation
									if (value && value.trim().length > 0) {
										const validation = validatePhoneWithMessage(value);
										if (!validation.valid && validation.error) {
											setErrors((prev) => ({
												...prev,
												phone: validation.error,
											}));
										} else {
											// Clear error if valid
											setErrors((prev) => {
												const newErrors = { ...prev };
												delete newErrors.phone;
												return newErrors;
											});
										}
									} else {
										// Clear error if empty
										setErrors((prev) => {
											const newErrors = { ...prev };
											delete newErrors.phone;
											return newErrors;
										});
									}
								}}
								error={!!errors.phone}
								autoComplete="tel"
								inputMode="tel"
								sx={{ 
									bgcolor: 'background.paper',
									'&:hover': {
										bgcolor: 'action.hover',
									}
								}}
							/>
							{errors.phone ? (
								<FormHelperText error sx={{ mt: 0.5 }}>{errors.phone}</FormHelperText>
							) : formData.phone && validatePhone(formData.phone) ? (
								<FormHelperText sx={{ mt: 0.5, color: 'success.main' }}>
									{locale === 'ar' 
										? '✓ رقم هاتف صحيح'
										: '✓ Valid phone number'}
								</FormHelperText>
							) : (
								<FormHelperText sx={{ mt: 0.5 }}>
									{locale === 'ar' 
										? 'يمكنك إدخال الرقم مع أو بدون مسافات. مثال: 0592123456 أو +970592123456'
										: 'You can enter the number with or without spaces. Example: 0592123456 or +970592123456'}
								</FormHelperText>
							)}
					</FormControl>
				</Stack>
			</Stack>
		</Stack>
	);
}

// Step 2: Service-Specific Requirements
function Step2Content({
	serviceFields,
	formData,
	onChange,
	errors,
	uploadedFiles,
	uploadedAttachments,
	uploadingFiles,
	onFileChange,
	onRemoveFile,
	isCheckoutFlow = false,
}: {
	serviceFields: FormField[];
	formData: Record<string, string>;
	onChange: (name: string, value: string) => void;
	errors: FieldErrors;
	uploadedFiles: Record<string, File>;
	uploadedAttachments: Record<string, UploadedAttachment>;
	uploadingFiles: Record<string, boolean>;
	onFileChange: (fieldName: string, file: File | null) => void;
	onRemoveFile: (fieldName: string) => void;
	isCheckoutFlow?: boolean;
}) {
	const t = useTranslations('Quote.wizard');
	const locale = useLocale() as 'en' | 'ar';
	
	const renderField = (field: FormField) => {
		const commonProps = {
			id: field.name,
			name: field.name,
			required: field.required ?? false,
		};

		// Get locale-specific labels and text
		const fieldLabel = locale === 'ar' && field.label_ar ? field.label_ar : field.label;
		const fieldPlaceholder = locale === 'ar' && field.placeholder_ar ? field.placeholder_ar : field.placeholder;
		const fieldHelperText = locale === 'ar' && field.helperText_ar ? field.helperText_ar : field.helperText;
		const fieldOptions = locale === 'ar' && field.options_ar ? field.options_ar : field.options;

		// Helper function to render label with optional indicator
		const renderLabel = (label: string, required?: boolean) => {
			if (required) {
				return label;
			}
			return (
				<>
					{label} <Typography component="span" variant="caption" color="text.secondary">({t('optional')})</Typography>
				</>
			);
		};

		switch (field.type) {
			case 'select':
				return (
					<FormControl required={field.required} fullWidth key={field.name} error={!!errors[field.name]}>
						<FormLabel htmlFor={field.name}>{renderLabel(fieldLabel, field.required)}</FormLabel>
						<Select
							{...commonProps}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
							error={!!errors[field.name]}
						>
							<MenuItem value="" disabled>
								{t('selectOption')}
							</MenuItem>
							{fieldOptions?.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
						{errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
						{!errors[field.name] && fieldHelperText && (
							<FormHelperText>{fieldHelperText}</FormHelperText>
						)}
					</FormControl>
				);

			case 'textarea':
				return (
					<FormControl required={field.required} fullWidth key={field.name} error={!!errors[field.name]}>
						<FormLabel htmlFor={field.name}>{renderLabel(fieldLabel, field.required)}</FormLabel>
						<OutlinedInput
							{...commonProps}
							multiline
							rows={3}
							placeholder={fieldPlaceholder}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
							error={!!errors[field.name]}
						/>
						{errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
						{!errors[field.name] && fieldHelperText && (
							<FormHelperText>{fieldHelperText}</FormHelperText>
						)}
					</FormControl>
				);

			case 'file':
				const isUploading = uploadingFiles[field.name];
				const isUploaded = !!uploadedAttachments[field.name];
				return (
					<Box key={field.name}>
						<FileUploadField
							label={fieldLabel}
							name={field.name}
							value={uploadedFiles[field.name] || null}
							onChange={(file) => onFileChange(field.name, file)}
							onRemove={() => onRemoveFile(field.name)}
							error={errors[field.name]}
							helperText={fieldHelperText}
							accept={fieldHelperText?.includes('PDF') ? '.pdf,.jpg,.jpeg,.png,.doc,.docx' : '.pdf,.jpg,.jpeg,.png,.doc,.docx'}
							maxSize={fieldHelperText?.includes('5MB') ? 5 * 1024 * 1024 : 10 * 1024 * 1024}
							required={field.required}
							disabled={isUploading}
						/>
						{isUploading && (
							<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<CircularProgress size={16} />
								<Typography variant="caption" color="text.secondary">
									{t('uploading')}
								</Typography>
							</Box>
						)}
						{isUploaded && !isUploading && (
							<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconCheck size={16} color="success" />
								<Typography variant="caption" color="success.main">
									{t('uploadedSuccessfully')}
								</Typography>
							</Box>
						)}
					</Box>
				);

			case 'date':
				return (
					<LocalizationProvider dateAdapter={AdapterDateFns} key={field.name}>
						<FormControl fullWidth required={field.required} error={!!errors[field.name]}>
							<FormLabel htmlFor={field.name}>{renderLabel(fieldLabel, field.required)}</FormLabel>
							<DatePicker
								value={formData[field.name] ? new Date(formData[field.name]) : null}
								onChange={(newValue) => {
									if (newValue) {
										onChange(field.name, newValue.toISOString().split('T')[0]);
									} else {
										onChange(field.name, '');
									}
								}}
								slotProps={{
									textField: {
										error: !!errors[field.name],
										helperText: errors[field.name] || fieldHelperText,
									},
								}}
								sx={{ mt: 1 }}
							/>
						</FormControl>
					</LocalizationProvider>
				);

			default:
				return (
					<FormControl required={field.required} fullWidth key={field.name} error={!!errors[field.name]}>
						<FormLabel htmlFor={field.name}>{renderLabel(fieldLabel, field.required)}</FormLabel>
						<OutlinedInput
							{...commonProps}
							type={field.type}
							placeholder={fieldPlaceholder}
							value={formData[field.name] || ''}
							onChange={(e) => onChange(field.name, e.target.value)}
							error={!!errors[field.name]}
						/>
						{errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
						{!errors[field.name] && fieldHelperText && (
							<FormHelperText>{fieldHelperText}</FormHelperText>
						)}
					</FormControl>
				);
		}
	};

	return (
		<Stack spacing={2}>
			<Box>
				<Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
					{t('step2Title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{t('step2Subtitle') || (locale === 'ar' 
						? 'يرجى تقديم التفاصيل والمستندات المطلوبة للخدمة'
						: 'Please provide the required details and documents for the service')}
				</Typography>
			</Box>

			<Stack spacing={2}>

				{/* Service-Specific Fields */}
				{serviceFields.length > 0 && (
					<>
						{serviceFields.map((field) => renderField(field))}
						<Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} /> {/* Divider */}
					</>
				)}

				{/* Service Urgency */}
				<FormControl required>
					<FormLabel htmlFor="urgency">{t('serviceUrgency')}</FormLabel>
					<Select
						id="urgency"
						name="urgency"
						defaultValue="standard"
						required
						value={formData.urgency || 'standard'}
						onChange={(e) => onChange('urgency', e.target.value)}
					>
						<MenuItem value="standard">{t('urgencyOptions.standard')}</MenuItem>
						<MenuItem value="express">{t('urgencyOptions.express')}</MenuItem>
						<MenuItem value="urgent">{t('urgencyOptions.urgent')}</MenuItem>
					</Select>
				</FormControl>

				{/* Shipping Information - Only in Checkout Flow */}
				{isCheckoutFlow && (
					<>
						<Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} />
						<Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
							{t('shippingInformation')}
						</Typography>
						
						{/* Shipping Location */}
						<FormControl required error={!!errors.shipping_location}>
							<FormLabel htmlFor="shipping_location">{t('shippingLocation')}</FormLabel>
							<Select
								id="shipping_location"
								name="shipping_location"
								required
								value={formData.shipping_location || ''}
								onChange={(e) => onChange('shipping_location', e.target.value)}
								error={!!errors.shipping_location}
							>
								<MenuItem value="west_bank">{getShippingLocationLabel('west_bank', locale)}</MenuItem>
								<MenuItem value="jerusalem">{getShippingLocationLabel('jerusalem', locale)}</MenuItem>
								<MenuItem value="area_48">{getShippingLocationLabel('area_48', locale)}</MenuItem>
								<MenuItem value="international">{getShippingLocationLabel('international', locale)}</MenuItem>
							</Select>
							{errors.shipping_location && <FormHelperText error>{errors.shipping_location}</FormHelperText>}
						</FormControl>

						{/* Delivery Type */}
						<FormControl required error={!!errors.delivery_type}>
							<FormLabel htmlFor="delivery_type">{t('deliveryType')}</FormLabel>
							<Select
								id="delivery_type"
								name="delivery_type"
								required
								value={formData.delivery_type || ''}
								onChange={(e) => {
									onChange('delivery_type', e.target.value);
									// Reset delivery_count when switching to single
									if (e.target.value === 'single') {
										onChange('delivery_count', '1');
									} else if (e.target.value === 'multiple' && !formData.delivery_count) {
										onChange('delivery_count', '2');
									}
								}}
								error={!!errors.delivery_type}
							>
								<MenuItem value="single">{getDeliveryTypeLabel('single', locale)}</MenuItem>
								<MenuItem value="multiple">{getDeliveryTypeLabel('multiple', locale)}</MenuItem>
							</Select>
							{errors.delivery_type && <FormHelperText error>{errors.delivery_type}</FormHelperText>}
						</FormControl>

						{/* Delivery Count - Only for Multiple Deliveries */}
						{formData.delivery_type === 'multiple' && (
							<FormControl required error={!!errors.delivery_count}>
								<FormLabel htmlFor="delivery_count">{t('deliveryCount')}</FormLabel>
								<OutlinedInput
									id="delivery_count"
									name="delivery_count"
									type="number"
									required
									inputProps={{ min: 2 }}
									value={formData.delivery_count || '2'}
									onChange={(e) => onChange('delivery_count', e.target.value)}
									error={!!errors.delivery_count}
								/>
								<FormHelperText>{t('deliveryCountHelper')}</FormHelperText>
								{errors.delivery_count && <FormHelperText error>{errors.delivery_count}</FormHelperText>}
							</FormControl>
						)}
					</>
				)}

				<Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} /> {/* Divider for optional fields */}

				{/* Optional Fields */}
				<FormControl error={!!errors.details}>
					<FormLabel htmlFor="details">
						{t('additionalDetails')} <Typography component="span" variant="caption" color="text.secondary">({t('optional') || 'Optional'})</Typography>
					</FormLabel>
					<OutlinedInput
						id="details"
						name="details"
						multiline
						rows={3}
						placeholder={t('detailsPlaceholder')}
						value={formData.details || ''}
						onChange={(e) => onChange('details', e.target.value)}
						error={!!errors.details}
					/>
					{errors.details && <FormHelperText error>{errors.details}</FormHelperText>}
				</FormControl>

				<FormControl>
					<FormLabel htmlFor="message">{t('additionalNotes')}</FormLabel>
					<OutlinedInput
						id="message"
						name="message"
						multiline
						rows={2}
						placeholder={t('notesPlaceholder')}
						value={formData.message || ''}
						onChange={(e) => onChange('message', e.target.value)}
					/>
				</FormControl>
			</Stack>
		</Stack>
	);
}

// Step 3: Review & Submit
function Step3Content({
	service,
	serviceFields,
	formData,
	uploadedFiles,
	uploadedAttachments,
	isCheckoutFlow = false,
	errors,
}: {
	service: Service;
	serviceFields: FormField[];
	formData: Record<string, string>;
	uploadedFiles: Record<string, File>;
	uploadedAttachments: Record<string, UploadedAttachment>;
	isCheckoutFlow?: boolean;
	errors: FieldErrors;
}) {
	const t = useTranslations('Quote.wizard');
	const tCheckout = useTranslations('Quote.checkout');
	const locale = useLocale() as 'en' | 'ar';
	
	// Collect all uploaded files - prefer uploadedAttachments (successfully uploaded) over uploadedFiles (local)
	const allUploadedAttachments = Object.values(uploadedAttachments);
	const allUploadedFiles = Object.values(uploadedFiles).filter((file): file is File => file instanceof File);
	// Use uploadedAttachments count if available, otherwise fall back to uploadedFiles
	const totalUploadedCount = allUploadedAttachments.length > 0 ? allUploadedAttachments.length : allUploadedFiles.length;
	const urgency = (formData.urgency || 'standard') as 'standard' | 'express' | 'urgent';

	// Calculate shipping costs for checkout flow
	const shippingAmount = isCheckoutFlow && formData.shipping_location && formData.delivery_type
		? calculateShippingRate({
			location: formData.shipping_location as ShippingLocation,
			deliveryType: formData.delivery_type as DeliveryType,
			deliveryCount: formData.delivery_type === 'multiple' ? parseInt(formData.delivery_count || '2', 10) : 1,
		})
		: 0;

	const serviceAmount = service.pricing?.amount || 0;
	const totalAmount = serviceAmount + shippingAmount;

	return (
		<Stack spacing={2}>
			<Box>
				<Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
					{isCheckoutFlow ? tCheckout('step3Title') : t('step3Title')}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{isCheckoutFlow ? tCheckout('reviewSubtitle') : t('reviewSubtitle')}
				</Typography>
			</Box>

			{isCheckoutFlow && (
				// Show price breakdown with shipping
				<Card>
					<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
						<Stack spacing={2}>
							<Typography variant="subtitle2" color="text.secondary">
								{tCheckout('totalAmount')}
							</Typography>
							
							{/* Service Fee */}
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography variant="body2" color="text.secondary">
									{t('serviceFee')}
								</Typography>
								<Typography variant="body1" fontWeight={600}>
									₪{serviceAmount.toFixed(2)}
								</Typography>
							</Box>

							{/* Shipping Cost */}
							{shippingAmount > 0 && (
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box>
										<Typography variant="body2" color="text.secondary">
											{t('shippingCost')}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{getShippingLocationLabel(formData.shipping_location as ShippingLocation, locale)} • {getDeliveryTypeLabel(formData.delivery_type as DeliveryType, locale)}
											{formData.delivery_type === 'multiple' && ` (${formData.delivery_count || '2'})`}
										</Typography>
									</Box>
									<Typography variant="body1" fontWeight={600}>
										₪{shippingAmount.toFixed(2)}
									</Typography>
								</Box>
							)}

							<Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} />

							{/* Total */}
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography variant="subtitle1" fontWeight={700}>
									{t('totalWithShipping')}
								</Typography>
								<Typography variant="h4" fontWeight={700} color="primary.main">
									₪{totalAmount.toFixed(2)}
								</Typography>
							</Box>
						</Stack>
					</CardContent>
				</Card>
			)}

			<Alert severity="info" sx={{ borderRadius: 2 }}>
				{t('reviewAlert')}
			</Alert>

			{/* Service & Pricing Estimate */}
			<Card>
				<CardContent sx={{ p: { xs: 3, md: 4 } }}>
					<Stack spacing={3}>
						<Box>
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
								{t('serviceRequested')}
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								{service.title}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
								{service.description}
							</Typography>
						</Box>

						{/* Pricing Estimate */}
						<PricingEstimate service={service} urgency={urgency} locale={locale === 'ar' ? 'ar' : 'en'} />
					</Stack>
				</CardContent>
			</Card>

			{/* Contact Information */}
			<Card>
				<CardContent sx={{ p: { xs: 3, md: 4 } }}>
					<Stack spacing={2}>
						<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
							{t('contactInfo')}
						</Typography>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 4 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('fullName')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{formData.name || 'N/A'}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, sm: 4 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('emailAddress')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{formData.email || 'N/A'}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, sm: 4 }}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										{t('phoneNumber')}
									</Typography>
									<Typography variant="body1" fontWeight={500}>
										{formData.phone || 'N/A'}
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Stack>
				</CardContent>
			</Card>

			{/* Service Requirements */}
			{serviceFields.length > 0 && (
				<Card>
					<CardContent sx={{ p: { xs: 3, md: 4 } }}>
						<Stack spacing={2}>
							<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
								{t('serviceInfo')}
							</Typography>
							{serviceFields.some(field => field.type !== 'file' && formData[field.name]) || formData.urgency ? (
								<Stack spacing={1.5}>
									{serviceFields.map((field) => {
										if (field.type === 'file') return null;
										const value = formData[field.name];
										if (!value) return null;
										const fieldLabel = locale === 'ar' && field.label_ar ? field.label_ar : field.label;
										return (
											<Box
												key={field.name}
												sx={{
													p: 2,
													borderRadius: 1,
													backgroundColor: 'background.default',
												}}
											>
												<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
													{fieldLabel}
												</Typography>
												<Typography variant="body2" fontWeight={500}>
													{value}
												</Typography>
											</Box>
										);
									})}
									{formData.urgency && (
										<Box
											sx={{
												p: 2,
												borderRadius: 1,
												backgroundColor: 'background.default',
											}}
										>
											<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
												{t('serviceUrgency')}
											</Typography>
											<Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
												{formData.urgency}
											</Typography>
										</Box>
									)}
								</Stack>
							) : (
								<Typography variant="body2" color="text.secondary">
									{locale === 'ar' ? 'لم يتم تقديم معلومات إضافية' : 'No additional information provided'}
								</Typography>
							)}
						</Stack>
					</CardContent>
				</Card>
			)}

			{/* Uploaded Documents */}
			{totalUploadedCount > 0 && (
				<Card>
					<CardContent sx={{ p: { xs: 3, md: 4 } }}>
						<Stack spacing={3}>
							<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
								{t('uploadedDocuments', { count: totalUploadedCount })}
							</Typography>

							{/* File Previews Grid */}
							<Grid container spacing={2}>
								{allUploadedAttachments.length > 0 ? (
									// Show uploaded attachments (successfully uploaded files)
									allUploadedAttachments.map((attachment) => (
										<Grid size={{ xs: 12, sm: 6, md: 4 }} key={attachment.id}>
											<Box
												sx={{
													border: '1px solid',
													borderColor: 'divider',
													borderRadius: 2,
													p: 2,
													backgroundColor: 'background.paper',
												}}
											>
												<Stack spacing={1}>
													<Typography variant="body2" fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{attachment.fileName}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{(attachment.fileSize / 1024).toFixed(2)} KB
													</Typography>
													{attachment.storagePath && (
														<Button
															size="small"
															variant="outlined"
															component="a"
															href={attachment.storagePath}
															target="_blank"
															rel="noopener noreferrer"
														>
															View File
														</Button>
													)}
												</Stack>
											</Box>
										</Grid>
									))
								) : (
									// Fallback to local files if no attachments yet
									allUploadedFiles.map((file, index) => (
										<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
											<FilePreview file={file} showRemove={false} />
										</Grid>
									))
								)}
							</Grid>

							{/* Required Documents Checklist */}
							{service.requiredDocuments && service.requiredDocuments.length > 0 && (
								<Box sx={{ pt: 2 }}>
									<RequiredDocumentsChecklist
										requiredDocuments={service.requiredDocuments}
										uploadedFiles={allUploadedFiles}
										uploadedFileCount={totalUploadedCount}
									/>
									{errors.requiredDocuments && (
										<Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
											{errors.requiredDocuments}
										</Alert>
									)}
								</Box>
							)}
						</Stack>
					</CardContent>
				</Card>
			)}

			{/* Additional Information */}
			{(formData.details || formData.message) && (
				<Card>
					<CardContent sx={{ p: { xs: 3, md: 4 } }}>
						<Stack spacing={2}>
							<Typography variant="h6" sx={{ fontSize: '1.125rem' }}>
								{t('additionalInformation')}
							</Typography>
							{formData.details && (
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
										{t('additionalDetails')}
									</Typography>
									<Typography variant="body2">{formData.details}</Typography>
								</Box>
							)}
							{formData.message && (
								<Box>
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
										{t('additionalNotes')}
									</Typography>
									<Typography variant="body2">{formData.message}</Typography>
								</Box>
							)}
						</Stack>
					</CardContent>
				</Card>
			)}
		</Stack>
	);
}

// Step 4: Payment (Checkout Flow Only)
function Step4PaymentContent({
	invoiceId,
	amount,
	currency,
	onPaymentSuccess,
}: {
	invoiceId: string;
	amount: number;
	currency: string;
	onPaymentSuccess: () => void;
}) {
	return (
		<PaymentFlow
			invoiceId={invoiceId}
			amount={amount}
			currency={currency}
			onPaymentSuccess={onPaymentSuccess}
		/>
	);
}

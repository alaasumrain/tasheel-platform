-- Activate only International Driving License service and deactivate all others
-- Update International Driving License with provided descriptions and pricing

-- First, deactivate all services
UPDATE services SET is_active = false, updated_at = NOW();

-- Update International Driving License service
UPDATE services 
SET 
  name_en = 'International Driving License',
  name_ar = 'رخصة القيادة الدولية',
  name = 'International Driving License',
  description_en = 'The International Driving License is an official document that allows you to drive vehicles outside your home country. It translates your local driving license into several languages, making it easier for authorities abroad to understand your driving rights. The license is valid in more than 150 countries and is usually issued for one year. It must be used alongside your original driving license.',
  description_ar = 'رخصة القيادة الدولية هي وثيقة رسمية تتيح لك قيادة المركبات خارج بلدك. تقوم بترجمة رخصة القيادة المحلية إلى عدة لغات، مما يسهل على السلطات في الخارج فهم حقوقك في القيادة. تُعتمد هذه الرخصة في أكثر من 150 دولة وتكون صالحة عادة لمدة سنة واحدة، ويجب استخدامها مع رخصة القيادة الأصلية.',
  pricing = jsonb_build_object(
    'type', 'fixed',
    'amount', 150
  ),
  process_steps = jsonb_build_array(
    jsonb_build_object(
      'number', 1,
      'title_en', 'Choose and Submit',
      'title_ar', 'اختر وأرسل',
      'description_en', 'Choose your service, upload the required documents, and pay securely online.',
      'description_ar', 'اختر خدمتك، ارفع المستندات المطلوبة، وادفع بشكل آمن عبر الإنترنت.'
    ),
    jsonb_build_object(
      'number', 2,
      'title_en', 'We Verify',
      'title_ar', 'نقوم بالتحقق',
      'description_en', 'Our team reviews your request within two hours and confirms document completion.',
      'description_ar', 'يراجع فريقنا طلبك خلال ساعتين ويؤكد اكتمال المستندات.'
    ),
    jsonb_build_object(
      'number', 3,
      'title_en', 'We Process',
      'title_ar', 'نقوم بالمعالجة',
      'description_en', 'We handle all government transactions while you track progress in real-time.',
      'description_ar', 'نتولى جميع المعاملات الحكومية بينما تتابع التقدم في الوقت الفعلي.'
    ),
    jsonb_build_object(
      'number', 4,
      'title_en', 'Receive and Done',
      'title_ar', 'استلم وانتهى',
      'description_en', 'Get your completed documents via email or physical delivery to your address.',
      'description_ar', 'احصل على مستنداتك المكتملة عبر البريد الإلكتروني أو التسليم الفعلي إلى عنوانك.'
    )
  ),
  required_documents = jsonb_build_array(
    'Passport copy (clear photo of passport page)',
    'Existing Palestinian driver\'s license copy (both sides)',
    'Passport number',
    'License number',
    'License expiry date'
  ),
  features = jsonb_build_array(
    'Valid in over 150 countries',
    'One-year validity',
    'Multi-language translation',
    'Fast processing',
    'Secure document handling',
    'Real-time tracking'
  ),
  turnaround_window = 'غير محدد',
  is_active = true,
  updated_at = NOW()
WHERE slug = 'international-driving-license';

-- If the service doesn't exist, create it (assuming we have a category_id)
-- Note: You may need to adjust the category_id based on your actual categories
-- This assumes there's a 'government' category
DO $$
DECLARE
  gov_category_id UUID;
BEGIN
  -- Get government category ID
  SELECT id INTO gov_category_id FROM service_categories WHERE slug = 'government' LIMIT 1;
  
  -- Only insert if service doesn't exist
  IF NOT EXISTS (SELECT 1 FROM services WHERE slug = 'international-driving-license') THEN
    INSERT INTO services (
      name,
      name_en,
      name_ar,
      slug,
      category_id,
      description_en,
      description_ar,
      pricing,
      process_steps,
      required_documents,
      features,
      turnaround_window,
      is_active,
      sort_order,
      created_at,
      updated_at
    ) VALUES (
      'International Driving License',
      'International Driving License',
      'رخصة القيادة الدولية',
      'international-driving-license',
      COALESCE(gov_category_id, (SELECT id FROM service_categories LIMIT 1)),
      'The International Driving License is an official document that allows you to drive vehicles outside your home country. It translates your local driving license into several languages, making it easier for authorities abroad to understand your driving rights. The license is valid in more than 150 countries and is usually issued for one year. It must be used alongside your original driving license.',
      'رخصة القيادة الدولية هي وثيقة رسمية تتيح لك قيادة المركبات خارج بلدك. تقوم بترجمة رخصة القيادة المحلية إلى عدة لغات، مما يسهل على السلطات في الخارج فهم حقوقك في القيادة. تُعتمد هذه الرخصة في أكثر من 150 دولة وتكون صالحة عادة لمدة سنة واحدة، ويجب استخدامها مع رخصة القيادة الأصلية.',
      jsonb_build_object('type', 'fixed', 'amount', 150),
      jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'title_en', 'Choose and Submit',
          'title_ar', 'اختر وأرسل',
          'description_en', 'Choose your service, upload the required documents, and pay securely online.',
          'description_ar', 'اختر خدمتك، ارفع المستندات المطلوبة، وادفع بشكل آمن عبر الإنترنت.'
        ),
        jsonb_build_object(
          'number', 2,
          'title_en', 'We Verify',
          'title_ar', 'نقوم بالتحقق',
          'description_en', 'Our team reviews your request within two hours and confirms document completion.',
          'description_ar', 'يراجع فريقنا طلبك خلال ساعتين ويؤكد اكتمال المستندات.'
        ),
        jsonb_build_object(
          'number', 3,
          'title_en', 'We Process',
          'title_ar', 'نقوم بالمعالجة',
          'description_en', 'We handle all government transactions while you track progress in real-time.',
          'description_ar', 'نتولى جميع المعاملات الحكومية بينما تتابع التقدم في الوقت الفعلي.'
        ),
        jsonb_build_object(
          'number', 4,
          'title_en', 'Receive and Done',
          'title_ar', 'استلم وانتهى',
          'description_en', 'Get your completed documents via email or physical delivery to your address.',
          'description_ar', 'احصل على مستنداتك المكتملة عبر البريد الإلكتروني أو التسليم الفعلي إلى عنوانك.'
        )
      ),
      jsonb_build_array(
        'Passport copy (clear photo of passport page)',
        'Existing Palestinian driver\'s license copy (both sides)',
        'Passport number',
        'License number',
        'License expiry date'
      ),
      jsonb_build_array(
        'Valid in over 150 countries',
        'One-year validity',
        'Multi-language translation',
        'Fast processing',
        'Secure document handling',
        'Real-time tracking'
      ),
      'غير محدد',
      true,
      1,
      NOW(),
      NOW()
    );
  END IF;
END $$;


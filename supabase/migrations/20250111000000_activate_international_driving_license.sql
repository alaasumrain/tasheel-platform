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
      true,
      1,
      NOW(),
      NOW()
    );
  END IF;
END $$;


-- Add shipping fields to applications table
-- Migration: 20250201000000_add_shipping_fields

-- Add shipping location and delivery type columns
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS shipping_location TEXT CHECK (shipping_location IN ('west_bank', 'jerusalem', 'area_48', 'international')),
ADD COLUMN IF NOT EXISTS delivery_type TEXT CHECK (delivery_type IN ('single', 'multiple')),
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_count INTEGER DEFAULT 1;

-- Add index for shipping location queries
CREATE INDEX IF NOT EXISTS idx_applications_shipping_location ON applications(shipping_location);

-- Add comment for documentation
COMMENT ON COLUMN applications.shipping_location IS 'Shipping location: west_bank, jerusalem, area_48, or international';
COMMENT ON COLUMN applications.delivery_type IS 'Delivery type: single (one-time) or multiple (2+ deliveries)';
COMMENT ON COLUMN applications.shipping_amount IS 'Calculated shipping cost in NIS';
COMMENT ON COLUMN applications.delivery_count IS 'Number of deliveries required (used for multiple delivery type)';


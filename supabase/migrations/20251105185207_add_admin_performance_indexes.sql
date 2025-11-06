-- Add performance indexes for admin queries
-- Migration: 20251105185207_add_admin_performance_indexes

-- Index on status for filtering orders by status
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Index on submitted_at for date range queries and timeline charts
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at);

-- Index on order_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_applications_order_number ON applications(order_number);

-- Index on service_slug for filtering by service
CREATE INDEX IF NOT EXISTS idx_applications_service_slug ON applications(service_slug);

-- Index on application_events for faster timeline queries
CREATE INDEX IF NOT EXISTS idx_application_events_application_id ON application_events(application_id);

-- Add assigned_to column for order assignment workflow
ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id);

-- Index on assigned_to for filtering orders by officer
CREATE INDEX IF NOT EXISTS idx_applications_assigned_to ON applications(assigned_to);

-- Add comment for documentation
COMMENT ON COLUMN applications.assigned_to IS 'UUID of the officer/user assigned to this order';

-- Create OTP codes table for phone/WhatsApp authentication
CREATE TABLE IF NOT EXISTS otp_codes (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	phone TEXT NOT NULL UNIQUE,
	code TEXT NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	attempts INTEGER DEFAULT 0
);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);

-- Add comment
COMMENT ON TABLE otp_codes IS 'Stores OTP codes for phone/WhatsApp authentication. Codes expire after 5 minutes.';

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can manage OTP codes" ON otp_codes;

-- Policy: Only service role can access (via server-side API)
-- This ensures only server-side code with service key can access OTP codes
CREATE POLICY "Service role can manage OTP codes"
	ON otp_codes
	FOR ALL
	USING (auth.role() = 'service_role')
	WITH CHECK (auth.role() = 'service_role');

-- Function to clean up expired OTP codes (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otp_codes()
RETURNS void AS $$
BEGIN
	DELETE FROM otp_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


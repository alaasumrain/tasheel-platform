-- Analytics Events Table Migration
-- Migration: 20250129000000_add_analytics_events.sql
-- Creates: analytics_events table for tracking user behavior

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address INET,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  page_path TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING GIN(properties);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_created ON analytics_events(event_name, created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE analytics_events IS 'Stores analytics events for user behavior tracking';
COMMENT ON COLUMN analytics_events.event_name IS 'Name of the event (e.g., form_start, form_complete, file_upload)';
COMMENT ON COLUMN analytics_events.properties IS 'JSON object containing event-specific properties';
COMMENT ON COLUMN analytics_events.session_id IS 'Browser session identifier';
COMMENT ON COLUMN analytics_events.page_path IS 'Page path where event occurred';

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to insert analytics events (for anonymous tracking)
CREATE POLICY "Allow insert analytics events" ON analytics_events
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Allow admins to read all analytics events
CREATE POLICY "Allow admins to read analytics events" ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Allow users to read their own analytics events
CREATE POLICY "Allow users to read own analytics events" ON analytics_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());


-- Phase 2: Workflow Foundation Tables
-- Migration: 20250128000000_add_workflow_tables
-- Creates: tasks, sla_configs, communications tables

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'email', 'office_visit', 'ministry', 'qa')),
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),
  time_spent_minutes INTEGER,
  outcome_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for tasks
CREATE INDEX IF NOT EXISTS idx_tasks_application_id ON tasks(application_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);

-- Create sla_configs table
CREATE TABLE IF NOT EXISTS sla_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) UNIQUE,
  target_hours INTEGER NOT NULL CHECK (target_hours > 0),
  warning_threshold_percent INTEGER DEFAULT 70 CHECK (warning_threshold_percent >= 0 AND warning_threshold_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for sla_configs
CREATE INDEX IF NOT EXISTS idx_sla_configs_service_id ON sla_configs(service_id);

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('call', 'email', 'whatsapp', 'office_visit')),
  user_id UUID REFERENCES users(id),
  summary TEXT,
  next_followup_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for communications
CREATE INDEX IF NOT EXISTS idx_communications_application_id ON communications(application_id);
CREATE INDEX IF NOT EXISTS idx_communications_user_id ON communications(user_id);
CREATE INDEX IF NOT EXISTS idx_communications_channel ON communications(channel);
CREATE INDEX IF NOT EXISTS idx_communications_created_at ON communications(created_at);

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'Task management for workflow tracking';
COMMENT ON TABLE sla_configs IS 'SLA configuration per service';
COMMENT ON TABLE communications IS 'Communication log for customer interactions';

COMMENT ON COLUMN tasks.type IS 'Task type: call, whatsapp, email, office_visit, ministry, qa';
COMMENT ON COLUMN tasks.priority IS 'Task priority: low, normal, high, urgent';
COMMENT ON COLUMN tasks.status IS 'Task status: open, in_progress, done, cancelled';
COMMENT ON COLUMN sla_configs.target_hours IS 'Target completion time in business hours';
COMMENT ON COLUMN sla_configs.warning_threshold_percent IS 'Percentage threshold for SLA warnings (0-100)';
COMMENT ON COLUMN communications.channel IS 'Communication channel: call, email, whatsapp, office_visit';


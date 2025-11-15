-- Zurvan Supabase Schema Setup
-- Run this SQL in your Supabase SQL editor to set up the database

-- Create app_role enum for user roles
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  stream TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streams table
CREATE TABLE IF NOT EXISTS streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  tasks_remaining INTEGER DEFAULT 0,
  next_deadline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

-- Create RLS policies for streams
CREATE POLICY "Users can view their own streams"
  ON streams FOR SELECT
  USING (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

CREATE POLICY "Users can insert their own streams"
  ON streams FOR INSERT
  WITH CHECK (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

CREATE POLICY "Users can update their own streams"
  ON streams FOR UPDATE
  USING (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

CREATE POLICY "Users can delete their own streams"
  ON streams FOR DELETE
  USING (true); -- You can restrict this to: user_id = auth.uid()::text if using Supabase auth

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid()::text);

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

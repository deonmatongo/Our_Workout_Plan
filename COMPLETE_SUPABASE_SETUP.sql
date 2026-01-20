-- =====================================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- Drop existing tables if you want a fresh start (OPTIONAL - comment out if you have data)
-- DROP TABLE IF EXISTS workouts CASCADE;
-- DROP TABLE IF EXISTS marathon_progress CASCADE;

-- =====================================================
-- CREATE WORKOUTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('run', 'strength', 'cross-training', 'rest')),
  title TEXT NOT NULL,
  duration INTEGER NOT NULL,
  distance NUMERIC,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  completed_by TEXT[] DEFAULT '{}',
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE MARATHON PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS marathon_progress (
  id TEXT PRIMARY KEY DEFAULT 'default',
  completed_workouts TEXT[] DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(type);
CREATE INDEX IF NOT EXISTS idx_workouts_completed_by ON workouts USING GIN(completed_by);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marathon_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DROP EXISTING POLICIES (to avoid conflicts)
-- =====================================================
DROP POLICY IF EXISTS "Allow all operations on workouts" ON workouts;
DROP POLICY IF EXISTS "Allow all operations on marathon_progress" ON marathon_progress;

-- =====================================================
-- CREATE POLICIES (Allow all operations - no auth)
-- =====================================================
CREATE POLICY "Allow all operations on workouts" ON workouts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on marathon_progress" ON marathon_progress
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- INSERT DEFAULT MARATHON PROGRESS RECORD
-- =====================================================
INSERT INTO marathon_progress (id, completed_workouts, last_updated)
VALUES ('default', '{}', NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CREATE TRIGGER FUNCTION FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- For marathon_progress, update last_updated
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================
DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marathon_progress_last_updated ON marathon_progress;
CREATE TRIGGER update_marathon_progress_last_updated
  BEFORE UPDATE ON marathon_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated_column();

-- =====================================================
-- VERIFICATION QUERIES (Check if everything is set up)
-- =====================================================
-- Run these separately to verify setup:

-- Check if tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check workouts table structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'workouts';

-- Check marathon_progress table structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'marathon_progress';

-- Check if policies are active:
-- SELECT * FROM pg_policies WHERE tablename IN ('workouts', 'marathon_progress');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready for the Our_Workout_Plan app
-- You can now:
-- 1. Add workouts from the calendar
-- 2. Mark workouts as complete
-- 3. Track marathon plan progress
-- 4. All data will persist in Supabase cloud database
-- =====================================================

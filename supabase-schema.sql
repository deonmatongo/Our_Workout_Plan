-- Create workouts table
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

-- Create marathon_progress table
CREATE TABLE IF NOT EXISTS marathon_progress (
  id TEXT PRIMARY KEY DEFAULT 'default',
  completed_workouts TEXT[] DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(type);
CREATE INDEX IF NOT EXISTS idx_workouts_completed_by ON workouts USING GIN(completed_by);

-- Enable Row Level Security (RLS)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marathon_progress ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we're not using auth)
CREATE POLICY "Allow all operations on workouts" ON workouts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on marathon_progress" ON marathon_progress
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default marathon progress record
INSERT INTO marathon_progress (id, completed_workouts, last_updated)
VALUES ('default', '{}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for workouts table
DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for marathon_progress table
DROP TRIGGER IF EXISTS update_marathon_progress_updated_at ON marathon_progress;
CREATE TRIGGER update_marathon_progress_updated_at
  BEFORE UPDATE ON marathon_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

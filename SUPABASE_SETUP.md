# Supabase Setup Instructions

## Step 1: Run the Database Schema

1. Go to your Supabase project: https://ewhigrnlelkermgyqgns.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click **Run** or press `Ctrl/Cmd + Enter`

This will create:
- `workouts` table with all necessary columns
- `marathon_progress` table for 21K plan tracking
- Indexes for better performance
- Row Level Security policies (allowing all operations)
- Automatic timestamp triggers

## Step 2: Verify Tables Were Created

1. Click on **Table Editor** in the left sidebar
2. You should see two tables:
   - `workouts`
   - `marathon_progress`

## Step 3: Test the Application

1. Stop the backend server (it's no longer needed!)
2. Make sure the frontend is running: `npm run dev`
3. Open http://localhost:8080
4. Try adding a workout - it should save to Supabase!

## What Changed

- ✅ Replaced Express backend with Supabase
- ✅ All workout data now stored in cloud database
- ✅ Marathon plan progress saved to Supabase
- ✅ No need to run backend server anymore
- ✅ Data accessible from any device
- ✅ Real-time sync capabilities (can be enabled later)

## Environment Variables

The `.env` file contains:
```
VITE_SUPABASE_URL=https://ewhigrnlelkermgyqgns.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These are already configured and ready to use!

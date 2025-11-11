-- Add user_id column to tools table
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Add user_id column
ALTER TABLE tools ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Step 2: Set up Row Level Security (RLS) policies

-- Enable RLS on tools table
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Allow everyone to read tools
CREATE POLICY "Allow public read access" ON tools FOR SELECT USING (true);

-- Policy for INSERT: Allow authenticated users to insert their own tools
CREATE POLICY "Allow users to insert their own tools" ON tools FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE: Only allow users to delete their own tools
CREATE POLICY "Allow users to delete their own tools" ON tools FOR DELETE 
USING (auth.uid() = user_id);

-- Policy for UPDATE: Only allow users to update their own tools
CREATE POLICY "Allow users to update their own tools" ON tools FOR UPDATE 
USING (auth.uid() = user_id);

-- Step 3: Update existing tools (optional - set to a default user or leave null)
-- UPDATE tools SET user_id = 'your-default-user-id' WHERE user_id IS NULL;

-- Step 4: Verify the setup
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tools' 
AND column_name = 'user_id';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tools';

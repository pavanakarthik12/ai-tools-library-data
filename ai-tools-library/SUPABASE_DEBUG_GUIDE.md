# Supabase Debug Guide

## 1. Check Your Supabase Table Structure

Run this SQL in your Supabase SQL Editor to verify your table structure:

```sql
-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tools' 
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid, primary key)
- `name` (text)
- `link` (text) - NOT `url`
- `category` (text)
- `tags` (text[]) - Array of strings
- `description` (text)
- `pricing` (text)
- `notes` (text)
- `created_at` (timestamptz with default now())

## 2. Fix Column Mismatches

If you have columns like `url` or `tags__001-003`, run these SQL commands:

```sql
-- Rename url to link if needed
ALTER TABLE tools RENAME COLUMN url TO link;

-- Fix tags array if it's stored as separate columns
-- First, add a proper tags column if it doesn't exist
ALTER TABLE tools ADD COLUMN IF NOT EXISTS tags text[];

-- If you have tags__001-003 columns, combine them:
UPDATE tools 
SET tags = ARRAY[tags__001, tags__002, tags__003] 
WHERE tags__001 IS NOT NULL;

-- Then drop the old columns
ALTER TABLE tools DROP COLUMN IF EXISTS tags__001;
ALTER TABLE tools DROP COLUMN IF EXISTS tags__002;
ALTER TABLE tools DROP COLUMN IF EXISTS tags__003;
```

## 3. Check Your Data

```sql
-- See all tools
SELECT * FROM tools LIMIT 5;

-- Check if tags are properly formatted as arrays
SELECT name, tags, array_length(tags, 1) as tag_count 
FROM tools 
WHERE tags IS NOT NULL 
LIMIT 5;
```

## 4. Fix Tags Array Format

If your tags are stored as strings instead of arrays:

```sql
-- Convert comma-separated strings to arrays
UPDATE tools 
SET tags = string_to_array(tags, ',') 
WHERE tags IS NOT NULL AND tags != '';

-- Or if tags are stored as JSON strings:
UPDATE tools 
SET tags = ARRAY(SELECT json_array_elements_text(tags::json)) 
WHERE tags IS NOT NULL;
```

## 5. Test Row Level Security (RLS)

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tools';

-- If RLS is blocking access, create policies:
CREATE POLICY "Allow public read access" ON tools FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON tools FOR DELETE USING (true);
```

## 6. Environment Variables

Make sure your `.env.local` file has the correct values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 7. Debug in Browser Console

Open your browser's developer console and look for these logs:
- 🔍 "Fetching tools from Supabase..."
- 📊 "Supabase response:" (should show data and error)
- ✅ "Tools fetched successfully: X tools"
- 📋 "Sample tool:" (should show a tool object)

## Common Issues:

1. **Empty data array**: Check RLS policies
2. **Column not found errors**: Verify column names match exactly
3. **Tags not displaying**: Ensure tags are stored as text[] arrays
4. **Authentication errors**: Check your Supabase URL and anon key

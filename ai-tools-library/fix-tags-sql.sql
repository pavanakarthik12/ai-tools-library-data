-- Fix Supabase tools table tags column
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tools' 
ORDER BY ordinal_position;

-- Step 2: Add tags column if it doesn't exist
ALTER TABLE tools ADD COLUMN IF NOT EXISTS tags text[];

-- Step 3: If you have old tags columns (tags__001, tags__002, etc.), combine them
-- First, let's see what columns exist:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tools' 
AND column_name LIKE 'tags%';

-- Step 4: If you have tags__001, tags__002, tags__003 columns, combine them:
-- (Uncomment and modify based on your actual column names)
/*
UPDATE tools 
SET tags = ARRAY[
  COALESCE(tags__001, ''),
  COALESCE(tags__002, ''),
  COALESCE(tags__003, '')
] 
WHERE tags__001 IS NOT NULL OR tags__002 IS NOT NULL OR tags__003 IS NOT NULL;

-- Remove empty strings from the array
UPDATE tools 
SET tags = ARRAY(SELECT unnest(tags) WHERE unnest(tags) != '');

-- Drop the old columns
ALTER TABLE tools DROP COLUMN IF EXISTS tags__001;
ALTER TABLE tools DROP COLUMN IF EXISTS tags__002;
ALTER TABLE tools DROP COLUMN IF EXISTS tags__003;
*/

-- Step 5: If you have tags stored as comma-separated strings, convert to array:
UPDATE tools 
SET tags = string_to_array(tags, ',') 
WHERE tags IS NOT NULL 
AND tags != '' 
AND array_length(string_to_array(tags, ','), 1) > 1;

-- Step 6: If you have tags stored as JSON strings, convert to array:
UPDATE tools 
SET tags = ARRAY(SELECT json_array_elements_text(tags::json)) 
WHERE tags IS NOT NULL 
AND tags != '' 
AND tags LIKE '[%]';

-- Step 7: Clean up any empty strings in arrays
UPDATE tools 
SET tags = ARRAY(SELECT unnest(tags) WHERE unnest(tags) != '' AND unnest(tags) IS NOT NULL)
WHERE tags IS NOT NULL;

-- Step 8: Set default empty array for rows with NULL tags
UPDATE tools 
SET tags = '{}' 
WHERE tags IS NULL;

-- Step 9: Verify the results
SELECT name, tags, array_length(tags, 1) as tag_count 
FROM tools 
WHERE tags IS NOT NULL 
LIMIT 10;

-- Step 10: Check for any remaining issues
SELECT name, tags 
FROM tools 
WHERE tags IS NOT NULL 
AND array_length(tags, 1) = 0;

-- Final verification
SELECT 
  COUNT(*) as total_tools,
  COUNT(tags) as tools_with_tags,
  AVG(array_length(tags, 1)) as avg_tags_per_tool
FROM tools;

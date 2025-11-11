# CSV Import Guide for Supabase Tools Table

## Proper Tags Format for CSV Import

When importing tools via CSV, ensure the `tags` column uses this format:

### ✅ Correct Format (Postgres Array)
```csv
name,description,link,category,tags,pricing,notes
ChatGPT,AI assistant,https://chat.openai.com,AI,"{AI,Assistant,Chat}","Free",Popular AI tool
GitHub,Code repository,https://github.com,Development,"{Git,Version Control,Open Source}","Free",Code hosting
```

### ❌ Incorrect Formats
```csv
# Don't use comma-separated strings
tags
"AI,Assistant,Chat"

# Don't use JSON strings
tags
"[\"AI\",\"Assistant\",\"Chat\"]"

# Don't use separate columns
tags__001,tags__002,tags__003
AI,Assistant,Chat
```

## SQL to Fix Existing Data

If you have existing data with incorrect tag formats, run this SQL:

```sql
-- Fix comma-separated strings to arrays
UPDATE tools 
SET tags = string_to_array(tags, ',') 
WHERE tags IS NOT NULL 
AND tags != '' 
AND tags NOT LIKE '{%}';

-- Fix JSON strings to arrays
UPDATE tools 
SET tags = ARRAY(SELECT json_array_elements_text(tags::json)) 
WHERE tags IS NOT NULL 
AND tags LIKE '[%]';

-- Clean up empty strings in arrays
UPDATE tools 
SET tags = ARRAY(SELECT unnest(tags) WHERE unnest(tags) != '' AND unnest(tags) IS NOT NULL)
WHERE tags IS NOT NULL;

-- Set empty array for NULL tags
UPDATE tools 
SET tags = '{}' 
WHERE tags IS NULL;
```

## CSV Import Template

Use this template for consistent imports:

```csv
name,description,link,category,tags,pricing,notes,created_at
"Tool Name","Tool description","https://example.com","Category","{tag1,tag2,tag3}","Free","Additional notes","2024-01-01T00:00:00Z"
```

## Verification Queries

After import, verify your data:

```sql
-- Check tags format
SELECT name, tags, array_length(tags, 1) as tag_count 
FROM tools 
WHERE tags IS NOT NULL 
LIMIT 10;

-- Check for any malformed tags
SELECT name, tags 
FROM tools 
WHERE tags IS NOT NULL 
AND array_length(tags, 1) = 0;

-- Count tools with tags
SELECT 
  COUNT(*) as total_tools,
  COUNT(tags) as tools_with_tags,
  AVG(array_length(tags, 1)) as avg_tags_per_tool
FROM tools;
```

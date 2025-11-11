# Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Database Schema

Make sure your Supabase database has a `tools` table with the following columns:

- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `url` (text)
- `category` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Row Level Security (RLS)

Make sure to set up appropriate RLS policies for your `tools` table to allow:
- SELECT operations for all users
- INSERT operations for authenticated users
- DELETE operations for authenticated users
